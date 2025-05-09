import { useUserCollection } from "../app/hooks/useUserCollection";
import TotalCard from "../components/myAccount/charts/TotalCard";
import CTRChart from "../components/myAccount/charts/CTRChart";

function MyAccount(): React.ReactElement {
  // const { isAuthenticated, user, collection } = useUserCollection();

  return (
    <>
      <div className="p-6">
        <div className="flex gap-6 w-full ">
          <TotalCard
            title="Total de enlaces"
            total={1300}
            description={"Enlaces totales creados hasta la fecha"}
          />

          <TotalCard
            total={20300}
            description={"Clicks hechos por los usuarios en tus enlaces"}
            title="Total de clicks"
          />
          <TotalCard
            total={10417}
            description={"Visitantes totaldes a tus enlaces"}
            title="Total de visitantes"
          />
          <TotalCard
            title="CTR"
            total={Number((20300 / 1300).toFixed(2))}
            description={"Tasa promedio de clicks por enlace"}
          />
        </div>

        <CTRChart />
      </div>
    </>
  );
}

export default MyAccount;
