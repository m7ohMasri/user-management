const e = require('connect-flash');
const User= require('../model/user');
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const { validationResult } = require('express-validator');
exports.getHome=(req,res,next)=>{
    res.render('home');
}
exports.getAllUser= async(req,res,next)=>{
    try{
 const users=await User.find();
    res.render('index',{
        users:users
    })
    }
    catch(err){
        console.log(err);
        next(err);
    }

    
   
}
exports.getEdit= async(req,res,next)=>{
    try{
    const userId=req.params.id;
   
   if(req.session.userId!==userId &&req.session.role!=='admin' ){
    return res.redirect('/index')
   }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
  console.log("Invalid ObjectId:", userId);
  return res.redirect('/');
}

const user = await User.findById(userId);
    if(!user){
        return res.redirect('/');
    }
    return res.render('edit',{
        user:user,
        message:undefined
    })
    }
    catch(err){
        next(err)
    }
   
    

}
exports.postEditUser= async(req,res,next)=>{
    try{
    const userId=req.body.id;
    const fname=req.body.fname;
    const lname=req.body.lname;
    const phone=req.body.phone;
    const address=req.body.address;
    const errors=validationResult(req);
    if(req.session.userId!==userId && req.session.role!=='admin' ){
    return res.redirect('/index')
   }
      const user= await User.findOne({ _id:new mongoose.Types.ObjectId(userId)});
    if(!user){
        return res.redirect('/');
    }
    if(!errors.isEmpty()){
         return res.render('edit',{
        user:user,
        message:errors.array()[0].msg
    })
    }
    user.fname=fname;
    user.lname=lname;
    user.phone=phone;
    user.address=address;
    await user.save();
     
    return res.redirect('/index');
    }
    catch(err){
        console.log("edit")
        next(err);
    }
    


}
exports.postDelete=  async(req,res,next)=>{
    try{
    const userId= req.params.id;
    const result=await User.findByIdAndDelete(userId);
    if(!result){
         req.flash("error", "User not found");
            return res.redirect("/index");
    }
            return res.redirect("/index");

    }
    catch(err){
        console.log(err);
        next(err);
    }
   

}