const express = require("express")
const { exec, execFile } = require("child_process")
const mysql = require("mysql2")
const config = require("./dbconfig.json")

const app = express()
app.use(express.json())

function ensureDatabaseExists(runCommand, onError = () => {}) {
  const connection = mysql.createConnection({
    host: "localhost",
    user: config.user,
    password: config.password
  })

  connection.connect((err) => {
    if (err) {
      console.error("[DB] Failed to connect to MySQL.", err)
      connection.destroy()
      return onError(err)
    }
    console.log("[DB] Connected to MySQL.")

    connection.query("SHOW DATABASES LIKE 'signo'", (queryErr, result) => {
      if (queryErr) {
        console.error("[DB] Could not inspect database list.", queryErr)
        connection.end()
        return onError(queryErr)
      }

      if (result.length === 0) {
        console.log("[DB] Database 'signo' not found. Running CreateDB.js...")
        exec("node CreateDB.js", { cwd: __dirname }, (execErr, stdout, stderr) => {
          connection.end()

          if (execErr) {
            console.error("[DB] CreateDB.js exited with error.", execErr)
            return onError(execErr)
          }

          console.log("[DB] CreateDB.js completed successfully.")
          runCommand()
        })
        return
      }

      console.log("[DB] Database 'signo' already exists.")
      connection.end()
      runCommand()
    })
  })
}

app.post("/api/command", (req, res) => {
  const { command } = req.body

  const respondWithError = (message, err) => {
    console.error(`[API] ${message}`, err)
    if (!res.headersSent) {
      res.status(500).send(message)
    }
  }

  if (!command) {
    console.warn("[API] Request received without command.")
    return res.status(400).send("Unknown command")
  }

  function runCommand() {
    if (command === "createPoll") {
      const { title, start, end, options } = req.body

      if (!Array.isArray(options)) {
        console.warn("[API] createPoll called without a valid options array.")
        return res.status(400).send("Options must be an array")
      }

      const optionsArg = options.map((option) => `"${option}"`).join(",")
      console.log("[API] Running CreatePoll.js...")
      exec(
        `node CreatePoll.js --title="${title}" --start="${start}" --end="${end}" --options=${optionsArg}`,
        { cwd: __dirname },
        (err, stdout, stderr) => {
          if (err) {
            return respondWithError("Failed to run CreatePoll.js.", err)
          }
          res.send(stdout || "OK")
        }
      )
      return
    }

    if (command === "loadPolls") {
      console.log("[API] Running LoadPolls.js...")
      exec(`node LoadPolls.js`, { cwd: __dirname }, (err, stdout, stderr) => {
          if (err) {
            return respondWithError("Failed to run LoadPolls.js.", err)
          }
          res.setHeader("Content-Type", "application/json")
          res.send(stdout || "[]")
        }
      )
      return
    }

    if (command === "loadPoll") {
      const { id } = req.body
      console.log("[API] Running LoadPoll.js...")
      exec(`node LoadPoll.js --id="${id}"`, { cwd: __dirname }, (err, stdout, stderr) => {
          if (err) {
            return respondWithError("Failed to run LoadPoll.js.", err)
          }
          res.setHeader("Content-Type", "application/json")
          res.send(stdout || "[]")
        }
      )
      return
    }

    if (command === "voteOption") {
      const { pollId, optionId } = req.body
      console.log("[API] Running VoteOption.js...")
      exec(`node VoteOption.js --poll=${pollId} --option=${optionId}`, { cwd: __dirname },
        (err, stdout, stderr) => {
          if (err) {
            return respondWithError("Failed to run VoteOption.js.", err)
          }
          res.send(stdout || "Vote saved")
        }
      )
      return
    }

    if (command === "deletePoll") {
      const { pollId } = req.body
      console.log("[API] Running DeletePoll.js...")
      exec(`node DeletePoll.js --id=${pollId}`, { cwd: __dirname },
        (err, stdout, stderr) => {
          if (err) {
            return respondWithError("Failed to run DeletePoll.js.", err)
          }
          res.send(stdout || "Poll deleted")
        }
      )
      return
    }

    if (command === "editPoll") {
      const { id, title, start, end, options } = req.body

      if (!Array.isArray(options)) {
        console.warn("[API] editPoll called without a valid options array.")
        return res.status(400).send("Options must be an array")
      }

      const optJson = JSON.stringify(options)
      const safeId = id == null ? "" : String(id)
      const safeTitle = title == null ? "" : String(title)
      const safeStart = start == null ? "" : String(start)
      const safeEnd = end == null ? "" : String(end)

      console.log("[API] Running EditPoll.js...")
      execFile(
        "node",
        [
          "EditPoll.js",
          `--id=${safeId}`,
          `--title=${safeTitle}`,
          `--start=${safeStart}`,
          `--end=${safeEnd}`,
          `--options=${optJson}`
        ],
        { cwd: __dirname },
        (err, stdout, stderr) => {
          if (err) {
            return respondWithError("Failed to run UpadatePoll.js.", err)
          }
          res.send(stdout || "OK")
        }
      )
      return
    }

    console.warn(`[API] Unknown command received: ${command}`)
    res.status(400).send("Unknown command")
  }

  ensureDatabaseExists(runCommand, (err) => respondWithError("Failed to prepare database.", err))
})

app.listen(3001, () => {
  console.log("API running on http://localhost:3001")
})

