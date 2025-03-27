
const express = require("express");
const { VoterRouter } = require("./src/routes/Voter");
const { AdminRouter } = require("./src/routes/Admin");
const { BlockchainRouter } = require("./src/routes/Blockchain");
const cors = require("cors");

const app = express();
app.use(cors())
app.use(express.json())

app.use("/voter",VoterRouter)
app.use("/admin",AdminRouter)
app.use("/blockchain",BlockchainRouter);
app.listen(5000,()=>{
    console.log(`connected to port number 5000`)
})
