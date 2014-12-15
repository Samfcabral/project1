"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("watchlists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      street: {
        type: DataTypes.STRING
      },
      citystatezip: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("watchlists").done(done);
  }
};