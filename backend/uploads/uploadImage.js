const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARYNAME,
  api_key: process.env.CLOUDINARYAPIKEY,
  api_secret: process.env.CLOUDINARYAPISECRET
});

async function uploadImages(imageFiles) {
  const uploadPromises = imageFiles.map((image) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "profile_pics", // Specify the folder in Cloudinary
        },
        (error, result) => {
          if (error) {
            reject(`Failed to upload image: ${error.message}`);
          } else {
            resolve(result.url);
          }
        }
      );

      uploadStream.end(image.buffer);
    });
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error(`Error uploading images: ${error}`);
    throw error;
  }
}

module.exports = uploadImages;
