export default (sequelize: any, DataTypes: any) => {
  const Workstation = sequelize.define(
    "Workstation",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      seatCode: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      status: { type: DataTypes.STRING(50), defaultValue: "Disponible" },
      onboardingProcessId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "workstations",
    },
  );

  Workstation.associate = function (models: any) {
    Workstation.belongsTo(models.OnboardingProcess, { foreignKey: "onboardingProcessId" });
  };

  return Workstation;
};
