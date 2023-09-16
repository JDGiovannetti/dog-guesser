import express from "express";
import axios from "axios";

let app = express();
const port = 3000;
app.use(express.static("public"));

//Step 1: select four random breeds
//Step 2: select one of the four to be the answer, use that answer to display a random image for that breed
//Step 3: make the buttons equal those four random breeds, one will be the right answer
//Step 4: if user clicks the correct answer, display correct, if not, display wrong
//Step 5: repeat!

app.get("/", async (req,res) => {
    try {
        const response = await axios.get('https://dog.ceo/api/breeds/list/all');
      } catch (error) {
        console.error(error);
      }

      let breeds = response.data.message;
      let keys = Object.keys(breeds);
    res.render("index.ejs");
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});