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
const flash          = require('connect-flash')
const multer         = require('multer')
const csrf           = require('csurf')

//env proccess
require('dotenv').config()

//define Packages
const app = express()
//connect to DB
mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true , useUnifiedTopology: true})

//mongoose.connect('mongodb://localhost/mskn', {useNewUrlParser: true, useUnifiedTopology: true});




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

//connect-flash
app.use(flash())

//file storage system
  //destination && filename
const fileStorage = multer.diskStorage({
  filename : (req,file,cb)=>{
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
  }
})
  //accepted file extensions
const fileFilter = (req,file,cb)=>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
   cb(null, true)
  }else{
    req.errorImage = 'Error Extension'
    cb(null, false , req.errorImage)
  }
}
//multer
app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'))

//admin Dashboard Routes
const adminRoutes   = require('./routes/admin')
app.use('/admin',adminRoutes)

//csruf Token
const csrfProtection = csrf()
//ejs
app.set('view engine','ejs')
//static file app
app.use(express.static(path.join(__dirname,'public')))
//body parser
app.use(bodyParser.urlencoded({extended:false}))
//method-override
app.use(methodOverride('_method'))
//use csrfProtection Token
app.use(csrfProtection)

//middlewars
app.use((req,res,next)=>{
  res.locals.currentUser = req.user,
  res.locals.error = req.flash('error'),
  res.locals.success = req.flash('success'),
  res.locals.csrfToken = req.csrfToken(),
  res.locals.moment = require('moment')
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
    return res.status(404).render('notfound/404',{pageTitle:'لا يوجد شئ هنا'})
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
app.listen(PORT,()=>{
  console.log('server 3000 started')
})