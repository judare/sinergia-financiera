"use client";
import {
  Twitter,
  Github,
  Linkedin,
  MessageSquare,
  AudioWaveform,
  PersonStanding,
} from "lucide-react";

const Footer = () => {
  const footerNav = [
    {
      title: "Producto",
      links: [
        {
          label: (
            <div className="flex items-center gap-2">
              <div className="text-white size-5 rounded-md bg-blue-500 flex items-center justify-center">
                <AudioWaveform className="size-4" />
              </div>
              <div>Agentes Humanos</div>
            </div>
          ),
          href: "/humans",
        },
        {
          label: (
            <div className="flex items-center gap-2">
              <div className="text-white size-5 rounded-md bg-indigo-500 flex items-center justify-center">
                <PersonStanding className="size-4" />
              </div>
              <div>Agentes IA</div>
            </div>
          ),
          href: "/",
        },
        { label: "Documentación", href: "/docs" },
        { label: "Precios", href: "/pricing" },
        { label: "Casos de uso", href: "#" },
      ],
    },
    {
      title: "Compañía",
      links: [
        { label: "Sobre nosotros", href: "/" },
        { label: "Blog", href: "#" },
        { label: "Carreras", href: "#" },
        { label: "Contactar a ventas", href: "https://wa.me/573222901435" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { label: "Centro de ayuda", href: "#" },
        { label: "Estado del servicio", href: "#" },
        { label: "API", href: "/integrations" },
        { label: "Socios", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Política de Privacidad", href: "/privacy" },
        { label: "Términos de Servicio", href: "/privacy" },
        { label: "Cookies", href: "/privacy" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://x.com/blokaycom", label: "Twitter" },
    { icon: Github, href: "https://github.com/talkiaco", label: "Github" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/100473702",
      label: "LinkedIn",
    },
    { icon: MessageSquare, href: "#", label: "Blog" },
  ];

  return (
    <footer className="relative overflow-hidden rounded-2xl bg-neutral-100 ">
      <div className="max-w-7xl mx-auto px-6 md:py-16 py-8 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:gap-8 lg:grid-cols-12">
          {/* Columna 1: Logo y Slogan */}
          <div className="lg:col-span-3">
            <a href="#" className="flex items-center space-x-2">
              <img src="/logo.svg" className="h-6 md:h-8" />
            </a>
          </div>

          {/* Columnas 2-5: Enlaces */}
          <div className="grid grid-cols-2 md:gap-8 gap-4 md:grid-cols-4 lg:col-span-9">
            {footerNav.map((section) => (
              <div key={section.title} className="text-xs md:text-sm">
                <h3 className=" text-gray-900 font-medium ">{section.title}</h3>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className=" font-light text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Barra inferior: Copyright y Redes Sociales */}
        <div className="mt-16 md:pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Talkia. Todos los derechos
            reservados.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
              >
                <span className="sr-only">{social.label}</span>
                <social.icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
