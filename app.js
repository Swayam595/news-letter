const express = require('express')
const body_parser = require('body-parser')
//const request = require("request")
const https = require("https")
const port = process.env.PORT || 3000

const app = express()
app.use(body_parser.urlencoded({extended : true}))
app.use(express.static("static"))

app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/signup.html`);
})

app.post('/', function (req, res) {
  const first_name = req.body.fName
  const last_name = req.body.lName
  const email = req.body.email

  const data = {
    members: [
      {
        email_address : email,
        status : 'subscribed',
        merge_fields : {
          FNAME : first_name,
          LNAME : last_name
        }
      }
    ],
  }
  const json_data = JSON.stringify(data)

  const url = "https://us6.api.mailchimp.com/3.0/lists/44b1054501"
  const options = {
    method : "POST",
    auth : "swayamsw:26441f556e0c329a7402dd18a860a6a5-us6"
  }

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(json_data)
  request.end()

})

app.post('/failure', function(req, res) {
  res.redirect("/");
})

app.listen(port, function () {
  console.log(`App is listensing at http://localhost:${port}`);
})
