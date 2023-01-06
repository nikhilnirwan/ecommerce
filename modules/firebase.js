var axios = require("axios");

function sendNotification(token, notification) {
  // setting up data to sent
  var data = JSON.stringify({
    to: token,
    notification: notification,
  });

  //api configuration
  var config = {
    method: "post",
    url: "https://fcm.googleapis.com/fcm/send",
    headers: {
      Authorization: "key=" + process.env.FIREBASE_SERVER_KEY,
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config);
}

module.exports = { sendNotification };
