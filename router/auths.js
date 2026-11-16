const express=require('express');
const router=express.Router();
const {check}=require('express-validator');
const User= require('../model/user')
const  authscontroler=require('../controller/auths');
router.get('/signup',authscontroler.getSignup);
router.get('/login',authscontroler.getlogin);
router.post('/login',[
    check('email').notEmpty().withMessage("email is required").isEmail().normalizeEmail().withMessage('enter a valid email') ,
    check('password').notEmpty().withMessage('password is required').isString().trim()
],authscontroler.login);
router.post('/signup',[
    check('fname').notEmpty().withMessage("first name is required").isString().trim(),
    check('lname').notEmpty().withMessage("last name is required").isString().trim(),
     check('email').notEmpty().withMessage("email is required").isEmail().withMessage("enter a valid email").normalizeEmail()
     .custom(async(value,req)=>{
        const exsitEmail= await User.findOne({email:value});
          if(exsitEmail){
         throw new Error("email is taken")
     }
     else{
        return true
     }
     }),
         check('address').notEmpty().withMessage("addressis required").isString().trim(),
             check('phone').notEmpty().withMessage("phone number is required").isNumeric()
             .matches(/^(\+972|0)?5\d{8}$/).withMessage('enter a valid palestinian number'),
             check('password').notEmpty().withMessage("password is required").isString()
             .matches(/^(?=.*[A-Za-z])[A-Za-z0-9*#@.]{6,}$/).withMessage("password sohuld be 6 or moer character and contains at least one letter2qa")
             .trim(),check('image').custom((value,{req})=>{
                if(!req.file){
                    throw (new Error('profile image is required'));
                }
                return true;
             })
        
    
],authscontroler.signup);
router.post('/logout',authscontroler.postLogOut);
router.get('/reset',authscontroler.getReset);
router.get('/reset/:token',authscontroler.getnewPass);
router.post('/newPassword',[
    check('password').notEmpty().withMessage("password is required").matches(/^(?=.*[A-Za-z])[A-Za-z0-9*#@.]{6,}$/).withMessage("password sohuld be 6 or moer character and contains at least one letter2qa")
             .trim(),

],authscontroler.postNewPassword)
router.post('/reset',[
    check('email').notEmpty().withMessage("email is required").isEmail().withMessage("enter a valid email")
],authscontroler.postReset);




module.exports=router;