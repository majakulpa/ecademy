const express = require('express')
const {
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  aliasTopCheap,
  aliasTopCourses,
  getCourseStats,
} = require('../controllers/courseController')

const router = express.Router()

router.route('/course-stats').get(getCourseStats)
router.route('/top-10-best').get(aliasTopCourses, getAllCourses)
router.route('/top-10-cheap').get(aliasTopCheap, getAllCourses)

router.route('/').get(getAllCourses).post(createCourse)

router.route('/:id').get(getCourse).patch(updateCourse).delete(deleteCourse)

module.exports = router
