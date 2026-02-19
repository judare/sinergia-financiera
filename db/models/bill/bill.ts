import moment from "moment";
import Sequelize from "sequelize";
const model = (sequelize: any, DataTypes: any) => {
  const Bill = sequelize.define(
    "Bill",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      startBillingCycle: { type: DataTypes.DATE, allowNull: true },
      endBillingCycle: { type: DataTypes.DATE, allowNull: true },

      number: { type: DataTypes.INTEGER, allowNull: true },
      amount: { type: DataTypes.DECIMAL, allowNull: true },
      paid: { type: DataTypes.TINYINT, allowNull: true },
    },
    {
      tableName: "bills",
      paranoid: true,
    }
  );

  Bill.associate = function (models: any) {
    models.Bill.belongsTo(models.Business);
  };

  Bill.prototype.getDetailsByKeys = async function (keys: any) {
    const details = await sequelize.models.BillDetail.findAll({
      attributes: ["concept", "value", "amount"],
      where: {
        billId: this.id,
        concept: { [Sequelize.Op.in]: keys },
      },
    });

    return details.reduce((acc: any, detail: any) => {
      acc[detail.concept] = {
        value: detail.value,
        amount: detail.amount,
      };
      return acc;
    }, {});
  };

  Bill.getBillByBusiness = async function (businessId: any) {
    let bill = await sequelize.models.Bill.findOne({
      where: {
        businessId,
        endBillingCycle: { [Sequelize.Op.gte]: moment().toDate() },
        startBillingCycle: { [Sequelize.Op.lte]: moment().toDate() },
      },
    });
    if (!bill) {
      bill = await Bill.create({
        businessId,
        startBillingCycle: moment().toDate(),
        endBillingCycle: moment().add(1, "month").toDate(),
      });
      await sequelize.models.Business.update(
        { currentBillId: bill.id },
        { where: { id: businessId } }
      );
    }
    return bill;
  };

  Bill.prototype.incrementKeys = async function (
    keys: { [key: string]: number }[]
  ) {
    const billDetails = await sequelize.models.BillDetail.findAll({
      attributes: ["id", "concept"],
      where: {
        billId: this.id,
        concept: { [Sequelize.Op.in]: Object.keys(keys) },
      },
    });

    const reduced = billDetails.reduce((acc: any, detail: any) => {
      acc[detail.concept] = detail;
      return acc;
    }, {});

    for (let key in keys) {
      if (reduced[key]) {
        // console.log("incrementing", key, keys[key], reduced[key]?.id);
        reduced[key].increment("value", { by: keys[key] });
      } else {
        reduced[key] = await sequelize.models.BillDetail.create({
          billId: this.id,
          concept: key,
          value: keys[key],
        });
      }
    }
  };

  return Bill;
};

export default model;
