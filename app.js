const express = require('express')
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
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

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`))
})

app.use(globalErrorHandler)

module.exports = app
