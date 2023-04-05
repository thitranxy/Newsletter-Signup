const express = require("express");
const bodyParser=require("body-parser");
const request=require("request");
// const path=require("path");
const https=require("https");
const { url } = require("inspector");

const app=express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
 
app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/views/signup.html")
});
 
app.post("/", (req,res)=>{
     const firstName=req.body.firstName;
     const lastName=req.body.lastName;
     const email=req.body.email;

     const data={
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME:firstName,
                    LNAME:lastName,
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    const url="https://us14.api.mailchimp.com/3.0/lists/f1be286b1f"
    const options={
        method: "POST",
        auth:"milky:db68087af6fa527042e3ad6b50fe7c20-us14"
    };

    const request=https.request(url, options, (response)=>{
        
        if (response.statusCode==200){
            res.sendFile(__dirname+"/views/success.html")
        }
        else{
            res.sendFile(__dirname+"/views/failure.html")
        }

        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
    // 
    // f1be286b1f


});

app.post("/failure", (req,res)=>{
    res.redirect("/");
});




app.listen(process.env.PORT||3000, ()=>{
    console.log("My server is up and running at port 3000");
});