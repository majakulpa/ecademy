const Course = require('./../models/courseModel')

exports.getAllCourses = async (req, res) => {
  try {
    // build query & filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Course.find(JSON.parse(queryStr))

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      //exlude __v
      query = query.select('-__v')
    }

    // pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      numCourses = await Course.countDocuments()
      if (skip >= numCourses) throw new Error('This page does not exist')
    }

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
