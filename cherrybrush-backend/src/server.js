import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from "bcrypt";
import 'dotenv/config.js';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import clientRoutes from "./routes/clientRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// go UP from backend → project root → frontend/dist
//const Dist = path.join(__dirname, "..", "dist");


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(express.static(Dist));

app.use("/api", clientRoutes);
app.use("/api/auth", authRoutes);
  
const MONGO_URI = process.env.MONGO_DB

function tokenAuthentication(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) return res.status(401).json({ 
        message:"Token Missing",
        valid: false
    })
    
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token"});
        
        req.userId = user;
        next();
    });
}

mongoose.connect(MONGO_URI).then(
    () => {
        console.log("Mangodb Connected");
    }).catch(() => {
        console.log("Failed");
    })
    
    
    const userSchema = new mongoose.Schema({
        userId:{
            type:String,
            required:true,
            unique:true
        },
        username:{
            type:String,
            required:true
        },
        password:{
            type: String,
            required:true
        },
        email:{
            type:String,
            required:false,
            unique:true,
        sparse:true
    },
    phone: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        validate: {
            validator: v => /^\+?[0-9]{7,15}$/.test(v),
            message: props => `${props.value} is not a valid phone number`
        }
    },
    addresses: [
        {
            label: {
                type: String,
                default: "Home"
            },
            line1: {
                type: String,
                required: true
            },
            line2: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            pincode: {
                type: String,
                required: true,
                match: /^[A-Za-z0-9\s-]{3,12}$/
            },
            country: {
                type: String,
                default: "India",
                required:true
            }
        }
    ],    
    isAdmin:{
        type:Boolean,
        default:false,
        select:false
    }
})

const productSchema = new mongoose.Schema({
    product:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        default:0
    }
});

const user = mongoose.model("user", userSchema)

const productData = mongoose.model("product", productSchema)

app.get("/", cors(), (req, res) => {
    res.redirect("/login");
});

app.post("/login", async(req, res) => {
    const { username, password } = req.body
    
    try{
        const check = await user.findOne({ username })
        
        if (!check) {
            return res.json({
                success: false,
                message: "User does not exist"
            });
        }
        
        const passCheck = await bcrypt.compare(password, check.password)
        
        if(!passCheck) {
            return res.json({
                success:false,
                message: "Incorrect Password"
            })
        }
        
        if (check && passCheck){
            
            const token = jwt.sign(
                { id: check.userId },
                process.env.JWT_KEY,
                { expiresIn : "5s" }
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

app.post("/register", async(req, res) => {
    const{username, password} = req.body;
    const userId = uuid();
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const data = {
        userId,
        username: username,
        password: hashedPassword,
        isAdmin:false
    }
    
    try{
        const check = await user.findOne({ username: username })
        
        if (check){
            res.json({
                success: false,
                message: "Username Already Taken",
                username: username
            })
        } else {
            await user.create(data)
            
            const token = jwt.sign(
                { userId },
                process.env.JWT_KEY,
                { expiresIn : "1h" }
            )
            
            res.json({
                success: true,
                message: "Login Successful",
                username: username,
                token
            })
        }
        
    } catch (e) {
        console.error("SIGNUP ERROR:", e);
        return res.status(500).json({
            success: false,
            message: "Signup failed"
        });
    }
})


app.get("/auth", tokenAuthentication, (req, res) => {
    res.json({ 
        message: `Hello you are authorized.`,
        valid: true
    });
});

app.post("/product", async(req, res) => {
    const { product, price } = req.body
    
    const data = {
        product:product,
        price:price
    }
    
    try{
        await productData.insertMany([data])
        res.json({
            message:'Product Added Successfully'
        })
    } catch(e) {
        console.log(e)
    }  
})

app.get("/product", async(req, res) => {
    const products = await productData.find({});
    
    res.json({
        response:products
    })
});


app.post("/product/prod", async(req, res) => {
    const { productname } = req.body;
    
    const product = await productData.find({product: productname});
    
    res.json({
        response:product
    })
})

app.post("/api/cart", async (req, res) => {
    const { variantId, qty } = req.body;
    
    const variant = await findVariantById(variantId);
    
    if (!variant) return res.status(404).send("Variant not found");
    if (variant.stock < qty) return res.status(400).send("Out of stock");
    
    addToCart(req.user.id, variantId, qty);
    res.send("Added to cart");
});

// app.get(/.*/, (req, res) => {
//     res.sendFile(path.join(Dist, "index.html"));
//   });
  
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})

// Catch-all for React Router