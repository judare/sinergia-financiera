export default (sequelize: any, DataTypes: any) => {
  const AssetsDelivery = sequelize.define(
    "AssetsDelivery",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      onboardingProcessId: { type: DataTypes.INTEGER, allowNull: false },
      assetType: {
        type: DataTypes.ENUM("software", "uniform", "equipment", "stationery"),
        allowNull: false,
        defaultValue: "equipment",
      },
      itemName: { type: DataTypes.STRING(100), allowNull: false },
      serialNumber: { type: DataTypes.STRING(100), allowNull: true },
      licenseKey: { type: DataTypes.STRING(200), allowNull: true },
      size: { type: DataTypes.STRING(50), allowNull: true },
      quantity: { type: DataTypes.INTEGER, allowNull: true },
      isDelivered: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      paranoid: true,
      tableName: "assets_deliveries",
    },
  );

  AssetsDelivery.associate = function (models: any) {
    AssetsDelivery.belongsTo(models.OnboardingProcess, { foreignKey: "onboardingProcessId" });
  };

  return AssetsDelivery;
};
