import SQLite from 'react-native-sqlite-storage';

class SQLiteDB {
  constructor() {}
  async executeQuery(sql, params = []) {
    global.db.transaction(trans => {
      trans.executeSql(
        sql,
        params,
        (_trans, results) => {
          console.log(results);
          return {error: null, results};
        },
        error => {
          console.log('error', error);
          return {error, result: null};
        },
      );
    });
  }

  // Create Table
  async CreateTable() {
    let Table = await this.executeQuery(
      'CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY NOT NULL, app TEXT, title TEXT DEFAULT NULL, titleBig TEXT DEFAULT NULL, text TEXT DEFAULT NULL, subText TEXT DEFAULT NULL, summaryText TEXT DEFAULT NULL, bigText TEXT DEFAULT NULL, audioContentsURI TEXT DEFAULT NULL, imageBackgroundURI TEXT DEFAULT NULL, extraInfoText TEXT DEFAULT NULL, icon TEXT DEFAULT NULL, image TEXT DEFAULT NULL)',
      [],
    );
    console.log('CreateTable', Table);
    return Table;
  }

  async Insertdata(data) {
    console.log('data', data);
    await this.CreateTable();
    let query =
      'INSERT INTO notifications (app, title, titleBig, text, subText, summaryText, bigText, audioContentsURI, imageBackgroundURI, extraInfoText, icon, image) VALUES';
    for (let i = 0; i < data.length; ++i) {
      query =
        query +
        "('" +
        data[i].app +
        "','" +
        data[i].title +
        "','" +
        data[i].titleBig +
        "','" +
        data[i].text +
        "','" +
        data[i].subText +
        "','" +
        data[i].summaryText +
        "','" +
        data[i].bigText +
        "','" +
        data[i].audioContentsURI +
        "','" +
        data[i].imageBackgroundURI +
        "','" +
        data[i].extraInfoText +
        "','" +
        data[i].icon +
        "','" +
        data[i].image +
        "')";
      if (i != data.length - 1) {
        query = query + ',';
      }
    }
    query = query + ';';
    console.log(query);
    let multipleInsert = await this.executeQuery(query, []);
    console.log(multipleInsert);
    return multipleInsert;
  }

  async DeleteQuery(id) {
    let deleteQuery = await this.executeQuery(
      'DELETE FROM notifications WHERE id = ?',
      [id],
    );
    console.log(deleteQuery);
    return deleteQuery;
  }

  /**
   * Select Query Example
   */
  async SelectQuery() {
    await this.CreateTable();
    let selectQuery = await this.executeQuery(
      'SELECT * FROM notifications',
      [],
    );
    const responseData = [];
    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      var item = rows.item(i);
      responseData.push(item);
    }

    return responseData;
  }
}
export default new SQLiteDB();
