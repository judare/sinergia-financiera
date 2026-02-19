export default (sequelize: any, DataTypes: any) => {
  const TrainingPlan = sequelize.define(
    "TrainingPlan",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      onboardingProcessId: { type: DataTypes.INTEGER, allowNull: false },
      courseName: { type: DataTypes.STRING(150), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "training_plans",
    },
  );

  TrainingPlan.associate = function (models: any) {
    TrainingPlan.belongsTo(models.OnboardingProcess, { foreignKey: "onboardingProcessId" });
  };

  return TrainingPlan;
};
