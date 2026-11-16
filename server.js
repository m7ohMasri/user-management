// Load settings from .env (see .env.example). Needs Node 20.12+.
try { process.loadEnvFile(); } catch (e) { /* no .env file: use real environment variables */ }
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const ejs=require('ejs');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const multer=require('multer');
app.set('view engine', 'ejs');
app.set('views','./views');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json())
const csrf= require('csurf');
const csrfPro=csrf();
const path=require('path')
const userRouter=require('./router/user');
const authsRouter=require('./router/auths');
const errorcontroler=require('./controller/error')
const { error } = require('console');
const Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + path.extname(file.originalname));

    }
}

)
const upload=multer({storage:Storage});
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(upload.single('image'));

const url=process.env.MONGODB_URI;
mongoose
.connect
(url)

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized :false,
    store:MongoStore.create({
        mongoUrl:url,
        collectionName:'sessions'
    }),
    cookie:{
         maxAge: 1000 * 60 * 60 * 24, 
  httpOnly: true

    }
}))
app.use(csrfPro);
app.use(flash());
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.userId=req.session.userId;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use(userRouter);
app.use(authsRouter);
app.use('/500',errorcontroler.get500);

app.use(errorcontroler.get404);

app.use((error,req, res, next)=>{
    res.render('500')
})

app.listen(process.env.PORT || 3000);