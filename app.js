var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
// it remove all script tag from content 


//setup mongoose
mongoose.connect("mongodb://localhost/blog_app", {useNewUrlParser: true, useUnifiedTopology: true});

//app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//mongoose config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now} //this is storing date when user created post
});

var Blog = mongoose.model("Blog", blogSchema);


// routes


app.get("/",(req, res)=>{
    res.redirect("/blogs");
})

//index route
app.get("/blogs", (req, res)=>{
    Blog.find({}, function(err, blogs){
        if(err)
        {
            console.log(err);
        }else{
            // console.log(blogs);
            res.render("index", {blogs:blogs});
        }
    })
})

//new route
app.get("/blogs/new", (req,res)=>{
    res.render("new");
});

// create route
app.post("/blogs", (req,res)=>{
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
})

// show route

app.get("/blogs/:id",(req,res)=>{
      Blog.findById(req.params.id, (err, foundBlog)=>{
          if(err){
              res.redirect("/blogs");
          }else{
              res.render("show", {blog: foundBlog});
          }
      })
});

// edit route
app.get("/blogs/:id/edit", (req,res)=>{
       Blog.findById(req.params.id, (err, foundBlog)=>{
            if(err)
            {
                res.redirect("/blogs");
            }else{
                res.render("edit", {blog: foundBlog});
            }
       });
});

// update route
app.put("/blogs/:id", (req,res)=>{
    //findByIdAndUpdate(id, newdata, callback function())
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateBlog)=>{
            if(err)
            {
                res.redirect("/blogs");
            }else{
                res.redirect(`/blogs/{req.params.id}`);
            }
     });
});

//destroy route

app.delete("/blogs/:id", (req,res)=>{
     Blog.findByIdAndRemove(req.params.id, (err)=>{
         if(err){
             res.redirect("error in deleting");
         }else{
              res.redirect("/blogs");
         }
     })
});


//starting server
app.listen(3000, ()=>{
    console.log("server is running!!");
});