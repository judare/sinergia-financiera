export default (sequelize: any, DataTypes: any) => {
  const Plan = sequelize.define(
    "Plan",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      label: { type: DataTypes.STRING, allowNull: true },
      includedMinutes: { type: DataTypes.INTEGER, allowNull: true },
      price: { type: DataTypes.DOUBLE, allowNull: true },
      priceExtraMinute: { type: DataTypes.DOUBLE, allowNull: true },
      limitDatasources: { type: DataTypes.INTEGER, allowNull: true },
      limitCustomers: { type: DataTypes.INTEGER, allowNull: true },
      retentionDays: { type: DataTypes.INTEGER, allowNull: true },
      pricePerAgent: { type: DataTypes.DOUBLE, allowNull: true },
      includedAgents: { type: DataTypes.INTEGER, allowNull: true },
      priceYearly: { type: DataTypes.DOUBLE, allowNull: true },
      isPublic: { type: DataTypes.BOOLEAN, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "plans",
    }
  );

  Plan.FREE_ID = 1;

  Plan.findById = async function (id: string) {
    return await Plan.findByPk(id);
  };

  return Plan;
};
