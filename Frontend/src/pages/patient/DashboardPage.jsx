import { useOutletContext } from "react-router-dom";
import DashboardOverview from "../../components/dashboard/DashboardOverview";

export default function DashboardPage() {
  const { patient } = useOutletContext();
  return <DashboardOverview patient={patient} />;
}
