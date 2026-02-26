export default (sequelize: any, DataTypes: any) => {
  const Area = sequelize.define(
    "Area",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      directorId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      paranoid: true,
      tableName: "areas",
    },
  );

  Area.associate = function (models: any) {
    Area.belongsTo(models.User, { foreignKey: "directorId" });
  };

  return Area;
};
