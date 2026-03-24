import { useOutletContext } from "react-router-dom";

import MedicalHistoryCard from "../../components/medical/MedicalHistoryCard";

export default function MedicalHistoryPage() {
  const { patient } = useOutletContext();

  return <MedicalHistoryCard patient={patient} />;
}
