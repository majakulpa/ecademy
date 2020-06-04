const Course = require('./../models/courseModel')

exports.getAllCourses = async (req, res) => {
  try {
    // build query
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])

    const query = await Course.find(queryObj)

    // execute query
    const courses = await query

    // send response
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        course: newCourse,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id)

    res.status(200).json({
      status: 'success',
      data: null,
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    })
  }
}
