// current timestamp in milliseconds
let ts = Date.now();

let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();
if (hours.toString().length === 1) {
  hours = "0" + hours;
}

// current minutes
let minutes = date_ob.getMinutes();
if (minutes.toString().length === 1) {
  minutes = "0" + minutes;
}

// current seconds
let seconds = date_ob.getSeconds();
if (seconds.toString().length === 1) {
  seconds = "0" + seconds;
}

exports.date = function () {
  const datefinal = year + "/" + month + "/" + date;
  return datefinal;
};

exports.time = function () {
  const timefinal = hours + ":" + minutes + ":" + seconds;
  return timefinal;
};
