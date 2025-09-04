const pool = require('./db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected! Current time:', res.rows[0]);
    pool.end(); // close the connection
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();
