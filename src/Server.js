import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from "bcrypt"
import 'dotenv/config';
import jwt from 'jsonwebtoken'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const MONGO_URI = process.env.MONGO_DB

function tokenAuthentication(req, res, next){
    const authToken = req.headers["authorization"];
    const validateToken = authToken && authToken.split(" ")[1];

    if (!validateToken) return res.status(401).json({ message:"Token Missing" })

    jwt.verify(validateToken, process.env.JWT_KEY, (err, load) => {
        if (err) return res.status(403).json({ message: "Invalid Token"})

        req.load = load
        next();
    });
}



mongoose.connect(MONGO_URI).then(
    () => {
        console.log("Mangodb Connected");
    }).catch(() => {
        console.log("Failed");
    })

const newSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required:true
    }
})

const user = mongoose.model("user", newSchema)


app.get("/login", cors(), (req, res) => {

})

app.post("/login", async(req, res) => {
    const { username, password } = req.body
    
    try{
        const check = await user.findOne({ username: username })
        const passCheck = await bcrypt.compare(password, check.password)
        
        if (check && passCheck){

            const token = jwt.sign(
                { id: username },
                process.env.JWT_KEY,
                { expiresIn : "1h" }
            )

            res.json({
                success: true,
                message: "Login Successful",
                username: check.username,
                token
            })
        } else {
            res.json({
                success: false,
                message: "Incorrect Password",
                username: check.username
            })
        };

    } catch (e) {
        console.log(e)
        res.json("Server Error")
    }
})

app.post("/signin", async(req, res) => {
    const{username, password} = req.body

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
        username: username,
        password: hashedPassword
    }

    try{
        const check = await user.findOne({ username: username })

        if (check){
            res.json("exist")
        } else {
            res.json("notexist")
            await user.insertMany([data])
        }

    } catch (e) {
        res.json("notexist")
    }
})


app.get("/auth", tokenAuthentication, (req, res) => {
    res.json({ message: `Hello you are authorized.` });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})