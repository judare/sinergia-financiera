import db from "@/db/conn";
import { Logger } from "@/lib/logs";

const { Bill } = db;
export default class AI {
  private user: { businessId: string };
  protected logger: Logger | null = null;
  public tokensInput: number = 0;
  public tokensOutput: number = 0;

  constructor(user: { businessId: string }, logger: Logger | null = null) {
    this.user = user;
    this.logger = logger;
  }

  protected async incrementUsage(input: number, output: number) {
    let bill = await Bill.getBillByBusiness(this.user.businessId);
    bill.incrementKeys({
      INPUT_TOKENS: input,
      OUTPUT_TOKENS: output,
    });
  }

  protected extractCode(code: string) {
    if (!code) return "";
    let res = code.match(/```([\s\S]+?)```/g);
    if (res) {
      code = res[1];
    }
    return code;
  }
}
