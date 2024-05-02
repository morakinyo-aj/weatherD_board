const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const fs = require('fs')


const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))
// connection of database

mongoose.connect('mongodb://localhost:27017/weather_dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Definition of Schema
const UserSchema = mongoose.Schema({
  username:String,
  password:String
})
const User = mongoose.model("User",UserSchema)





app.get("/", (req, res) => {
  const homepath = `${__dirname}/public/login.html`
  // res.header('Content-Type', 'application/javascript');
  fs.readFile(homepath, "utf-8", (err, data) => {
    if(err){
      console.log(err)
      res.status(500).send("Internal Server Error")
    }else{
      res.send(data);
    }
  })
})



app.get("/actual", (req, res) => {
  const homepath = `${__dirname}/public/main.html`
  // res.header('Content-Type', 'application/javascript');
  fs.readFile(homepath, "utf-8", (err, data) => {
    if(err){
      console.log(err)
      res.status(500).send("Internal Server Error")
    }else{
      res.send(data);
    }
  })
})

app.post('/login', async(req,res) => {
  const{ username, password }=req.body;

try{
  const newUser = new User({
    username,
    password
  });
  await newUser.save()
  res.redirect("/actual")
}catch (error) {
  console.log(error)
  res.status(500).json({ error: 'Error saving User data' });
}
  
  
})





app.post('/addWeatherData', async (req, res) => {
  const { temperature, location } = req.body;

  const newWeatherData = new WeatherModel({
    temperature,
    location,
    date: new Date()
  });

  try {
    const savedData = await newWeatherData.save();
    res.json(savedData);
  } catch (error) {
    res.status(500).json({ error: 'Error saving weather data' });
  }
});

app.post('*', async(req,res) =>{
  res.send("This page does not exist")
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
