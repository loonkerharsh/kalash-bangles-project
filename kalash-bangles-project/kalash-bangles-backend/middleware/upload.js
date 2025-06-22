
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to ensure directory exists
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'public/images/others'; // Default path
    
    // Determine path based on fieldname or route context
    if (req.baseUrl.includes('/categories')) {
      uploadPath = 'public/images/categories';
    } else if (req.baseUrl.includes('/bangles')) {
      if (file.fieldname.startsWith('baseImageFile')) {
        uploadPath = 'public/images/bangles';
      } else if (file.fieldname.includes('colorVariants') && file.fieldname.includes('[imageFile]')) {
        uploadPath = 'public/images/variants';
      }
    }
    
    ensureDirExists(path.join(__dirname, '..', uploadPath)); // Ensure directory exists relative to project root
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname.replace(/\W+/g, '-') + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Use upload.any() to handle dynamically named fields from FormData, especially for color variants.
// We will then process req.files in the controller.
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports = upload;
