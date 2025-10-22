import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function toBase64FromUrl(url) {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    const mimeType = res.headers["content-type"];
    const base64 = Buffer.from(res.data, "binary").toString("base64");
    return `data:${mimeType};base64,${base64}`;
}

export const makePdf = async (data, applicationId) => {
    const outputPath = path.join(__dirname, `../temp/${applicationId}_application.pdf`);
    console.log(outputPath);

    const logoPath = path.join(__dirname, "../../frontend/public/assets/KalyanLogo.svg");
    console.log("Logo exists:", fs.existsSync(logoPath), logoPath);

    const logoBase64 = fs.existsSync(logoPath)
        ? fs.readFileSync(logoPath).toString("base64")
        : "";

    // Get photo as base64 if available
    let photoBase64 = "";
    if (data?.documents?.photo?.downloadLink) {
        try {
            photoBase64 = await toBase64FromUrl(data.documents.photo.downloadLink);
        } catch (error) {
            console.error("Failed to fetch photo:", error);
        }
    }

    // Format address
    const formatAddress = () => {
        const parts = [
            data?.personalInfo?.address,
            data?.personalInfo?.city,
            data?.personalInfo?.state
        ];
        const validParts = parts.filter(Boolean);
        const addressString = validParts.join(', ');
        return data?.personalInfo?.pincode ? `${addressString} - ${data.personalInfo.pincode}` : addressString;
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Application - ${applicationId}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 10mm; }
        body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .header h1 { font-size: 16pt; }
        .header .logo { height: 40px; }
        
        .info-row { font-size: 8pt; color: #666; margin-bottom: 8px; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #000; padding: 4px 6px; text-align: left; }
        th { background: #f0f0f0; font-weight: bold; width: 35%; font-size: 8pt; }
        td { font-size: 8pt; }
        
        .section-title {
            background: #000;
            color: #fff;
            padding: 4px 8px;
            font-weight: bold;
            font-size: 10pt;
            margin-top: 8px;
            margin-bottom: 4px;
        }
        
        .photo-cell { text-align: center; padding: 8px; }
        .photo-cell img { max-width: 100px; max-height: 120px; border: 1px solid #000; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Student Application Form</h1>
            <div class="info-row">Application ID: <strong>${applicationId}</strong> | Date: <strong>${new Date().toISOString()}</strong></div>
        </div>
        ${logoBase64 ? `<img src="data:image/svg+xml;base64,${logoBase64}" class="logo">` : ''}
    </div>

    <div class="section-title">PERSONAL INFORMATION</div>
    <table>
        <tr><th>Full Name</th><td>${data?.personalInfo?.fullName || '-'}</td><th>Date of Birth</th><td>${data?.personalInfo?.dateOfBirth || '-'}</td></tr>
        <tr><th>Gender</th><td>${data?.personalInfo?.gender || '-'}</td><th>Aadhar</th><td>${data?.personalInfo?.aadhar || '-'}</td></tr>
        <tr><th>Email</th><td colspan="3">${data?.personalInfo?.email || '-'}</td></tr>
        <tr><th>Phone</th><td>${data?.personalInfo?.phone || '-'}</td><th>City</th><td>${data?.personalInfo?.city || '-'}</td></tr>
        <tr><th>Address</th><td colspan="3">${data?.personalInfo?.address || '-'}, ${data?.personalInfo?.city || ''}, ${data?.personalInfo?.state || ''} - ${data?.personalInfo?.pincode || ''}</td></tr>
    </table>

    <div class="section-title">ACADEMIC INFORMATION</div>
    <table>
        <tr><th>School</th><td>${data?.academicInfo?.school || '-'}</td><th>Board</th><td>${data?.academicInfo?.board || '-'}</td></tr>
        <tr><th>Current Class</th><td>${data?.academicInfo?.currentClass || '-'}</td><th>Previous Score</th><td>${data?.academicInfo?.previousScore ? data.academicInfo.previousScore + '%' : '-'}</td></tr>
    </table>

    <div class="section-title">GUARDIAN INFORMATION</div>
    <table>
        <tr><th>Guardian Name</th><td>${data?.guardianInfo?.guardianName || '-'}</td><th>Relationship</th><td>${data?.guardianInfo?.relationship || '-'}</td></tr>
        <tr><th>Phone</th><td>${data?.guardianInfo?.guardianPhone || '-'}</td><th>Email</th><td>${data?.guardianInfo?.guardianEmail || '-'}</td></tr>
    </table>

    <div class="section-title">ADDITIONAL INFORMATION</div>
    <table>
        <tr><th>Experience</th><td colspan="3">${data?.additionalInfo?.experience || '-'}</td></tr>
        <tr><th>Expectations</th><td colspan="3">${data?.additionalInfo?.expectations || '-'}</td></tr>
        <tr><th>Special Needs</th><td colspan="3">${data?.additionalInfo?.specialNeeds || '-'}</td></tr>
    </table>

    <table>
        <tr>
            <th>Documents</th>
            <td>Photo: ${data?.documents?.photo ? '✓' : '✗'} | ID: ${data?.documents?.idProof ? '✓' : '✗'} | Academic: ${data?.documents?.academicRecords ? '✓' : '✗'}</td>
            ${photoBase64 ? `<td rowspan="1" class="photo-cell"><img src="${photoBase64}" alt="Photo"></td>` : '<td>-</td>'}
        </tr>
    </table>
</body>
</html>`;

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // Launch browser and generate PDF
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle' });
    
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '0mm',
            right: '0mm',
            bottom: '0mm',
            left: '0mm'
        }
    });

    await browser.close();

    console.log(`PDF generated successfully: ${outputPath}`);
    return outputPath;
};
