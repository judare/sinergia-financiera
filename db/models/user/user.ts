import bcrypt from "bcryptjs";
import moment from "moment";

export default (sequelize: any, DataTypes: any) => {
  const toExecute: any = {};
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fullName: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: true },
      roleId: { type: DataTypes.INTEGER, allowNull: true },
      areaId: { type: DataTypes.INTEGER, allowNull: true },
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
    },
    {
      paranoid: true,
      tableName: "users",
    },
  );

  User.associate = function (models: any) {
    User.belongsTo(models.Role, { foreignKey: "roleId" });
    User.belongsTo(models.Area, { foreignKey: "areaId" });
    User.hasMany(models.OnboardingProcess, {
      as: "ManagedProcesses",
      foreignKey: "managerId",
    });
  };

  /**
   *Check Permission
   *@return new token
   */
  User.prototype.getCookieSession = async function () {
    let userMapped = {
      id: this.id,
      businessId: this.businessId,
      fullName: this.fullName,
      image: this.image,
      email: this.email,
      rol: this.rol,
      extra1: this.extra1,
      extra2: this.extra2,
      extra3: this.extra3,
    };

    return {
      user: userMapped,
    };
  };

  User.getCookieSessionOptions = function () {
    return {
      domain:
        process.env.NODE_ENV == "production" ? ".sinergia.co" : ".localhost",
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
        },
      );

      delete toExecute[id];
    }, 5000);
  };

  return User;
};
