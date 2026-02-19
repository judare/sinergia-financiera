import bcrypt from "bcryptjs";
import moment from "moment";

export default (sequelize: any, DataTypes: any) => {
  const toExecute: any = {};
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: true },
      image: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: true },
      cellphone: { type: DataTypes.STRING, allowNull: true },
      rol: { type: DataTypes.STRING, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      currentViewId: { type: DataTypes.STRING, allowNull: true },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        set(password: string) {
          if (password) {
            let objThis: any = this;
            let pass = bcrypt.hashSync(password, 10);
            objThis.setDataValue("password", pass);
          }
        },
      },
      blockedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastActionAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      mfa: {
        type: DataTypes.TEXT,
        get() {
          let objThis: any = this;
          const json = objThis.getDataValue("mfa");
          return JSON.parse(json || "{}");
        },
        set(value: any) {
          let objThis: any = this;
          objThis.setDataValue("mfa", JSON.stringify(value));
        },
      },
      extra1: { type: DataTypes.STRING, allowNull: true },
      extra2: { type: DataTypes.STRING, allowNull: true },
      extra3: { type: DataTypes.STRING, allowNull: true },
      emailVerified: { type: DataTypes.BOOLEAN, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "users",
    }
  );

  User.associate = function (models: any) {
    models.User.belongsTo(models.Business);
  };

  /**
   *Check Permission
   *@return new token
   */
  User.prototype.getCookieSession = async function () {
    const business = await this.getBusiness();

    const plan = await business.getPlan();
    let userMapped = {
      id: this.id,
      businessId: this.businessId,
      name: this.name,
      image: this.image,
      email: this.email,
      rol: this.rol,
      extra1: this.extra1,
      extra2: this.extra2,
      extra3: this.extra3,
    };

    let businessMapped = {
      id: business.id,
      name: business.name,
      billEmail: business.billEmail,
      logo: business.logo,
      countryId: business.countryId,
      website: business.website,
      addedCard: !!business.paymentProviderToken,
      limitViews: !business.paymentProviderToken ? 5 : null,
      limitUsers: !business.paymentProviderToken ? 2 : null,
    };

    let planMapped = {
      id: plan.id,
      label: plan.label,
      includedMinutes: plan.includedMinutes,
      price: plan.price,
      priceExtraMinute: plan.priceExtraMinute,
      limitDatasources: plan.limitDatasources,
      limitCustomers: plan.limitCustomers,
      retentionDays: plan.retentionDays,
    };

    return {
      user: userMapped,
      business: businessMapped,
      plan: planMapped,
    };
  };

  User.getCookieSessionOptions = function () {
    return {
      domain:
        // process.env.NODE_ENV == "production" ? ".talkia.co" : ".talkia.lol",
        process.env.NODE_ENV == "production" ? ".talkia.co" : ".localhost",
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV == "production",
    };
  };

  /**
   *Find user by her id
   *@return corresponfing user
   */
  User.findById = async function (id: string) {
    return await User.findByPk(id);
  };

  /**
   *Find user by her email
   *@return corresponfing user
   */
  User.findByEmail = async function (email: string, queryBuilder: any = {}) {
    let user = await User.findOne({
      ...queryBuilder,
      where: {
        ...queryBuilder.where,
        email,
      },
    });
    return user;
  };
  /**
   *Find user by her email
   *@return corresponfing user
   */
  User.createNew = async function ({
    name,
    email,
    image,
    companyName = "",
    password = null,
    emailVerified = false,
  }: any) {
    const { Bill, Business, Workspace, User } = sequelize.models;

    const business = await Business.create({
      planId: sequelize.models.Plan.FREE_ID,
      name: companyName,
      billEmail: email,
    });

    const bill = await Bill.create({
      businessId: business.id,
      startBillingCycle: moment().format("YYYY-MM-DD"),
      endBillingCycle: moment().add(1, "month").format("YYYY-MM-DD"),
      number: moment().format("YYYYMM"),
      paid: false,
      amount: 0,
    });

    await business.update({
      currentBillId: bill.id,
    });

    const user = await User.create({
      image,
      name,
      password,
      email,
      businessId: business.id,
      rol: "admin",
      emailVerified,
    });

    await Workspace.create({
      name: "Principal",
      businessId: business.id,
    });

    // await Key.createNew(workspace.id, business.id, true);

    await business.update({
      ownerId: user.id,
    });

    user.Business = business;
    return user;
  };

  /**
   *Compare two passwords
   *@return if they correspond or not
   */
  User.prototype.matchPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
  };

  User.markUsed = async function (id: string) {
    if (!toExecute[id]) {
      toExecute[id] = {
        th: null,
        executeOn: Date.now() + 60 * 1000,
      };
    }
    if (toExecute[id]?.th && toExecute[id]?.executeOn > Date.now())
      clearTimeout(toExecute[id]?.th);

    toExecute[id].th = setTimeout(async () => {
      User.update(
        {
          lastActionAt: Date.now(),
        },
        {
          where: {
            id,
          },
        }
      );

      delete toExecute[id];
    }, 5000);
  };

  return User;
};
