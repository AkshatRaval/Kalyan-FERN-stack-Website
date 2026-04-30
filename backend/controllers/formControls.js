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
  if (obj === null) return null;
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


function safeJSON(raw) {
  if (!raw) return raw;
  try { return JSON.parse(raw); }
  catch { return raw; }           // if it's already a plain string, keep it
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export const postAForm = async (req, res) => {
  const formName = req.params.formname;
  let pdfLocalPath = null;
  const tempFiles = [];

  try {
    // ── 1. Parse body dynamically — no whitelist ─────────────────────────────
    // Every key in req.body is a field id serialised as JSON.
    // Private keys are prefixed with _ (e.g. _payment).
    const fieldData = {};
    const internalMeta = {};

    for (const [key, raw] of Object.entries(req.body)) {
      if (key.startsWith('_')) {
        internalMeta[key.slice(1)] = safeJSON(raw);
      } else {
        fieldData[key] = safeJSON(raw);
      }
    }

    const payment = internalMeta.payment ?? {};

    // ── 2. Upload ALL file fields dynamically ────────────────────────────────
    const fileLinks = {};
    if (req.files) {
      const fileEntries = Object.entries(req.files);
      const uploads = await Promise.all(
        fileEntries.map(async ([fieldName, files]) => {
          const file = Array.isArray(files) ? files[0] : files;
          if (!file) return [fieldName, [null, null]];
          tempFiles.push(file.path);
          const links = await uploadToDrive(file.path);
          return [fieldName, links];
        })
      );
      for (const [fieldName, [viewLink, downloadLink]] of uploads) {
        fileLinks[fieldName] = { viewLink: viewLink ?? null, downloadLink: downloadLink ?? null };
      }
    }

    // ── 3. Build final document payload ─────────────────────────────────────
    const appId = getNextAppId(formName);
    console.log(`[postAForm] App ID: ${appId} | Form: ${formName}`);

    const finalData = {
      ...fieldData,
      files: fileLinks,
      payment: {
        required: payment.required ?? false,
        status: payment.status ?? false,
        id: payment.id ?? '',
        amount: payment.amount ?? 0,
      },
    };

    // ── 4. Generate PDF ──────────────────────────────────────────────────────
    pdfLocalPath = await makePdf(finalData, appId);
    tempFiles.push(pdfLocalPath);
    const pdfLinks = pdfLocalPath ? await uploadToDrive(pdfLocalPath) : [null, null];

    // ── 5. Save to Firestore ─────────────────────────────────────────────────
    const docPayload = stripUndefined({
      applicationId: appId,
      formType: formName,
      status: 'pending',
      userId: req.user?.uid ?? null,
      createdAt: new Date().toISOString(),
      applicationForm: { viewLink: pdfLinks[0] ?? null, downloadLink: pdfLinks[1] ?? null },
      ...finalData,
    });

    const docRef = await db.collection('userApplications').add(docPayload);
    const docId = docRef.id;

    // ── 6. Google Sheets (non-blocking) ──────────────────────────────────────
    appendToSheet(docPayload).catch((err) =>
      console.error('[postAForm] Sheet append failed (non-fatal):', err)
    );

    return res.status(200).json({ success: true, id: docId });

  } catch (err) {
    console.error('[postAForm] Error:', err);
    return res.status(500).json({ success: false, message: err?.message ?? String(err) });

  } finally {
    // ── Cleanup temp files ───────────────────────────────────────────────────
    for (const filePath of tempFiles) {
      try {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        console.error('[postAForm] Cleanup error:', e);
      }
    }
  }
};

// ─── Other controllers (unchanged) ───────────────────────────────────────────

export const getAllForms = async (req, res) => {
  try {
    const snapshot = await db.collection('userApplications').get();
    if (snapshot.empty) return res.status(404).json({ message: 'No data found.' });

    const categorised = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      const key = data.formType ?? 'uncategorised';
      if (!categorised[key]) categorised[key] = [];
      categorised[key].push({ id: doc.id, ...data });
    });

    res.status(200).json({ message: 'Success.', data: categorised });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forms.' });
  }
};

export const getFormById = async (req, res) => {
  try {
    const doc = await db.collection('userApplications').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Form not found.' });
    res.status(200).json({ message: 'Success.', data: { id: doc.id, ...doc.data() } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch form.' });
  }
};

export const deleteAForm = (req, res) => {
  res.send('Form Is Deleted ' + req.params.formname);
};
