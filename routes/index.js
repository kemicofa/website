var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/email', function(req, res, next){

  const pass     = process.env.PASSWORD;
  const user     = process.env.USER;
  const host     = process.env.HOST;

  var transporter = nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: {
        user,
        pass 
    }
  });

  const {emailfrom, firstname, lastname, message} = req.body;

  var mailOptions = {
    from: 'notif@kemicofa.io',
    to: email,
    subject: `Message from ${firstname} ${lastname} (${emailfrom})`,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.status(200).json({message: "Message sent..."});
  //TODO: Send message to recipient

})

module.exports = router;
