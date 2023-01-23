const express = require('express')
const cors = require('cors');

const Procedure = require("./procedures.js")
const on = new Procedure();



const app = express();


app.use(cors())
app.use(express.json())





app.use(cors())
app.use(express.json())



app.listen(3000, () => {
    console.log(`This app is runnning on port ${3000}`)
})


app.get("/test", async (req, res) => {
    let r = await on.params(4, 6);

    res.send(r);
});