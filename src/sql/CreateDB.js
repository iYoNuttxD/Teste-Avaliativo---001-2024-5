let mysql = require('mysql2')
let config = require("./dbconfig.json")

let con = mysql.createConnection({
  host: "localhost",
  user: config.user,
  password: config.password
})

con.connect(function(err) {
  if (err) throw err
  console.log("Connected!")

  con.query("CREATE DATABASE IF NOT EXISTS signo", function (err, result) {
    if (err) throw err
    console.log("Database created")
  })

    con.changeUser({database: "signo"}, function (err, result) {
        if (err) throw err
        console.log("Using database signo")
  })

  let polls = `CREATE TABLE IF NOT EXISTS polls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL
  )`
  con.query(polls, function (err, result) {
    if (err) throw err
    console.log("Table 'polls' ready")
  })

  let options = `CREATE TABLE IF NOT EXISTS poll_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
  )`
  con.query(options, function (err, result) {
    if (err) throw err
    console.log("Table 'poll_options' ready")
  })

  let votes = `CREATE TABLE IF NOT EXISTS votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    option_id INT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE
  )`
  con.query(votes, function (err, result) {
    if (err) throw err
    console.log("Table 'votes' ready")
  })
  
  console.log("CreateDB finished.")
  con.end()
})