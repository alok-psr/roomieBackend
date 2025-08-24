import express from "express";
import cors from "cors"

const app = express()

// cors policy .. for now we allow everything
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

// common middlewares
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true, limit:'16kb'}))
app.use(express.static("public"))


// import controllers for routes
import healthCheck  from "./src/routes/health.route.js";
import listing from "./src/routes/listing.route.js"

// routes
app.use('/api/health',healthCheck)
app.use('/api/listing',listing)

app.get('/',(req,res)=>{
    res.json("hellow")
})

export { app }