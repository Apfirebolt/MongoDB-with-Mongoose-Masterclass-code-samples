const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Student = require('../models/student');

// Get All Students
router.get('/', async (req, res, next) => {
   const students = await Student.find().lean();
   // const students = await Student.find({firstName: { $eq: 'Drake' }, lastName: { $eq: 'James' } }).lean();
   res.render('students/list', { layout:'empty', title: 'All Students', students });
});

router.get('/create', (req, res, next) => {
   res.render('students/add', { layout:'empty', title: 'Add Student' });
});

router.post('/create', [
    body('firstName', 'First Name is required.').notEmpty(),
    body('lastName', 'Last Name is required.').notEmpty(),
  ], (req, res, next) => {
    const validation = validationResult(req);
    if(validation.errors.length > 0) {
      res.render('students/add', {
        errors: validation.errors,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
    } else {
        const newStudent = new Student({
          firstName: req.body.firstName,
          lastName: req.body.lastName
        });
        new Student(newStudent)
        .save()
        .then(student => {
          req.flash('success_msg', 'student successfully added.');
          res.redirect('/students')
      })
      .catch((err) => {
        console.log('Error ', err);
        res.render('students/add', {
          error: err,
        });
      })
    }
});

// Create a Student

// Get filtered List of Students

// Get Student Detail
router.get('/:id', async (req, res, next) => {
  const student = await Student.findOne({_id: req.params.id}).lean();
  if (!student) {
    res.redirect('/students', { error_msg: 'Student not found' });
  } else {
    res.render('students/detail', { layout:'empty', title: 'Student Detail', student: student });
  }
});

// Edit Student Details
router.get('/edit/:id', async (req, res, next) => {
  const student = await Student.findOne({_id: req.params.id}).lean();
  if (!student) {
    res.redirect('/students', { error_msg: 'Student not found' });
  } else {
    res.render('students/edit', { layout:'empty', title: 'Edit Student', student: student });
  }
});

router.post('/edit/:id', async (req, res, next) => {
  const { firstName, lastName } = req.body;
  const updatedStudent = await Student.findOneAndUpdate({_id: req.params.id}, {$set:{firstName:firstName, lastName: lastName}}, {new: true})
  if (updatedStudent) {
    req.flash('success_msg', 'Student data successfully updated');
    res.redirect('/students')
  } else {
    req.flash('error_msg', 'Student not found');
    res.redirect('/students')
  }
});

// Delete student form
router.get('/delete/:id', async (req, res, next) => {
  const student = await Student.findOne({_id: req.params.id}).lean();
  if (!student) {
    res.redirect('/students', { error_msg: 'Student not found' });
  } else {
    res.render('students/delete', { layout:'empty', title: 'Edit Student', student: student });
  }
});

// Delete student post request
router.post('/delete/:id', async (req, res, next) => {
  const deletedStudent = await Student.findOneAndDelete({_id: req.params.id});
  if (deletedStudent) {
    req.flash('success_msg', 'Student data successfully deleted');
    res.redirect('/students')
  } else {
    req.flash('error_msg', 'Student not found');
    res.redirect('/students')
  }
});

// Add Subject Form
router.get('/:id/subjects', async (req, res, next) => {
  const student = await Student.findOne({_id: req.params.id}).lean();
  if (student) {
    res.render('subjects/add', { layout:'empty', title: 'Add Subject', student: student });
  } else {
    req.flash('error_msg', 'Student not found');
    res.redirect('/students')
  }
});

// Add Subject to a student profile POST
router.post('/:id/subjects', async (req, res, next) => {
  const selectedStudent = await Student.findOne({_id: req.params.id});
  if (selectedStudent) {
    const { name, marks } = req.body;
    selectedStudent.subjects.push({ name: name, marks: marks });
    selectedStudent.save();
    req.flash('success_msg', 'Subject added successfully');
    res.redirect('/students')
  } else {
    req.flash('error_msg', 'Student not found');
    res.redirect('/students')
  }
});

// Remove Subject from a student
router.get('/:id/subjects/delete/:subjectId', async (req, res, next) => {
  const student = await Student.findOne({_id: req.params.id}).lean();
  if (student) {
    const selectedSubject = student.subjects.find((item) => item._id == req.params.subjectId);
    res.render('subjects/delete', { layout:'empty', title: 'Remove Subject', student: student, subject: selectedSubject });
  } else {
    req.flash('error_msg', 'Student not found');
    res.redirect('/students')
  }
});

// Remove Subject from a student POST
router.post('/:id/subjects/delete/:subjectId', async (req, res, next) => {
  const student = await Student.findOne({_id: req.params.id});
  if (student) {
    student.subjects.id(req.params.subjectId).remove();
    student.save((err, result) => {
      if (err) {
        console.log('Err ', err);
      }
      req.flash('success_msg', 'Subject removed successfully');
      res.redirect('/students')
    }); 
    
  } else {
    req.flash('error_msg', 'Student not found');
    res.redirect('/students')
  }
});

// Edit Subject for a student GET
router.get('/:id/subjects/edit/:subjectId', async (req, res, next) => {
  const student = await Student.findOne({_id: req.params.id}).lean();
  if (student) {
    const selectedSubject = student.subjects.find((item) => item._id == req.params.subjectId);
    res.render('subjects/edit', { layout:'empty', title: 'Remove Subject', student: student, subject: selectedSubject });
  } else {
    req.flash('error_msg', 'Student not found');
    res.redirect('/students')
  }
});

// Edit Subject for a student POST
router.post('/:id/subjects/edit/:subjectId', async (req, res, next) => {
  const student = await Student.findOne({_id: req.params.id});
  if (student) {
    student.subjects.id(req.params.subjectId).name = req.body.name;
    student.subjects.id(req.params.subjectId).marks = req.body.marks;
    student.save((err, result) => {
      if (err) {
        console.log('Err ', err);
      }
      req.flash('success_msg', 'Subject edited successfully');
      res.redirect('/students')
    });   
  } else {
    req.flash('error_msg', 'Student not found');
    res.redirect('/students')
  }
});

module.exports = router;
