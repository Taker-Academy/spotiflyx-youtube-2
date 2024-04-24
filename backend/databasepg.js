const {Client} = require('pg')
const { password, database } = require('pg/lib/defaults')

const client = new Client({
    host: "localhost",
    user: "pix_user",
    port: 5432,
    password: "pixservice123",
    database: "pix_reaction_db"
})

client.connect();

client.query(`Select * from users`, (err, res) => {
    if (!err){
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
})