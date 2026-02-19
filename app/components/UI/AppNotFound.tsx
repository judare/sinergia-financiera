import Link from "next/link";

export default function () {
  return (
    <div className="bg-neutral-950 pt-32 pb-32 md:pb-32 border-0 rounded-3xl mb-20 relative overflow-hidden md:bg-cover bg-no-repeat bg-bottom bg-[length:60rem_auto]  text-white text-center">
      <h1 className="lg:text-4xl text-2xl font-bold">404 - Not found</h1>
      <p>This page doesn't exists.</p>
      <Link href="/" className="underline mt-5 block">
        Click here to come back
      </Link>
    </div>
  );
}
