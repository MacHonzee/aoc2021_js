class Utils {
  nTimes(n, cb) {
    for (let i = 0; i < n; i++) {
      cb(i);
    }
  }
}

module.exports = new Utils();
