const Course = require('./../models/courseModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.aliasTopCheap = (req, res, next) => {
  req.query.limit = '10'
  req.query.sort = 'price'
  next()
}

exports.aliasTopCourses = (req, res, next) => {
  req.query.limit = '10'
  req.query.sort = '-ratingsAverage'
  next()
}

exports.getAllCourses = catchAsync(async (req, res, next) => {
  // execute query
  const features = new APIFeatures(Course.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  const courses = await features.query

  // send response
  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses,
    },
  })
})

exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(new AppError('No course found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  })
})

exports.createCourse = catchAsync(async (req, res, next) => {
  const newCourse = await Course.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      course: newCourse,
    },
  })
})

exports.updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!course) {
    return next(new AppError('No course found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  })
})

exports.deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id)

  if (!course) {
    return next(new AppError('No course found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: null,
  })
})

exports.getCourseStats = catchAsync(async (req, res, next) => {
  const stats = await Course.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4 } },
    },
    {
      $group: {
        _id: '$level',
        numCourses: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ])

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  })
})
