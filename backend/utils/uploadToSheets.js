// uploadToSheets.js
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const HEADER_ROW = [
  'Application ID', 'Submission Date', 'Status', 'Form Type', 'User ID',
  'Full Name', 'Email', 'Phone', 'Date of Birth', 'Gender', 'Aadhar', 'Address', 'City', 'State', 'Pincode',
  'Current Class', 'School', 'Board', 'Previous Score',
  'Guardian Name', 'Guardian Phone', 'Guardian Email', 'Relationship',
  'Team Name', 'Team Members',
  'Payment ID', 'Payment Required', 'Payment Status',
  'Experience', 'Expectations', 'Special Needs',
  'Photo Link', 'ID Proof Link', 'Academic Records Link', 'Application PDF'
];

function normalizePrivateKey(obj) {
  if (!obj) return obj;
  if (obj.private_key && typeof obj.private_key === 'string') {
    // fix escaped newlines if present
    obj.private_key = obj.private_key.replace(/\\n/g, '\n');
  }
  return obj;
}

async function loadCredentialsFromEnv() {
  // 1) Base64 env recommended
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64) {
    try {
      const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      return normalizePrivateKey(parsed);
    } catch (e) {
      throw new Error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY_BASE64: ' + e.message);
    }
  }

  // 2) Raw JSON in env (less ideal but supported)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      return normalizePrivateKey(parsed);
    } catch (e) {
      throw new Error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY JSON: ' + e.message);
    }
  }

  // 3) Service account file path (GOOGLE_APPLICATION_CREDENTIALS recommended in prod)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const p = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!fs.existsSync(p)) throw new Error('GOOGLE_APPLICATION_CREDENTIALS file not found at ' + p);
    try {
      const raw = fs.readFileSync(p, 'utf8');
      const parsed = JSON.parse(raw);
      return normalizePrivateKey(parsed);
    } catch (e) {
      throw new Error('Failed to read/parse GOOGLE_APPLICATION_CREDENTIALS file: ' + e.message);
    }
  }

  // no credentials found
  return null;
}

async function getSheetsClient() {
  const credentials = await loadCredentialsFromEnv();

  if (!credentials) {
    throw new Error('No Google service account credentials found. Set GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 or GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_KEY.');
  }

  // ensure private_key newlines are correct
  const creds = normalizePrivateKey(credentials);

  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive'
    ],
  });

  await auth.authorize(); // 👈 IMPORTANT
  return google.sheets({ version: 'v4', auth });
}


async function initializeSheetHeader(formType) {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID environment variable is not set.');

  const sheets = await getSheetsClient();

  try {
    // Check if sheet (formType tab) exists
    const metadata = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = metadata.data.sheets.some(
      s => s.properties.title === formType
    );

    // ✅ If sheet/tab doesn’t exist, create it
    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: { title: formType },
              },
            },
          ],
        },
      });
      // console.log(`🆕 Created new sheet tab: ${formType}`);
    }

    // ✅ Write header row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${formType}!A1`,
      valueInputOption: 'RAW',
      resource: { values: [HEADER_ROW] },
    });

    // console.log(`✅ Header row initialized for sheet: ${formType}`);
  } catch (err) {
    console.error('❌ Error initializing header row:', err.message || err);
    throw err;
  }
}


export const appendToSheet = async (data) => {
  try {
    const {
      formType = '',
      applicationId = '',
      createdAt = new Date().toISOString(),
      status = 'pending',
      userId = '',
      personalInfo = {},
      academicInfo = {},
      guardianInfo = {},
      teamInfo = null,
      payments = {},
      additionalInfo = {},
      documents = {},
      applicationForm = []
    } = data;

    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error('SPREADSHEET_ID environment variable is not set.');

    await initializeSheetHeader(formType);
    const sheets = await getSheetsClient();

    const rowData = [
      applicationId,
      new Date(createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status,
      formType,
      userId,
      personalInfo.fullName || '',
      personalInfo.email || '',
      personalInfo.phone || '',
      personalInfo.dateOfBirth || '',
      personalInfo.gender || '',
      personalInfo.aadhar || '',
      personalInfo.address || '',
      personalInfo.city || '',
      personalInfo.state || '',
      personalInfo.pincode || '',
      academicInfo.currentClass || '',
      academicInfo.school || '',
      academicInfo.board || '',
      academicInfo.previousScore || '',
      guardianInfo.guardianName || '',
      guardianInfo.guardianPhone || '',
      guardianInfo.guardianEmail || '',
      guardianInfo.relationship || '',
      teamInfo?.teamName || 'Individual',
      (teamInfo?.members?.map(m => m.name).join(', ')) || 'N/A',
      payments.paymentId || 'N/A',
      payments.paymentRequired ? 'Yes' : 'No',
      payments.paymentStatus ? 'Success' : 'Pending',
      additionalInfo.experience || '',
      additionalInfo.expectations || '',
      additionalInfo.specialNeeds || '',
      documents.photo?.viewLink || '',
      documents.idProof?.viewLink || '',
      documents.academicRecords?.viewLink || '',
      applicationForm[0] || ''
    ];

    const request = {
      spreadsheetId,
      range: `${formType}!A:A`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [rowData] },
    };

    const response = await sheets.spreadsheets.values.append(request);
    // console.log('✅ Successfully appended data to Google Sheet.');
    return response;

  } catch (err) {
    // Helpful log for debugging; rethrow so caller can handle
    console.error('❌ Error updating Google Sheet:', (err && err.response?.data) || err.message || err);
    throw err;
  }
};
