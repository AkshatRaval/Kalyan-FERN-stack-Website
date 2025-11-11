import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Router from "express";
dotenv.config();

const HEADER_ROW = [
  "Full Name",
  "Email Id",
  "Phone Number",
  "તમે ક્યારેય “શેર માર્કેટ” વિશે સાંભળ્યું છે?",
  "નીચે પૈકી કઈ વસ્તુમાં રોકાણ કરવામાં આવે છે?",
  "Option Trading” તમને કઇ વાત સમજાવે છે?",
  "રોકાણ કરતા પહેલા સૌથી અગત્યની બાબત કઈ છે?",
  "Mutual Fund શું છે?",
  "તમે દર મહિને પૈસામાંથી બચત / ઈન્વેસ્ટ કરો છો?",
  "તમે ક્યારેય શેર માર્કેટ અથવા IPOમાં રોકાણ કર્યું છે?",
  "જો કોઈ સ્કીમ “Double Money in 1 Month” કહે તો તમે શું કરશો?",
  "તમારું Demat Account છે?",
  "ફાઇનાન્સ શીખવામાં તમારો રસ કેટલો છે?",
  "તમારું Demat કયા બ્રોકર પાસે છે?",
  "PAN નંબર",
  "Client ID",
  "Regular trading",
  "Submitted At",
];

async function loadCredentialsFromEnv() {

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

function normalizePrivateKey(obj) {
  if (!obj) return obj;
  if (obj.private_key && typeof obj.private_key === 'string') {
    // fix escaped newlines if present
    obj.private_key = obj.private_key.replace(/\\n/g, '\n');
  }
  return obj;
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
      range: `quizCertificate!A1`,
      valueInputOption: 'RAW',
      resource: { values: [HEADER_ROW] },
    });

    // console.log(`✅ Header row initialized for sheet: ${formType}`);
  } catch (err) {
    console.error('❌ Error initializing header row:', err.message || err);
    throw err;
  }
}


const quizRoute = Router();
function getLocalTime(date) {
  const options = {
    timeZone: "Asia/Kolkata",
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true // Use 12-hour clock (AM/PM)
  };

  return date.toLocaleString("en-IN", options);
}
quizRoute.post("/api/upload", async (req, res) => {
  try {
    const { answers = {}, q9a = {}, user = {} } = req.body;
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId)
      throw new Error("SPREADSHEET_ID environment variable is not set.");

    await initializeSheetHeader("quizCertificate");
    const sheets = await getSheetsClient();
const myDate = new Date()
    const rowData = [
      user?.fullName,
      user?.email,
      user?.phone,
      answers[0],
      answers[1],
      answers[2],
      answers[3],
      answers[4],
      answers[5],
      answers[6],
      answers[7],
      answers[8],
      answers[9],
      q9a.broker,
      q9a.pan,
      q9a.clientId,
      q9a.regularTrading ? "YES" : "NO",
      getLocalTime(myDate)
    ];

    const request = {
      spreadsheetId,
      range: `quizCertificate!A:A`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: { values: [rowData] },
    };

    const response = await sheets.spreadsheets.values.append(request);

    res.status(201).json({"message" : "Sccess"})
  } catch (err) {
    console.error(
      "❌ Error updating Google Sheet:",
      (err && err.response?.data) || err.message || err
    );
    throw err;
  }
});

export default quizRoute;