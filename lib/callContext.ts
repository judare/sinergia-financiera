import fetch from "node-fetch";

interface ContextExecution {
  businessId: string;
  block: any;
  datasources: any;
  session?: any;
  form: any;
  utils: any;
  ipAddress: string;
}
interface ExecutionsOptions {
  memoryLimit: number;
  timeout: number;
  concurrentLimit: number;
}

interface IStats {
  memoryUsage: number;
  currentExecutions: number;
  rowsSelected: number;
  rowsAffected: number;
  timeDb: number;
}

const requestExecutor = async (endpoint: string, body: any) => {
  let url = `http://localhost:9002/${endpoint}`;
  let req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  let response: any = await req.json();
  return response.result;
};

export function getExecutions(businessId: string): Promise<any[]> {
  return requestExecutor("executions", {
    businessId,
  });
}

export function getSqlExecute({
  datasource,
  sql,
  businessId,
  memoryLimit,
}: any): Promise<any[]> {
  return requestExecutor("sql-execute", {
    datasource,
    businessId,
    sql,
    memoryLimit,
  });
}

export function getBlockLogs(params: any): Promise<any[]> {
  return requestExecutor("block-logs", {
    ...params,
  });
}

export async function releaseContext({ businessId }: any): Promise<any[]> {
  let response = await requestExecutor("release-context", {
    businessId,
  });

  if (response?.type == "exception") {
    throw new Error(response?.content?.message || "No schema found");
  }

  return response.result;
}

export function executeInContext(
  paramsExecution: ContextExecution,
  options: ExecutionsOptions = {
    memoryLimit: 1024,
    timeout: 300,
    concurrentLimit: 3,
  }
): Promise<{ response: any; text: string; stats: IStats | null }> {
  return requestExecutor("execution", {
    ...paramsExecution,
    timeout: options.timeout,
    memoryLimit: options.memoryLimit,
    concurrentLimit: options.concurrentLimit,
  });
}

export function handleException(err: any, block: any = null) {
  let response = {
    type: "exception",
    content: {
      name: err.name || "Function Error",
      message: err?.sqlMessage || err?.message || "Unexpected Error",
      key: null,
      description: "",
    },
  };

  if (err.sql) {
    response.content.name = "SQL_ERROR";
    response.content.description = err.sql;
  } else if (err.show) {
    response.content.key = err.key;
  }

  if (err.name === "TypeError") {
    response.content.name = `Error on endpoint "${block?.key}"`;
    response.content.description = err.description;
  }
  if (err.stack && !response.content.description) {
    const ocrrence = err.stack
      .split("\n")
      .find((l: string) => l.includes("at fn"));
    if (ocrrence) {
      response.content.description = `Error on line ${ocrrence
        .replace("evalmachine.<anonymous>", "")
        .trim()}`;
    }
  }
  return response;
}
