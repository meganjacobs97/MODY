module.exports = function(sequelize, DataTypes) {
    const Round = sequelize.define('Round', {
       
    });

    Round.associate = function(models) {
        // add associations here
        // ex:Review.hasMany(models.BlogPost);
        //each round belongs to a tournamnetbracket
        Round.belongsTo(models.TournamentBracket, {
            foreignKey: {
              allowNull: false
            }
        });
        //each round has multiple options (2)
        Round.hasMany(models.Option); 
    };


    return Round;
};