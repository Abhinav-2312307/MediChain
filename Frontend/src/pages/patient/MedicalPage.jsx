import { useOutletContext } from "react-router-dom";
import CurrentHealthCard from "../../components/medical/CurrentHealthCard";
import MedicalHistoryCard from "../../components/medical/MedicalHistoryCard";

export default function MedicalPage() {
  const { patient } = useOutletContext();

  return (
    <div className="space-y-6">
      <MedicalHistoryCard patient={patient} />
      <CurrentHealthCard patient={patient} />
    </div>
  );
}
