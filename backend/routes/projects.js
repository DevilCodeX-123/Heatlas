const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const mongoose = require('mongoose');

// @route GET /api/projects
// @desc Get all governance projects
router.get('/', async (req, res) => {
  try {
    const seedData = [
      {
        name: 'Urban Forest Bangalore',
        zone: 'South-West Delta',
        budget: '₹42.5 Cr',
        completion: 82,
        phase: 'Phase II',
        score: 9.1,
        status: 'high',
        color: '#4ade80'
      },
      {
        name: 'Yamuna Cleanse Initiative',
        zone: 'NCR Sector 4',
        budget: '₹128.0 Cr',
        completion: 45,
        phase: 'In-Progress',
        score: 7.4,
        status: 'med',
        color: '#f6ad55'
      }
    ];

    // If MongoDB failed to connect (e.g. ECONNREFUSED due to network/IP limits), return fallback seed data
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, serving fallback project data');
      return res.json(seedData);
    }

    const projects = await Project.find({});
    // If no projects exist, return some dummy seed data just to keep the UI working
    if (projects.length === 0) {
      await Project.insertMany(seedData);
      return res.json(seedData);
    }
    
    res.json(projects);
  } catch (error) {
    console.error('Projects API Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
