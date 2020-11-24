module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("Project", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    Project.associate = function(models) {
        Project.belongsTo(models.Project, {
          foreignKey: {
            allowNull: false
          }
        })}
    return Project;
};