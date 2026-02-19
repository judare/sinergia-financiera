// rateLimiter.ts
type RateLimiterConfig = {
  limitByMinute?: number;
  limitByHour?: number;
  limitByDay?: number;
};

type HitRecord = {
  lastRequest: number;
  timestamps: number[];
};

export class RateLimiter {
  private config: RateLimiterConfig;
  private store: Map<string, HitRecord>;

  constructor(config: RateLimiterConfig) {
    this.config = config;
    this.store = new Map();
    setInterval(() => this.cleanOldRecords(), 60 * 60 * 1000);
  }

  async cleanOldRecords() {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    for (const [key, record] of this.store.entries()) {
      if (now - record.lastRequest > oneDay) {
        this.store.delete(key);
      }
    }
  }

  async check(key: string): Promise<void> {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [], lastRequest: now };
      this.store.set(key, record);
    }

    if (
      this.config.limitByMinute &&
      record.timestamps.filter((ts) => now - ts <= oneMinute).length >=
        this.config.limitByMinute
    ) {
      throw new Error("Rate limit exceeded (minute)");
    }

    if (
      this.config.limitByHour &&
      record.timestamps.filter((ts) => now - ts <= oneHour).length >=
        this.config.limitByHour
    ) {
      throw new Error("Rate limit exceeded (hour)");
    }

    if (
      this.config.limitByDay &&
      record.timestamps.length >= this.config.limitByDay
    ) {
      throw new Error("Rate limit exceeded (day)");
    }

    // Registrar nueva petición
    record.timestamps.push(now);
  }
}
