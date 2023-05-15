/**
 * Export et test de la connexion à la base de données MySQL
 */

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'db',
  user: 'user',
  password: 'password',
  database: 'mydb'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) throw err
  console.log('The solution is: ', rows[0].solution)
})

// connection.end()
module.exports = connection
