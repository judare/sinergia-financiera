export default (sequelize: any, DataTypes: any) => {
  const Role = sequelize.define(
    "Role",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(50), allowNull: false },
    },
    {
      paranoid: true,
      tableName: "roles",
    },
  );

  Role.associate = function (models: any) {
    Role.hasMany(models.User, { foreignKey: "roleId" });
  };

  return Role;
};
