const express= require('express');

const User = require('./models/users');
const app = express();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get('/',(req,res)=>{
    res.render("index")
})
app.post('/create_user', (req,res)=>{
    const{name,email,password} = req.body;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            const userdata = await User.create({
                name,
                email,
                password:hash,
        
            })   
            let token = jwt.sign({email},'lsslskslskslskslskslsk');
            res.cookie('token',token,{httpOnly:true});
            res.send("got it ")
             });
    });
  
    
    
})

app.get('/login',(req,res)=>{   
    res.render("login")
});
app.post('/login_user',async (req,res)=>{
    const{email,password} = req.body;

    let find_user = await User.findOne({email:req.body.email})
    if(!find_user) return res.send("Something went wrong");

    bcrypt.compare(req.body.password, find_user.password).then(function(result) {
       if(result){
        let token = jwt.sign({email},'lsslskslskslskslskslsk');
        res.cookie('token',token,{httpOnly:true});
        res.send("You are logged in !!")

       }
       else{
        res.send("Soemthing went wrong !!")
       }
    });
})

app.listen(3000,()=>{
    console.log("Server is running on 3000 ")
})