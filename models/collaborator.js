module.exports = (sequelize, DataTypes) => {
    const Collaborator = sequelize.define("Collaborator", {
        requesterId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        requesterUsername: {
            type: DataTypes.STRING,
            allowNull: false
        },
        requesterEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        requesterMessage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })

    Collaborator.associate = function(models) {
        Collaborator.belongsTo(models.Project, {
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Collaborator;
}