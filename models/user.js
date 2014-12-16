"use strict";

var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
var passportLocal = require("passport-local");

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email: { 
      type: DataTypes.STRING, 
      unique: true, 
      validate: {
        len: [6, 30],
      }
    },
    password_digest: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: true
      }
  },
    firstName: { 
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
  },
    lastName: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.INTEGER,
    }
  }, 
  {
    instanceMethods: {
        checkPassword: function(password) {
          return bcrypt.compareSync(password, this.password_digest);
        }
      },
      classMethods: {
        encryptPassword: function(password) {
          var hash = bcrypt.hashSync(password, salt);
          return hash;
        },
        createSecure: function(email, password, firstName, lastName, phone, err, success ) {
          if(password.length < 6) {
            err({message: "Password should be more than six characters"});
          }
          else{
            this.create({
              email: email,
              password_digest: this.encryptPassword(password),
              firstName: firstName,
              lastName: lastName,
              phone: phone

            }).then(function(user) {
                success({message: 'Account created, please log in now'});
              },
              function(error) {
                console.log(error);
                if(error.email){
                  err({message: 'Your username should be at least 6 characters long', email: email});
                }
                else{
                  err({message: 'An account with that username already exists', email: email});
                }
            });
          }
        },
        authenticate: function(email, password, err, success) {
          // find a user in the DB
          this.find({
            where: {
              email: email
            }
          })
          // when that's done, 
          .done(function(error,user){
            if(error){
              console.log(error);
              err({message: "Oops! Something went wrong"});
            }
            else if (user === null){
              err({message: "Username does not exist"});
            }
            else if ((User.comparePass(password, user.password_digest)) === true){
              success();
            }
            else {
              err({message: "Invalid password"});
            }
          });
        }

      } // close classMethods
    }); // close define user
    return user;
}; // close User function
