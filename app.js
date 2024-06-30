//create app
const express = require('express');
const app = express();

//body parser middleware
const bodyParser = require('body-parser');
const urlenconderParser = bodyParser.urlencoded({ extended: true })
app.use(urlenconderParser)

//setting up view engine
app.set('view engine', 'ejs');

//session configuration
const session = require('express-session');
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  next();
});

//configure prot
const PORT = process.env.PORT || 5000;

//running the server
app.listen(PORT, () => console.log(`server is running on prot:${PORT} >>>>`));

//predefined user credentials
const predifinedUsername = 'user';
const predifinedPassword = '1234';

//landing page
app.get('/', (req, res) => {
  if (req.session.isValid) {
    //home page
    res.render('home.ejs');
  } else {
    //login page
    res.render('login.ejs')
  }
})

//login page
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  //check for validity
  if (username == predifinedUsername && password == predifinedPassword) {
    req.session.isValid = true;
    res.render('home.ejs');
  } else {
    //login page with incorrect message
    res.render('incorrect.ejs');
  }
})

app.get('/home', (req, res) => {
  if (req.session.isValid) {
    res.render('home.ejs');
  } else {
    res.redirect('/');
  }
});

//logout button configure
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/home');
    }
    //clear user data after logout
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

//404 page
app.use((req, res) => {
  res.status(404).render('404');
});



