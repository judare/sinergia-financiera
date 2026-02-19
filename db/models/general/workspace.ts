import { string_to_slug } from "@/lib/utils";

const model = (sequelize: any, DataTypes: any) => {
  const Workspace = sequelize.define(
    "Workspace",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      datasources: { type: DataTypes.INTEGER, allowNull: true },
      urlScript: { type: DataTypes.STRING, allowNull: true },
      urlStyles: { type: DataTypes.STRING, allowNull: true },
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
        set(slug: string) {
          let objThis: any = this;
          objThis.setDataValue("slug", string_to_slug(slug));
        },
      },
    },
    {
      paranoid: true,
      tableName: "workspaces",
    }
  );

  Workspace.associate = function (models: any) {
    models.Workspace.belongsTo(models.Business);
  };

  Workspace.findById = async function (id: string) {
    let queryBuilder: any = {
      where: {
        id,
      },
    };

    return await Workspace.findOne(queryBuilder);
  };

  Workspace.findByIdAndBusiness = async function (
    id: string,
    businessId: string
  ) {
    let queryBuilder: any = {
      where: {
        id,
        businessId,
      },
    };

    return await Workspace.findOne(queryBuilder);
  };

  return Workspace;
};

export default model;
