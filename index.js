const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

require("dotenv").config();

const route = require("./routes/client/index.route.js")
const routeAdmin = require("./routes/admin/index.route.js");

const database = require("./config/database.js");


const app = express();

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser('DEN215'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

const port = process.env.PORT;

database.connect();


app.set('views', `${__dirname}/views`); // specify the views directory
app.set('view engine', 'pug'); // register the template engine

app.use(express.static(`${__dirname}/public`));

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log("sucess sadsadsadsadsad");
})
//