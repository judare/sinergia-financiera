export default (sequelize: any, DataTypes: any) => {
  const OnboardingProcess = sequelize.define(
    "OnboardingProcess",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      processCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      fullName: { type: DataTypes.STRING(150), allowNull: false },
      documentType: { type: DataTypes.STRING(20), allowNull: false },
      documentNumber: { type: DataTypes.STRING(50), allowNull: false },
      position: { type: DataTypes.STRING(100), allowNull: false },
      areaId: { type: DataTypes.INTEGER, allowNull: false },
      startDate: { type: DataTypes.DATEONLY, allowNull: false },
      managerId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING(50), defaultValue: "Pendiente" },
    },
    {
      paranoid: true,
      tableName: "onboarding_processes",
    },
  );

  OnboardingProcess.associate = function (models: any) {
    OnboardingProcess.belongsTo(models.Area, { foreignKey: "areaId" });
    OnboardingProcess.belongsTo(models.User, {
      as: "Manager",
      foreignKey: "managerId",
    });
    OnboardingProcess.hasMany(models.AreaRequest, {
      foreignKey: "onboardingProcessId",
    });
    OnboardingProcess.hasMany(models.AssetsDelivery, {
      foreignKey: "onboardingProcessId",
    });
    OnboardingProcess.hasOne(models.TechnicalRequirement, {
      foreignKey: "onboardingProcessId",
    });
    OnboardingProcess.hasMany(models.TrainingPlan, {
      foreignKey: "onboardingProcessId",
    });
    OnboardingProcess.hasOne(models.Workstation, {
      foreignKey: "onboardingProcessId",
    });
  };

  return OnboardingProcess;
};
