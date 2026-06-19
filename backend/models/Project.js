const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  zone: { type: String, required: true },
  budget: { type: String, required: true }, // e.g. "₹42.5 Cr"
  completion: { type: Number, required: true },
  phase: { type: String, required: true },
  score: { type: mongoose.Schema.Types.Mixed }, // Number or 'TBD'
  status: { type: String, enum: ['high', 'med', 'low', 'tbd'], default: 'tbd' },
  color: { type: String }, // Hex color for frontend
  lat: { type: Number },
  lng: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
