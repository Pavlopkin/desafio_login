const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const httpServer = http.createServer(app);
const io = new Server(httpServer)
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}
const session = require('express-session')

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public'))

//arreglo donde se guardan los mensajes del chat//
const chats = []
//arreglo donde se guardan los productos//
const messages = [
    {
      title: "Campera Gore Tex",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/gore.png",
      price:25000,
    },
    {
      title: "Puffy Shirt",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/puffy.png",
      price: 60000,
    },
    {
      title: "Bolígrafo anti gravedad",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/boligrafo.png",
      price: 1500,
    },
    {
      title: "Jimmy's Shoes",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/shoes.png",
      price: 13000,
    },
    {
      title: "Fusilli Jerry",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/fusilli.png",
      price: 1200,
    },
    {
      title: "The coffee table booky",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/bookof.png",
      price: 3500,
    },
];

//////////////////











const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pavlopkin:<password>@coder.5pcfc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});



app.use(session({
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://pavlopkin:mErajPEqyHpbsFf4@coder.5pcfc.mongodb.net/?retryWrites=true&w=majority",
    mongoOptions: advancedOptions
  }),
  secret: 'mErajPEqyHpbsFf4',
  resave: false,
  saveUninitialized: false
}))
/*
const DBusers = [
    {username: 'pablo'},
]

/*

function auth(req, res, next) {
    if(req.session.admin) {
        return next()
    }

    return res.status(401).send('error auth')
}

*/

app.get('/login', (req, res)=> {
  if(req.session.username) return res.redirect('/')
  res.sendFile(__dirname + '/views/login.html')
})

app.post('/login', (req, res)=>{
  req.session.username = req.body.username
  return res.redirect('/')
})
app.get('/', (req, res)=> {
  console.log(res.session);
  if(!req.session.username) return res.redirect('/login')
  //res.sendFile(__dirname + '/views/index.html')
  return res.render('index', {username: req.session.username})
})
app.get('/logout', (req, res)=> {
  req.session.destroy()
  res.sendFile(__dirname + '/views/logout.html')
})

/*
app.get('/login', (req, res) => {
    let {username} = req.query

    if(username) return res.redirect('/')

    res.sendFile(__dirname +'/views/index.html')
    //if(!username) return res.send('Login failed')

    //username = username.toLowerCase()

  

    //const data = DBusers.find(d => d.username == username)
    //if(!data) return res.send('Login failed')

    //req.session.username = username
    //req.session.admin = true

    //res.send('Login sucess!!')
 
    res.render('desafio/index', { messages, username }) 
 
})
app.get('/private', auth, (req, res) => {
    res.render('desafio/index', { messages })
})

app.get('/logout', (req, res) => {
    req.session.destroy( err => {
        if(!err) res.send('Logout ok')
        else res.send({status: 'Logout ERROR ', body: err})
    })
})


*/

///////////////////


io.on('connection', (socket) => {
    console.log('user conetado, id: ' +  socket.id)

    socket.emit('messages', messages); 

    socket.on('new-message', (newMessage) => {
        console.log({newMessage});
        messages.push(newMessage);
        io.sockets.emit('messages', messages)
        const pos = messages.length - 1;
        })

    socket.emit('chats', chats);

    socket.on('new-chat', (newChats) => {  
        console.log({newChats});
        chats.push(newChats);
        io.sockets.emit('chats', chats)
    })
});

httpServer.listen(3000, ()=> console.log('server running...'))

