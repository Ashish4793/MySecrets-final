require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI,function(err){
    if(err){
        console.log(err);
    } else {
        console.log("CONNECTION ESTABLISHED SUCCESFULLY");
    }
})

const secretSchema = {
    secret : String
};

const Secret = mongoose.model("Secret" , secretSchema);


app.get("/", function(req,res){
    res.render("home");
});

app.get("/submit", function(req,res){
    res.render("submit");
});

app.get("/secrets", function(req,res){


    Secret.find(function(err,foundSecrets){
        
        if(err) {
            console.log(err);
        } else {
            if(foundSecrets){
                res.render("secrets" , {secretsFound : foundSecrets})
            }
        }
    })
});


app.post("/submit" , function(req,res){
    const submittedSecret = req.body.inputSecret;

    const newSecret = new Secret ({
        secret : submittedSecret
    })
    newSecret.save(function(err){
        if (!err){
            res.redirect("/secrets");
        } else {
            console.log(err);
        }
    });
})


app.listen(3000,function(){
    console.log("<<<<<<------------Server started ------------->>>>>>>");
});