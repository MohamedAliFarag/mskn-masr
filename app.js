//app listen
const PORT = process.env.PORT || 3000

//packages
const express        = require('express')
const path           = require('path')
const bodyParser     = require('body-parser')
const mongoose       = require('mongoose')
const methodOverride = require('method-override')
const session        = require('express-session')
const passport       = require('passport')
const LocalStrategy  = require('passport-local')
//env proccess
require('dotenv').config()

//define Packages
const app = express()
console.log(process.env.DATABASEURL)
//connect to DB
mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true , useUnifiedTopology: true})

//express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

//passport init
app.use(passport.initialize())
app.use(passport.session())

// passport config
const User = require('./models/user');
passport.use(new LocalStrategy({
  usernameField: 'email',
},User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//ejs
app.set('view engine','ejs')
//static file app
app.use(express.static(path.join(__dirname,'public')))
//body parser
app.use(bodyParser.urlencoded({extended:false}))
//method-override
app.use(methodOverride('_method'))

//middlewars
app.use((req,res,next)=>{
  res.locals.currentUser = req.user
  next()
})


//Routes
const homeRoutes    = require('./routes/home')
const productRoutes = require('./routes/products')
const authRoutes    = require('./routes/auth')
//use Routes
app.use(homeRoutes)
app.use(productRoutes)
app.use(authRoutes)

//404 page
app.use((req,res,next)=>{
    return res.status(404).render('notfound/404',{pageTitle:'Not Found'})
})

//mongoose deprecation fix
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


//mongoose connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB Connected')
});

//app Listen
app.listen(PORT)