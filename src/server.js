const express = require("express")
const myRoutes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express()
app.use(cors({ origin:true, credentials:true }))
app.use(cookieParser())

app.use(express.json())

app.use(myRoutes)

app.get("/health", (req, res)=>{
    return res.json("up!")
})

app.listen(3333, ()=>console.log("Server rodando na porta 3333"))