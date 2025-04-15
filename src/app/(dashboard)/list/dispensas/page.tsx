import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { lessonsData, role } from "@/lib/data";
import Image from "next/image";

type Lesson = {
  id: number;
  name:string;
  dispensa:string;
  date:number;
  dat:number;
  document:string;
};

const columns = [
  {
    header: "Nome do Funcionário",
    accessor: "name",
  },
  {
    header: "Tipo de Dispensa",
    accessor: "dispensa",
  },
  {
    header: "Inicio",
    accessor: "date",
  }
  ,
  {
    header: "Termino",
    accessor: "action",
  },
  {
    header: "Documento",
    accessor: "document",
  },
  ,
  {
    header: "Acções",
    accessor: "dat",
    
  },
 
];

const LessonListPage = () => {
  const renderRow = (item: Lesson) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td>{item.dispensa}</td>
      <td >{item.date}</td>
      <td >{item.dat}</td>
      <td >{item.document}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
             
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-3">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Dispensas</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={lessonsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default LessonListPage;
