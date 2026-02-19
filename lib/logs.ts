import moment from "moment";
import fs from "fs";
import path from "path";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

export class Logger {
  private logs: any;
  private path: string;
  private name: string;

  constructor(pathName: string, name: string) {
    const BASE = serverRuntimeConfig.PROJECT_ROOT;
    let folderLogs = path.resolve(BASE, pathName);

    this.name = name;
    this.path = folderLogs;
    this.logs = [];
  }

  public save() {
    let logs =
      this.logs
        .map((log: { date: string; log: any }) => {
          return `[${log.date}] ${log.log}`;
        })
        .join("\n") + "\n\n\n";
    let realPath = this.path;
    let dirFile = path.resolve(realPath, this.name);

    try {
      fs.appendFileSync(dirFile, logs, { encoding: "utf8" });
    } catch (err) {
      if (!fs.existsSync(realPath)) {
        fs.mkdirSync(realPath, { recursive: true });
      }
      if (!fs.existsSync(dirFile)) {
        fs.writeFileSync(dirFile, logs, { encoding: "utf8" });
      }
    } finally {
      this.logs = [];
    }
  }

  private parseLog(log: string, type: "error" | "info" | "log" | "warn") {
    return {
      date: moment().format("DD/MM/YYYY HH:mm:ss.SSS"),
      log,
      type,
    };
  }

  private getLog(log: any): string {
    if (typeof log == "string") {
      return log;
    }

    return JSON.stringify(log);
  }

  public log(log: string | any) {
    try {
      this.logs.push(this.parseLog(this.getLog(log), "info"));
    } catch (err) {
      this.logs.push(this.parseLog("Error saving log", "error"));
    } finally {
      this.save();
    }
  }

  public error(log: string | any) {
    try {
      this.logs.push(this.parseLog(this.getLog(log), "error"));
    } catch (err) {
      this.logs.push(this.parseLog("Error saving log", "error"));
    } finally {
      this.save();
    }
  }

  public warn(log: string | any) {
    try {
      this.logs.push(this.parseLog(this.getLog(log), "warn"));
    } catch (err) {
      this.logs.push(this.parseLog("Error saving log", "error"));
    } finally {
      this.save();
    }
  }
}
