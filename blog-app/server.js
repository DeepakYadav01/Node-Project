const express = require("express");
const app = express();
app.use("/static", express.static(__dirname + "/static"));
app.set("view engine","ejs");
const port = process.env.port || 3000;


const formidable = require("formidable");
const fs = require("fs");

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

const ObjectId = require("mongodb").ObjectId;
const MongoClient = require("mongodb").MongoClient;
const e = require("express");
const url = 'mongodb://localhost:27017'
const database = "blog";


var allPosts = [];
MongoClient.connect(url,{useNewUrlParser: true},(err,client)=>{

    if(err){
        console.log(err);
    }else{
        const blog = client.db(database);
        console.log("Database Connected...");

        app.get("/",(req,res)=>{
            blog.collection("posts").find().sort({"_id":-1}).toArray((err,posts)=>{
                if(err){
                    console.log(err);
                } else{
                    allPosts = posts
                    res.render("home",{posts:posts});
                }
            });
           
        });



        app.get("/add-post",(req,res)=>{
            res.render("add-post");
        });


        app.post("/do-post",(req,res)=>{
           blog.collection("posts").insertOne(req.body,(err,document)=>{
                if(err){
                    console.log(err);
                } else{
                    res.send("posted successfully");
                }
            });
            
        });


        app.get("/posts/:id",(req,res)=>{

            blog.collection("posts").findOne({"_id":ObjectId(req.params.id)},(err,post)=>{
                res.render("post",{post:post, allPosts: allPosts});
            });
        });


        app.post("/do-delete",(req,res)=>{
            if(req.body.image == ""){
                blog.collection("posts").deleteOne({"_id":ObjectId(req.body.id)},(err)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.send("deleted successfully");
                    }
                });
            } 
            else{
                fs.unlink(req.body.image.replace("/",""),(err)=>{ 
                    if(err){
                        console.log(err);
                    }else{
                        blog.collection("posts").deleteOne({"_id":ObjectId(req.body.id)},(err)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                res.send("deleted successfully");
                            }
                        });
                    }
                })
            }
            
        });


        app.get("/posts/edit/:id",(req,res)=>{
            blog.collection("posts").findOne({"_id":ObjectId(req.params.id)},(err,post)=>{
                res.render("edit-post",{post:post});
            });
        })

        
        app.post("/do-update-post",(req,res)=>{
            blog.collection("posts").updateOne({"_id":ObjectId(req.body.id)},{
                $set:{
                    "author":req.body.author,
                    "title":req.body.title,
                    "category":req.body.category,
                    "content":req.body.content,
                    "image":req.body.image,
                    "date":req.body.date,
                },
                
            },(err,post)=>{
                if(err){
                    console.log(err);
                }else{
                    res.send("updated successfully");
                }
            });
            console.log(req.body.id)
        })


        app.get("/categories/:category",(req,res)=>{
            blog.collection("posts").find({"category": req.params.category}).toArray((err,posts)=>{
                if(err){
                    console.log(err);
                } else{
                    res.render("categories", {posts:posts,allPosts:allPosts});
                }
                
            });
        });


        app.post("/do-upload-image",(req,res)=>{
            const formData = new formidable.IncomingForm();
            formData.parse(req,(err,fields,files)=>{
                if(err){
                    console.log(err);
                }
                else{
                    const oldPath = files.file.path;
                    const newPath = "static/images/" + files.file.name;
                    fs.rename(oldPath,newPath,(err)=>{
                        if(err){
                            console.log(err)
                        }
                        else{
                            res.send("/"+newPath);
                        }
                    });
                }
            });
        });



        app.post("/do-update-image",(req,res)=>{
            const formData = new formidable.IncomingForm();
            
            formData.parse(req,(err,fields,files)=>{

                if(fields.image == ""){
                    const oldPath = files.file.path;
                        const newPath = "static/images/" + files.file.name;
                        fs.rename(oldPath,newPath,(err)=>{
                            if(err){
                                console.log(err)
                            }
                            else{
                                res.send("/"+newPath);
                            }
                        });
                }
                else{

                    fs.unlink(fields.image.replace("/",""),(err)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            const oldPath = files.file.path;
                            const newPath = "static/images/" + files.file.name;
                            fs.rename(oldPath,newPath,(err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    res.send("/"+newPath);
                                }
                            });
                        }
                    })
                }
               
            });
        });


        
        app.get("*",(req,res)=>{
           res.render("error404");
        });

        
        app.listen(port,()=>{
            console.log("Server Started...");
        })
    }
});



