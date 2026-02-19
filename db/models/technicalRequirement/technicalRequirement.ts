export default (sequelize: any, DataTypes: any) => {
  const TechnicalRequirement = sequelize.define(
    "TechnicalRequirement",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      onboardingProcessId: { type: DataTypes.INTEGER, allowNull: false },
      computerType: { type: DataTypes.STRING(50), allowNull: true },
      softwareLicenses: { type: DataTypes.TEXT, allowNull: true },
      clothingSizes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "technical_requirements",
    },
  );

  TechnicalRequirement.associate = function (models: any) {
    TechnicalRequirement.belongsTo(models.OnboardingProcess, { foreignKey: "onboardingProcessId" });
  };

  return TechnicalRequirement;
};
