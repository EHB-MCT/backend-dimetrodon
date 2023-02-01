const express = require('express')
const cors = require('cors');
const Procedure = require("./procedures.js")
const http = require('http');
const bodyParser = require('body-parser');
const { Server } = require("socket.io")

const ContentBasedRecommender = require('content-based-recommender')
const recommender = new ContentBasedRecommender({
  minScore: 0.05,
  maxSimilarDocuments: 100
});


const app = express();
const server = http.createServer(app);

const on = new Procedure();

const PORT = process.env.PORT || 3000;

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
app.use(cors({ origin: '*' }))
app.use(bodyParser.json());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded())

io.on('connection', (socket) => {
    socket.on('toDispay', async msg => {
        console.log(msg)
        let r = await on.getArtPieceToDisplay(msg);
        console.log(r)
        socket.broadcast.emit('display', r[0]);
    })

    socket.on('on', async msg => {
        socket.broadcast.emit('on', 'toggle');

        let r = await on.updateState(msg)
    })

    socket.on('off', async msg => {
        socket.broadcast.emit('off', 'toggle');

        let r = await on.updateState(msg)
    })

    socket.on('broadcast', async msg => {
        socket.broadcast.emit(msg, 'succes');
    })
    socket.on('broadcast-change', async msg => {
        socket.broadcast.emit(msg.split('-')[0], msg.split('+-')[1]);

    })
    
    socket.on('broadcast-dis', async msg => {
        socket.broadcast.emit(msg.split('+')[0], msg.split('+')[1]);
    })

});

server.listen(PORT, () => {
    console.log('listening on *:' + PORT);
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
        let store = await on.register(user.firstName, user.Lastname, user.email, user.password);
        console.log(store)
        res.status(201).send({
            status: "ok",
            message: "user saved",
            wat: store[0]
        });
    }

});

app.post("/addArt", async (req, res) => {
    console.log(req.body)
    const art = [req.body.subject, 1, req.body.genre, req.body.style, req.body.name_art, req.body.description_art, req.body.namefile];
    let r = await on.addArt(art);
    res.send(r);
});

app.get("/getArtPieceToDisplay/:id", async (req, res) => {
    let r = await on.getArtPieceToDisplay(req.params.id);
    console.log(r)

    res.send(r[0]);
});


app.get("/getArtist/:id", async (req, res) => {
    let r = await on.getArtist(req.params.id);
    res.send(r);
});

app.get("/getArtPiecePage/:id", async (req, res) => {
    let r = await on.getArtPiecePage(req.params.id);
    res.send(r)
})

app.get("/getUserRoomsFrames/:id", async (req, res) => {
    let r = await on.getUserRoomsFrames(req.params.id);
    res.send(r)
})

app.get("/getSimilarPieces/:id", async (req, res) => {
    let r = await on.getAll();
    recommender.train(r[0]);
    const similarDocuments = recommender.getSimilarDocuments(req.params.id, 0, 10);
    // let items = r[0].filter(e=>{ if(similarDocuments.map(e=> e.id).findIndex(e.id)){return 1}else{return -1}})
    if(similarDocuments.length != 0){
        let tot = similarDocuments.map(e=> e.id);
        let show = await on.getIds(tot);
    
        res.send(show)
    }else{
        res.send([])

    }

})


app.get("/getFilters", async (req, res) => {
    let r = await on.getFilters();
    res.send(r);
});


app.post("/applyThemJuicyFilter", async (req, res) => {
    console.log(req.body)
    let r = await on.applyThemJuicyFilter(req.body);
    res.send(r);

});

app.get("/getLikesOfuSER", async (req, res) => {
    let r = await on.getLikesOfuSER();
    res.send(r);
})

app.post("/checkGuid", async (req, res) => {
    let r = await on.checkGuid(req.body.guid)
    res.send(r[0][0])
})

app.post("/createFrame", async (req, res) => {
    let r = await on.addFrame([req.body.iduser, req.body.framename, req.body.roomname, req.body.guid])
    res.status(200).send({ message: 'succes' })
})

app.post("/getUserRooms", async (req, res) => {
    let r = await on.getUserRooms([req.body.iduser])
    res.send(r[0])
})


app.post("/likeStatePiece", async (req, res) => {
    let r = await on.likeStatePiece([req.body.iduser, req.body.idpiece])
    res.send(r[0])

})


app.post("/toggleLike", async (req, res) => {
    let r = await on.toggleLike([req.body.iduser, req.body.idpiece])
    res.send(r)

}) 

app.get("/getFrameSettings/:id", async (req, res) => {
    let r = await on.getFrameSettings([req.params.id])
    res.send(r)

}) 
app.post("/updateSettings", async (req, res) => {
    let r = await on.updateSettings([req.body.idframe, req.body.settings])
    console.log(r)
    res.send(r)

}) 

