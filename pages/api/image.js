// pages/api/random-image.js
import sharp from 'sharp';

export default async function Image(req, res) {
    // Generate a random image using the sharp library
    const image = await sharp({
        create: {
            width: 400,
            height: 400,
            channels: 3,
            background: {
                r: 0,
                g: 0,
                b: 255
            }
        }
    })
        .png()
        .toBuffer();

    // Set the Content-Type header and send the image as the response
    res.setHeader('Content-Type', 'image/png');
    res.send(image);
};
