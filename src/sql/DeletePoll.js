let mysql = require("mysql2")
let config = require("./dbconfig.json")

let args = process.argv.slice(2)
let id = ""

for (let i = 0; i < args.length; i++) {
  let a = args[i]
  if (a.startsWith("--id=")) id = a.substring(5)
}


let con = mysql.createConnection({
  host: "localhost",
  user: config.user,
  password: config.password,
})

con.connect(function (err) {
  if (err) throw err

  con.changeUser({ database: "signo" }, function (err) {
    if (err) throw err

    con.query("DELETE FROM polls WHERE id = ?", [id], function (err, result) {
      if (err) throw err
      console.log("Poll deleted")
      con.end()
    })
  })
})
