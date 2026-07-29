const mongoose = require('mongoose');

const graphSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Graph'
  },
  numNodes: {
    type: Number,
    required: true,
    min: 1
  },
  edges: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Graph', graphSchema);
