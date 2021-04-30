import SQLite from 'react-native-sqlite-storage';

/**
 * Execute sql queries
 *
 * @param sql
 * @param params
 *
 * @returns {resolve} results
 */
const executeQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    global.db.transaction(trans => {
      trans.executeSql(
        sql,
        params,
        (_trans, results) => {
          resolve(results);
        },
        error => {
          console.log('error=====================================>', error);
          resolve(null);
        },
      );
    });
  });

class SQLiteDB {
  // Create Table
  async CreateTable() {
    let Table = await executeQuery(
      'CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY NOT NULL, app TEXT, title TEXT DEFAULT NULL, titleBig TEXT DEFAULT NULL, text TEXT DEFAULT NULL, subText TEXT DEFAULT NULL, summaryText TEXT DEFAULT NULL, bigText TEXT DEFAULT NULL, audioContentsURI TEXT DEFAULT NULL, imageBackgroundURI TEXT DEFAULT NULL, extraInfoText TEXT DEFAULT NULL, icon TEXT DEFAULT NULL, image TEXT DEFAULT NULL, time INTEGER NULL)',
      [],
    );
    return Table;
  }

  async Insertdata(data) {
    await this.CreateTable();
    let query =
      'INSERT INTO notifications (app, title, titleBig, text, subText, summaryText, bigText, audioContentsURI, imageBackgroundURI, extraInfoText, icon, image, time) VALUES';
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
        "','" +
        data[i].time +
        "')";
      if (i !== data.length - 1) {
        query = query + ',';
      }
    }
    query = query + ';';
    let multipleInsert = await executeQuery(query, []);
    return multipleInsert;
  }

  async DeleteQuery(id) {
    let deleteQuery = await executeQuery(
      'DELETE FROM notifications WHERE app = ?',
      [id],
    );
    return deleteQuery;
  }

  /**
   * Select Query Example
   */
  async SelectQuery(appid) {
    await this.CreateTable();
    let selectQuery = await executeQuery(
      'SELECT * FROM notifications where app = ?',
      [appid],
    );
    const responseData = [];
    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      var item = rows.item(i);
      responseData.push(item);
    }

    return responseData;
  }

  async getAllApps() {
    await this.CreateTable();
    let selectQuery = await executeQuery(
      'SELECT app, icon, COUNT(app) as count FROM notifications GROUP BY app',
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
