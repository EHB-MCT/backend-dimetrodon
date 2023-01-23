const express = require('express')
const cors = require('cors');

const Procedure = require("./procedures.js")
const on = new Procedure();

const app = express();

app.use(cors())
app.use(express.json())

app.listen(3001, () => {
    console.log(`This app is runnning on port ${3001}`)
});


app.post("/login", async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    let r = await on.login(user.email, user.password);
    console.log(r[0]);
    if (!user.email || !user.password) {
        res.status(404).send({
            status: "not ok",
            message: "some fields are missing: email or password"
        })
    } else if (r[0].length == 0) {
        res.status(404).send({
            status: "not ok",
            message: "user does not exist"
        })
    } else {
        res.status(200).send({
            status: "ok",
            message: "logged in",
            data: r[0][0]
        });
    }
});

app.post("/register", async (req, res) => {
    const user = {
        firstName: req.body.firstname,
        Lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    };

    if (await on.findExistingUser(user.email)) {
        res.status(404).send({
            status: "not ok",
            message: "There is already a user with this email"
        })
    } else {
        await on.register(user.firstName, user.Lastname, user.email, user.password);
        res.status(201).send({
            status: "ok",
            message: "user saved",
        });
    }

});