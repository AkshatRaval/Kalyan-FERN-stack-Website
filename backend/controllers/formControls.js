import multer from "multer";
import fs from 'fs'
import { uploadToDrive } from "../utils/filesUpload.js";
import path from "path";
import { db } from "../utils/firebaseConfig.js";
import { makePdf } from "../utils/makePdf.js";
import { appendToSheet } from "../utils/uploadToSheets.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }
})

function getNextAppId(formName) {
  const counterPath = path.join(process.cwd(), `counters/${formName}.txt`);
  let count = 0;
  // 🔹 Read current counter
  if (fs.existsSync(counterPath)) {
    const data = fs.readFileSync(counterPath, 'utf8');
    count = parseInt(data) || 0;
  }

  const nextCount = count + 1;

  fs.writeFileSync(counterPath, String(nextCount));

  return `KALYAN${formName.slice(0, 3).toUpperCase()}${String(nextCount).padStart(4, '0')}`;
}
// postAForm.js (improved)



export const postAForm = async (req, res) => {
  const formName = req.params.formname;
  let pdfLocalPath = null;

  function stripUndefined(obj) {
    if (obj === undefined) return undefined;
    if (obj === null) return null;
    if (Array.isArray(obj)) {
      return obj
        .map(stripUndefined)
        .filter((v) => v !== undefined);
    }
    if (typeof obj === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(obj)) {
        const cleaned = stripUndefined(v);
        if (cleaned !== undefined) out[k] = cleaned;
      }
      return out;
    }
    return obj;
  }


  try {
    const personalInfo = req.body.personalInfo ? JSON.parse(req.body.personalInfo) : {};
    const academicInfo = req.body.academicInfo ? JSON.parse(req.body.academicInfo) : {};
    const guardianInfo = req.body.guardianInfo ? JSON.parse(req.body.guardianInfo) : {};
    const additionalInfo = req.body.additionalInfo ? JSON.parse(req.body.additionalInfo) : {};
    const payments = req.body.payments ? JSON.parse(req.body.payments) : {};
    const teamInfo = req.body.teamInfo ? JSON.parse(req.body.teamInfo) : null;

    const { fullName, email, phone, dateOfBirth, gender, aadhar, address, city, state, pincode } = personalInfo;
    const { currentClass, school, board, previousScore } = academicInfo;
    const { guardianName, guardianPhone, guardianEmail, relationship } = guardianInfo;
    const { experience, expectations, specialNeeds } = additionalInfo;
    const { paymentRequired, paymentStatus, paymentId } = payments;
    const teamName = teamInfo?.teamName || null;
    const members = teamInfo?.members || [];

    const photoFile = req.files?.photo?.[0];
    const idProofFile = req.files?.idProof?.[0];
    const academicRecordsFile = req.files?.academicRecords?.[0];

    const uploadPromises = [];
    if (photoFile) uploadPromises.push(uploadToDrive(photoFile.path));
    else uploadPromises.push(Promise.resolve([null, null]));

    if (idProofFile) uploadPromises.push(uploadToDrive(idProofFile.path));
    else uploadPromises.push(Promise.resolve([null, null]));

    if (academicRecordsFile) uploadPromises.push(uploadToDrive(academicRecordsFile.path));
    else uploadPromises.push(Promise.resolve([null, null]));

    const [photoLinks, idProofLinks, academicRecordsLinks] = await Promise.all(uploadPromises);

    const finalData = {
      personalInfo: { fullName, email, phone, dateOfBirth, gender, aadhar, address, city, state, pincode },
      academicInfo: { currentClass, school, board, previousScore },
      teamInfo: teamInfo ? { teamName, members } : null,
      guardianInfo: { guardianName, guardianPhone, guardianEmail, relationship },
      additionalInfo: { experience, expectations, specialNeeds },
      payments: { paymentRequired, paymentStatus, paymentId },
      documents: {
        photo: { viewLink: photoLinks?.[0] || null, downloadLink: photoLinks?.[1] || null },
        idProof: { viewLink: idProofLinks?.[0] || null, downloadLink: idProofLinks?.[1] || null },
        academicRecords: { viewLink: academicRecordsLinks?.[0] || null, downloadLink: academicRecordsLinks?.[1] || null }
      }
    };

    const appId = getNextAppId(formName);
    console.log(`[postAForm] STEP 5: App ID generated: ${appId}`);
    console.log("[postAForm] STEP 6: Making PDF...");
    pdfLocalPath = await makePdf(finalData, appId);

    const pdfLinks = pdfLocalPath ? await uploadToDrive(pdfLocalPath) : [null, null];

    // Save to Firestore
    const docPayloadRaw = {
      applicationId: appId,
      formType: formName,
      status: "pending",
      userId: req.user?.uid || null,
      ...finalData,
      createdAt: new Date().toISOString(),
      applicationForm: pdfLinks
    };

    const docPayload = stripUndefined(docPayloadRaw);
    const docRef = await db.collection('userApplications').add(docPayload);
    const docId = docRef.id;

    try {
      await appendToSheet(docPayload);
    } catch (sheetErr) {
      console.error('Failed to append to Sheets:', sheetErr);
      // don't fail the whole request because of sheet failure
    }

    // Return an 'id' field — frontend expects result.id
    return res.status(200).json({ success: true, id: docId, data: finalData });

  } catch (error) {
    console.error("❌ Error in postAForm:", error);
    return res.status(500).json({ success: false, message: error?.message || String(error) });
  } finally {
    // Cleanup temp files if present
    try {
      const filesToDelete = [
        req.files?.photo?.[0]?.path,
        req.files?.idProof?.[0]?.path,
        req.files?.academicRecords?.[0]?.path,
        pdfLocalPath
      ];
      for (const filePath of filesToDelete) {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      const uploadDir = path.join(process.cwd(), 'temp');
      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        for (const file of files) {
          const fullPath = path.join(uploadDir, file);
          fs.unlinkSync(fullPath);
        }
      }
    } catch (cleanupErr) {
      console.error('⚠️ Error while cleaning up temp files:', cleanupErr);
    }
  }
};

export const deleteAForm = (req, res) => {
  const formName = req.params.formname;
  res.send("Form Is Deleted " + formName)
}

export const getAllForms = async (req, res) => {
  try {
    const applicationsRef = db.collection('userApplications');
    const snapshot = await applicationsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No Data Found found.' });
    }
    const categorizedForms = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const formType = data.formType || 'uncategorized';

      // If the category doesn't exist in our object yet, create it as an array.
      if (!categorizedForms[formType]) {
        categorizedForms[formType] = [];
      }

      // Add the current form to its category.
      categorizedForms[formType].push({
        id: doc.id,
        ...data
      });
    });

    res.status(200).json({
      message: 'Successfully retrieved and categorized all submissions.',
      data: categorizedForms
    });

  } catch (error) {
    console.error('Error fetching formes:', error);
    res.status(500).json({ error: 'Failed to fetch formes.' });
  }
};

export const getFormById = async (req, res) => {
  const formName = req.params.formname
  const id = req.params.id;
  try {
    const formRef = db.collection('userApplications').doc(id);
    const doc = await formRef.get()
    if (!doc.exists) {
      return res.status(404).json({ message: 'Form Not found.' });
    }

    res.status(200).json({
      message: 'Successfully retrieved Form.',
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching Users:', error);
    res.status(500).json({ error: 'Failed to fetch Users.' });
  }
}