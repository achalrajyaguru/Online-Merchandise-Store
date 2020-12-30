var braintree = require("braintree");

var gateway = new braintree.BraintreeGateway({
  environment:  braintree.Environment.Sandbox,
  merchantId:   '9s8qtcsnnzjgjc6z',
  publicKey:    'q4ff4rmnxb3hrntt',
  privateKey:   '8c8bce746a405b3871438ef56e6be2e0'
});
exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function(err, response) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;

  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,

      options: {
        submitForSettlement: true
      }
    },
    function(err, result) {
      if (err) {
        res.status(500).json(error);
      } else {
        res.json(result);
      }
    }
  );
};
