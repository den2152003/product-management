const express = require("express");
var path = require('path');
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require('moment');
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const route = require("./routes/client/index.route.js")
const routeAdmin = require("./routes/admin/index.route.js");

const database = require("./config/database.js");

const app = express();
const server = http.createServer(app); // Tạo server từ app
const io = new Server(server);

global._io = io;

const port = process.env.PORT;

database.connect();

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser('DEN215'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.locals.moment = moment;

app.set('views', `${__dirname}/views`); // specify the views directory
app.set('view engine', 'pug'); // register the template engine

app.use(express.static(`${__dirname}/public`));

routeAdmin(app);
route(app);

app.use((req, res, next) => {
  res.status(404).render("client/pages/errors/404", {
    pageTitle: "404 Not Found"
  });
});

server.listen(port, () => {
    console.log("sucess sadsadsadsadsad");
})
//