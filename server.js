const express = require('express')
var path = require('path');
const authPay = require('./authorizePayment');
const app = express()
const port = 3000

app.use(express.urlencoded({
    extended: true
  }))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/pay', (req, res) => {
    console.log(req.body);
    authPay.createAnAcceptPaymentTransaction(req.body.dataValue, function(response)  {
        console.log(response);
        res.json(response);
    });
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})