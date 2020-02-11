const app = require('./app');
const knex =require('knex');
const {PORT, DATABASE_URL, CLOUDINARY_URL} = require('./config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

app.set('db', db);

//const clouddb = knex({
//    client: 'pg',
//    connection: CLOUDINARY_URL
//});

//app.set('clouddb', clouddb)

app.listen(PORT, ()=>{
    console.log(`Server listening at http://localhost:${PORT}`)
});