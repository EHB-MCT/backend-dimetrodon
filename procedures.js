const sql = require("./db.js");

class Procedure {
  async getSum() {
    let result = await sql.awaitQuery("CALL getSum()");
    console.log(result);

    return result;
  }
}

module.exports = Procedure;
