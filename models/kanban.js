module.exports = (sequelize, DataTypes) => {
    const Kanban = sequelize.define("Kanban", {
      todo: {
        type: DataTypes.STRING
      },
      inProgress: {
        type: DataTypes.BOOLEAN, defaultValue: false
      },
      completed: {
        type: DataTypes.BOOLEAN, defaultValue: false
      }
    });
  
    Kanban.associate = function (models) {
      Kanban.belongsTo(models.Project, {
        foreignKey: {
          allowNull: false
      },
      onDelete: "cascade"
  })
}
    
  
    return Kanban;
  };