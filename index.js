const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
var cors = require('cors');

const { generateAuthUrl, getAccessToken } = require("tw-3-legged");
//const path = require("path");
dotenv.config();

const saltRounds = 10;

const app = express();
app.use(cors());

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  next(); 
});

app.set("view engine", "ejs");

const Client_ID = 'Qmk4NUVLbDV5LWtQM2JlcDhFUDY6MTpjaQ';
const Client_Secret = 'nQ3jc0MAVSo6luHyDm1v1PWzLmy7NjTt7hePfdgAFGd6jLnH_w';

const API_Key='6ioRlvj1uZxNwnmrPKnhvBi2Z';
const API_Key_Secret='sdh0v0qyvqdS38RI0JtfT7D6fUxSJzjVyssm2dfoW7GBA5spxE';


const request_token_url = 'https://api.twitter.com/oauth/request_token';
const access_token_url = 'https://api.twitter.com/oauth/access_token';
const authorize_url = 'https://api.twitter.com/oauth/authorize';
const show_user_url = 'https://api.twitter.com/1.1/users/show.json';








app.use(
  express.urlencoded({
    extended: true,
  })
);



app.get("/", function (req, res) {
  res.render("index");
});


app.get("/start",async function (req, res) {
  try{

    const callbackUrl='https://8e68-2405-201-5c1c-8046-10bc-79db-cac2-442.in.ngrok.io/callback'
    console.log("-----------------------------------dddddddddddddddddddddddddddddddddddddd")
    const authUrl = await generateAuthUrl(API_Key, API_Key_Secret, callbackUrl);
    console.log("-----------------------------------lllllllllllllllllllllllll",authUrl)
    return res.send({authUrl});

  }catch(err){
    console.log("-----------------------------------llllllllllllllllllll",err)
  }

 
});


app.get("/callback",async function (req, res) {
  try{
    
   console.log("-----------------------------------lllllllllllllllllllllllll",req.query);
  const { oauth_token, oauth_verifier}=req.query;
  const TOKEN = await getAccessToken(oauth_token, oauth_verifier);
  console.log("------------------ffffffffffffffffffffffffffffffffffff--------",TOKEN);

  let JWT;

    if(TOKEN){
      const payload = {
        sub: TOKEN.userId,
        screenName: TOKEN.screenName,
        oauthToken: TOKEN.oauthToken,
        oauthTokenSecret:TOKEN.oauthTokenSecret
    };
     JWT=jwt.sign(payload, process.env.JWT_SECRET);
    }

  console.log("=============================",JWT);
  res.render("index",{JWT});

  }catch(err){
    console.log("-----------------------------------llllllllllllllllllll",err);
  }

 
});


app.listen(5000, function () {
  console.log("Server has started at port 5000");
});



