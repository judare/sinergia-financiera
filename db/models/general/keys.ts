import { ModelInterface } from "@/db";
import jwt from "jsonwebtoken";
import Sequelize from "sequelize";
import { makeid } from "@/lib/utils";

export default (sequelize: any, DataTypes: any) => {
  const toExecute: any = {};
  const Key: ModelInterface = sequelize.define(
    "Key",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: true },
      workSpaceId: { type: DataTypes.INTEGER, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: true },
      privateKey: { type: DataTypes.STRING, allowNull: true },
      publicKey: { type: DataTypes.STRING, allowNull: true },
      lastUseAt: { type: DataTypes.DATE, allowNull: true },
      expiresAt: { type: DataTypes.DATE, allowNull: true },
      isDefault: { type: DataTypes.BOOLEAN, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "keys",
    }
  );

  Key.associate = function (models: any) {
    models.Key.belongsTo(models.Workspace);
    models.Key.belongsTo(models.Business);
  };

  Key.createNew = async function (
    workspaceId: number,
    businessId: number,
    isDefault: boolean
  ) {
    let key = await Key.create({
      name: "Nuevo llave",
      businessId: businessId,
      workSpaceId: workspaceId,
      privateKey: "secret-" + makeid(32),
      publicKey: "pk-" + makeid(32),
      isDefault,
    });
    return key;
  };

  Key.useKey = async function (workspaceId: string, jwtToken: string) {
    let Op = Sequelize.Op;
    let keys = await Key.findAllRevalidate(
      {
        attributes: [
          "id",
          "privateKey",
          "publicKey",
          "workSpaceId",
          "lastUseAt",
        ],
        include: [
          {
            model: sequelize.models.Business,
            required: true,
          },
        ],
        where: {
          [Op.or]: [{ publicKey: workspaceId }, { workspaceId }],
        },
      },
      {
        workspaceId,
        revalidationTime: 60 * 1000,
        key: `useKey`,
      }
    );

    if (!jwtToken) {
      return keys[0];
    }

    let key = null;
    for (let k of keys) {
      try {
        jwt.verify(jwtToken, k.privateKey);
        key = k;
      } catch (err) {
        continue;
      }
    }
    if (key) {
      key.markUsed();
    }

    return key;
  };

  Key.getActiveKeys = async function (
    workspaceId: string,
    cache = 60 * 1000
  ): Promise<any[]> {
    let Op = Sequelize.Op;
    let keys = await Key.findAllRevalidate(
      {
        attributes: ["id", "privateKey", "publicKey", "lastUseAt", "isDefault"],
        where: {
          workspaceId,
          [Op.or]: [
            {
              expiresAt: {
                [Op.gte]: Date.now(),
              },
            },
            {
              expiresAt: null,
            },
          ],
        },
      },
      {
        revalidationTime: cache,
        key: `getActiveKeys`,
        workspaceId,
      }
    );

    return keys;
  };

  Key.verifySecret = async function (workspaceId: string, jwtToken: string) {
    let key = null;
    let keys = await Key.getActiveKeys(workspaceId);
    for (let k of keys) {
      try {
        jwt.verify(jwtToken, k.privateKey);
        key = k;
      } catch (err) {
        continue;
      }
    }
    if (!key) {
      return null;
    }

    key.markUsed();
    return key;
  };

  Key.prototype.getObfuscateKey = function () {
    // only 5 first and last characters
    return (
      this.privateKey.substring(0, 5) + "......." + this.privateKey.slice(-10)
    );
  };

  Key.prototype.markUsed = async function () {
    if (!toExecute[this.id]) {
      toExecute[this.id] = {
        th: null,
        executeOn: Date.now() + 60 * 1000,
      };
    }
    // remove previous timeout
    if (toExecute[this.id]?.th && toExecute[this.id]?.executeOn > Date.now())
      clearTimeout(toExecute[this.id]?.th);

    toExecute[this.id].th = setTimeout(async () => {
      await this.update({
        lastUseAt: Date.now(),
      });
      delete toExecute[this.id];
    }, 5000);
  };

  return Key;
};
