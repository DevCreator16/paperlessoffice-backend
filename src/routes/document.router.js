const express = require('express');
const router = express.Router();
const { createDocument, updateDocument, deleteDocument, addSignatureToDocument, shareDocument } = require('../controllers/document.controller');
const { authMiddleware } = require('../middleware/auth');
// const { generatePDF } = require('../helpers/file-upload.helper');

router.post('/create',authMiddleware(), createDocument);
router.post('/update/:id', authMiddleware(), updateDocument);
router.delete('/delete/:id', authMiddleware(), deleteDocument);
router.post('/:id/add-signature/:userID', authMiddleware(), addSignatureToDocument);
router.post('/share', authMiddleware(), shareDocument);


module.exports = router;
