let mysql = require('mysql2');
let config = require('./dbconfig.json');

let id="", title="", start="", end="", optionsArg="";

for (const a of process.argv.slice(2)) {
  if (a.startsWith("--id="))       id = a.slice(5);
  else if (a.startsWith("--title="))  title = a.slice(8);
  else if (a.startsWith("--start="))  start = a.slice(8);
  else if (a.startsWith("--end="))    end   = a.slice(6);
  else if (a.startsWith("--options=")) optionsArg = a.slice(10);
}

function toMySQLDateTime(s){
  if (!s) return s;
  let t = s.replace('T',' ');
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(t)) t += ':00';
  return t;
}

const pollId = Number(id);
const starts_at = toMySQLDateTime(start);
const ends_at   = toMySQLDateTime(end);

let options = [];
if (optionsArg) {
  try { options = JSON.parse(optionsArg) } catch { options = [] }
}
if (!Array.isArray(options)) options = [];
options = options
  .map(o => {
    if (typeof o === 'string') {
      const trimmed = o.trim();
      return trimmed.length > 0 ? { text: trimmed } : null;
    }
    if (!o || typeof o !== 'object') return null;
    const hasId = o.id !== undefined && o.id !== null;
    const textValue = typeof o.text === 'string' ? o.text.trim() : '';
    if (hasId && textValue.length === 0) {
      return { id: o.id, remove: true };
    }
    if (textValue.length === 0) return null;
    const normalized = { text: textValue };
    if (hasId) normalized.id = o.id;
    return normalized;
  })
  .filter(Boolean);

let con = mysql.createConnection({ host:"localhost", user:config.user, password:config.password });

con.connect(function(err){
  if (err) throw err;
  con.changeUser({ database:'signo' }, function(err){
    if (err) throw err;

    con.query(
      'UPDATE polls SET title = ?, starts_at = ?, ends_at = ? WHERE id = ?',
      [title, starts_at, ends_at, pollId],
      function(err){
        if (err) throw err;

        const incomingIds = new Set(
          options
            .filter(opt => opt && opt.id !== undefined && opt.id !== null && !opt.remove)
            .map(opt => Number(opt.id))
            .filter(id => !Number.isNaN(id))
        );

        con.query(
          'SELECT id FROM poll_options WHERE poll_id = ?',
          [pollId],
          function(err, rows){
            if (err) throw err;

            const idsToRemove = rows
              .map(r => Number(r.id))
              .filter(id => !Number.isNaN(id) && !incomingIds.has(id));

            let removeIndex = 0;
            (function removeNext(){
              if (removeIndex >= idsToRemove.length) return applyOptions();
              const removeId = idsToRemove[removeIndex++];
              con.query(
                'DELETE FROM poll_options WHERE id = ? AND poll_id = ?',
                [removeId, pollId],
                function(err){ if (err) throw err; removeNext(); }
              );
            })();

            function applyOptions(){
              const activeOptions = options.filter(opt => opt && !opt.remove);
              if (activeOptions.length === 0) {
                if (idsToRemove.length > 0) {
                  console.log(`Poll updated (id=${pollId}) removing ${idsToRemove.length} options.`);
                } else {
                  console.log(`Poll updated (id=${pollId}).`);
                }
                return con.end();
              }

              let i = 0;
              (function next(){
                if (i >= activeOptions.length) {
                  const totalChanges = activeOptions.length + idsToRemove.length;
                  console.log(`Poll updated (id=${pollId}) with ${totalChanges} option changes.`);
                  return con.end();
                }
                const opt = activeOptions[i++];
                const hasId = opt && opt.id !== undefined && opt.id !== null;
                const textValue = opt && opt.text != null ? String(opt.text) : '';
                const normalizedText = textValue.trim();

                if (hasId) {
                  con.query(
                    'UPDATE poll_options SET text = ? WHERE id = ? AND poll_id = ?',
                    [normalizedText, Number(opt.id), pollId],
                    function(err){ if (err) throw err; next(); }
                  );
                } else {
                  con.query(
                    'INSERT INTO poll_options (poll_id, text) VALUES (?, ?)',
                    [pollId, normalizedText],
                    function(err){ if (err) throw err; next(); }
                  );
                }
              })();
            }
          }
        );
      }
    );
  });
});
