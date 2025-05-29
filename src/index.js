const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize variables
let attentive = 0;
let nonAttentive = 0;
let camOff = 0;
let notDetected = 0;
let highPerformance = 0;
let needAttention = 0;

// Store the graph data
let graphData = {
  datasets: [
    {
      label: 'Attentive',
      data: [45, 85, 75, 90, 80],
    },
    {
      label: 'Non-Attentive',
      data: [15, 60, 45, 30, 80],
    },
    {
      label: 'Camera Off',
      data: [30, 40, 55, 45, 65],
    },
    {
      label: 'Not in Camera',
      data: [75, 35, 25, 40, 15],
    },
  ]
};

// API endpoint to update attendance data
app.post('/api/attendance', (req, res) => {
  try {
    const { attentive: newAttentive, nonAttentive: newNonAttentive, camOff: newCamOff, notDetected: newNotDetected } = req.body;
    
    console.log('Incoming attendance:', req.body);
    // Update the values
    attentive = newAttentive || 0;
    nonAttentive = newNonAttentive || 0;
    camOff = newCamOff || 0;
    notDetected = newNotDetected || 0;

    // Calculate total students
    const totalStudents = attentive + nonAttentive + camOff + notDetected;
    
    // Calculate average attentiveness
    const averageAttentiveness = totalStudents > 0 ? (attentive / totalStudents) * 100 : 0;

    res.json({
      success: true,
      data: {
        attentive,
        nonAttentive,
        camOff,
        notDetected,
        totalStudents,
        averageAttentiveness
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// API endpoint to get current attendance data
app.get('/api/attendance', (req, res) => {
  const totalStudents = attentive + nonAttentive + camOff + notDetected;
  const averageAttentiveness = totalStudents > 0 ? (attentive / totalStudents) * 100 : 0;

  res.json({
    attentive,
    nonAttentive,
    camOff,
    notDetected,
    totalStudents,
    averageAttentiveness
  });
});

// GET endpoint to retrieve graph data


// POST endpoint for high performance data
app.post('/api/highPerformance', (req, res) => {
  try {
    const { highPerformance: newHighPerformance, needAttention: newNeedAttention } = req.body;
    
    // Validate the data
    if (typeof newHighPerformance !== 'number' || typeof newNeedAttention !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid data format. Expected numbers for highPerformance and needAttention'
      });
    }

    // Update the values
    highPerformance = newHighPerformance;
    needAttention = newNeedAttention;

    res.json({
      success: true,
      data: {
        highPerformance,
        needAttention,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET endpoint for high performance data
app.get('/api/highPerformance', (req, res) => {
  res.json({
    success: true,
    data: {
      highPerformance,
      needAttention,
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






