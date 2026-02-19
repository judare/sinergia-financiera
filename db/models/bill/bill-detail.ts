import Sequelize from "sequelize";

const model = (sequelize: any, DataTypes: any) => {
  const BillDetail = sequelize.define(
    "BillDetail",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      billId: { type: DataTypes.INTEGER, allowNull: true },
      concept: { type: DataTypes.STRING, allowNull: true },
      value: { type: DataTypes.INTEGER, allowNull: true },
      amount: { type: DataTypes.DECIMAL, allowNull: true },
      lastUpdateAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "bill_details",
      paranoid: true,
    }
  );

  BillDetail.associate = function (models: any) {
    models.BillDetail.belongsTo(models.Bill);
  };

  return BillDetail;
};

export default model;
