require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");

let indexRouter;
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
.then(() => {
    console.log("Connected to mongodb.");
    indexRouter = require("./server/routes/index.js");
    app.use("/",indexRouter);
})
.catch(err => {
    console.log(err);
    process.exit(1);
})

app.set("view engine","ejs");
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static("./public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`Server started running on port : ${PORT}.`);
});
