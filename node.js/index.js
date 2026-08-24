// Event emitter:
/*const {EventEmitter} =  require('events');
const eventEmitter = new EventEmitter();
eventEmitter.on("lunch",()=>{
    console.log("🍣 yum");
    });
    eventEmitter.emit("lunch");
    eventEmitter.emit("lunch");*/


// File system:
/*const {readFile, readFileSync} = require('fs');
// readFileSync:
// const txt = readFileSync("./hello.txt", 'utf8');
// console.log(txt);


// readFile:
readFile("./hello.txt","utf8", (err, txt)=>{
    console.log(txt);
});
console.log("Do this asap!");*/


// Creating your own module
/* const myModule = require("./my-module");
console.log(myModule); */

// Express app: 
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
const { readFile } = require('fs');

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "test" ,
});

app.get('/', (request, response) => {
    readFile('./home.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('sorry, out of order');
        }
        response.send(html);
    });
});

app.get('/json', (request, response) => {
    return response.json('/text sent from backend ');
});

app.get('/people', (request, response) => {
    const sql = "SELECT * FROM persons";
    db.query(sql, (err, data)=>{
        if(err){
            return response.send(err);
        }
        else{
            return response.send(data);
        }
    });
});


app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'))
