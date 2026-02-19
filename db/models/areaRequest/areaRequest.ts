export default (sequelize: any, DataTypes: any) => {
  const AreaRequest = sequelize.define(
    "AreaRequest",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      onboardingProcessId: { type: DataTypes.INTEGER, allowNull: false },
      areaId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING(50), defaultValue: "Pendiente" },
      deadline: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      paranoid: true,
      tableName: "area_requests",
    },
  );

  AreaRequest.associate = function (models: any) {
    AreaRequest.belongsTo(models.OnboardingProcess, { foreignKey: "onboardingProcessId" });
    AreaRequest.belongsTo(models.Area, { foreignKey: "areaId" });
  };

  return AreaRequest;
};
