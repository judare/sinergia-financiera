"use client";

export const Asset = function ({
  src,
  type,
  company,
  score,
}: {
  src: string;
  type?: "video" | "image";
  score: number;
  company: {
    name: string;
    logo: string;
  };
}) {
  return (
    <a href="/asset/1" className="flex flex-col items-center justify-center ">
      <div className="relative group ">
        <div className="absolute top-3 rounded-2xl right-5  text-white bg-black/30 px-5 py-2 uppercase backdrop-blur-lg text-xs shadow-2xl z-10 ">
          {type === "video" ? "Video" : "Imagen"}
        </div>

        <div className="overflow-hidden w-[300px] h-[250px] rounded-2xl relative hover:scale-105 transition-transform duration-300">
          <div
            className={`absolute -bottom-10 rounded-2xl right-5  text-white bg-black/30 px-5 py-2 uppercase backdrop-blur-lg text-xs shadow-2xl z-10 transition-all duration-300 group-hover:bottom-3`}
          >
            Score {score}%
          </div>
          {type === "video" ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={src} type="video/mp4" />
            </video>
          ) : (
            <img src={src} className="w-full h-full object-cover" />
          )}
        </div>
      </div>
      {company && (
        <div className="flex justify-start items-center w-full mt-3">
          <img
            src={company.logo}
            className="w-8 h-8 rounded-full"
            alt={company.name}
          />
          <span className="text-sm ml-2">{company.name}</span>
        </div>
      )}
    </a>
  );
};

export default function Hero() {
  return (
    <div
      className={` h-full flex-1 flex justify-center flex-col overflow-hidden  rounded-xl  text-black select-none relative pl-5 lg:pl-10 `}
    >
      <h2 className="text-2xl md:text-3xl xl:text-7xl text-center mt-auto mb-20 ">
        Descubre que mejorar <br /> de tus anuncios
      </h2>

      <div className="flex gap-3 items-center ">
        <Asset
          src="/a1.jpg"
          company={{ name: "Rappi", logo: "/c1.webp" }}
          score={75}
        />
        <Asset
          src="/a2.mp4"
          type="video"
          company={{ name: "NU Bank", logo: "/c2.webp" }}
          score={68}
        />
        <Asset
          src="/a3.jpg"
          company={{ name: "Kavak", logo: "/c3.webp" }}
          score={68}
        />
        <Asset
          src="/a4.jpg"
          company={{ name: "Bitso", logo: "/c4.webp" }}
          score={70}
        />
        <Asset
          src="/a5.jpg"
          company={{ name: "Claro", logo: "/c5.webp" }}
          score={80}
        />
      </div>
    </div>
  );
}
