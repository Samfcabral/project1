"use strict";

module.exports = function(sequelize, DataTypes) {
  var watchlist = sequelize.define("watchlist", {
    street: DataTypes.STRING,
    citystatezip: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.user)
      }
    }
  });

  return watchlist;
};
