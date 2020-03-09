const express = require("express");

const app = express();





app.get("/",(req,res) => {
    res.send("home page")
});



app.get("/about",(req,res) => {
    res.send("about page")
});

const checkUser = (req,res,next) => {
    console.log(req.orginalUrl);
    res.send(req.orginalUrl)
    next();
}

app.use(checkUser)

 
app.listen(9000,() => {
    console.log("Playground is now running on port 9000");
})