export default (sequelize: any, DataTypes: any) => {
  const Position = sequelize.define(
    "Position",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      areaId: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      bossId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      paranoid: true,
      tableName: "positions",
    },
  );

  Position.associate = function (models: any) {
    Position.belongsTo(models.Position, { foreignKey: "bossId" });
    Position.belongsTo(models.Area, { foreignKey: "areaId" });
  };

  return Position;
};
