
const express=require('express');
const router=express.Router();
const {check}=require('express-validator');

const  usercontroler=require('../controller/user');
router.get('/',usercontroler.getHome);
router.get('/index',usercontroler.getAllUser)
router.get('/edit/:id',usercontroler.getEdit);
router.post('/edit',[
     check('fname').notEmpty().withMessage("first name is required").isString().trim(),
        check('lname').notEmpty().withMessage("last name is required").isString().trim(),
         check('address').notEmpty().withMessage("addressis required").isString().trim(),
                     check('phone').notEmpty().withMessage("phone number is required").isNumeric()
                     .matches(/^(\+972|0)?5\d{8}$/).withMessage('enter a valid palestinian number')
        
],usercontroler.postEditUser);
router.post('/delete/:id',usercontroler.postDelete);
module.exports=router;
