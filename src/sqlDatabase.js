
const bcrypt = require("bcrypt");

const { Client } = require('pg');

const create  = `
CREATE TABLE users (
    id integer,
    name varchar,
    password varchar,
    wallet integer,
    email varchar,
    phoneNumber integer,
    accountNumber text,
    pin integer,
    currencyCode text,
    currency jsonb,
    currencyaccount text
);
`



const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'xylo',
    port: 5432,
  })
async function connect(){
   
  
    client.connect();
    

}

async function addNewUser(user){
   return new Promise(async (resolve,reject )=>{
var users=[]
var oneuser;
console.log(user)
const currencyJson = JSON.stringify(user.currency)


const quary = " INSERT INTO users (name, password, wallet,email,phoneNumber,accountNumber,pin,currencyCode,currency,currencyaccount) VALUES ('"+user.name+"','"+user.password+"','"+user.wallet+"','"+user.email+"','"+user.phoneNumber+"','"+user.accountNumber+"','"+user.pin+"','"+user.currencyCode+"','"+currencyJson+"','{"+user.currencyaccount+"}');"
console.log(quary)
user.currency=currencyJson

client.query(quary, (err, res) => {
   if (err) {
       console.error(err);
       return;
   }else{
    resolve("User has been added")
   }
   
   
});
   })
  
}
async function getUserById(id){
   
  
    if(!client.connect()) {connect()};
    return new Promise(async (resolve,reject)=>{
        const quary = " select * from users where id="+id
       await client.query(quary, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Table is successfully created');
            client.end();
            resolve(res.rows)
           
            
    
        });
    
      })
}

async function deleteUser(user){
   
  
    return new  Promise(async (resolve,reject)=>{
        const quary = " delete from users where name='"+user.name+"'"
       await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;
            }else{

                resolve("User has been deleted")
            }
          
          
            
            
            
           
          
           
        });
        await client.query("delete from transitions where user_id="+user.id)
    
      }) 
}
async function getAllUsers(name,password){
   

  
 
  
 
    
   return new  Promise(async (resolve,reject)=>{
    const quary = " SELECT * FROM users"
   await client.query(quary, async (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
       

        users=JSON.parse(JSON.stringify(res.rows))
       
        for(i=0;i<users.length;i++){
           
            if(users[i].name==name){
          
               if(await bcrypt.compare(password, users[i].password)){
                
                  
                 resolve(users[i])
                   
               }else{
                   reject("Premission denied")
                  
               }
          
            }
        }
        reject("User has not been found")
        
       
      
       
    });

  }) 
}


async function getAllUsers2(name){
   

  
 
  
 
    
    return new  Promise(async (resolve,reject)=>{
     const quary = " select * from users"
    await client.query(quary, async (err, res) => {
         if (err) {
             console.error(err);
             return;
         }
        
 
         users=JSON.parse(JSON.stringify(res.rows))
        
         for(i=0;i<users.length;i++){
            
             if(users[i].name==name){
           
               
                 
                   
                  resolve(users[i])
                    
              
           
             }
         }
         reject("User has not been found")
         
        
       
        
     });
 
   }) 
 }


async function addTransaction(transaction, id){
    console.log(transaction)

    return new  Promise(async (resolve,reject)=>{
        const quary = " INSERT INTO transitions  VALUES ('"+id+"','"+transaction.type+"','"+transaction.from+"','"+transaction.to+"','"+transaction.buy+"','"+transaction.sell+"','"+transaction.course+"');"
        const quary2 = "select * from transitions where user_id='"+id+"'"
       await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
           });

           await client.query(quary2, async (err, res) => {
            if (err) {
                console.error(err);
                return;

            }
            resolve(res.rows)
           });
    
      }) 


}
async function deposit(deposit,id){
  
    const cycki = JSON.stringify(deposit);
   
    return new  Promise(async (resolve,reject)=>{
        const quary = " update users  set currency=  '"+cycki+'\' where id ='+id
       
      
       await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;

            }
           });

          
    
      }) 


}
async function updateCurrenty(user,transition){
   
 
   const  wallet=user.currency
   console.log(wallet)
   if(transition.type=="Sell"){
    for(let i = 0; i < wallet.length; i++) {
        let obj = wallet[i];
            if(obj["currencyCode"]==transition.from)
            {
               console.log( wallet[i]["amount"])
               console.log( transition.sell)
                    wallet[i]["amount"]-=transition.sell;
                    console.log( wallet[i]["amount"])
                    await deposit(wallet,user.id)
            }
        console.log(wallet)
          }
   }
   console.log(wallet)
   
      
    
   
   


}
async function getTransations(id){
   
 console.log(id)
    return new  Promise(async (resolve,reject)=>{
        const quary = " select * from transitions where user_id ="+id;
       
      
       await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;
                          
            }
            resolve(res.rows)
           });

          
    
      }) 
    
       
     
    
    
 
 
 }
module.exports = { 
    connect,
    addNewUser,
    getAllUsers,
    getUserById,
    deleteUser ,
    
    getAllUsers2,
    addTransaction,
    deposit,updateCurrenty,
    getTransations
   } 

