require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/artist-search-results", (req, res) => {
//     res.render("artist-search-results");
// })

app.get("/artist-search", (req, res) => {
  const { artistname } = req.query;
  const lowercaseArtistName = artistname.toLowerCase();

  spotifyApi.searchArtists(lowercaseArtistName).then(
    function (data) {
      const { artists } = data.body;
      res.render("artist-search-results", { artistDetails: artists.items });
    },
    function (err) {
      console.error(err);
    }
  );
});
app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi.getArtistAlbums(artistId).then(
    function (data) {
      res.render("albums", { albumdetails: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});
app.get("/tracks/:trackId", (req, res) => {
  const { trackId } = req.params;
  spotifyApi.getAlbumTracks(trackId, { limit: 5, offset: 1 }).then(
    function (data) {
    console.log(data.body.items[0]);
      res.render("tracks", { trackdetails: data.body.items });
    },

    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
