let mysql  = require('mysql2')
let config = require('./dbconfig.json')

let args = process.argv.slice(2)
let id = ''

for (let i = 0; i < args.length; i++) {
  let a = args[i]
  if (a.indexOf('--id=') === 0) {
    id = a.substring(5)
  }
}

let con = mysql.createConnection({
  host: 'localhost',
  user: config.user,
  password: config.password
})

con.connect(function (err) {
  if (err) throw err

  con.changeUser({ database: 'signo' }, function (err) {
    if (err) throw err

    const sql = `
      SELECT
        id,
        title,
        DATE_FORMAT(starts_at, '%Y-%m-%dT%H:%i:%s') AS start,
        DATE_FORMAT(ends_at,   '%Y-%m-%dT%H:%i:%s') AS end
      FROM polls
      WHERE id = ?
    `
    con.query(sql, [id], function (err, rows) {
      if (err) throw err
      if (rows.length === 0) {
        process.stdout.write(JSON.stringify(null))
        con.end()
      }


        let poll = rows[0]

        const sqlOptions = `
            SELECT
            o.id,
            o.text,
            COUNT(v.id) AS votes
            FROM poll_options o
            LEFT JOIN votes v ON v.option_id = o.id
            WHERE o.poll_id = ?
            GROUP BY o.id, o.text
            ORDER BY o.id
        `
        con.query(sqlOptions, [id], function (err, optRows) {
        if (err) throw err
        poll.options = optRows
        process.stdout.write(JSON.stringify(poll))
        con.end()
        })


    })
    
  })
})
