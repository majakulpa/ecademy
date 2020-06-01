const express = require('express')
const morgan = require('morgan')

const courseRouter = require('./routes/courseRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

// routes
app.use('/api/v1/courses', courseRouter)
app.use('/api/v1/users', userRouter)

module.exports = app
