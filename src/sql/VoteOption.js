let mysql = require("mysql2")
let config = require("./dbconfig.json")

let args = process.argv.slice(2)
let pollId = ""
let optionId = ""

for (let i = 0; i < args.length; i++) {
  let a = args[i]
  if (a.startsWith("--poll=")) { pollId = a.substring(7) }
  if (a.startsWith("--option=")) { optionId = a.substring(9) }
}

let con = mysql.createConnection({
  host: "localhost",
  user: config.user,
  password: config.password
})

con.connect(function (err) {
  if (err) throw err

  con.changeUser({ database: "signo" }, function (err) {
    if (err) throw err

    let sql = "INSERT INTO votes (poll_id, option_id) VALUES (?, ?)"
    con.query(sql, [pollId, optionId], function (err, result) {
      if (err) throw err
      console.log("Vote saved")
      con.end()
    })
  })
})
