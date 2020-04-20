module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('User', {
       user_name: DataTypes.STRING,
       password: DataTypes.STRING
    });

    //each user can have many tournament brackets
    User.associate = function(models) {
        User.hasMany(models.TournamentBracket);
    };
    return User;
};