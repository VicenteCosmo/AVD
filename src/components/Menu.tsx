import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/admin",
      },
      {
        icon: "/student.png",
        label: "Funcionário",
        href: "/list/funciona",
      },
      {
        icon: "/lesson.png",
        label: "Dispensas",
        href: "/list/dispensas",
      },
      {
        icon: "/attendance.png",
        label: "Assiduidade",
        href: "/list/assiduidade",
      },
      {
        icon: "/treinamento.png",
        label: "Formações",
        href: "/list/get_courses",
      },
      {
        icon: "/diagrama.png",
        label: "Perfomance",
        href: "/list/Perfomance",
      },
    ],
  },
  {
    title: "OUTROS",
    items: [
      {
        icon: "/suporte-tecnico.png",
        label: "Suporte",
        href: "/Suporte",
      },
      {
        icon: "/setting.png",
        label: "Definições",
        href: "/Definições",
      },
      {
        icon: "/logout.png",
        label: "Sair",
        href: "/Sair",
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
