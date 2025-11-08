const userModels = require("../Models/userModels");
const bcrypt = require("bcryptjs");

const register = async(req,res)=>{

    const{name,email,password} = req.body

    let user = await userModels.findOne({email:email})

    if(user) return res.status(404).json("fail")

    const hashpassword = await bcrypt.hash(password,10);

    await userModels.create({name,email,password:hashpassword});

    res.status(201).json("success")

}


const login = async(req,res)=>{

 const{email,password} = req.body;

    let user = await userModels.findOne({email:email});

    if(!user) return res.status(404).json("failed");

    const ismatch = await bcrypt.compare(password,user.password);

    if(!ismatch) return res.json("failed");

    res.status(201).json("success")

    
}

module.exports = {register,login}
