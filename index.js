const express = require('express')
const cors = require('cors');
var bodyParser = require('body-parser')
const multer = require('multer')
const Procedure = require("./procedures.js")
const on = new Procedure();
var path = require('path');

const app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded())

app.use(cors())
app.listen(3001, () => {
    console.log(`This app is runnning on port ${3001}`)
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

var upload = multer({ dest: __dirname + '/public/uploads/' });
var type =

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




app.post("/addArt", upload.single('blob'), async (req, res) => {

    console.log(req.body.blob);
    const user =
        [req.body.subject, 1, req.body.genre, req.body.style, req.body.name_art, req.body.description_art, req.body.namefile, req.body.ext, req.body.blob];
    let r = await on.addArt(user);
    return r;
});