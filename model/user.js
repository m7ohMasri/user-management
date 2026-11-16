const mongoose=require('mongoose');
const schema=mongoose.Schema;
const userSchema=new schema({
    fname:{
        type:String,
        required:true
    },
     lname:{
        type:String,
        required:true
    },
    address:{
         type:String,
        required:true
    },
     phone:{ 
        type:String,
        required:true
    },
    role:{
         type:String,
        required:true
    },
    email:{
         type:String,
        required:true
    },
    password:{
         type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    }
    
    , resertoken: String ,
      resettokenExp:Date

})
module.exports=mongoose.model('user',userSchema);