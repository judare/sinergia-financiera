const model = (sequelize: any, DataTypes: any) => {
  const PaymentMethod = sequelize.define(
    "PaymentMethod",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      verified: { type: DataTypes.INTEGER, allowNull: true },
      paymentProviderToken: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.STRING, allowNull: true },
      meta: { type: DataTypes.JSON, allowNull: true },
      lastUseAt: { type: DataTypes.DATE, allowNull: true },
      expiryMonth: { type: DataTypes.STRING, allowNull: true },
      expiryYear: { type: DataTypes.STRING, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: true },
      brand: { type: DataTypes.STRING, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "payment_methods",
    }
  );

  PaymentMethod.associate = function (models: any) {
    models.PaymentMethod.belongsTo(models.Business);
  };

  return PaymentMethod;
};

export default model;
