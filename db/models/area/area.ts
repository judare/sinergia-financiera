export default (sequelize: any, DataTypes: any) => {
  const Area = sequelize.define(
    "Area",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      paranoid: true,
      tableName: "areas",
    },
  );

  Area.associate = function (models: any) {
    Area.hasMany(models.User, { foreignKey: "areaId" });
    Area.hasMany(models.OnboardingProcess, { foreignKey: "areaId" });
    Area.hasMany(models.AreaRequest, { foreignKey: "areaId" });
  };

  return Area;
};
