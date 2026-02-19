import { Layout, Button } from "./Layout";

export default function ForgotPassword(context: any) {
  return (
    <Layout>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">
          Hola {context.name}, Recupera tu contraseña
        </h1>
        <p className="font-light text-neutral-500">
          Alguien ha solicitado cambiar tu contraseña. Si es usted, haga clic en
          el botón de abajo para cambiar tu contraseña.
        </p>
      </div>

      <Button href={"https://talkia.co/recoverpassword/" + context.token}>
        Cambiar contraseña
      </Button>

      <p className="mt-5">Si no fuiste tú, por favor ignore este correo.</p>
    </Layout>
  );
}
