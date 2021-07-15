import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
var _DbContext;

var getDB = () => {
  return new Promise(async (resolve, reject) => {
    if (_DbContext == undefined) {
      SQLite.openDatabase({name: 'FonDB.db'}, (dbResult) => {
        _DbContext = dbResult;
        resolve(_DbContext);
      });
    } else {
      //DB Already exists
      resolve(_DbContext);
    }
  });
};

export default getDB;
