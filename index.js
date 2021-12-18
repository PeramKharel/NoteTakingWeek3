const express = require("express")
const basicAuth = require("express-basic-auth")
const {engine} = require("express-handlebars")
const app = express();
 const AuthChallenger = require("./AuthChallenger");
 const port = 3000;
const fs = require("fs");
const path = require("path");
const NoteService = require('./Services/NoteService')
const NoteRouter = require('./Routers/NoteRouter')

const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

app.engine('handlebars', engine({defaultLayout: "main"}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


app.use(
    basicAuth({
      authorizeAsync: true,
      authorizer: AuthChallenger(knex),
      challenge: true,
    })
)

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const noteService = new NoteService(knex);

app.get("/", (req, res) => {
  res.render("index", {
    user: req.auth.user,
  })
});

app.use("/api/notes", new NoteRouter(noteService).router());

app.listen(port, () => {
  console.log("Listening on 3000");
});
