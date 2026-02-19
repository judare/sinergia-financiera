import Sequelize from "sequelize";
import mysql2 from "mysql2";
// Models
import _QueryExecution from "./models/_query_executions";
import Business from "./models/user/business";
import Plan from "./models/user/plan";
import User from "./models/user/user";
import Bill from "./models/bill/bill";
import BillDetail from "./models/bill/bill-detail";
import Feedback from "./models/general/feedback";
import Key from "./models/general/keys";
import PaymentMethod from "./models/user/payment-method";
import Workspace from "./models/general/workspace";
import Country from "./models/general/country";
import PotentialBusiness from "./models/user/potential-business";

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
          this._QueryExecution
            .create({
              sql: str,
              ms: time,
              type: "alert_register",
              logging: console.log,
            })
            .catch((err: any) => {
              console.log(err);
            });
        } else {
          // console.log(str);
        }
      },
    },
  );
  public Sequelize = Sequelize;
  public models: { [key: string]: ModelInterface } = {};
  public _QueryExecution = this.instanceModel(
    "_QueryExecution",
    _QueryExecution,
  );

  public Business = this.instanceModel("Business", Business);
  public User = this.instanceModel("User", User);
  public Feedback = this.instanceModel("Feedback", Feedback);
  public Bill = this.instanceModel("Bill", Bill);
  public BillDetail = this.instanceModel("BillDetail", BillDetail);
  public Key = this.instanceModel("Key", Key);
  public PaymentMethod = this.instanceModel("PaymentMethod", PaymentMethod);
  public Workspace = this.instanceModel("Workspace", Workspace);
  public Plan = this.instanceModel("Plan", Plan);
  public Country = this.instanceModel("Country", Country);

  public PotentialBusiness = this.instanceModel(
    "PotentialBusiness",
    PotentialBusiness,
  );

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
