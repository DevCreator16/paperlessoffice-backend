const multer = require('multer');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Ensure directories exist
const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;
        if (file.fieldname === 'profile') {
            uploadPath = path.join(__dirname, '../../profiles/');
        } else if (file.fieldname === 'document') {
            uploadPath = path.join(__dirname, '../../documents/');
        }
        ensureDirectoryExistence(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        if (file.fieldname === 'profile') {
            cb(null, req.body.name + '-' + Date.now() + path.extname(file.originalname));
        }
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // total file 5MB
    },
    fileFilter: (req, file, cb) => {
        try {
            if (file.fieldname === 'profile' && !file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                throw new Error('Only image files are allowed for profiles!');
            }
            cb(null, true);
        } catch (error) {
            cb(error, false);
        }
    }
});

// Middleware function to generate PDF and save to the document folder
const generatePDF = (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }

    const pdfPath = path.join(__dirname, '../../documents/', `${title.replace(/\s+/g, '_')}-${Date.now()}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.text(content);
    doc.end();

    stream.on('finish', () => {
        req.pdfPath = pdfPath;
        next();
    });
};

module.exports = { upload, generatePDF };
