import { useOutletContext } from "react-router-dom";
import DiagnosticsPanel from "../../components/diagnostics/DiagnosticsPanel";

export default function DiagnosticsPage() {
  const { patient } = useOutletContext();
  return <DiagnosticsPanel patient={patient} />;
}
