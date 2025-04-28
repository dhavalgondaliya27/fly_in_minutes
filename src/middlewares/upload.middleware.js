import multer from 'multer';

// Store file in memory to directly send buffer to S3
const storage = multer.memoryStorage();

export const uploadFile = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per file (optional, you can change)
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});
