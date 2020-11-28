module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("Project", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tag: {
          type: DataTypes.STRING,
        }
    });

    Project.associate = function(models) {
        Project.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        })}

    Project.associate = function(models) {
      Project.hasMany(models.Collaborator, {
        onDelete: "cascade"
      });
    };
       
    return Project;
};