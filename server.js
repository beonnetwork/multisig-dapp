var compression = require('compression');
var express = require('express');
// var bodyParser = require('body-parser');
// const cors = require('cors');
const staticFile = require('connect-static-file');

sendgridKey = process.env.SENDGRID_API_KEY

var app = express();
var fallback = require('express-history-api-fallback');

var root = 'dist';

// app.use(cors());
app.use(compression({
  filter: function(req, res){
    return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
  },
  level: 9
}));
app.use('/silent', staticFile(`${__dirname}/src/silent.html`));

// app.use(bodyParser.urlencoded({extended:true}));
app.use(compression());
app.use(express.static(root));
app.use(fallback('index.html', {root:root}));
app.listen(process.env.PORT || 3000);
