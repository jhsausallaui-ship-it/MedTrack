//Import Express,mysql2,cors
const express =require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000;
//Middleware
app.use(cors());
app.use(express.json());
 
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

//Route
app.get('/',(req,res)=>{
    res.send("MedTracker server is running...");
});
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});