const sql = require("./db.js");

class Procedure {
  async getSum() {
    let result = await sql.awaitQuery("CALL getSum()");
    console.log(result);

    return result;
  }

  async params(param1, param2) {
    let result = await sql.awaitQuery("CALL getCustomSum(?,?)", [param1, param2]);
    console.log(result);

    return result;
  }
}

module.exports = Procedure;
