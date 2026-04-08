const pkg = require("pg");
const pool = new pkg.Pool({ host: "localhost", user: "postgres", password: "password", database: "postgres" });
pool.query("SELECT $1::text as val", [undefined])
  .then(res => console.log(res.rows))
  .catch(err => console.log("ERROR:", err.message))
  .finally(() => process.exit(0));
