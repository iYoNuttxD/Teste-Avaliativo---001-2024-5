let mysql  = require('mysql2')
let config = require('./dbconfig.json')

let con = mysql.createConnection({
  host: 'localhost',
  user: config.user,
  password: config.password
})

con.connect(function (err) {
  if (err) throw err
  con.changeUser({ database: 'signo' }, function (err) {
    if (err) throw err

    let sql = `
      SELECT
        id,
        title,
        DATE_FORMAT(starts_at, '%Y-%m-%dT%H:%i:%s') AS start,
        DATE_FORMAT(ends_at,   '%Y-%m-%dT%H:%i:%s') AS end
      FROM polls
      ORDER BY id DESC
    `
    con.query(sql, function (err, rows) {
      if (err) throw err
      process.stdout.write(JSON.stringify(rows))
      con.end()
    })
  })
})
