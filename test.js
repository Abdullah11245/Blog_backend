const express = require('express');
const multer = require('multer');
const { JSDOM } = require('jsdom');
const TurndownService = require('turndown');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Initialize express and specify body size limits
const app = express();

// Increase limits for JSON and URL-encoded data
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

const upload = multer({ storage: multer.memoryStorage() });
const turndownService = new TurndownService();

app.post('/post', upload.single('image'), async (req, res) => {
    let htmlContent;

    if (req.file) {
        try {
            // Assuming this function uploads a file from buffer and gets the URL
            const uploadResult = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
            htmlContent = `<img src="${uploadResult.url}"/>`;
        } catch (error) {
            console.error('Failed to upload image to Cloudinary', error);
            return res.status(500).send('Failed to upload image');
        }
    } else if (req.body.htmlContent) {
        htmlContent = req.body.htmlContent;

        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        const images = document.querySelectorAll('img');

        for (let img of images) {
            let src = img.getAttribute('src');
            console.log(src);
            if (src.startsWith('data:')) {
                // Save base64 image to server temporarily
                const base64Data = src.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                const tempImagePath = path.join(__dirname, 'tempImage.png');

                try {
                    fs.writeFileSync(tempImagePath, buffer);

                    const uploadResult = await uploadImageToCloudinary(tempImagePath);
                    img.setAttribute('src', uploadResult.url);

                    // Clean up temporary file
                    fs.unlinkSync(tempImagePath);
                } catch (error) {
                    console.error('Failed to upload image to Cloudinary', error);
                    return res.status(500).send('Failed to upload image');
                }
            }
        }

        htmlContent = dom.serialize();
        console.log(htmlContent);
    } else {
        return res.status(400).send('No content provided');
    }

    const markdownContent = turndownService.turndown(htmlContent);
    res.send(markdownContent);
});
