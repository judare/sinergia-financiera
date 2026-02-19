import fetch from "node-fetch";

class Wompi {
  private pubKey = process.env.WOMPI_PUBKEY;
  private privateKey = process.env.WOMPI_PRIVKEY;

  static STATUS_MAP: any = {
    PENDING: "pending", // PENDING
    APPROVED: "approved", // APPROVED
    DECLINED: "reject", // REJECT
    VOIDED: "reject", // REJECT
    ERROR: "reject", // REJECT
  };

  async request(
    endpoint: string,
    method: string,
    data: any = null,
    key = this.pubKey
  ) {
    let options: any = {
      json: true,
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key,
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    console.log(options);
    let request = await fetch(
      "https://production.wompi.co/v1" + endpoint,
      options
    );

    let json = await request.json();

    return { result: json };
  }

  async getToken() {
    let { result }: any = await this.request(
      "/merchants/" + this.pubKey,
      "GET",
      null
    );
    const token = result.data.presigned_acceptance.acceptance_token;
    return token;
  }

  async createPaymentSource(token: string, email: string) {
    let body = {
      type: "CARD",
      token: token,
      customer_email: email,
      acceptance_token: await this.getToken(),
    };

    let { result }: any = await this.request(
      "/payment_sources",
      "POST",
      body,
      this.privateKey
    );

    console.log(result);
    if (!result?.data?.id) {
      console.log(result.error.messages);
      throw {};
    }

    return {
      id: result.data.id,
      status: result.data.status,
    };
  }

  async createOrder({ currency, token, transactionId, amount, email }: any) {
    const body = {
      amount_in_cents: amount * 100,
      currency: currency,
      reference: transactionId,
      acceptance_token: await this.getToken(),
      customer_email: email,
      payment_method: {
        type: "CARD",
        installments: 2, // Número de cuotas
      },
      payment_source_id: token,
    };

    let { result }: any = await this.request(
      "/transactions",
      "POST",
      body,
      this.privateKey
    );

    if (!result?.data?.id) {
      console.log(result.error.messages);
      throw {};
    }

    return {
      id: result.data.id,
      status: result.data.status,
    };
  }

  async getTransaction(transaction: any) {
    let { result }: any = await this.request(
      "/transactions/" + transaction.codeProvider,
      "GET"
    );
    if (!result || !result.data) {
      return {
        id: null,
        status: "pending",
      };
    }

    return {
      id: result.data.id,
      status: result.data.status,
    };
  }
}

export default Wompi;
