let { Pool } = require('pg')

require('dotenv').config()

let pool = new Pool({
    connectionString: 'postgresql://aziz:ixoP2WwwSt6RecAPyVikaYTJfVyh4Yev@dpg-d28olaruibrs73dp279g-a.oregon-postgres.render.com/densaulyq_db',
    ssl: {rejectUnauthorized: false}
})


module.exports = pool