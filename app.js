//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import path from "path";
import ejs from "ejs";
import mongoose from "mongoose";
const __dirname=path.resolve();
const homeStartingContent = "Welcome to the Daily Journal ! You have landed to the right place This is a platform where you can read and write ";
const c1="interesting and attractive blogs and also read what other folks have to say about !So what are you";
const c2="waiting for ? Click on the 'COMPOSE BLOG' option and start writing your blog!";
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
const postSchema = {
  pname:String,
  title: String,
  content: String
};
const Post = mongoose.model("Post", postSchema);
app.get("/home", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      startingContent1: c1,
      startingContent2: c2,
      posts: posts
      });
  });
});
app.get("/compose", function(req, res){
  res.render("compose");
});
app.get("/",function(req,res){
  res.sendFile('/public/css/cover.html',{root:__dirname});
});
app.post("/compose", function(req, res){
    const post = new Post({
    pname:req.body.postName,
    title: req.body.postTitle,
    content: req.body.postBody 
  });
  post.save(function(err){
    if (!err){
        res.redirect("/home");
    }
  });
});
app.get("/posts/:postId", function(req, res){
const requestedPostId = req.params.postId;
Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      pname:post.pname,
      title: post.title,
      content: post.content
    });
  });
});
app.get("/about", function(req, res){
  res.render("about");
});
app.get("/live",async (req,res)=>{
    const endpoint="https://newsapi.org/v2/top-headlines?country=in&apiKey=b24dd7e7467249949d4de38698deefc4";
    fetch(endpoint,{
      method:'GET'
    })
    .then(res=>res.json())
    .then(data=> {
      const items=data.articles;
      res.render("livenews",{
        items
      });
    })
    .catch(err=>console.log(err))
});
app.delete("/posts/:id",function(req,res){
    const id=req.params.id;
    Post.deleteOne({_id:id})
    .then(response=>{
      response.json({redirect:'/home'});
    })
    .catch(err=>{
      console.log(err);
    })
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
