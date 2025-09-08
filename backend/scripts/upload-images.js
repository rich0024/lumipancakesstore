const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dx4biopst',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImages() {
  try {
    console.log('Starting image upload to Cloudinary...');
    
    // Path to frontend images
    const imagesDir = path.join(__dirname, '../../frontend/public/images');
    
    // Images to upload
    const imagesToUpload = [
      {
        localPath: path.join(imagesDir, 'Lumi Pancakes - Etsy Shop Banner.png'),
        publicId: 'lumipancakesstore/banner',
        folder: 'lumipancakesstore'
      },
      {
        localPath: path.join(imagesDir, 'Lumi Pancakes - Etsy Shop Icon.png'),
        publicId: 'lumipancakesstore/icon',
        folder: 'lumipancakesstore'
      },
      {
        localPath: path.join(imagesDir, 'placeholder.svg'),
        publicId: 'lumipancakesstore/placeholder',
        folder: 'lumipancakesstore'
      }
    ];

    const uploadedImages = {};

    for (const image of imagesToUpload) {
      if (fs.existsSync(image.localPath)) {
        console.log(`Uploading ${path.basename(image.localPath)}...`);
        
        const result = await cloudinary.uploader.upload(image.localPath, {
          public_id: image.publicId,
          folder: image.folder,
          overwrite: true,
          resource_type: 'auto'
        });
        
        uploadedImages[path.basename(image.localPath)] = result.secure_url;
        console.log(`✓ Uploaded: ${result.secure_url}`);
      } else {
        console.log(`⚠️  File not found: ${image.localPath}`);
      }
    }

    console.log('\n🎉 Image upload complete!');
    console.log('Uploaded images:');
    Object.entries(uploadedImages).forEach(([filename, url]) => {
      console.log(`  ${filename}: ${url}`);
    });

    return uploadedImages;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (require.main === module) {
  uploadImages()
    .then(() => {
      console.log('Image upload process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Image upload process failed:', error);
      process.exit(1);
    });
}

module.exports = uploadImages;
