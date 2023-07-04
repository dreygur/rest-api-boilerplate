
Date.prototype.addDays = function (days) {
  let date = new Date(this.toDateString());
  date.setDate(this.getDate() + days);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};