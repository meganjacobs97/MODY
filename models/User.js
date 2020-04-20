module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('User', {
       
    });

    User.associate = function(models) {
        User.hasMany(models.TournamentBracket);
    };
    return User;
};