export default (sequelize: any, DataTypes: any) => {
  const PositionTemplate = sequelize.define(
    "PositionTemplate",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      positionName: { type: DataTypes.STRING(100), allowNull: false },
      suggestedComputerType: { type: DataTypes.STRING(50), allowNull: true },
      suggestedSoftware: { type: DataTypes.TEXT, allowNull: true },
      suggestedTraining: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "position_templates",
    },
  );

  PositionTemplate.associate = function (_models: any) {};

  return PositionTemplate;
};
