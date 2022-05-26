const express = require("express");
const formidable = require("express-formidable");
const app = express();
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
app.use(formidable());
app.use(cors());
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const isAuthenticated = require("./Middlewares/isAuthenticated");
const userRoutes = require("./routes/user");
app.use(userRoutes);

//PERSOS-BD-FAVORIS
app.get("/characters", async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const skip = req.query.skip || 0;

    let name = "";
    if (req.query.name) {
      name = req.query.name;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}&limit=${limit}&skip=${skip}&name=${name}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/comics/:characterId", async (req, res) => {
  try {
    let characterId = "";
    if (req.params.characterId) {
      characterId = req.params.characterId;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/comics", async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const skip = req.query.skip || 0;

    let title = "";
    if (req.query.title) {
      title = req.query.title;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}&limit=${limit}&skip=${skip}&title=${title}`
    );
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/favorites",/* isAuthenticated,*/ async (req, res) => {
  const { favs } = req.fields;

  let favTab = [[], []]; // On  a un tableau contenant 2 tableaux: 1 pour les persos  et 1 pour les comics
  try {
    for (let i = 0; i < favs.length; i++) { //1ère boucle dans les persons
      if (i === 0) {
        for (let j = 0; j < fav[i].length; j++) { //Boucle imbriquée pour les bd
          const response = await axios.get(
            `https://lereacteur-marvel-api.herokuapp.com/character/${favs[i][j]}?apiKey=${process.env.MARVEL_API_KEY}`
          );

          favTab[0].push(response.data);
        }
      } else {
        for (let j = 0; j < favs[i].length; j++) {
          const response = await axios.get(
            `https://lereacteur-marvel-api.herokuapp.com/comic/${favs[i][j]}?apiKey=${process.env.MARVEL_API_KEY}`
          );

          favTab[1].push(response.data);
        }
      }
    }
    res.status(200).json(favTab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(400).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
