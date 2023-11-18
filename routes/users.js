require('dotenv').config();
const express = require('express')
const  database = require("../src/sqlDatabase.js")
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { restart } = require('nodemon');
let refreshTokens=[]
router.post('/users/token', async(req,res)=>{
  
  const refreshToken=req.body.token
  if(refreshToken==null) return res.sendStatus(401)
  if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_ACCESS_TOKEN,(err,user)=>{
    if(err) console.log(err)
   
    const accessToken=generateRefreshToken({name:user.name})
    return res.json({accessToken: accessToken})

})
          
})
router.delete('/users/logOut', (req,res)=>{
  refreshTokens=refreshTokens.filter(token=>token!==req.body.token)
  
  return res.sendStatus(204)
})

router.post('/users/posts', outhoricateToken, async(req,res)=>{
 
  await  database.getAllUsers2(req.user).then((data)=>
  {
                
         
    res.json(data)
  }
  ).catch(err => {
   console.log(err)
 });
          
})

router.get('/users/login', async(req,res)=>{
  const userr = req.body[0]
 
  const user2 = req.body
  
    await  database.getAllUsers(user2.name,user2.password).then((data)=>
    {
      const username = user2.name
      const user={name: username}
       
      const accessToken= generateRefreshToken(user)
      const refreshToken = jwt.sign(user,process.env.REFRESH_ACCESS_TOKEN)
      refreshTokens.push(refreshToken)
      
      const wallet = data.currency;
      for(let i = 0; i < wallet.length; i++) {
        let obj = wallet[i];
       
        data.wallet=obj["amount"];
          }
      
          console.log("Logged as "+data.name)
     
     return res.json([{accessToken  : accessToken},{  refreshToken: refreshToken},{user: data}])
    }
    ).catch(err => {
      console.log(err)
     return res.send(err)
   });
   
})
router.post('/users/newUser',async (req,res)=>{
   
   console.log(req.body)
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  
  var user = req.body
      user.password=hashedPassword;
  
  return res.send(  database.addNewUser(user))
})


router.delete('/users/deleteUser',outhoricateToken,async (req,res)=>{
  await  database.getAllUsers2(req.user).then(async(data)=>
  {           const deposit = req.body
              const json =data.currency;
              
           console.log(data)
              database.deposit(req.body, data.id)
           
              database.deleteUser(data).then((data)=>{
                return res.send(data)
               })
            
    
  }
  ).catch(err => {
   console.log(err)
 });

  
})



router.post('/users/trans', outhoricateToken, async(req,res)=>{
 


  await  database.getAllUsers2(req.user).then(async(data)=>
  {
    console.log(data.id)

  
    await database.addTransaction(req.body,data.id).then((data)=>{
     return res.json(data)
    })
    

  }
  ).catch(err => {
   console.log(err)
 });
          
})
router.post('/users/mainAccount',outhoricateToken, async (req,res)=>{
 
  await  database.getAllUsers2(req.user).then(async(data)=>
  {           const deposit = req.body
              const json =data.currency;
              
              for(let i = 0; i < json.length; i++) {
                ;
               
                  if(json[i]["currencyCode"]=="pln"){
                    console.log(deposit["amount"])
                    console.log( json[i]["amount"])
                    json[i]["amount"]+=deposit["amount"]
                    console.log( json[i]["amount"])
                    await database.deposit(json,data.id)
                  }

                 
            }
            console.log(json)
            
    res.json(data)
  }
  ).catch(err => {
   console.log(err)
 });

})
router.put('/users/updateCurrency',outhoricateToken, async (req,res)=>{
 
  await  database.getAllUsers2(req.user).then(async(data)=>
  {           const deposit = req.body
              const json =data.currency;
              
           console.log(data)
              database.deposit(req.body, data.id)
           
              
            
    res.json(data)
  }
  ).catch(err => {
   console.log(err)
 });

})
router.get('/users/getCurrency',outhoricateToken, async (req,res)=>{
 
  await  database.getAllUsers2(req.user).then(async(data)=>
  {           const deposit = req.body
              const json =data.currency;
              
           console.log(data)
              database.deposit(req.body, data.id)
           
              
            
    res.json(data.currency)
  }
  ).catch(err => {
   console.log(err)
 });

})
router.get('/users/getTransations',outhoricateToken, async (req,res)=>{
 
  await  database.getAllUsers2(req.user).then(async(data)=>
  {           const deposit = req.body
              const json =data.currency;
              
           console.log(data)
              database.getTransations(data.id).then((data)=>{
                res.json(data)
              })
           
              
            
 
  }
  ).catch(err => {
   console.log(err)
 });

})
router.get('/users/get' ,async (req,res)=>{
 
  return res.send("cipeczka")

})
function  outhoricateToken(req,res,next){
  
  const outhHeader =  req.headers['authorization']
  
  const token= outhHeader && outhHeader.split(" ")[1]  
  console.log(token)

  if(token==null) return res.sendStatus(401)
 
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
       if(err) { return res.sendStatus(403)}
      
         req.user=user.name;

        next()
  })

}

function generateRefreshToken(user){

return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})

}



module.exports = router
