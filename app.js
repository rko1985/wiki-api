const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = new mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(async function(req, res){
        try {
            const foundArticles = await Article.find();
            res.send(foundArticles);
        } catch (err) {
            res.send(err);
        }
    })
    .post(async function(req, res){
        try {
            const newArticle = await new Article({
                title: req.body.title,
                content: req.body.content
            });

            newArticle.save();
            res.send("Successfully added a new")

        } catch (err) {
            res.send(err);
        }
    })
    .delete(async function(req, res){
        try{
            await Article.deleteMany();
            res.send("All articles deleted successfully!");
        } catch (err){
            res.send(err);
        }
});

app.route('/article/:articleTitle')
    .get(async function(req, res){
        try {
            const articleTitle = req.params.articleTitle
            const foundArticle = await Article.findOne({title: articleTitle});
            if(foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title were found.");
            }
        } catch (err) {
            res.send(err);
        }
    })
    .put(async function(req, res){
        console.log(req.body.title);
        console.log(req.body.content);
        try {
            await Article.replaceOne(
                {title: req.params.articleTitle},
                {title: req.body.title, content: req.body.content},
                {overwrite:true},
            );
            res.send("Successfully updated article.")            
        } catch (err) {
            res.send(err);
        }
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
  