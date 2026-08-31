import { useParams } from "react-router-dom";
import TripChat from "./TripChat";

function TripChatPage() {
  const { tripId } = useParams();

  return <TripChat tripId={tripId} />;
}

export default TripChatPage;