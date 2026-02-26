export default (sequelize: any, DataTypes: any) => {
  const Course = sequelize.define(
    "Course",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      observation: { type: DataTypes.STRING, allowNull: false },
      mode: { type: DataTypes.ENUM("virtual", "presence"), allowNull: false },
    },
    {
      paranoid: true,
      tableName: "courses",
    },
  );

  return Course;
};
