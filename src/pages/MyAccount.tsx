import { useUserCollection } from "../app/hooks/useUserCollection";
import TotalCard from "../components/myAccount/charts/TotalCard";
import { UniqueChart } from "../components/myAccount/charts/UniqueChart";
import { CharTabs } from "../components/myAccount/CharTabs";
import CountUp from "react-countup";

function MyAccount(): React.ReactElement {
  const { isAuthenticated, user, collection } = useUserCollection();

  type Dato = { date: Date; link: string } | { date: Date; ip: string };

  const linkActivityHandler = (datos: Dato[] | undefined) => {
    const map = new Map<string, number>();

    datos?.forEach(({ date }) => {
      const key = new Date(date).toISOString().split("T")[0];
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([date, count]) => ({ date, enlaces: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  const linActivityData = linkActivityHandler(user?.LinkActivity);
  const clickAnalitycsData = linkActivityHandler(user?.clickAnalitycs);
  console.log(linActivityData);
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4">
        <TotalCard
          title="Total de enlaces"
          children={
            <CountUp end={collection.totalCount} decimals={0} duration={2} />
          }
          description={"Enlaces totales creados hasta la fecha"}
        />

        <TotalCard
          children={
            <CountUp
              end={user?.statistics.totalClicks}
              decimals={0}
              duration={2}
            />
          }
          description={"Clics hechos por los usuarios en tus enlaces"}
          title="Total de clics"
        />
        <TotalCard
          children={
            <CountUp
              end={user?.statistics.totalVisitors}
              decimals={0}
              duration={2}
            />
          }
          description={"Visitantes totaldes a tus enlaces"}
          title="Total de visitantes"
        />
        <TotalCard
          title="CTR"
          children={
            <CountUp
              end={Number(
                (user?.statistics.totalClicks / collection.totalCount).toFixed(
                  2
                )
              )}
              decimals={2}
              duration={2}
            />
          }
          description={"Tasa promedio de clics por enlace"}
        />
      </div>
      <CharTabs
        enlaces={
          <UniqueChart
            title="Resumen de enlaces"
            data={linActivityData}
            description="Mostrando estadisticas de enlaces creados"
            tipo="enlaces"
          />
        }
        clicks={
          <UniqueChart
            title="Resumen de clics"
            data={clickAnalitycsData}
            description="Mostrando estadisticas de clics"
            tipo="clics"
          />
        }
      />
    </div>
  );
}

export default MyAccount;
