const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique:true
  },
  content: {
    type: String,
    required: true
  },
  signatures: {
    type: [{
      type: {
        type: String,
        enum: ['text', 'canvas', 'upload'],
        required: true
      },
      data: String, // Data storage can vary based on type (e.g., text input, base64 string for canvas or image)
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    }],
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
    timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
