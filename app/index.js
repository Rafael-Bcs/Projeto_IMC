const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3004;
const API_URL = process.env.API_URL || 'http://localhost:3000';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'aula-ti-323-vesp',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
}));

app.get('/', (req, res) => {
    res.render('imc', { apiUrl: API_URL });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});