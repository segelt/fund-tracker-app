import getDB from '../../context/Database';

let DBService = {
  addFundTableIfNotExists: function () {
    return new Promise(async (resolve, reject) => {
      await getDB().then(async (db) => {
        await db.transaction(async (tx) => {
          try {
            tx.executeSql(
              `
                    CREATE TABLE IF NOT EXISTS 'portfolyo' ( 
                        'fundCode' TEXT NOT NULL, 
                        'dateAdded' TEXT NOT NULL, 
                        'priceBought' REAL NOT NULL, 
                        'amountBought' REAL NOT NULL, 
                        PRIMARY KEY('fundCode','dateAdded')
                    );`,
              [],
              (tx, res) => {
                //created succesfully
              },
            )
              .then((rows) => {
                //success at creating table
                resolve(rows);
              })
              .catch((err) => {
                //error at creating table
                //console.log(err);
              });
          } catch (err) {
            //console.log(err);
            //error at create items
          }
        });
      });
    });
  },

  getAllFunds: function () {
    return new Promise(async (resolve, reject) => {
      await getDB().then(async (db) => {
        await db.transaction(
          async (tx) => {
            try {
              tx.executeSql('SELECT * FROM portfolyo;', [])
                .then((rows) => {
                  //Success at querying table
                  resolve(rows[1]);
                })
                .catch((err) => {
                  //Caught error at inner sql while querying table
                  reject();
                  return true;
                });
            } catch (erx) {}
          },
          (err) => {
            //any error goes here
            //Caught error at transaction while querying table
            reject(err);
            return true;
          },
          (sx) => {
            resolve(sx);
          },
        );

        resolve();
      });
    })
      .then((rows) => {
        //Succesfully reaching and of transaction
        return rows;
      })
      .catch((err) => {
        //console.log(err);
      });
  },

  getFundAsCollection: function () {
    return new Promise(async (resolve, reject) => {
      var output = [];
      await this.getAllFunds()
        .then(({rows}) => {
          for (let i = 0; i < rows.length; i++) {
            let rowItem = rows.item(i);
            let newItem = {
              amountBought: rowItem.amountBought,
              dateAdded: rowItem.dateAdded,
              fundCode: rowItem.fundCode,
              priceBought: rowItem.priceBought,
            };

            output.push(newItem);
          }
          resolve(output);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  //INSERT into portfolyo (fundCode, dateAdded, priceBought, amountBought) VALUES ('AFA', '13-10-2020', 2.8382, 1000)
  insertValue: function (insertMap) {
    return new Promise(async (resolve, reject) => {
      await getDB()
        .then(async (db) => {
          await db.transaction(
            async (tx) => {
              tx.executeSql(
                'INSERT INTO portfolyo (fundCode, dateAdded, priceBought, amountBought) VALUES (?, ?, ?, ?);',
                [
                  insertMap.fonKodu,
                  insertMap.tarih,
                  insertMap.payFiyati,
                  insertMap.payMiktari,
                ],
              )
                .then((rows) => {
                  //Success adding the content
                  resolve(rows[1].rowsAffected == 1);
                })
                .catch((err) => {
                  reject();
                  return true;
                });
            },
            (err) => {
              //Error adding content
              //console.log(err);
              reject(err);
              return true;
            },
            (sx) => {
              resolve();
            },
          );
        })
        .catch((err) => {
          //console.log(err);
        });
    });
  },

  updateValue: function (insertMap) {
    return new Promise(async (resolve, reject) => {
      await getDB()
        .then(async (db) => {
          await db
            .transaction(
              async (tx) => {
                tx.executeSql(
                  'UPDATE portfolyo SET amountBought = amountBought + ? WHERE fundCode = ? AND dateAdded = ?;',
                  [insertMap.payMiktari, insertMap.fonKodu, insertMap.tarih],
                )
                  .then((rows) => {
                    //Success updating the content
                    resolve(rows[1].rowsAffected == 1);
                  })
                  .catch((err) => {
                    reject(err);
                    return true;
                  });
              },
              (err) => {
                //Error updating content
                reject(err);
                return true;
              },
              (sx) => {
                resolve();
              },
            )
            .then((rs) => {
              resolve(rs);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          //db error
        });
    });
  },

  checkIfValueExists: function (insertMap) {
    return new Promise(async (resolve, reject) => {
      await getDB().then(async (db) => {
        await db
          .transaction(
            async (tx) => {
              try {
                tx.executeSql(
                  'SELECT * from portfolyo WHERE fundCode = ? and dateAdded = ?',
                  [insertMap.fonKodu, insertMap.tarih],
                )
                  .then((rows) => {
                    //Success at querying table
                    resolve(rows[1].rows.length == 1);
                  })
                  .catch((err) => {
                    reject();
                    return true;
                  });
              } catch (erx) {}
            },
            (err) => {
              reject(err);
              return true;
            },
            (sx) => {
              resolve(sx);
            },
          )
          .then(({rows}) => {
            //Reaches end of transaction at this service
            return rows == true;
          })
          .catch((err) => {
            throw new Error('Error while checking if fund exists');
          });
      });
    });
  },

  dropTable: function (table) {
    return new Promise(async (resolve, reject) => {
      await getDB()
        .then(async (db) => {
          await db.transaction(
            async (tx) => {
              tx.executeSql(`DROP TABLE IF EXISTS ${table};`, [])
                .then((rows) => {
                  //Drop success
                  resolve();
                })
                .catch((err) => {
                  reject();
                  return true;
                });
            },
            (err) => {
              reject(err);
              return true;
            },
          );
        })
        .catch((err) => {});
    });
  },

  getTableList: function () {
    return new Promise(async (resolve, reject) => {
      await getDB().then(async (db) => {
        await db.transaction(async (tx) => {
          try {
            const rows = await tx.executeSql(
              `SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';`,
              [],
            );
            resolve();
          } catch (err) {}
        });
      });
    });
  },

  //delete from portfolyo WHERE fundCode = 'NNF'
  deleteFund: function (deleteCode) {
    return new Promise(async (resolve, reject) => {
      await getDB().then(async (db) => {
        await db.transaction(async (tx) => {
          tx.executeSql('delete from portfolyo WHERE fundCode = ?', [
            deleteCode,
          ])
            .then((rows) => {
              resolve(rows[1].rowsAffected);
            })
            .catch((err) => {
              reject(err);
              return true;
            });
        });
      });
    });
  },

  deleteAllRows: function () {
    return new Promise(async (resolve, reject) => {
      await getDB().then(async (db) => {
        await db
          .transaction(async (tx) => {
            tx.executeSql('delete from portfolyo', [])
              .then((rows) => {
                resolve(rows);
              })
              .catch((err) => {
                reject(err);
                return true;
              });
          })
          .then((sx) => {
            resolve();
          })
          .catch((err) => {
            reject();
          });
      });
    });
  },

  getRowCount: async function () {
    return new Promise(async (resolve, reject) => {
      await getDB()
        .then(async (db) => {
          await db.transaction(async (tx) => {
            try {
              const resultSet = await tx.executeSql(
                `SELECT COUNT(*) from portfolyo;`,
                [],
              );
              const count = resultSet[1].rows.item(0)['COUNT(*)'];
              if (typeof count === 'undefined' || !Number.isInteger(count)) {
                reject('Error');
              }
              resolve(count);
            } catch (err) {}
          });
        })
        .catch((err) => {
          //Error fetching db
          reject('Error');
        });
    });
  },
};

export default DBService;
