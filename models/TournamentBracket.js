module.exports = function(sequelize, DataTypes) {
    const TournamentBracket = sequelize.define('TournamentBracket', {
       
    });

    TournamentBracket.associate = function(models) {
        // add associations here
        // ex:Review.hasMany(models.BlogPost);
        TournamentBracket.belongsTo(models.User, {
            foreignKey: {
              allowNull: false
            }
        });
    };

    TournamentBracket.associate = function(models) {
        TournamentBracket.hasMany(models.Round);
    };

    return TournamentBracket;
};