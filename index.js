const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const env = require('dotenv')
env.config({path  :'./configs/.env'})
const db = require('./configs/db')
const app = express()
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// api routes import 
// const router = require('./routes')

const stripe = require('stripe')('sk_test_51NIxoKSEqWCtw5Firmp2yDnhOYVHwm3jvPuAqlM3CsTpCuLf7xI7hWBt7VAcxKFTNXIJ7CTWRTE0Z92aMzAItXIe00t6lCw5Op')

// handling CORS
app.use(cors({origin  : '*'}))

// database connection
db(app) 
app.use(express.json({ limit: '4MB' }));
app.use(express.urlencoded({ extended: true, limit: '4MB' })); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// api routes 

// app.use('/api',router)

// Create a Payment Intent (returns the client with a temporary secret)
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "Inr",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// initialization of the app
app.get('/', (req, res) => {
  res.send('Hello World!')
})




// creating an http server instance
const server = http.createServer(app)

// creating an socket.io instance by parsing http server instance
const io = new Server(server , {
  cors : {
    origin : 'http://localhost:3000',
    methods : ['GET' , 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('sendMessage' , (data) => {
    console.log(data)
  })

  // listen for client disconnections
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = app

