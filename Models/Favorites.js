const mongoose = require("mongoose");

const Favorites = mongoose.model("Favorite", {
  itemId: mongoose.Schema.Types.ObjectId,
  name: String,
  thumbnail: {
    path: String,
    extension: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Favorites;
