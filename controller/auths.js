const e = require('connect-flash');
const User= require('../model/user');
const bcrypt=require('bcryptjs');
const { route } = require('../router/user');
const mongoose=require('mongoose')
const nodemailer= require('nodemailer');
const crypto=require('crypto');
const { buffer } = require('stream/consumers');
const {validationResult}=require('express-validator');
const sendGrid=require('nodemailer-sendgrid-transport');
const transport=nodemailer.createTransport(sendGrid({
    auth:{
    api_key:process.env.SENDGRID_API_KEY
    }
}));
exports.getSignup= (req,res,next)=>{
     let message= req.flash('error');
   if(message.length>0){
    message=message[0];
   }
   else{
    message =null;
   }
    res.render('signup',{
        message:message,
        hasError:false,
        user:{
            fname:"",
            lname:"",
            email:"",
            address:"",
            phone:"",
            password:""
        }
    });
}
exports.getlogin= (req,res,next)=>{
    let message= req.flash('error');
   if(message.length>0){
    message=message[0];
   }
   else{
    message =null;
   }
    return res.render('login',{
        message:message,
        hasError:false
    });
}
exports.login= async(req,res,next)=>{
    try{
          const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
       return res.render('login',{
        message:errors.array()[0].msg,
        hasError:true,
        user:{
            email:email,
            password:password
        }
    }); 
    }
      const user= await User.findOne({email:email});
               if(!user){
                return   res.render('login',{
                  message:"email not found",
                   hasError:true,
        user:{
            email:email,
            password:password
        }
    });
               }
 const match= await  bcrypt.compare(password,user.password);
 if(match){
    req.session.userId=user._id;
    req.session.role=user.role;
    req.session.islog=true;
    req.session.save(err=>{
        if(err){
            console.log(err)
       return res.redirect('/')
        }
        else{
            return res.redirect('/index');

        }
    });
 }
 else{
             return   res.render('login',{
                  message:"wrong password",
                   hasError:true,
             user:{
            email:email,
            password:password
        }
    });
 }

    }
    catch(err){
        console.log(err);
        next(err);
    }
  
}
exports.signup= async(req,res,next)=>{
    try{
    const fname= req.body.fname;
    const lname=req.body.lname;
    const phone=req.body.phone;
    const  email=req.body.email;
    const address=req.body.address;
    const password=req.body.password;
    const image=req.file;
        console.log(image)

      const errors=validationResult(req);
    if(!errors.isEmpty()){
       return res.render('signup',{
        message:errors.array()[0].msg ,
         user:{
            fname:fname,
            lname:lname,
            email:email,
            address:address,
            phone:phone,
            password:password
        },
        hasError:true
    }); 
    }
    if (!image) {
  return res.render('signup', {
    message: 'الرجاء رفع صورة شخصية',
    user: { fname, lname, email, address, phone, password: '' },
    hasError: true
  });
}

 const imageurl= `/uploads/${image.filename}`;


    const hashPass= await bcrypt.hash(password,12);
     const user=new User({
        email:email,
        fname:fname,
        lname:lname,
        address:address,
        phone:phone,
        password:hashPass,
        imageUrl:imageurl,
        role:"user"
     })
      await user.save();
            return  res.redirect('/login');
    }
  catch (err) {
        console.log(err);
        next(err);
    }
     


}
exports.postLogOut=(req,res,next)=>{
    req.session.destroy(err=>{
        if(err)
            console.log(err);
        res.redirect('/');
    })

}
exports.getReset=(req,res,next)=>{
     let message= req.flash('error');
   if(message.length>0){
    message=message[0];
   }
   else{
    message =null;
   }
    res.render('reset',{
        message:message,
        hasError:false
    })
}
exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('reset', {
                hasError: true,
                message: errors.array()[0].msg
            })
        }

        User.findOne({ email: email }).then(user => {
            if (!user) {
                return res.render('reset', {
                    hasError: true,
                    message: "no account with this email",
                    u: { email: email }
                })
            }
            user.resertoken = token;
            user.resettokenExp = Date.now() + 3600000;
            req.session.userId = user._id;

            return user.save().then(result => {
                transport.sendMail({
                    to: req.body.email,
                    from: process.env.MAIL_FROM,
                    subject: "reset your password",
                    html: `
                      <p>reset your password</p>
                      <p>Click this <a href="${process.env.APP_URL || 'http://localhost:3000'}/reset/${token}">link</a> to set a new password</p>
                    `
                });
                res.redirect('/');
            });
        }).catch(err =>
            { console.log(err);
            next(err);});
    })
}

exports.getnewPass=(req,res,next)=>{
    const token=req.params.token;
    User.findOne({resertoken:token,resettokenExp:{$gt:Date.now()}}).then(user=>{
   let message= req.flash('error');
   if(message.length>0){
    message=message[0];
   }
   else{
    message =null;
   }
    res.render('newPassword',{
        message:message,
        passwordToken:token,
        hasError:false
    })
    }).catch(err=>console.log(err));
    
}
exports.postNewPassword=(req,res,next)=>{
    let resertuser;
    const password=req.body.password;
    const passwordToken=req.body.passwordToken;
    const userId=req.body.userId;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
         res.render('newPassword',{
        message:errors.array()[0].msg,
        passwordToken:passwordToken,
        hasError:true,
        errMassage:errors.array()[0].msg,
        user:{
            password:password

        }
    })

    }
   User.findOne({resertoken:passwordToken,resettokenExp:{$gt:Date.now()},_id:new mongoose.Types.ObjectId(userId)}).then(user=>{
         if (!user) {
        req.flash('error', 'invaled link ');
        return res.redirect('/login'); 
      }
        resertuser=user;
     return  bcrypt.hash(password,12).then(hashPasword=>{
    resertuser.password=hashPasword;
    resertuser.resertoken=undefined;
    resertuser.resettokenExp=undefined;
     resertuser.save()
        }).then(result=>{
        return    res.redirect('/login');
        })  
    }
    )
    .catch(err=>{
        next(err);
    })

}