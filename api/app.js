const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const concertsRouter = require('./routes/concerts')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const bodyParser = require('body-parser')

/**
 * Connexion à la base de données
 */
const connection = require('./db')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(logger('dev'))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
/**
 * Enregistrement des routes
 */
app.use('/', indexRouter)
app.use('/', usersRouter)
app.use('/', concertsRouter)

/**
 * Configuration Swagger, exposition de la doc sur la route /doc
 */
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send('Error')
})

module.exports = app
