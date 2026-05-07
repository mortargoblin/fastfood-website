const db = require('../connection.js');

beforeEach(() => {
  if (db.__reset) {
    db.__reset();
  }
});
