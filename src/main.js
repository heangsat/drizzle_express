import express from "express";
import {db} from "./db/db.js";
import { users,userAuth } from "./db/schema.js"; // Import your schema
import { eq } from "drizzle-orm"; // Import the eq function for querying
import cors from "cors";
import { validateUserData } from "./controller/middlecheck.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const app = express();
const PORT = 3000;
 app.use(express.json());
 app.use(cors());
const JWT_SECRET = "0ms0jzperWpyHCaPyuwMHkSwfptuhDQI5am2e2rrXbKJ7dVh4WQ62zcBLozaHAVU"; 

//get all users
app.get("/getuser",async (req,res) => {
    try{
        const allUsers = await db.select().from(users);
        res.json(allUsers);
    }catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//post user
app.post("/addUser", validateUserData, async (req, res) => {
    try {
        const {name,email} = req.body;
        if(!name || !email){
            return res.status(400).json({ error: "Name and email are required" });
        }
        const newUser = await db.insert(users).values({ name, email });
        res.status(201).json({ message: "User added successfully", user: newUser } );

    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//update user
app.put("/updateUser/:id",async (req,res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }
        const updatedUser = await db.update(users).set({ name, email }).where(eq(users.id, Number(id)));
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//delete user
app.delete("/deleteUser/:id",async (req,res) => {
    try {
        const { id } = req.params;
        await db.delete(users).where(eq(users.id, Number(id)));
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//authentication route
app.post("/auth",async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({ error: "Email and password are required" });
        }
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Email and password must be strings" });
        }
        const result = await db.select().from(userAuth).where(eq(userAuth.email, email));
        if (result.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const user = result[0];
        if (user.password !== password) {
                return res.status(401).json({ error: "Invalid email or password" });
        }
            res.json({ message: "Authentication successful", user: { id: user.id, name: user.name, email: user.email } });

    } catch (error) {
        console.error("Error in authentication:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
})

//rigister route
app.post("/register",async (req,res) => {
    try {
        const {name,email,password} = req.body;
        const passworHash = await bcrypt.hash(password, 10);   

        if(!name || !email || !password){
            return res.status(400).json({ error: "Name, email and password are required" });
        }
        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Name, email and password must be strings" });
        }
        const existingUser = await db.select().from(userAuth).where(eq(userAuth.email, email));
        if (existingUser.length > 0) {
            return res.status(409).json({ error: "Email already exists" });
        }
        const newUser = await db.insert(userAuth).values({ name, email, password: passworHash });
        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
})

app.get("/getUserAuth",async (req,res) => {
    try{
        const allUsersAuth = await db.select().from(userAuth);
        res.json(allUsersAuth);
    }catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


//login route jwt implementation
app.post("/login",async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({ error: "Email and password are required" });
        }
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Email and password must be strings" });
        }
        const result = await db.select().from(userAuth).where(eq(userAuth.email, email));
        if (result.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
