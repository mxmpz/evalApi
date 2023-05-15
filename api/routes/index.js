const express = require('express')
const router = express.Router()
const connection = require('../db')

/* GET home page. */
router.get('/', function (req, res, next) {
  // #swagger.summary = "Page d'accueil"

  connection.query('SELECT * FROM user;', (error, rows, fields) => {
    if (error) {
      console.error('Error connecting: ' + error.stack)
      return
    }

    const users = rows.map(element => {
      return {
        pseudo: element.pseudo
      }
    })
    res.render('index', { title: 'RESTful web api', users })
  })
})

module.exports = router
