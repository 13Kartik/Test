const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const app = express();
const port = 3000;

// Route to generate image from HTML template
app.get('/generate-image', async (req, res) => {
    const htmlTemplatePath = 'template.html'; // Path to your HTML template file

    try {
        // Generate image
        const imageBuffer = await generateImageFromTemplate(htmlTemplatePath);
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': imageBuffer.length,
            'Cache-Control': 'no-store', // Prevent caching
            'Pragma': 'no-cache' // Compatibility with older clients
        });
        res.end(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
});

async function generateImageFromTemplate(htmlTemplatePath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load HTML template
    const htmlContent = await fs.readFile(htmlTemplatePath, 'utf8');
    await page.setContent(htmlContent);

    // Wait for rendering to complete
    await page.evaluate(() => {
        return new Promise(resolve => {
            setTimeout(resolve, 1000); // Delay for 1000 milliseconds (1 second)
        });
    });

    // Set viewport size
    await page.setViewport({ width: 800, height: 600 });

    // Capture screenshot and save as image
    const imageBuffer = await page.screenshot({ type: 'png' });

    await browser.close();
    console.log(`Image generated successfully`);
    
    return imageBuffer;
}

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
