const express = require('express')

const fs =require('fs')
const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/nodeOne")
.then(()=> console.log("Mongoo Db connected"))
.catch((err)=> console.log("Error In Mongo Db Connection :",err))



const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    jobTitle:{
        type:String
    },
    gender:{
        String
    }

 },
 {timestamps:true}
)

 const User = mongoose.model("User",userSchema)

const app = express()
const port=3000

app.use(express.urlencoded({ extended: false}))

app.use((req,res,next)=>{
    fs.appendFile(
        "log.txt",
        `\n${Date.now()} :${req.ip} ${req.method} : ${req.path}`,
        (err,data)=>{
            next()
        } 
    )
    // return res.json({"status":"hello from first middle ware"})
})

app.use((req,res,next)=>{
    // res.setHeader("X-Name","Ashwini rishab")
  
    
    next()
})


app.get("/users", async (req,res) => {
   
    const allDBUser = await User.find({})

    const html=`
    <ul>
    ${allDBUser.map((users) => `<li>${users.firstName}, ${users.email} </li>`).join("")}
    </ul>
    `
  return  res.send(html)
})

app.get("/api/users/", async (req,res)=>{
    const allDBUser = await User.find({})

    return res.json(allDBUser)
})

app.route('/api/users/:id')
.get(async (req,res)=>{
   const user = await User.findById(req.params.id)
    await User.findByIdAndDelete(req.params.id)
    res.json({"status":"pending"})
})



app.post ('/api/users', async (req,res)=>{
    const body =req.body
    if(!body || !body.first_name|| !body.last_name ||!body.email|| !body.gender || !body.job_title){
        return res.status(400).json({msg:"all fields are required"})
    }
   
 const result =  await User.create({
    firstName: body.first_name,
    lastName:body.last_name,
    email:body.email,
    gender:body.gender,
    jobTitle:body.job_title
  })
   
    console.log("Result:",result);
    

   return res.status(201).json({"message":"Success"})
})
   

app.listen(port, (req,res)=>{
    console.log(`Server is listing at :${port}`);
    
})


