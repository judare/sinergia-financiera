import Sequelize from "sequelize";
import mysql2 from "mysql2";
// Models

import User from "./models/user/user";
import Area from "./models/area/area";
import Role from "./models/role/role";
import OnboardingProcess from "./models/onboardingProcess/onboardingProcess";
import AreaRequest from "./models/areaRequest/areaRequest";
import AssetsDelivery from "./models/assetsDelivery/assetsDelivery";
import TechnicalRequirement from "./models/technicalRequirement/technicalRequirement";
import TrainingPlan from "./models/trainingPlan/trainingPlan";
import PositionTemplate from "./models/positionTemplate/positionTemplate";
import Workstation from "./models/workstation/workstation";

type CacheOptions = {
  revalidationTime?: number;
  key?: string | null;
  workspaceId?: string | null;
};

export type ModelInterface = {
  [x: string]: any;
  findAll: (options?: any) => Promise<any>;
  findOne: (options?: any) => Promise<any>;
  create: (options?: any) => Promise<any>;
  update: (options?: any, options2?: any) => Promise<any>;
  destroy: (options?: any, options2?: any) => Promise<any>;
  count: (options?: any) => Promise<any>;
  findByPk: (options?: any) => Promise<any>;
  findAllRevalidate: (options: any, cache: CacheOptions) => Promise<any>;
  findOneRevalidate: (options: any, cache: CacheOptions) => Promise<any>;
  // updateLast(options?: any, key: ): Promise<any>;
};

const SequelizeObj: any = Sequelize;

export default class DB {
  private cache: any;
  public Op = Sequelize.Op;
  public sequelize: any = new SequelizeObj(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      pool: {
        max: 20,
        min: 0,
        idle: 20000,
        acquire: 200000,
      },
      dialect: "mysql",
      define: {
        charset: "utf8",
        collate: "utf8_general_ci",
      },
      timezone: "-05:00",
      dialectModule: mysql2,
      operatorsAliases: this.Op,
      benchmark: true,
      logging: (str: string, time: number) => {
        if (time > 1500) {
          console.log(time, str);
        }
      },
    },
  );
  public Sequelize = Sequelize;
  public models: { [key: string]: ModelInterface } = {};

  public User = this.instanceModel("User", User);
  public Area = this.instanceModel("Area", Area);
  public Role = this.instanceModel("Role", Role);
  public OnboardingProcess = this.instanceModel("OnboardingProcess", OnboardingProcess);
  public AreaRequest = this.instanceModel("AreaRequest", AreaRequest);
  public AssetsDelivery = this.instanceModel("AssetsDelivery", AssetsDelivery);
  public TechnicalRequirement = this.instanceModel("TechnicalRequirement", TechnicalRequirement);
  public TrainingPlan = this.instanceModel("TrainingPlan", TrainingPlan);
  public PositionTemplate = this.instanceModel("PositionTemplate", PositionTemplate);
  public Workstation = this.instanceModel("Workstation", Workstation);

  constructor() {
    this.cache = {};
    this.associate();
  }

  addCache(cache: CacheOptions, key: string, value: any) {
    let workspaceId = cache?.workspaceId || "default";
    if (!this.cache[workspaceId]) {
      this.cache[workspaceId] = {};
    }
    this.cache[workspaceId][key] = {
      value,
      timeExpire: Date.now() + (cache?.revalidationTime || 10000),
    };
  }

  getCache(cache: CacheOptions, key: string) {
    let workspaceId = cache?.workspaceId || "default";
    if (!workspaceId) {
      workspaceId = "default";
    }
    if (!this.cache[workspaceId]?.[key]) {
      return null;
    }
    if (this.cache[workspaceId][key].timeExpire < Date.now()) {
      return null;
    }
    return this.cache[workspaceId][key].value;
  }

  instanceModel(modelName: string, modelRaw: any): ModelInterface {
    let model: ModelInterface = modelRaw(this.sequelize, Sequelize.DataTypes);
    this.models[modelName] = model;

    model.findAllRevalidate = async (options = {}, cache: CacheOptions) => {
      let cacheKey = cache?.key || this.getStringFromObject(options);
      let fromCache = this.getCache(cache, cacheKey);
      if (fromCache) return fromCache;
      let rows = await model.findAll(options);
      this.addCache(cache, cacheKey, rows);
      return rows;
    };

    model.findOneRevalidate = async (options = {}, cache: CacheOptions) => {
      let cacheKey = cache?.key || this.getStringFromObject(options);
      let fromCache = this.getCache(cache, cacheKey);
      if (fromCache) return fromCache;
      let row = await model.findOne(options);
      this.addCache(cache, cacheKey, row);
      return row;
    };

    return model;
  }

  associate() {
    let names = Object.keys(this.models);
    for (let i = 0; i < names.length; i++) {
      let modelName = names[i];
      let model = this.models[modelName];
      if (model.associate) {
        model.associate(this);
      }
    }
  }

  getStringFromObject(obj: any) {
    let cache: any[] = [];
    let sql = JSON.stringify(obj, (_, value) => {
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        if (cache.includes(value)) return;
        cache.push(value);

        const props = [
          ...Object.getOwnPropertyNames(value),
          ...Object.getOwnPropertySymbols(value),
        ];
        const replacement: any = {};
        for (const k of props) {
          if (typeof k === "symbol") {
            replacement[`Symbol:${Symbol.keyFor(k)}`] = value[k];
          } else {
            replacement[k] = value[k];
          }
        }
        return replacement;
      }
      return value;
    });
    return sql;
  }

  clearCache() {
    this.cache = {};
  }
}

export const insertInChunks = async (
  model: any,
  arr: any[],
  chunkSize: number,
) => {
  let chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    let chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  // insert in Customers the chunks
  for (let chunk of chunks) {
    await model.bulkCreate(chunk);
  }
  return chunks;
};
