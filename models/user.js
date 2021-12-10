'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Cart, { foreignKey: 'userId' });
    };

    async getCurrentCart() {
      return await sequelize.models.Cart.findOne({ where: { userId: this.id, paid: null } });
    };
  };

  User.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notNull: true,
        isEmail: true
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
      }
    },
    isAdmin: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
      validate: {
        notNull: true,
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
