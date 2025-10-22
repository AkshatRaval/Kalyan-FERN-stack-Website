// backend/utils/filesUpload.js
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import stream from 'stream';

dotenv.config();

// read service account key (keep this file safe)
const raw = fs.readFileSync('./keyGoogle.json', 'utf8');
const serviceAccount = JSON.parse(raw);

// auth + drive client
const auth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

function guessMimeType(filename) {
  const ext = (filename || '').split('.').pop().toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'txt') return 'text/plain';
  if (ext === 'csv') return 'text/csv';
  return 'application/octet-stream';
}

/**
 * uploadToDrive(input)
 * - input: string path OR { buffer, originalname, mimetype } OR multer file object with .path
 * - Returns: [webViewLink, webContentLink]
 */
export async function uploadToDrive(input) {
  if (!input) throw new Error('uploadToDrive: input required');

  await auth.authorize();

  let filename, mimeType, bodyStream;

  if (typeof input === 'string') {
    const localPath = input;
    if (!fs.existsSync(localPath)) throw new Error(`Local file not found: ${localPath}`);
    const originalName = path.basename(localPath);
    filename = `upload-${Date.now()}-${originalName}`;
    mimeType = guessMimeType(originalName);
    bodyStream = fs.createReadStream(localPath);
  } else if (input && input.buffer) {
    const originalName = input.originalname || `file-${Date.now()}`;
    filename = `upload-${Date.now()}-${originalName}`;
    mimeType = input.mimetype || guessMimeType(originalName);
    const pass = new stream.PassThrough();
    pass.end(Buffer.from(input.buffer));
    bodyStream = pass;
  } else if (input && input.path) {
    const localPath = input.path;
    if (!fs.existsSync(localPath)) throw new Error(`Local file not found: ${localPath}`);
    const originalName = input.originalname || path.basename(localPath);
    filename = `upload-${Date.now()}-${originalName}`;
    mimeType = input.mimetype || guessMimeType(originalName);
    bodyStream = fs.createReadStream(localPath);
  } else {
    throw new Error('Unsupported input for uploadToDrive.');
  }

  const fileMetadata = {
    name: filename
    // no parents: upload to My Drive root
  };

  const media = {
    mimeType,
    body: bodyStream
  };

  // create file
  const createRes = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id',
    // no supportsAllDrives needed for root uploads
  });

  const fileId = createRes?.data?.id;
  if (!fileId) throw new Error('No file id returned from Drive.');

  // optional: make file readable by anyone with link (catch errors)
  try {
    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' }
    });
  } catch (permErr) {
    // Not fatal — you can remove this block if you don't want public links
    console.warn('Could not set public permission:', permErr.message);
  }

  const meta = await drive.files.get({
    fileId,
    fields: 'webViewLink, webContentLink'
  });

  return [meta.data.webViewLink, meta.data.webContentLink];
}
