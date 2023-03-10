const sql = require("./db.js");

class Procedure {
  async getSum() {
    let result = await sql.awaitQuery("CALL getSum()");
    console.log(result);

    return result;
  }

  async getFilters() {
    let result = await sql.awaitQuery("CALL getGenres()");
    let result2 = await sql.awaitQuery("CALL getStyles()");
    let result3 = await sql.awaitQuery("CALL getSubjects()");

    return [{ genres: result }, { styles: result2 }, { subjects: result3 }];
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
    console.log(result);
    return result;
  }

  async addArt(par) {
    console.log(par);
    let result = await sql.awaitQuery("CALL addArt(?,?,?,?,?,?,?)", par);
    return result;
  }

  async getFile(par) {
    let result = await sql.awaitQuery("CALL getFile(?)", [par]);
    return result;
  }
  async getArtist(par) {
    let result = await sql.awaitQuery("CALL getArtist(?)", [par])
    let result2 = await sql.awaitQuery("CALL getArtistPiece(?)", [par])
    return [result[0], result2[0]];
  }

  async getArtPieceToDisplay(par) {
    console.log(par);
    if(isNaN(par)){
      return [{}]
    }else{
    let result = await sql.awaitQuery("CALL getArtPieceToDisplay(?)", [par])
    return result;

    }
    

  }

  async getNewest() {
    let result = await sql.awaitQuery("CALL getNewest()")
    return result
  }

  async getStock(par) {
    let result = await sql.awaitQuery("CALL getStock(?)", [par])
    return result
  }

  async getArtPiecePage(par) {
    let result = await sql.awaitQuery("CALL getArtPiecePage(?)", [par])
    return result
  }

  async getUserRoomsFrames(par) {
    let result = await sql.awaitQuery("CALL getUserRoomsFrames(?)", [par])
    return result
  }

  async applyThemJuicyFilter(par) {
    console.log(par);
    let test = []
    if (par.genres.length) {
      test.push('idgenre IN (' + par.genres.map(e => "'" + e.id.split('-')[0] + "'").join(',') + ')')
    }
    if (par.styles.length) {
      test.push('idstyle IN (' + par.styles.map(e => "'" + e.id.split('-')[0] + "'").join(',') + ')')
    }
    if (par.subjects.length) {
      test.push('idsubject IN (' + par.subjects.map(e => "'" + e.id.split('-')[0] + "'").join(',') + ')')
    }
    console.log(test.join(' OR '));
    let result;
    if (par.genres.length || par.subjects.length || par.styles.length) {
      result = await sql.awaitQuery(`SELECT * FROM arts,files WHERE  arts.idart = files.idart AND ` + test.join(' OR ') + ' ORDER BY RAND () LIMIT 100')
    } else {
      result = await sql.awaitQuery(`SELECT * FROM arts,files WHERE  arts.idart = files.idart ORDER BY RAND () LIMIT 100`)

    }
    return result;
  }

  async updateState(par) {
    let result = await sql.awaitQuery("CALL updateState(?)", [par])
    return result
  }

  async getLikesOfuSER(par = 1) {
    let result = await sql.awaitQuery("CALL getLikesOfuSER(?)", [par])
    return result
  }

  async getRentOfUser(par = 1) {
    let result = await sql.awaitQuery("CALL getRentOfUser(?)", [par])
    return result
  }
  async checkGuid(par) {
    let result = await sql.awaitQuery("CALL checkGuid(?)", [par])
    return result
  }

  async addFrame(par) {
    let result = sql.awaitQuery("CALL addFrame(?)", [par])
    return result;
  }

  async getUserRooms(par) {
    let result = sql.awaitQuery("CALL getUserRooms(?)", [par])
    return result;
  }

  async likeStatePiece(par) {
    let result = sql.awaitQuery("CALL likeStatePiece(?)", [par])
    return result;
  }


  async toggleLike(par) {
    let result = sql.awaitQuery("CALL toggleLike(?)", [par])
    return result;
  }

  async getAll() {
    let result = sql.awaitQuery("CALL getAll()")
    return result
  }

  async getIds(par) {
    let result = sql.awaitQuery("SELECT * FROM arts,files WHERE arts.idart = files.idart AND arts.idart IN (?)", [par])
    return result

  }

  async getFrameSettings(par) {
    let result = sql.awaitQuery("CALL getFrameSettings(?)", [par])
    return result
  }

  async updateSettings(par) {
    let result = sql.awaitQuery("CALL updateSettings(?)", [par])
    return result

  }

  async setIp(par) {
    let result = sql.awaitQuery("CALL this.setIp(?,?)", par)
    return result;
  }

  async addHistory(par) {
    let result = sql.awaitQuery("CALL addHistory(?)", [par])
    return result;
  }

  async getHomePage() {
    let result = sql.awaitQuery("CALL getHomePage()")
    return result;
  }
}






module.exports = Procedure;