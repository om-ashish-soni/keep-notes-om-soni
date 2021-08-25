const express=require('express');
const app=express();
const cors=require('cors');
const url=require('url');
const bodyParser=require('body-parser');
const urlencodeParser=bodyParser.urlencoded({extended:false});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cors({
    origin:true,
    methods:["GET","POST"],
    Credentials:true
}));
const mongoose=require('mongoose');
const { stringify } = require('querystring');
mongoose.connect('mongodb://localhost:27017/todoapp',{useNewUrlParser:true,useUnifiedTopology:true});
const {Schema}=mongoose;

const todoappSchema=new Schema({
    id:Number,
    title:String,
    task:String
});
const usersListSchema=new Schema({
    username:String
})
app.get('/fetchData',(req,res)=>{
    let q=url.parse(req.url,true);
    console.log(`this is username : ${q.query.usrname}`);
    const usrname=q.query.usrname;
    
    const getTodos=async()=>{
        try{    
            const todoCollection=mongoose.model(usrname,todoappSchema);
            const myTodos=await todoCollection.find({},{__v:0});
            // console.log(myTodos);
            res.json(myTodos);
        }catch(err){
            console.log(err);
        }
        
    }
    getTodos();
})
app.post('/login',(req,res)=>{
    const usrname=req.body.usrname;
    console.log(req.body.usrname);
    const insertUser=async()=>{
        try{
            const userList=mongoose.model('userList',usersListSchema);
            const insertedUser=new userList({
                username:usrname
            });
            const result=await userList.insertMany([insertedUser]);
            console.log(result);
        }catch(err){
            console.log(err);
        }
    }
    insertUser();
    
})
app.post('/insertTask',(req,res)=>{
    const username=req.body.username;
    const id=req.body.id;
    const tasktitle=req.body.title;
    const taskstr=req.body.task;
    const insertTodo=async()=>{
        try{
            const todoCollection=mongoose.model(username,todoappSchema);
            const todo=new todoCollection({
                id:id,
                title:tasktitle,
                task:taskstr
            });
            const result=await todoCollection.insertMany([todo]);
            console.log(result[0]);
            res.json(result[0]);
        }catch(err){
            console.log(err);
        }
    }
    insertTodo();
});
app.post('/deleteTask',(req,res)=>{
    const _id=req.body._id;
    const usrname=req.body.usrname;
    console.log(_id);
    const deleteThisTask = async() =>{

        try{    
            const todoCollection=mongoose.model(usrname,todoappSchema);
            const result=await todoCollection.deleteOne({_id:_id});
            console.log(result);
        }catch(err){
            console.log(err);
        }
        
    }
    deleteThisTask();
})
app.listen(2498);