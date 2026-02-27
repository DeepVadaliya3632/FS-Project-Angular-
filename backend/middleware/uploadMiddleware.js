import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    fileName: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// file fitler

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
    }
}

const upload = multer({storage, fileFilter})

export default upload;