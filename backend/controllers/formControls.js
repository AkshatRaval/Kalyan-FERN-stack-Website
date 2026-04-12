// controllers/postAForm.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { uploadToDrive } from '../utils/filesUpload.js';
import { db } from '../utils/firebaseConfig.js';
import { makePdf } from '../utils/makePdf.js';
import { appendToSheet } from '../utils/uploadToSheets.js';

// ─────────────────────────────────────────────────────────────────────────────
// MULTER
// ─────────────────────────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, './temp'),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + unique);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function stripUndefined(obj) {
  if (obj === undefined) return undefined;
  if (obj === null)      return null;
  if (Array.isArray(obj)) return obj.map(stripUndefined).filter((v) => v !== undefined);
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

function safeParseBody(raw) {
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch { return null; }
}

function getNextAppId(formName) {
  const counterPath = path.join(process.cwd(), `counters/${formName}.txt`);
  let count = 0;
  if (fs.existsSync(counterPath)) {
    count = parseInt(fs.readFileSync(counterPath, 'utf8')) || 0;
  }
  const next = count + 1;
  fs.writeFileSync(counterPath, String(next));
  return `KALYAN${formName.slice(0, 3).toUpperCase()}${String(next).padStart(4, '0')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWN SECTION KEYS
// Add a new key here when you add a new section type in Apply.js + FormRenderer.
// ─────────────────────────────────────────────────────────────────────────────

const KNOWN_SECTIONS = [
  'personalInfo',
  'academicInfo',
  'guardianInfo',
  'teamInfo',
  'additionalInfo',
  'topicSelection',   // ← new
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export const postAForm = async (req, res) => {
  const formName   = req.params.formname;
  let pdfLocalPath = null;

  try {
    // ── 1. Parse only what was sent ──────────────────────────────────────────
    const parsedSections = {};
    for (const key of KNOWN_SECTIONS) {
      parsedSections[key] = safeParseBody(req.body[key]);
    }
    const payments = safeParseBody(req.body.payments) || {};

    const {
      personalInfo,
      academicInfo,
      guardianInfo,
      teamInfo,
      additionalInfo,
      topicSelection,
    } = parsedSections;

    // ── 2. Upload documents ──────────────────────────────────────────────────
    const photoFile           = req.files?.photo?.[0];
    const idProofFile         = req.files?.idProof?.[0];
    const academicRecordsFile = req.files?.academicRecords?.[0];

    const [photoLinks, idProofLinks, academicRecordsLinks] = await Promise.all([
      photoFile           ? uploadToDrive(photoFile.path)           : Promise.resolve([null, null]),
      idProofFile         ? uploadToDrive(idProofFile.path)         : Promise.resolve([null, null]),
      academicRecordsFile ? uploadToDrive(academicRecordsFile.path) : Promise.resolve([null, null]),
    ]);

    // ── 3. Build finalData — only include sections that arrived ──────────────
    const finalData = {
      ...(personalInfo   !== null && { personalInfo }),
      ...(academicInfo   !== null && { academicInfo }),
      ...(guardianInfo   !== null && { guardianInfo }),
      ...(teamInfo       !== null && { teamInfo }),
      ...(additionalInfo !== null && { additionalInfo }),
      ...(topicSelection !== null && { topicSelection }),   // ← stored as-is
      payments: {
        paymentRequired: payments.paymentRequired ?? false,
        paymentStatus:   payments.paymentStatus   ?? false,
        paymentId:       payments.paymentId       ?? '',
      },
      documents: {
        photo:           { viewLink: photoLinks?.[0]           || null, downloadLink: photoLinks?.[1]           || null },
        idProof:         { viewLink: idProofLinks?.[0]         || null, downloadLink: idProofLinks?.[1]         || null },
        academicRecords: { viewLink: academicRecordsLinks?.[0] || null, downloadLink: academicRecordsLinks?.[1] || null },
      },
    };

    // ── 4. App ID + PDF ──────────────────────────────────────────────────────
    const appId = getNextAppId(formName);
    console.log(`[postAForm] App ID: ${appId}`);

    pdfLocalPath = await makePdf(finalData, appId);
    const pdfLinks = pdfLocalPath ? await uploadToDrive(pdfLocalPath) : [null, null];

    // ── 5. Save to Firestore ─────────────────────────────────────────────────
    const docPayloadRaw = {
      applicationId:   appId,
      formType:        formName,
      status:          'pending',
      userId:          req.user?.uid || null,
      ...finalData,
      createdAt:       new Date().toISOString(),
      applicationForm: pdfLinks,
    };

    const docPayload = stripUndefined(docPayloadRaw);
    const docRef     = await db.collection('userApplications').add(docPayload);
    const docId      = docRef.id;

    // ── 6. Google Sheet (non-blocking) ───────────────────────────────────────
    try {
      await appendToSheet(docPayload);
    } catch (sheetErr) {
      console.error('Sheet append failed (non-fatal):', sheetErr);
    }

    return res.status(200).json({ success: true, id: docId, data: finalData });

  } catch (error) {
    console.error('❌ Error in postAForm:', error);
    return res.status(500).json({ success: false, message: error?.message || String(error) });

  } finally {
    // ── Cleanup temp files ───────────────────────────────────────────────────
    try {
      const toDelete = [
        req.files?.photo?.[0]?.path,
        req.files?.idProof?.[0]?.path,
        req.files?.academicRecords?.[0]?.path,
        pdfLocalPath,
      ];
      for (const p of toDelete) {
        if (p && fs.existsSync(p)) fs.unlinkSync(p);
      }
      const tempDir = path.join(process.cwd(), 'temp');
      if (fs.existsSync(tempDir)) {
        for (const file of fs.readdirSync(tempDir)) {
          fs.unlinkSync(path.join(tempDir, file));
        }
      }
    } catch (cleanupErr) {
      console.error('⚠️ Temp cleanup error:', cleanupErr);
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// OTHER CONTROLLERS
// ─────────────────────────────────────────────────────────────────────────────

export const deleteAForm = (req, res) => {
  res.send('Form Is Deleted ' + req.params.formname);
};

export const getAllForms = async (req, res) => {
  try {
    const snapshot = await db.collection('userApplications').get();
    if (snapshot.empty) return res.status(404).json({ message: 'No data found.' });

    const categorizedForms = {};
    snapshot.forEach((doc) => {
      const data     = doc.data();
      const formType = data.formType || 'uncategorized';
      if (!categorizedForms[formType]) categorizedForms[formType] = [];
      categorizedForms[formType].push({ id: doc.id, ...data });
    });

    res.status(200).json({
      message: 'Successfully retrieved and categorized all submissions.',
      data:    categorizedForms,
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms.' });
  }
};

export const getFormById = async (req, res) => {
  try {
    const doc = await db.collection('userApplications').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Form not found.' });
    res.status(200).json({ message: 'Successfully retrieved form.', data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Failed to fetch form.' });
  }
};