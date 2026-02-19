import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

class Email {
  private sender = "hi@sinergia.co";

  async send(to: string, subject: string, component: any, context: any) {
    await resend.emails.send({
      from: this.sender,
      to,
      subject,
      react: component(context),
    });
  }
}

export default Email;
