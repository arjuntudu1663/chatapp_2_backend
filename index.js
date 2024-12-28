const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors");
const { data } = require("react-router-dom");

app.use(express.json());

app.use(cors({
    origin:["http://localhost:3000"]
}))

try{
    mongoose.connect("mongodb+srv://arjuntudu9163:awHhKuynNRCy47mD@cluster0.cq6wv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}catch(e){
    if(e){
        console.log("mongoose connection error")
    }
}

const Users = mongoose.model("users_chatapp",{
    name:String,
    password:String,
    masseges:[]
})

const Massege = mongoose.model("massege_chatapp",{
      sender:String,
      receiver:String,
      senderName : String,
      receiverName:String,
      massege:[],
      time:String
})


app.post("/register",async(req,res)=>{
    
   
    const data = {}

    if(req.body.password === req.body.re_password){
        
        data.name = req.body.name
        data.password = req.body.password

    }

    try{ 
         
        const find_response = await Users.find(data);
        if(find_response.length>0){
            res.json(find_response)
        }else{
            const response = await Users.create(data);
            res.json([])
        }
        

         
    }catch(e){
        console.log(e);
    }

})

app.get("/",async(req,res)=>{
    
    try{    
        const response = await Users.find({});
        return res.json(response)
    }catch(e){
        console.log()
    }

   
})

app.post("/getName",async(req,res)=>{
     
    try{

        const response = await Users.find({_id:req.body.id})
        res.json(response)

    }catch(e){}

})

app.post("/login",async(req,res)=>{
    
    try{
        const response = await Users.find({name:req.body.name,password:req.body.password})
        res.json(response)
    }catch(e){
        console.log(e)
    }

})

app.post("/searchPeople",async(req,res)=>{

    

    try{
        const response = await Users.find(req.body)
        res.json(response)
    }catch(e){
        console.log(e)
    }

})

app.post("/sendMassege",async(req,res)=>{
     

    console.log("---------------------------------------------------------------------------------------")

    const senderId = req.body.sender
    const receiverId = req.body.receiver
    const new_massege = req.body.massege
    const senderName = req.body.senderName
    const receiverName = req.body.receiverName

    

    

    try{ 

        
           const find_massege = await Massege.find({receiver:receiverId,sender:senderId})
        
           console.log(find_massege , "< === find massege response")
    
           if(find_massege.length <= 0){
             
              const create_massege = await Massege.create({
              sender:senderId,
              receiver:receiverId,
              senderName:senderName,
              receiverName : receiverName,
              massege:new_massege

            })
            
            console.log(create_massege , "< ==== new massege creation response")
            res.json(create_massege)
            
            

           }else{

              const new_list = [...find_massege[0].massege,new_massege]
             
              console.log(new_list, " <===== new list")


              const update_massege = await Massege.findOneAndUpdate({receiver:receiverId,sender:senderId},{$set:{massege:new_list}})
              const update_massege2 = await Massege.findOneAndUpdate({sender:receiverId,receiver:senderId},{$set:{massege:new_list}})
              
              console.log(update_massege , "< ======== first update")
              console.log(update_massege2,"<==== updated massege response")

              res.json(update_massege)


           }

       
        
      console.log("-------------------------------------------------------")
        
       

    }catch(e){}

})

app.post("/getMassege",async(req,res)=>{
     
 
     try{
        const response = await Massege.find({sender:req.body.id})
   
        console.log(response[0].massege,"<=== all massege response")
        res.json(response)
      
     }catch(e){

     }


})

app.post("/user_masseges",async (req,res)=>{
     
    const userId = req.body.userId 

    try{
        const response_1 = await Users.find({_id:userId})
        const response_2 = await Massege.find({sender:userId})

        console.log(response_2, "<================ users receivers")
        
        const new_list = []

        response_2.map((x)=>{
            new_list.push({"id":x.receiver,"name":x.receiverName})
        })

        console.log(new_list,"<========= new list")

        const response_3 = await Users.findOneAndUpdate({_id:userId},{$set:{masseges:new_list}})
        console.log(response_3,"<==== after update ")

        res.json(response_3.masseges)

    }catch(e){}

})

app.post("/currentRoomChat",async(req,res)=>{
     
    const roomId = req.body.roomId
    
    
    

    try{
         
        const response = await Massege.find({_id:roomId});



      

    }catch(e){}
    

})

app.post("/msgRoomChats",async(req,res)=>{
    
    const sender = req.body.sender
    const receiver = req.body.receiver

   

    try{
        const response = await Massege.find({sender:sender,receiver:receiver})
        console.log(response,"<================================================msgRoomChats ")
        res.json(response)

    }catch(e){}

     
})

app.post("/getAllMasseges",async(req,res)=>{
     
    console.log(req.body, "<========= getAllmassege req");

    try{
        const response = await Massege.find({sender:req.body.sender,receiver:req.body.receiver});
        console.log(response , "<=== all massege for the current")
    }catch(e){}

})



app.listen(5000,(err)=>{
    if(!err){
        console.log("app started")
    }
})

