import express from "express";
import cors from "cors"

const app = express()

// cors policy .. for now we allow everything
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

// common middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))


// import controllers for routes
import healthCheck  from "./src/routes/health.route.js";
import listing from "./src/routes/listing.route.js"
import roomie from "./src/routes/roomie.route.js"
import user from "./src/routes/user.route.js";
// routes
app.use('/api/health',healthCheck)
app.use('/api/listing',listing)
app.use('/api/roomie',roomie)
app.use('/api/user',user);

app.get('/',(req,res)=>{
    res.json("hellow")
})

export { app }