const express = require('express')
const router = express.Router()
const connection = require('../db')

/* GET users listing. */
router.get('/users', function (req, res, next) {
  connection.query('SELECT * FROM User;', (error, rows, fields) => {
    if (error) {
      console.error('Error connecting: ' + error.stack)
      return
    }
    const users = rows.map(element => {
      return {
        pseudo: element.pseudo
      }
    })
    res.send(users)
  })
})

module.exports = router
