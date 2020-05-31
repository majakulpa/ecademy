const fs = require('fs')
const express = require('express')

const app = express()

// middleware
app.use(express.json())

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/resources/data/courses.json`)
)

const getAllCourses = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses
    }
  })
}

const getCourse = (req, res) => {
  const course = courses.find(el => el.id === parseInt(req.params.id))

  if (!course) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      course
    }
  })
}

const createCourse = (req, res) => {
  const newId = courses.length + 1
  const newCourse = Object.assign({ id: newId }, req.body)

  courses.push(newCourse)

  fs.writeFile(
    `${__dirname}/resources/data/courses.json`,
    JSON.stringify(courses),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          course: newCourse
        }
      })
    }
  )
}

const updateCourse = (req, res) => {
  if (parseInt(req.params.id) > courses.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      course: 'Updated course'
    }
  })
}

const deleteCourse = (req, res) => {
  if (parseInt(req.params.id) > courses.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  res.status(204).json({
    status: 'success',
    data: null
  })
}

app
  .route('/api/v1/courses')
  .get(getAllCourses)
  .post(createCourse)

app
  .route('/api/v1/courses/:id')
  .get(getCourse)
  .patch(updateCourse)
  .delete(deleteCourse)

const port = 3000
app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
