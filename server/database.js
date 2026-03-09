const mysql = require("mysql2");
//Connecting to the database
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"medtrack_db"
});
db.connect((err)=>{
    if(err){
        console.warn("Connection failed",err.message);
    }else{
        console.log("Connected to the database");
    };
});