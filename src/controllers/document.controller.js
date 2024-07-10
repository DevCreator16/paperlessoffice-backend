const Document = require('../models/document');
const User = require('../models/user');
const SharedDocument = require('../models/sharedDocument');
const { generatePDF } = require('../helpers/file-upload.helper');
const fs = require('fs');
// const path = require('path');

const createDocument = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Generate PDF and get the path
        generatePDF(req, res, async (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to generate PDF',
                    error: err.message
                });
            }

            const newDocument = new Document({
                title,
                content,
                documentPath: req.pdfPath,
                user: req.user._id
            });

            const savedDocument = await newDocument.save();

            res.status(200).json({
                success: true,
                message: 'Document created successfully',
                document: savedDocument
            });
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create document',
            error: error.message
        });
    }
};


const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        // Find the document by ID
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Update the document title and content
        document.title = title;
        document.content = content;

        // Generate new PDF and update the document path
        generatePDF(req, res, async (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to generate PDF',
                    error: err.message
                });
            }

            // Remove the old PDF file
            if (fs.existsSync(document.documentPath)) {
                fs.unlinkSync(document.documentPath);
            }

            document.documentPath = req.pdfPath;

            const updatedDocument = await document.save();

            res.status(200).json({
                success: true,
                message: 'Document updated successfully',
                document: updatedDocument
            });
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update document',
            error: error.message
        });
    }
};


const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the document by ID
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Delete the document file from filesystem
        if (fs.existsSync(document.documentPath)) {
            fs.unlinkSync(document.documentPath);
        }

        // Delete the document from database
        await Document.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to delete document',
            error: error.message
        });
    }
};

const addSignatureToDocument = async (req, res) => {
    try {
      const { id } = req.params; // Extract userID from params
      const { type, data } = req.body;
  
      const document = await Document.findById(id);
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }
  
      // Add signature to the document
      document.signatures.push({ type, data, user: req.user._id }); // Store userID with signature
      const updatedDocument = await document.save();
  
      res.status(200).json({
        success: true,
        message: 'Signature added to document successfully',
        document: updatedDocument
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to add signature to document',
        error: error.message
      });
    }
  };


  const shareDocument = async (req, res) => {
    try {
      const { recipientFullName, message, documentId } = req.body;
  
      // Check if req.user is defined and contains _id
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated or missing user information'
        });
      }
  
      // Split full name into first name and last name
      const [recipientFName, recipientLName] = recipientFullName.trim().split(' ');
  
      // Find recipient by first name and last name
      const recipient = await User.findOne({ fname: recipientFName, lname: recipientLName });
  
      if (!recipient) {
        return res.status(404).json({
          success: false,
          message: `Recipient '${recipientFullName}' not found`
        });
      }
  
      // Find the document being shared
      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }
  
      // Create shared document entry
      const sharedDocument = new SharedDocument({
        sender: req.user._id, // Assuming req.user._id is correctly populated
        recipient: recipient._id,
        message,
        document: document._id
      });
  
      await sharedDocument.save();
  
      res.status(200).json({
        success: true,
        message: 'Document shared successfully',
        sharedDocument
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to share document',
        error: error.message
      });
    }
  };

module.exports = { createDocument, updateDocument, deleteDocument, addSignatureToDocument, shareDocument };
