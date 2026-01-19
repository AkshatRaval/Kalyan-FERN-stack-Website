// makePdf.js (replace existing)
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function toBase64FromUrl(url) {
  try {
    const res = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });
    const mimeType = res.headers["content-type"] || "application/octet-stream";
    const base64 = Buffer.from(res.data, "binary").toString("base64");
    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.warn("toBase64FromUrl failed for", url, err?.message || err);
    return ""; 
  }
}

function safeString(s) {
  return (s === null || s === undefined || s === '') ? '-' : String(s);
}

export const makePdf = async (data, applicationId) => {
  const tempDir = path.join(__dirname, "../temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const outputPath = path.join(tempDir, `${applicationId}_application.pdf`);
  console.log(`[makePdf] outputPath = ${outputPath}`);

  // Resolve logo path (safe)
  const logoPathLocal = path.join(process.cwd(), "frontend", "public", "assets", "KalyanLogo.svg");
  let logoBase64 = "";
  try {
    if (fs.existsSync(logoPathLocal)) {
      logoBase64 = fs.readFileSync(logoPathLocal).toString("base64");
      console.log("[makePdf] loaded local logo:", logoPathLocal);
    } else {
      console.warn("[makePdf] logo not found at", logoPathLocal);
    }
  } catch (err) {
    console.warn("[makePdf] error reading logo:", err?.message || err);
  }

  // Photo
  let photoBase64 = "";
  if (data?.documents?.photo?.downloadLink) {
    photoBase64 = await toBase64FromUrl(data.documents.photo.downloadLink);
  }

  // Build address safely
  const formatAddress = () => {
    const parts = [
      data?.personalInfo?.address,
      data?.personalInfo?.city,
      data?.personalInfo?.state
    ].filter(Boolean);
    const addr = parts.join(", ");
    return data?.personalInfo?.pincode ? `${addr} - ${data.personalInfo.pincode}` : addr;
  };

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Student Application Form</title>
  <style>
    /* --- General Setup --- */
    * { 
      box-sizing: border-box; 
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt; /* Slightly larger base font */
      color: #333; /* Darker gray instead of pure black */
      margin: 0;
      padding: 0;
      background-color: #f4f4f4; /* Light gray background for the page */
    }
    .container {
      max-width: 800px; /* A4-like width */
      margin: 20px auto; /* Center on screen */
      padding: 24px;
      background: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border-radius: 8px;
    }

    /* --- Print-Specific Styles --- */
    @page {
      size: A4;
      margin: 10mm;
    }
    @media print {
      body {
        background-color: #fff;
      }
      .container {
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
      }
    }

    /* --- Header --- */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #000;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 20pt;
      margin: 0 0 5px 0;
      color: #000;
    }
    .header .logo {
      height: 50px; /* Slightly larger logo */
      max-width: 150px;
    }
    .info-row {
      font-size: 9pt;
      color: #555;
    }

    /* --- Section Titles --- */
    .section-title {
      background: #333; /* Dark gray, less harsh than black */
      color: #fff;
      padding: 8px 12px;
      font-weight: 700;
      font-size: 11pt;
      margin-top: 20px;
      margin-bottom: 12px;
      border-radius: 4px;
    }
    .section-title:first-of-type {
      margin-top: 0;
    }

    /* --- Tables --- */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    th, td {
      border: 1px solid #ddd; /* Lighter border color */
      padding: 10px; /* More padding */
      text-align: left;
      vertical-align: top; /* Aligns content to top */
      font-size: 10pt;
    }
    th {
      background: #f9f9f9; /* Lighter TH background */
      width: 25%; /* Reduced width for labels */
      font-weight: 600; /* Bolder than normal, not full-bold */
      text-align: right; /* Right-aligns labels for clean look */
      padding-right: 12px;
      color: #111;
    }

    /* --- Photo Cell --- */
    .photo-cell {
      text-align: center;
      vertical-align: middle;
      width: 140px; /* Fixed width for photo column */
    }
    .photo-cell img {
      max-width: 120px;
      max-height: 120px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f9f9f9;
    }

    /* --- Checkmarks --- */
    .check { color: #008000; font-weight: bold; }
    .cross { color: #D00000; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>Application Form</h1>
        <div class="info-row">Application ID: <strong>${applicationId}</strong> | Date: <strong>${new Date().toLocaleString()}</strong></div>
      </div>
      ${logoBase64 ? `<img src="data:image/svg+xml;base64,${logoBase64}" class="logo" alt="logo">` : ''}
    </div>

    <div class="section-title">PERSONAL INFORMATION</div>
    <table>
      <tr>
        <th>Full Name</th><td>${safeString(data?.personalInfo?.fullName)}</td>
        <th>Date of Birth</th><td>${safeString(data?.personalInfo?.dateOfBirth)}</td>
      </tr>
      <tr>
        <th>Gender</th><td>${safeString(data?.personalInfo?.gender)}</td>
        <th>Aadhar</th><td>${safeString(data?.personalInfo?.aadhar)}</td>
      </tr>
      <tr>
        <th>Email</th><td colspan="3">${safeString(data?.personalInfo?.email)}</td>
      </tr>
      <tr>
        <th>Phone</th><td>${safeString(data?.personalInfo?.phone)}</td>
        <th>City</th><td>${safeString(data?.personalInfo?.city)}</td>
      </tr>
      <tr>
        <th>Address</th><td colspan="3">${safeString(formatAddress())}</td>
      </tr>
    </table>

    <div class="section-title">ACADEMIC INFORMATION</div>
    <table>
      <tr>
        <th>School</th><td>${safeString(data?.academicInfo?.school)}</td>
        <th>Board</th><td>${safeString(data?.academicInfo?.board)}</td>
      </tr>
      <tr>
        <th>Current Class</th><td>${safeString(data?.academicInfo?.currentClass)}</td>
        <th>Previous Score</th><td>${data?.academicInfo?.previousScore ? safeString(data.academicInfo.previousScore + '%') : '-'}</td>
      </tr>
    </table>

    <div class="section-title">GUARDIAN INFORMATION</div>
    <table>
      <tr>
        <th>Guardian Name</th><td>${safeString(data?.guardianInfo?.guardianName)}</td>
        <th>Relationship</th><td>${safeString(data?.guardianInfo?.relationship)}</td>
      </tr>
      <tr>
        <th>Phone</th><td>${safeString(data?.guardianInfo?.guardianPhone)}</td>
        <th>Email</th><td>${safeString(data?.guardianInfo?.guardianEmail)}</td>
      </tr>
    </table>

    <div class="section-title">ADDITIONAL INFORMATION</div>
    <table>
      <tr><th>Experience</th><td colspan="3">${safeString(data?.additionalInfo?.experience)}</td></tr>
      <tr><th>Expectations</th><td colspan="3">${safeString(data?.additionalInfo?.expectations)}</td></tr>
      <tr><th>Special Needs</th><td colspan="3">${safeString(data?.additionalInfo?.specialNeeds)}</td></tr>
    </table>

    <div class="section-title">DOCUMENTS</div>
    <table>
      <tr>
        <th>Photo & ID</th>
        <td>
          Photo: ${data?.documents?.photo?.downloadLink ? '<span class="check">✓ Uploaded</span>' : '<span class="cross">✗ Missing</span>'}<br>
          ID Proof: ${data?.documents?.idProof?.downloadLink ? '<span class="check">✓ Uploaded</span>' : '<span class="cross">✗ Missing</span>'}
        </td>
        ${photoBase64 ? `<td class="photo-cell" rowspan="2"><img src="${photoBase64}" alt="Photo"></td>` : '<td>-</td>'}
      </tr>
      <tr>
        <th>Academic</th>
        <td>
          Records: ${data?.documents?.academicRecords?.downloadLink ? '<span class="check">✓ Uploaded</span>' : '<span class="cross">✗ Missing</span>'}
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;

  let browser;
  try {
    // Launch with safe flags (useful on Linux servers)
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: 30000
    });

    const page = await browser.newPage({
      viewport: { width: 1200, height: 800 }
    });

    // setContent may wait for external resources; add a timeout and a fallback waitForLoadState
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 });
    // give the page a small extra moment to layout and render images
    await page.waitForTimeout(500);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
    });

    console.log(`[makePdf] PDF generated: ${outputPath}`);
    await browser.close();
    return outputPath;
  } catch (err) {
    console.error("[makePdf] ERROR:", err?.message || err);
    if (browser) {
      try { await browser.close(); } catch (_) {}
    }
    throw new Error("PDF generation failed: " + (err?.message || String(err)));
  }
};
