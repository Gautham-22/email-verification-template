const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/model");

router.get("/",(req,res) => {
    res.render("index",{message : ""});
})

router.get("/app/:secret",(req,res) => {
    User.findOneAndUpdate({secret : req.params.secret},{$set : {isVerified : true} },(err,user) => {
        if(err) {
            return res.status(500).send({message : "Error during authorization."});
        }
        if(!user) {
            return res.redirect("/authFailure");
        }
        res.render("app");
    });
});

router.post("/signup",(req,res) => {
    const hash = genHash(req.body.password);
    const secret = genSecret();
    const newUser = new User({
        email : req.body.email,
        password : hash,
        secret : secret,
        isVerified : false
    });
    newUser.save()
    .then((user) => {
        console.log(`New user : ${user}.`);
        sendVerificationMail(user);
        res.render("index",{message : "Verification link sent to your email"});
    })
    .catch(err => {
        res.status(500).send({error : "Error while creating an user."});
    })
});

router.get("/authFailure",(req,res) => {
    res.render("index",{message : "Login into your account"});
});

function genSecret() {
    let randomString = crypto.randomBytes(64).toString("hex");
    return randomString;
} 

function genHash(password) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password,salt);
    return hash;
}

function sendVerificationMail(user) {
    try {
        const Transport = nodemailer.createTransport({
            service : "Gmail",
            auth : {
                user : process.env.email,
                pass : process.env.password 
            }
        });
        const mailOptions = {
            from : "John",
            to : user.email,
            subject : "Email verification for app",
            html : `<p>Hey, thanks for signing into our app.</p> <a href='http://localhost:3000/app/${user.secret}'>Click here</a> to verify your account.`
        };
        Transport.sendMail(mailOptions,(err,res) => {
            if(err) {
                console.log(err);
            }else {
                console.log("Successfully sent email!");
            }
        })
    } catch(err) {
        console.log(err);
    }
}

module.exports = router;