import { useOutletContext } from "react-router-dom";
import PatientChat from "../../components/chat/PatientChat";

export default function ChatPage() {
  const { patient } = useOutletContext();
  return <PatientChat patient={patient} />;
}
