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

  async login(param1, param2) {
    let result = await sql.awaitQuery("CALL checkUser(?,?)", [param1, param2]);
    console.log(result);
    return result;
  }

  async findExistingUser(param1) {
    let result = await sql.awaitQuery("CALL findExistingUser(?)", [param1]);
    if (result[0].length == 0) {
      return false;
    } else {
      return true;
    }

  }

  async register(firstname, lastname, email, password) {
    let result = await sql.awaitQuery("CALL createUser(?,?,?,?)", [firstname, lastname, email, password]);
    return result;
  }

}


module.exports = Procedure;