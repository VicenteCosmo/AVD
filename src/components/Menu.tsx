import { role } from "@/lib/data";
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
        visible: ["admin", "funcionario",],
      },
      {
        icon: "/student.png",
        label: "Funcionário",
        href: "/list/funciona",
        visible: ["admin"],
      },
      {
        icon: "/lesson.png",
        label: "Dispensas",
        href: "/list/dispensas",
        visible: ["admin", "funcionario"],
      },{
        icon: "/lesson.png",
        label: "Dispensas",
        href: "/list/minhaAssiduidade",
        visible: ["admin", "funcionario"],
      },
      {
        icon: "/plus.png",
        label: "Minha Assiduidade",
        href: "/list/minhaAssiduidade",
        visible: [ "student"],
      },
      {
        icon: "/attendance.png",
        label: "Assiduidade",
        href: "/list/assiduidade",
        visible: ["admin"],
      },
      {
        icon: "/treinamento.png",
        label: "Formações",
        href: "/get_courses",
        visible: ["admin", "funcionario"],
      },
      {
        icon: "/diagrama.png",
        label: "Perfomance",
        href: "/list/Perfomance",
        visible: ["admin", "funcionario"],
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
        visible: ["admin", "funcionario"],
      },
      {
        icon: "/setting.png",
        label: "Definições",
        href: "/Definições",
        visible: ["admin"],
      },
      {
        icon: "/logout.png",
        label: "Sair",
        href: "/Sair",
        visible: ["admin", "funcionario"],
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
            if (item.visible.includes(role)) {
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
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
