// pages/api/addRow.ts

import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Define the row to add to the sheet
    const { email, name, jobLink, resumefileName, resumePdfFile, additionalNotes } = req.body;

    console.log(jobLink)

    if (!email || !name || !jobLink || !resumefileName) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Use the service account credentials
    const privateKey = {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };


    const docId = process.env.SPREADSHEET_ID;  // Replace with your Google Sheet ID
    const sheets = google.sheets({ version: 'v4' });
    const drive = google.drive({ version: 'v3' });

    try {
        const auth = new google.auth.JWT(
            privateKey.client_email,
            undefined,
            privateKey.private_key,
            ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        );

        await auth.authorize();

        // Assuming pdfFile is a base64 encoded string of the file content
        const buffer = Buffer.from(resumePdfFile.split(',')[1], 'base64');
        const readable = new Readable();
        readable._read = () => { }; // _read is required but can be a no-op.
        readable.push(buffer);
        readable.push(null);

        const driveResponse = await drive.files.create({
            auth: auth,
            media: {
                mimeType: 'application/pdf',
                body: readable
            },
            requestBody: {
                name: `${resumefileName}.pdf`, // Name your file
                parents: ['19RiduE3-EedKbxDPh99DWHjmfKkqBZFU'] // Replace with your Google Drive Folder ID
            }
        });

        const driveFileId = driveResponse.data.id;
        const pdfFileLink = `https://drive.google.com/file/d/${driveFileId}/view?usp=sharing`;

        await sheets.spreadsheets.values.append({
            auth: auth,
            spreadsheetId: docId,
            range: 'Sheet1',  // Update with your Sheet name
            valueInputOption: 'RAW',
            requestBody: {
                values: [
                    [email, name, jobLink, pdfFileLink, additionalNotes, new Date()]
                ],
            },
        });

        res.status(200).json({ message: 'Row added successfully' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: `Error: ${error}` });
    }
}
