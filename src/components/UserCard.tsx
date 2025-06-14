// components/UserCardStats.tsx
import Image from "next/image";

interface UserCardStatsProps {
  title: string;
  value: number;
  iconSrc: string;
  bgColor?: string;
  badge?: string;
}

const UserCardStats = ({
  title,
  value,
  iconSrc,
  bgColor = "bg-blue-100",
  badge,
}: UserCardStatsProps) => {
  return (
    <div className={`rounded-xl ${bgColor} p-4 flex flex-col items-center shadow-md`}>
      {badge && (
        <span className="text-xs bg-gray-200 px-7 py-1 rounded-full mb-2">
          {badge}
        </span>
      )}
      <Image src={iconSrc} alt={title} width={40} height={40} className="mb-3" />
      <h1 className="text-3xl font-bold">{value}</h1>
      <p className="text-sm text-gray-700">{title}</p>
    </div>
  );
};

export default UserCardStats;
