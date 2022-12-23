const userModel = require('./userSchema');
const { isValidString,isValidEmail,isValidMobileNo,isValidPassword,isValidpincode,isValidBody} = require('../utils/validtion')
const {uploadFile} = require('../utils/aws.js');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const { config } = require('dotenv');

const createUser  = async function (req, res) {
    try {
    let data = req.body;
    let files = req.files;
   
        let { fname,
            lname,
            email,
            phone,
            password,
            address
        } = data;

        address = JSON.parse(address);
        // address=JSON.parse(address);

        if (Object.keys(data).length == 0) return res.status(400).send({ msg: "all data is required"
        });
        if (!fname || !isValidString(fname)) return res.status(400).send({
            msg: "first name is required"
        });
        if (!lname || !isValidString(lname)) return res.status(400).send({
            msg: "last name is required"
        });

        if (!email || !isValidString(email)) return res.status.send(400).send({
            msg: "email id is required"
        });
        if (!isValidEmail(email)) return res.status.send({
            msg: "email is not valid please provide valid email"
        });
        let checkemail = await userModel.findOne({email});
        if (checkemail) return res.status(400).send({status: false,msg: " this emailId already register"});


        if (!phone) return res.status(400).send({
            status: false,
            message: "phone is required"
        })
        if (!isValidMobileNo(phone)) return res.status(400).send({
            status: false,
            message: `${phone} is not a valid phone.`
        })
        const isPhoneAlreadyUsed = await userModel.findOne({phone})
        if (isPhoneAlreadyUsed) {
            return res.status(409).send({
                status: false,
                message: `${phone} is already in use, Please try a new phone number.`})
        }


        if (files.length === 0) return res.status(400).send({
            status: false,
            message: "Profile Image is mandatory"
        })
        if (!password) return res.status(400).send({
            status: false,
            message: "password is required"
        })
        if (!isValidPassword(password)) return res.status(400).send({
            status: false,
            msg: "Please provide a valid Password with min 8 to 15 char with Capatial & special (@#$%^!)"
        })



        if (!address) return res.status(400).send({
            status: false,
            message: "address is required"
        })
        if (address.shipping) {

            if (!isValidString(address.shipping.street)) return res.status(400).send({
                status: false,
                message: "Shipping address's Street Required"
            })
            if (!isValidString(address.shipping.city)) return res.status(400).send({
                status: false,
                message: "Shipping address city Required"
            })
            if (!(address.shipping.pincode)) return res.status(400).send({
                status: false,
                message: "Shipping address's pincode Required"
            })
            if (!isValidpincode(address.shipping.pincode)) return res.status(400).send({
                status: false,
                message: "Shipping Pinecode is not valide"
            })

        } else {
            return res.status(400).send({
                status: false,
                message: "Shipping address cannot be empty."
            })
        }
        // Billing Address validation

        if (address.billing) {
            if (!isValidString(address.billing.street)) return res.status(400).send({
                status: false,
                message: "billing address's Street Required"
            })
            if (!isValidString(address.billing.city)) return res.status(400).send({
                status: false,
                message: "billing address city Required"
            })
            if (!(address.shipping.pincode)) return res.status(400).send({
                status: false,
                message: "billing address's pincode Required"
            })
            if (!isValidpincode(address.billing.pincode)) return res.status(400).send({
                status: false,
                message: "billing Pinecode is not valide"
            })

        } else
            return res.status(400).send({
                status: false,
                message: "Billing address cannot be empty."
            })
    
        let profileImage = await uploadFile(files[0]); //upload image to AWS
        const encryptedPassword = await bcrypt.hash(password, 10) //encrypting password by using bcrypt.

        //object destructuring for response body.
        const userData = {
            fname,
            lname,
            email,
            profileImage,
            phone,
            password: encryptedPassword,
            address
        }
        const saveUserData = await userModel.create(userData);
        return res.status(201).send({
            status: true,
            message: "user created successfully.",
            data: saveUserData
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}





//***************************************************** [user login] *****************************************************************
const loginUser = async function (req, res) {
    try {
        let loginData = req.body
        let { email, password } = loginData
 
        if (!isValidBody(loginData)) return res.status(400).send({ status: false, message: "Please fill email or password" })
        
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: `Please fill valid or mandatory email ` })
        }
 
        if (!password)
            return res.status(400).send({ status: false, message: `Please fill valid or mandatory password ` })
 
        let user = await userModel.findOne({ email: loginData.email });
        if (!user) {
            return res.status(404).send({ status: false, message: "User Not found" });
        }
        
        //comparing hard-coded password to the hashed password
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).send({ status: false, message: "wrong password" })
        }
        let token = jwt.sign({ "userId": user._id }, "productManagement", { expiresIn: '24h' });


        return res.status(200).send({ status: true, message: "login successfully", data: { userId: user._id, token: token } })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
 } 


// **********************************************************[Get User]**************************************************
 const getUser = async (req,res)=>{
   try
   {
      const userId = req.params.userId;
      console.log(userId)
      if(!mongoose.isValidObjectId(userId)) return res.status(400).send({msg:"userId is not Valid"});
    
      const user = await userModel.findOne({ _id: userId });
      if(!user) return res.status(404).send({status:false,msg:"user not found"});

    return res.status(200).send({status:true, massage: "User all Details", data: user });
      
   }
   catch(err)
   {
    res.status(500).send({status:false, massage: err.massage})
   }
}


const updateUser=async function(req,res){
    try{
        const userId=req.params.userId
        const data=req.body;
        const files= req.files;
        const {fname,lname,phone,email,password,address,profileImage}=data

    if (fname) {
        if (!isValidString(fname)) return res.status(400).send({ status: false, message: "please provide valid fname" })
        }
    if (lname) {
        if (!isValidString(lname)) return res.status(400).send({ status: false, message: "please provide valid lname" })
            }
    if (email) {
         if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "please provide valid email" })
        }
    if (password) {
         if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "please provide valid password" });
         password = await bcrypt.hash(password, 10)
         } 

    if (phone) {
            if (!isValidMobileNo(phone)) return res.status(400).send({ status: false, message: "please provide valid phone no" })
            }  
            // let {shipping,billing}=address;
    if(address){
    if (address.shipping) {
        if(!isValidString(address.shipping.street)) return res.status(400).send({ status: false, message: "please provide valid street" })
        if (!isValidString(address.shipping.city)) return res.status(400).send({ status: false, message: "please provide valid city" })   
        if (!isValidpincode(address.shipping.pincode)) return res.status(400).send({ status: false, message: "please provide valid pincode" })
        } 
    if (address.billing) {
        if(!isValidString(address.billing.street)) return res.status(400).send({ status: false, message: "please provide valid street" })
        if (!isValidString(address.billing.city))  return res.status(400).send({ status: false, message: "please provide valid city" })
        if (!isValidpincode(address.billing.pincode)) return res.status(400).send({ status: false, message: "please provide valid pincode" })
           } 
        }
    if(files.length != 0) {
        var fileImgUrl= await uploadFile(files[0]);

    } 
    let updateData={
        fname,lname,email,password,phone,address,profileImage:fileImgUrl

    }
    console.log(updateData)
    const updatedUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: updateData }, { new: true ,upsert:true})
    if(!updatedUser)return res.status(404).send({status:false,message:"User is not found"})

    return res.status(200).send({ status: true, message: "Success", data: updatedUser }) 

    }catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}





module.exports={createUser,loginUser,getUser,updateUser}