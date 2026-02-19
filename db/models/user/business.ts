export default (sequelize: any, DataTypes: any) => {
  const Business = sequelize.define(
    "Business",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      ownerId: { type: DataTypes.INTEGER, allowNull: true },
      planId: { type: DataTypes.INTEGER, allowNull: true },
      logo: { type: DataTypes.STRING, allowNull: true },
      website: { type: DataTypes.STRING, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: true },
      paymentProviderToken: { type: DataTypes.STRING, allowNull: true },
      billEmail: { type: DataTypes.STRING, allowNull: true },
      countryId: { type: DataTypes.INTEGER, allowNull: true },
      country: { type: DataTypes.STRING, allowNull: true },
      city: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      currentBillId: { type: DataTypes.INTEGER, allowNull: true },
      paymentMethodId: { type: DataTypes.INTEGER, allowNull: true },
      vatType: { type: DataTypes.STRING, allowNull: true },
      vatNumber: { type: DataTypes.STRING, allowNull: true },
      context: { type: DataTypes.STRING, allowNull: true },
      defaultPhoneNumberId: { type: DataTypes.INTEGER, allowNull: true },
      onboarding: {
        type: DataTypes.ENUM,
        values: ["initial", "companyData", "finish"],
      },
      meta: {
        type: DataTypes.TEXT,
        get() {
          let objThis: any = this;
          const json = objThis.getDataValue("meta");
          return JSON.parse(json || "{}");
        },
        set(value: any) {
          let objThis: any = this;
          objThis.setDataValue("meta", JSON.stringify(value));
        },
      },
    },
    {
      paranoid: true,
      tableName: "businesses",
    }
  );

  Business.associate = function (models: any) {
    models.Business.belongsTo(models.User, {
      foreignKey: "ownerId",
      as: "owner",
    });
    models.Business.belongsTo(models.Bill, {
      foreignKey: "currentBillId",
      as: "bill",
    });

    models.Business.belongsTo(models.Plan, {
      foreignKey: "planId",
    });

    models.Business.belongsTo(models.Country, {
      foreignKey: "countryId",
    });
  };

  Business.findById = async function (id: string) {
    return await Business.findByPk(id);
  };

  Business.prototype.hasToPay = async function () {
    let paymentMethod = await sequelize.models.PaymentMethod.findOne({
      where: {
        businessId: this.id,
        verified: true,
      },
    });
    return !paymentMethod;
  };

  return Business;
};
