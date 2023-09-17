import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import fetch from 'node-fetch';

let app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

//Step 1: select four random breeds done
//Step 2: select one of the four to be the answer, use that answer to display a random image for that breed
//Step 3: make the buttons equal those four random breeds, one will be the right answer
//Step 4: if user clicks the correct answer, display correct, if not, display wrong
//Step 5: repeat!
function capFL(word) { // capitalizes the first letter of a word
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getRandom(len) {
  return Math.floor(Math.random() * len);
}
function getFourRandomDogs(keylist, allbreeds) { 
  let res = [];
  let dogs = [];
  let i = 0;
  while(i < 4) { // get four random dog keys
    let randomInd = getRandom(keylist.length);
    if(dogs.includes(keylist[randomInd])) { // no repeats
      continue;
    }
    else {
      dogs.push(keylist[randomInd]);
      i++;
    }
  }

  dogs.forEach((dog) => { 
    if(allbreeds[dog].length != 0) { // handle breeds w/ multiple types (australian shepherd vs. german shepherd, etc.)
        // if there are sub-breeds, choose a random one
      // appends subbreed to breed name (ex: appends "German" to "Shepherd")
      let randomSub = allbreeds[dog][getRandom(allbreeds[dog].length)];
      res.push([`${dog}/${randomSub}`, capFL(randomSub) + " " + capFL(dog)]);
    }
    else {
      res.push([`${dog}`, capFL(dog)]);
    }
  }) 
  return res; // returns in form of [path, display name]
}

app.get("/", async (req,res) => {
    try {
        const response = await axios.get('https://dog.ceo/api/breeds/list/all');
        let breeds = response.data.message; // list of all breeds on api
        let keys = Object.keys(breeds); // list of all keys from breeds api

        let dogs = getFourRandomDogs(keys, breeds); // choose four for options
        let ans = dogs[getRandom(dogs.length)]; // one dog chosen as answer
        let dogimg = await axios.get(`https://dog.ceo/api/breed/${ans[0]}/images/random`);

        res.render("index.ejs", {dogs: dogs, answer: ans, dogimg: dogimg.data.message});
      } catch (error) {
        console.error(error);
      }
    
});

app.post("/answer", (req,res) => {
  console.log(req.body);
  res.render("index.ejs");
})
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});