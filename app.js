const express = require('express');
const app = express()
const morgan = require('morgan');
const mysql = require('mysql');

const bodyparser = require("body-parser")
app.use(bodyparser.urlencoded({extended: false}))
app.use(morgan('short'))

app.use(express.static("./public"))

function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user:"root" ,
    password:"harrison",
    database:"lbta_mysql"
  })

}

app.post("/user_create", (req, res) => {

  console.log("Creating New User")
  console.log("First Name: " + req.body.create_first_name)
  const firstName = req.body.create_first_name
  const lastName = req.body.create_last_name

  const queryString = "INSERT INTO users (first_name, last_name) VALUES (? , ?)"
  getConnection().query(queryString, [firstName, lastName], (err, results, fields) => {
    if (err) {
      console.log("Error inserting: " + err)
      res.sendStatus(500)
      return
    }
    console.log("Inserted Successfully")
    res.end()
  })
})

app.get("/users/:id", (req, res) => {
  console.log("Fetching user with id: " + req.params.id);

  const connection = getConnection()

  const userID = req.params.id
  const queryString = "SELECT * FROM users WHERE id = ?"
  connection.query(queryString, [userID], (err, rows, fields) => {
    console.log("Successfully Fetching data")
    res.json(rows)

  })
    //res.end()
})

app.get("/", (req, res) => {
  console.log("Responding to Root");
  res.send("Hello from Root")
})

app.get("/users", (req, res) => {

  const connection = getConnection()
  connection.query("SELECT * FROM users", (err, rows, fields) => {
    console.log("Successfully Fetching data")
    res.json(rows)
  })
})

app.listen(3003, () => {
 console.log("Server is up and running.");
})
