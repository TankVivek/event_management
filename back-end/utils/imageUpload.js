const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs'); // Required if uploading from a file

const uploadImageToImgBB = async (imagePath) => {
const apiKey = process.env.YOUR_CLIENT_API_KEY; // Replace with your actual ImgBB API key
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    const url = `https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`;

    try {
        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error.message);
        throw error;
    }
};

module.exports = uploadImageToImgBB