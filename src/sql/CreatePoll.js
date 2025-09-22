let mysql = require('mysql2')
let config = require('./dbconfig.json')

let args = process.argv.slice(2)
let title = ''
let start = ''
let end = ''
let optionsArg = ''

for (let i = 0; i < args.length; i++) {
  let a = args[i]
  if (a.indexOf('--title=') === 0) { title = a.substring(8) }
  if (a.indexOf('--start=') === 0) { start = a.substring(8) }
  if (a.indexOf('--end=') === 0) { end = a.substring(6) }
  if (a.indexOf('--options=') === 0) { optionsArg = a.substring(10) }
}

function toMySQLDateTime(date) {
  if (!date) return date
  let dateT = date.replace('T', ' ')
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateT)) dateT += ':00'
  return dateT
}

let starts_at = toMySQLDateTime(start)
let ends_at   = toMySQLDateTime(end)

let options = []
if (optionsArg) {
  options = optionsArg.split(',').map(function (s) {
    return s.trim().replace(/^"(.*)"$/, '$1')
  }).filter(function (s) { return s.length > 0 })
}

let con = mysql.createConnection({
  host: "localhost",
  user: config.user,
  password: config.password
})

con.connect(function (err) {
  if (err) throw err
  con.changeUser({ database: 'signo' }, function (err) {
    if (err) throw err

    con.query('INSERT INTO polls (title, starts_at, ends_at) VALUES (?, ?, ?)', 
        [title, starts_at, ends_at], function (err, result) {
      if (err) throw err

      let pollId = result.insertId
      let values = options.map(function (o) { return [pollId, o] })
      con.query('INSERT INTO poll_options (poll_id, text) VALUES ?', 
        [values], function (err) {
        if (err) throw err
        console.log('Poll created (id=' + pollId + ') with ' + options.length + ' options.')
        con.end()
      })
    })
  })
})
