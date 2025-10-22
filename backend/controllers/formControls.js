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

export const upload = multer({ storage: storage })

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

export const postAForm = async (req, res) => {
    const formName = req.params.formname;
    let pdfLocalPath;
    try {
        // 1️⃣ Extract text data
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
        const { teamName, members } = teamInfo;

        // 2️⃣ Extract files from req.files
        const photoFile = req.files?.photo?.[0];
        const idProofFile = req.files?.idProof?.[0];
        const academicRecordsFile = req.files?.academicRecords?.[0];

        // 3️⃣ Upload files to Drive
        const photoLinks = photoFile ? await uploadToDrive(photoFile.path) : [null, null];
        const idProofLinks = idProofFile ? await uploadToDrive(idProofFile.path) : [null, null];
        const academicRecordsLinks = academicRecordsFile ? await uploadToDrive(academicRecordsFile.path) : [null, null];

        // 4️⃣ Prepare final data object to save in Firestore / Sheets
        const finalData = {
            personalInfo: { fullName, email, phone, dateOfBirth, gender, aadhar, address, city, state, pincode },
            academicInfo: { currentClass, school, board, previousScore },
            teamInfo: teamInfo ? { teamName, members } : null,
            guardianInfo: { guardianName, guardianPhone, guardianEmail, relationship },
            additionalInfo: { experience, expectations, specialNeeds },
            payments: { paymentRequired, paymentStatus, paymentId },
            documents: {
                photo: { viewLink: photoLinks[0], downloadLink: photoLinks[1] },
                idProof: { viewLink: idProofLinks[0], downloadLink: idProofLinks[1] },
                academicRecords: { viewLink: academicRecordsLinks[0], downloadLink: academicRecordsLinks[1] }
            }
        };

        const appId = getNextAppId(formName);
        let pdfLocalPath = await makePdf(finalData, appId);
        const pdfLinks = pdfLocalPath ? await uploadToDrive(pdfLocalPath) : [null, null];



        // console.log(finalData)
        const docPayload = {
            applicationId: appId,
            formType: formName,
            status: "pending",
            userId: req.user.uid,
            ...finalData,
            createdAt: new Date().toISOString(),
            applicationForm: pdfLinks
        };
        const docRef = await db.collection('userApplications').add(docPayload);
        
        try {
            await appendToSheet(docPayload);
            // console.log('Saved to Firestore and appended to Sheets');
        } catch (err) {
            console.error('Failed to append to Sheets:', err);
        }
        const docId = docRef.id;


        return res.status(200).json({ success: true, docId: docId, data: finalData });
    } catch (error) {
        console.error("❌ Error in postAForm:", error);
        return res.status(500).json({ success: false, message: error.message });
    } finally {
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
                    // console.log(`Deleted temp file: ${filePath}`);
                }
            }

            const uploadDir = path.join(process.cwd(), 'temp');
            if (fs.existsSync(uploadDir)) {
                const files = fs.readdirSync(uploadDir);
                for (const file of files) {
                    const fullPath = path.join(uploadDir, file);
                    fs.unlinkSync(fullPath);
                }
                // console.log('🧹 Cleared temp upload folder successfully.');
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
            const formType = data.formType || 'uncategorized'; // Use 'uncategorized' if formType is missing

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