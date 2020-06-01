const fs = require('fs')

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/../resources/data/courses.json`)
)

exports.checkID = (req, res, next, val) => {
  if (req.params.id * 1 > courses.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    })
  }
  next()
}

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide course name and price',
    })
  }
  next()
}

exports.getAllCourses = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses,
    },
  })
}

exports.getCourse = (req, res) => {
  const id = req.params.id * 1
  const course = courses.find((el) => el.id === id)

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  })
}

exports.createCourse = (req, res) => {
  const newId = courses.length + 1
  const newCourse = Object.assign({ id: newId }, req.body)

  courses.push(newCourse)

  fs.writeFile(
    `${__dirname}/../resources/data/courses.json`,
    JSON.stringify(courses),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          course: newCourse,
        },
      })
    }
  )
}

exports.updateCourse = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      course: 'Updated course',
    },
  })
}

exports.deleteCourse = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  })
}
