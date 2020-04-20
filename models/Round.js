module.exports = function(sequelize, DataTypes) {
    const Round = sequelize.define('Round', {
       
    });

    Round.associate = function(models) {
        // add associations here
        // ex:Review.hasMany(models.BlogPost);
        Round.belongsTo(models.TournamentBracket, {
            foreignKey: {
              allowNull: false
            }
        });
    };

    return Round;
};