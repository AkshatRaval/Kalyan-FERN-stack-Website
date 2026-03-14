import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";
import express from "express";
import admin from "firebase-admin"; // must be initialized in your app entry file

dotenv.config();

const quizRoute = express.Router();

// ─── Config ───────────────────────────────────────────────────────
const SHEET_NAME = "QuizSheet";
const SUBMITTED_UIDS_COLLECTION = "quizSubmissions";

// HEADER ORDER must exactly match rowData order below — do not change one without the other
const HEADER_ROW = [
  "Full Name",        // col A
  "Mobile Number",    // col B
  "Email",            // col C
  "Firebase UID",     // col D
  "Score (correct)",  // col E
  "Total Questions",  // col F
  "Percentage",       // col G  — stored as plain "73%" string, NOT a number so sheets won't misread it
  "Submitted At",     // col H
];

// ─── Firebase Auth middleware ─────────────────────────────────────
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(authHeader.split("Bearer ")[1]);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json({ error: "Forbidden: Invalid or expired token" });
  }
};

// ─── One-submission-per-UID (Firestore) ──────────────────────────
const hasAlreadySubmitted = async (uid) => {
  const db = admin.firestore();
  const doc = await db.collection(SUBMITTED_UIDS_COLLECTION).doc(uid).get();
  return doc.exists;
};

const markAsSubmitted = async (uid, email) => {
  const db = admin.firestore();
  await db.collection(SUBMITTED_UIDS_COLLECTION).doc(uid).set({
    uid,
    email: email || "",
    submittedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

// ─── Google Sheets helpers ────────────────────────────────────────
function normalizePrivateKey(obj) {
  if (obj?.private_key) obj.private_key = obj.private_key.replace(/\\n/g, "\n");
  return obj;
}

async function getSheetsClient() {
  const p = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!p || !fs.existsSync(p)) throw new Error("Credentials file missing: " + p);
  const creds = normalizePrivateKey(JSON.parse(fs.readFileSync(p, "utf8")));
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

async function ensureSheetAndHeader(sheets, spreadsheetId) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = meta.data.sheets.some((s) => s.properties.title === SHEET_NAME);

  if (!exists) {
    console.log("Creating sheet:", SHEET_NAME);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: { requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] },
    });
  }

  // Always rewrite header row so it stays in sync
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "RAW",
    resource: { values: [HEADER_ROW] },
  });
}

function getIST(date) {
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Routes ───────────────────────────────────────────────────────

quizRoute.get("/test", (req, res) => {
  res.json({
    message: "Quiz route working!",
    sheet: SHEET_NAME,
    env: {
      hasCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
      hasSpreadsheetId: !!process.env.SPREADSHEET_ID,
    },
  });
});

// GET /check — called on quiz page load, returns { submitted: true/false }
quizRoute.get("/api/budget-quiz/check", verifyFirebaseToken, async (req, res) => {
  try {
    const submitted = await hasAlreadySubmitted(req.user.uid);
    return res.status(200).json({ submitted });
  } catch (err) {
    console.error("Check error:", err.message);
    return res.status(200).json({ submitted: false }); // fail open
  }
});

// POST — save submission, block duplicates
quizRoute.post("/api/budget-quiz", verifyFirebaseToken, async (req, res) => {
  console.log("\n New submission — UID:", req.user.uid);

  try {
    const { fullName, mobile, email, score, percentage, answers } = req.body;

    if (!fullName || !mobile) {
      return res.status(400).json({ error: "fullName and mobile are required." });
    }

    // Block duplicate
    if (await hasAlreadySubmitted(req.user.uid)) {
      console.warn("Duplicate blocked — UID:", req.user.uid);
      return res.status(409).json({ error: "Already submitted." });
    }

    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error("SPREADSHEET_ID env variable not set.");

    const sheets = await getSheetsClient();
    await ensureSheetAndHeader(sheets, spreadsheetId);

    // ── Build row — order matches HEADER_ROW exactly ──────────
    const totalQ = Array.isArray(answers) ? answers.length : 0;

    // Sanitize score: strip anything non-numeric, parse as integer
    const cleanScore = parseInt(String(score ?? 0).replace(/\D/g, ""), 10) || 0;

    // Sanitize percentage: strip %, spaces, re-add once — stored as text so sheets never misreads as date
    const rawPct = String(percentage ?? 0).replace(/[^0-9.]/g, "");
    const cleanPct = `${rawPct}%`;

    const rowData = [
      fullName,                       // A — Full Name
      mobile,                         // B — Mobile Number
      email || req.user.email || "",  // C — Email
      req.user.uid,                   // D — Firebase UID
      cleanScore,                     // E — Score (correct)
      totalQ,                         // F — Total Questions
      cleanPct,                       // G — Percentage (plain string e.g. "73%")
      getIST(new Date()),             // H — Submitted At
    ];

    console.log("Row to save:", rowData);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:A`,
      valueInputOption: "RAW",        // RAW = no auto-interpretation, prevents "600%" → date nonsense
      insertDataOption: "INSERT_ROWS",
      resource: { values: [rowData] },
    });

    // Mark submitted in Firestore only after sheet write succeeds
    await markAsSubmitted(req.user.uid, email || req.user.email);

    console.log("Saved successfully.");
    return res.status(201).json({ message: "Saved successfully." });

  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "Failed to save.", details: err.message });
  }
});

export default quizRoute;