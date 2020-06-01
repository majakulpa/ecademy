const express = require('express')
const {
  checkID,
  checkBody,
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController')

const router = express.Router()

router.param('id', checkID)

router.route('/').get(getAllCourses).post(checkBody, createCourse)

router.route('/:id').get(getCourse).patch(updateCourse).delete(deleteCourse)

module.exports = router
