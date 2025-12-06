// Import core libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Student model
const Student = require('./Student');

// Initialize Express app
const app = express();
const PORT = 5000;

// MIDDLEWARE CONFIGURATION

app.use(cors());
app.use(express.json());

//DATABASE CONNECTION

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

/* =========================
   API ROUTES
========================= */
/**
 * GET /api/students
 * Get all students
 */
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch students',
      details: err.message
    });
  }
});

/**
 * POST /api/students
 * Create a new student
 */
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({
      error: 'Failed to create student',
      details: err.message
    });
  }
});

/**
 * PUT /api/students/:id
 * Update student by ID
 */
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        error: 'Student not found'
      });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({
      error: 'Failed to update student',
      details: err.message
    });
  }
});

/**
 * DELETE /api/students/:id
 * Delete student by ID
 */
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        error: 'Student not found'
      });
    }

    res.status(200).json({
      message: 'Student deleted successfully',
      id: deletedStudent._id
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to delete student',
      details: err.message
    });
  }
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
