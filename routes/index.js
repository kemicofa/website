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
  const target   = process.env.EMAIL;
  var transporter = nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: {
        user,
        pass 
    }
  });

  const {email, firstname, lastname, message} = req.body;

  const mailOptions = {
    from: 'kevin@kemicofa.io',
    to: target,
    subject: `Message from ${firstname} ${lastname} (${email})`,
    text: message
  };

  const copyMailOptions = {
    from: 'kevin@kemicofa.io',
    to: email,
    subject: `Email copy from kemicofa.io`,
    html: `
      <p>Hey !</p>
      <p>
          This an automatic email letting you know that your message
          was successfully delivered.
      </p>
      <p>I'll respond to your email as soon as possible.</p>
      <br/>
      <p>Cheers,</p>
      <p>Kevin</p>
      <a href="http://kemicofa.io">kemicofa.io</a>
    `
  }

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(400).json({message: "Unable to send message."})
    } else {
      console.log('Email sent: ' + info.response);

      transporter.sendMail(copyMailOptions, function(error, info){

        if(error){
          //nothing else to do... not a big deal if this fails...
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }

        res.status(200).json({message: "Message sent..."});

      })
    }
  });
})

module.exports = router;
