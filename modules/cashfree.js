var axios = require("axios");

// Genrate Cashfree token function
function generateToken(order_id, order_amount) {
  // var data = '{\n  "orderId": order_id,\n  "orderAmount": order_amount\n}';
  if (process.env.Mode == "Test") {
    var app_secret = process.env.CF_CLIENT_SECRET;
    var client_id = process.env.CF_CLIENT_ID;
    var token_url = process.env.CF_TOKEN_URL;
  } else {
    var app_secret = process.env.Live_CF_CLIENT_SECRET;
    var client_id = process.env.Live_CF_CLIENT_ID;
    var token_url = process.env.Live_CF_TOKEN_URL;
  }

  var data =
    '{\n "orderId": "' +
    order_id +
    '",\n  "orderAmount": "' +
    order_amount +
    '"\n}';

  var config = {
    method: "post",
    url: token_url,
    headers: {
      "X-Client-Id": client_id,
      "X-Client-Secret": app_secret,
      "Content-Type": "text/plain",
    },
    data: data,
  };

  return axios(config);
}

// export
module.exports = { generateToken };
