export default (sequelize: any, DataTypes: any) => {
  const PotentialBusiness = sequelize.define(
    "PotentialBusiness",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      visits: { type: DataTypes.INTEGER, allowNull: true },
      headline: { type: DataTypes.STRING(255), allowNull: true },
      slug: { type: DataTypes.STRING(255), allowNull: true },
      name: { type: DataTypes.STRING(255), allowNull: true },
      city: { type: DataTypes.STRING(255), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      category: { type: DataTypes.STRING(255), allowNull: true },
      personName: { type: DataTypes.STRING(255), allowNull: true },
      personRole: { type: DataTypes.STRING(255), allowNull: true },
      image: { type: DataTypes.STRING(255), allowNull: true },
      cellphone: { type: DataTypes.STRING(255), allowNull: true },
      email: { type: DataTypes.STRING(255), allowNull: true },
      website: { type: DataTypes.STRING(255), allowNull: true },
      demoAudio: { type: DataTypes.STRING(255), allowNull: true },
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
      originUrl: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      paranoid: true,
      tableName: "potential_businesses",
    }
  );

  return PotentialBusiness;
};
