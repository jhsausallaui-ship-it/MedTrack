//Import Express,mysql2,cors
const express =require("express");
const db = require("./database");
const cors = require("cors");

const app = express();
const PORT = 3000;
//Middleware
app.use(cors());
app.use(express.json());
 
//Testing if the Route in running
app.get('/',(req,res)=>{
    res.send("MedTracker server is running...");
});

//Routers

//Sign up
app.get('/register',(res,req)=>{
    const {
        first_name,
        last_name,
        date_of_birth,
        address,
        email,
        contact_number,
        pass,
    } = req.body;

    const sql =`INSERT INTO users(first_name,last_name,date_of_birth,address,email,contact_number,pass)VALUES(?,?,?,?,?,?,?)`;

    const values =[
        first_name,
        last_name,
        date_of_birth,
        address,
        email,
        contact_number,
        pass
    ];
    db.query(sql,values,(err,result)=>{
        if(err){
            console.error("Register error: ",err.message);
            return res.statusCode(500).json({
                success:false,
                message:"Failed to register user"
            });
        }
        res.json({
            success:true,
            message: "User registered"
        });
    });
});

//Log in

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});