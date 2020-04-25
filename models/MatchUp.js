module.exports = function(sequelize, DataTypes) {
    const MatchUp = sequelize.define('MatchUp', {
       round: DataTypes.INTEGER,
       bracket: DataTypes.INTEGER, 
       option1: DataTypes.STRING,
       option2: DataTypes.STRING,
       option1_votes: DataTypes.INTEGER,
       option2_votes: DataTypes.INTEGER,
       winner: DataTypes.STRING
    });

    MatchUp.associate = function(models) {
        // add associations here
        // ex:Review.hasMany(models.BlogPost);
        //each matchup belongs to a tournamnetbracket
        MatchUp.belongsTo(models.TournamentBracket, {
            foreignKey: {
              allowNull: false
            }
        });
        //each matchup has multiple options (2)
        // MatchUp.hasMany(models.Option); 
    };


    return MatchUp;
};