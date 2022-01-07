class Utils {
  nTimes(n, cb) {
    for (let i = 0; i < n; i++) {
      cb(i);
    }
  }

  rangeTimes(from, to, cb) {
    for (let i = from; i <= to; i++) {
      cb(i);
    }
  }
}

module.exports = new Utils();
