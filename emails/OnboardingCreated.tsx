import { Layout } from "./Layout";

export default function OnboardingCreated(context: any) {
  return (
    <Layout>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">
          Un nuevo proceso de onboarding ha sido creado
        </h1>
        <p className="font-light text-neutral-500">
          Datos:
          <div>{context.onboarding?.processCode}</div>
          <div>{context.onboarding?.fullName}</div>
          <div>{context.onboarding?.documentType}</div>
        </p>
      </div>
    </Layout>
  );
}
