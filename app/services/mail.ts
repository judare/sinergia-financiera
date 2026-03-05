import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

class Email {
  private sender = "sinergia@bemovil.net";

  async send(to: string, subject: string, component: any, context: any) {
    let result = await resend.emails.send({
      from: this.sender,
      to,
      subject,
      react: component(context),
    });
    console.log(result);
  }
}

export default Email;
