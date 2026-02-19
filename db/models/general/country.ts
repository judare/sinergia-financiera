export default (sequelize: any, DataTypes: any) => {
  const Country = sequelize.define(
    "Country",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: true },
      code: { type: DataTypes.STRING, allowNull: true },
      indicator: { type: DataTypes.STRING, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "countries",
    }
  );

  Country.associate = function (models: any) {};

  return Country;
};
