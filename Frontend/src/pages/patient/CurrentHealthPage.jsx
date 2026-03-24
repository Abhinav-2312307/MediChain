import { useOutletContext } from "react-router-dom";

import CurrentHealthCard from "../../components/medical/CurrentHealthCard";

export default function CurrentHealthPage() {
  const { patient } = useOutletContext();

  return <CurrentHealthCard patient={patient} />;
}
