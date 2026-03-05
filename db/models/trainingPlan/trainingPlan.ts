export default (sequelize: any, DataTypes: any) => {
  const TrainingPlan = sequelize.define(
    "TrainingPlan",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      onboardingProcessId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "training_plans",
    },
  );

  TrainingPlan.associate = function (models: any) {
    TrainingPlan.belongsTo(models.OnboardingProcess, {
      foreignKey: "onboardingProcessId",
    });
    TrainingPlan.belongsTo(models.Course, { foreignKey: "courseId" });
  };

  return TrainingPlan;
};
