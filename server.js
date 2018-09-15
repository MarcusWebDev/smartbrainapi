const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs'); //creates hashes which are used to encrypt sensistive information, like passwords
const cors = require('cors');
const knex = require('knex'); //lets you use postgreSQL syntax in js and allows you to connect the back end to the database and update/retrieve/post data

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//this block of code lets us use knex to connect to the database
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

db.select('*').from('users').then( data => {
	console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/',  (req, res) => { res.send('it is working!') })

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})//signin.js's function, handleSignin, requires db and bcrypt. This function passes db and bcrypt to signin.js and that is called dependency injection

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)}) 

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req,res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req,res)})

/*bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
    // res == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
    // res == false
}); */

app.listen(process.env.PORT || 3001, () => {
	console.log(`App is running on port ${process.env.PORT}`);
});