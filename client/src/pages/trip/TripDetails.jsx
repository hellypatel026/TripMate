// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../services/api";
// import useAuthStore from "../../store/authStore";
// function TripDetails() {

//     const { tripId } = useParams();
//     const user = useAuthStore((state) => state.user);
//     const [trip, setTrip] = useState(null);
//     const [showEditTrip, setShowEditTrip] = useState(false);

//     const [editTripData, setEditTripData] = useState({
//         name: "",
//         destination: "",
//         startDate: "",
//         endDate: ""
//     });
//     const [members, setMembers] = useState([]);
//     const [itinerary, setItinerary] = useState([]);
//     const [showItineraryForm, setShowItineraryForm] = useState(false);
//     const [editingItineraryId, setEditingItineraryId] = useState(null);
//     const [itineraryData, setItineraryData] = useState({
//         title: "",
//         description: "",
//         date: "",
//         startTime: "",
//         endTime: "",
//         location: ""
//     });
//     const [bookings, setBookings] = useState([]);
//     const [showBookingForm, setShowBookingForm] = useState(false);
//     const [editingBookingId, setEditingBookingId] = useState(null);
//     const [bookingData, setBookingData] = useState({
//         type: "hotel",
//         name: "",
//         bookingReference: "",
//         price: "",
//         status: "pending",
//         startDate: "",
//         endDate: "",
//         location: "",
//         documentUrl: ""
//     });
//     const [expenses, setExpenses] = useState([]);
//     const [editingExpenseId, setEditingExpenseId] = useState(null);
//     const [selectedParticipants, setSelectedParticipants] = useState([]);
//     const [participantValues, setParticipantValues] = useState({});
//     const [showExpenseForm, setShowExpenseForm] = useState(false);
//     const [expenseSummary, setExpenseSummary] = useState(null);
//     const [expenseData, setExpenseData] = useState({
//         title: "",
//         amount: "",
//         category: "food",
//         splitType: "equal",
//         paidBy: "",
//         description: ""
//     });
//     const [settlementData, setSettlementData] = useState({
//         from: "",
//         to: "",
//         amount: ""
//     });
//     const currentMember = members.find(
//         (member) =>
//             member.user?.email === user?.email
//     );

//     const isOwner = currentMember?.role === "owner";

//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [showAddMember, setShowAddMember] = useState(false);

//     const [memberData, setMemberData] = useState({
//         email: "",
//         role: "member"
//     });

//     const [settlements, setSettlements] = useState([]);
//     const [showSettlementForm, setShowSettlementForm] = useState(false);
//     // Fetch trip and members
//     useEffect(() => {

//         const fetchData = async () => {

//             try {

//                 setIsLoading(true);

//                 const tripResponse = await api.get(
//                     `/trips/${tripId}`
//                 );

//                 const memberResponse = await api.get(
//                     `/trip-members/${tripId}`
//                 );
//                 const itineraryResponse = await api.get(
//                     `/itinerary/${tripId}`
//                 );
//                 const bookingResponse = await api.get(
//                     `/bookings/${tripId}`
//                 );
//                 const expenseResponse = await api.get(
//                     `/expenses/${tripId}`
//                 );
//                 const summaryResponse = await api.get(
//                     `/expenses/${tripId}/summary`
//                 );
//                 const settlementResponse = await api.get(
//                     `/settlements/${tripId}`
//                 );
//                 setTrip(tripResponse.data.trip);
//                 setMembers(memberResponse.data.members);
//                 setSelectedParticipants(
//                     memberResponse.data.members.map(
//                         (member) => member.user._id
//                     )
//                 );
//                 setItinerary(itineraryResponse.data.itinerary);
//                 setBookings(bookingResponse.data.bookings);
//                 setExpenses(expenseResponse.data.expenses);
//                 setExpenseSummary(summaryResponse.data);

//                 setSettlements(settlementResponse.data.settlements);
//             } catch (error) {

//                 setError(
//                     error.response?.data?.message ||
//                     "Failed to fetch trip details"
//                 );

//             } finally {

//                 setIsLoading(false);

//             }
//         };

//         fetchData();

//     }, [tripId]);

//     const handleMemberChange = (e) => {

//         setMemberData({
//             ...memberData,
//             [e.target.name]: e.target.value
//         });

//     };

//     const handleAddMember = async (e) => {

//         e.preventDefault();

//         try {

//             const response = await api.post(
//                 `/trip-members/${tripId}`,
//                 memberData
//             );

//             alert(response.data.message);

//             // Refresh member list
//             const memberResponse = await api.get(
//                 `/trip-members/${tripId}`
//             );

//             setMembers(memberResponse.data.members);

//             setMemberData({
//                 email: "",
//                 role: "member"
//             });

//             setShowAddMember(false);

//         } catch (error) {

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to add member"
//             );

//         }

//     };
//     const handleRemoveMember = async (memberId) => {
//         const confirmed = window.confirm(
//             "Are you sure you want to remove this member from the trip?"
//         );

//         if (!confirmed) return;

//         try {
//             const response = await api.delete(
//                 `/trip-members/${tripId}/${memberId}`
//             );

//             alert(response.data.message);

//             setMembers(prev =>
//                 prev.filter(member => member.user?._id !== memberId)
//             );

//         } catch (error) {
//             console.error("Error removing member:", error);

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to remove member"
//             );
//         }
//     };
//     const handleItineraryChange = (e) => {

//         setItineraryData({
//             ...itineraryData,
//             [e.target.name]: e.target.value
//         });

//     };
//     const handleAddItinerary = async (e) => {

//         e.preventDefault();

//         try {

//             const response = await api.post(
//                 `/itinerary/${tripId}`,
//                 itineraryData
//             );

//             alert(response.data.message);

//             setItinerary((prev) => [
//                 ...prev,
//                 response.data.itinerary
//             ]);

//             setItineraryData({
//                 title: "",
//                 description: "",
//                 date: "",
//                 startTime: "",
//                 endTime: "",
//                 location: ""
//             });

//             setShowItineraryForm(false);

//         } catch (error) {

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to add itinerary"
//             );

//         }

//     };
//     const handleEditItinerary = async (id, updatedData) => {
//         try {
//             const response = await api.put(
//                 `/itinerary/${id}`,
//                 updatedData
//             );

//             alert(response.data.message);

//             setItinerary((prev) =>
//                 prev.map((activity) =>
//                     activity._id === id
//                         ? response.data.itinerary
//                         : activity
//                 )
//             );

//             setEditingItineraryId(null);

//         } catch (error) {
//             console.error(
//                 "EDIT ITINERARY ERROR:",
//                 error.response?.data || error.message
//             );

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to update itinerary"
//             );
//         }
//     };
//     const handleDeleteItinerary = async (id) => {
//         const confirmed = window.confirm(
//             "Are you sure you want to delete this itinerary activity?"
//         );

//         if (!confirmed) {
//             return;
//         }

//         try {
//             const response = await api.delete(
//                 `/itinerary/${id}`
//             );

//             alert(response.data.message);

//             setItinerary((prev) =>
//                 prev.filter((activity) => activity._id !== id)
//             );

//         } catch (error) {
//             console.error(
//                 "DELETE ITINERARY ERROR:",
//                 error.response?.data || error.message
//             );

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to delete itinerary"
//             );
//         }
//     };
//     const handleBookingChange = (e) => {
//         setBookingData({
//             ...bookingData,
//             [e.target.name]: e.target.value
//         });
//     };
//     const handleAddBooking = async (e) => {

//         e.preventDefault();

//         try {

//             const response = await api.post(
//                 `/bookings/${tripId}`,
//                 {
//                     ...bookingData,
//                     price: Number(bookingData.price)
//                 }
//             );

//             alert(response.data.message);

//             setBookings((prev) => [
//                 ...prev,
//                 response.data.booking
//             ]);

//             setBookingData({
//                 type: "hotel",
//                 name: "",
//                 bookingReference: "",
//                 price: "",
//                 status: "pending",
//                 startDate: "",
//                 endDate: "",
//                 location: "",
//                 documentUrl: ""
//             });

//             setShowBookingForm(false);

//         } catch (error) {

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to add booking"
//             );

//         }
//     };
//     const handleEditBooking = async (id, updatedData) => {
//         try {
//             const response = await api.put(
//                 `/bookings/${id}`,
//                 updatedData
//             );

//             alert(response.data.message);

//             setBookings((prev) =>
//                 prev.map((booking) =>
//                     booking._id === id
//                         ? response.data.booking
//                         : booking
//                 )
//             );

//             setEditingBookingId(null);

//         } catch (error) {
//             console.error(
//                 "EDIT BOOKING ERROR:",
//                 error.response?.data || error.message
//             );

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to update booking"
//             );
//         }
//     };
//     const handleDeleteBooking = async (id) => {
//         const confirmed = window.confirm(
//             "Are you sure you want to delete this booking?"
//         );

//         if (!confirmed) {
//             return;
//         }

//         try {
//             const response = await api.delete(
//                 `/bookings/${id}`
//             );

//             alert(response.data.message);

//             setBookings((prev) =>
//                 prev.filter((booking) => booking._id !== id)
//             );

//         } catch (error) {
//             console.error(
//                 "DELETE BOOKING ERROR:",
//                 error.response?.data || error.message
//             );

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to delete booking"
//             );
//         }
//     };
//     const handleExpenseChange = (e) => {
//         setExpenseData({
//             ...expenseData,
//             [e.target.name]: e.target.value
//         });
//     };
//     const handleParticipantChange = (userId) => {

//         setSelectedParticipants((prev) => {

//             if (prev.includes(userId)) {
//                 return prev.filter((id) => id !== userId);
//             }

//             return [...prev, userId];

//         });

//     };
//     const handleParticipantValueChange = (userId, value) => {

//         setParticipantValues((prev) => ({
//             ...prev,
//             [userId]: value
//         }));

//     };
//     const handleAddExpense = async (e) => {

//         e.preventDefault();

//         try {

//             let participants;

//             if (expenseData.splitType === "equal") {

//                 participants = selectedParticipants.map(
//                     (userId) => ({
//                         user: userId
//                     })
//                 );

//             } else if (expenseData.splitType === "exact") {

//                 participants = selectedParticipants.map(
//                     (userId) => ({
//                         user: userId,
//                         amount: Number(
//                             participantValues[userId] || 0
//                         )
//                     })
//                 );

//             } else if (expenseData.splitType === "percentage") {

//                 participants = selectedParticipants.map(
//                     (userId) => ({
//                         user: userId,
//                         percentage: Number(
//                             participantValues[userId] || 0
//                         )
//                     })
//                 );
//             }

//             const response = await api.post(
//                 `/expenses/${tripId}`,
//                 {
//                     ...expenseData,
//                     amount: Number(expenseData.amount),
//                     participants
//                 }
//             );

//             alert(response.data.message);

//             setExpenses((prev) => [
//                 ...prev,
//                 response.data.expense
//             ]);

//             setExpenseData({
//                 title: "",
//                 amount: "",
//                 category: "food",
//                 splitType: "equal",
//                 paidBy: "",
//                 description: ""
//             });

//             setSelectedParticipants([]);
//             setParticipantValues({});
//             setShowExpenseForm(false);

//         } catch (error) {

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to add expense"
//             );
//         }
//     };
//     const handleEditExpense = async (id, updatedData) => {
//         try {
//             const response = await api.put(`/expenses/${id}`, updatedData);

//             alert(response.data.message);

//             setExpenses(prev =>
//                 prev.map(expense =>
//                     expense._id === id
//                         ? response.data.expense
//                         : expense
//                 )
//             );

//             // Refresh summary because expense amount may have changed
//             const summaryResponse = await api.get(
//                 `/expenses/${tripId}/summary`
//             );

//             setExpenseSummary(summaryResponse.data);

//             setEditingExpenseId(null);

//         } catch (error) {
//             console.error("Error updating expense:", error);

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to update expense"
//             );
//         }
//     };


//     const handleDeleteExpense = async (id) => {
//         const confirmed = window.confirm(
//             "Are you sure you want to delete this expense?"
//         );

//         if (!confirmed) return;

//         try {
//             const response = await api.delete(`/expenses/${id}`);

//             alert(response.data.message);

//             setExpenses(prev =>
//                 prev.filter(expense => expense._id !== id)
//             );

//             // Refresh summary after deletion
//             const summaryResponse = await api.get(
//                 `/expenses/${tripId}/summary`
//             );

//             setExpenseSummary(summaryResponse.data);

//         } catch (error) {
//             console.error("Error deleting expense:", error);

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to delete expense"
//             );
//         }
//     };
//     const handleCreateSettlement = async () => {
//         try {
//             if (
//                 !settlementData.from ||
//                 !settlementData.to ||
//                 !settlementData.amount
//             ) {
//                 alert("Please fill all settlement fields");
//                 return;
//             }

//             if (settlementData.from === settlementData.to) {
//                 alert("Pay From and Pay To cannot be the same member");
//                 return;
//             }

//             const response = await api.post(
//                 `/settlements/${tripId}`,
//                 {
//                     from: settlementData.from,
//                     to: settlementData.to,
//                     amount: Number(settlementData.amount)
//                 }
//             );

//             console.log("CREATED SETTLEMENT:", response.data);

//             setSettlements((prev) => [
//                 ...prev,
//                 response.data.settlement
//             ]);

//             setSettlementData({
//                 from: "",
//                 to: "",
//                 amount: ""
//             });

//             setShowSettlementForm(false);

//             alert("Settlement created successfully");
//         } catch (error) {
//             console.error(
//                 "CREATE SETTLEMENT ERROR:",
//                 error.response?.data || error.message
//             );

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to create settlement"
//             );
//         }
//     };
//     const handleEditTrip = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await api.put(
//                 `/trips/${tripId}`,
//                 editTripData
//             );

//             alert(response.data.message);

//             setTrip(response.data.trip);

//             setShowEditTrip(false);

//         } catch (error) {
//             console.error(
//                 "EDIT TRIP ERROR:",
//                 error.response?.data || error.message
//             );

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to update trip"
//             );
//         }
//     };
//     const handleDeleteTrip = async () => {
//         const confirmed = window.confirm(
//             "Are you sure you want to delete this trip?"
//         );

//         if (!confirmed) {
//             return;
//         }

//         try {
//             await api.delete(`/trips/${tripId}`);

//             alert("Trip deleted successfully");

//             window.location.href = "/dashboard";

//         } catch (error) {
//             console.error(
//                 "DELETE TRIP ERROR:",
//                 error.response?.data || error.message
//             );

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to delete trip"
//             );
//         }
//     };
//     const handleMarkSettlementPaid = async (settlementId) => {
//         try {
//             const response = await api.put(
//                 `/settlements/${settlementId}/paid`
//             );

//             console.log("SETTLEMENT PAID:", response.data);

//             setSettlements((prev) =>
//                 prev.map((settlement) =>
//                     settlement._id === settlementId
//                         ? response.data.settlement
//                         : settlement
//                 )
//             );

//             alert("Settlement marked as paid");
//         } catch (error) {
//             console.error(
//                 "MARK SETTLEMENT PAID ERROR:",
//                 error.response?.data || error.message
//             );

//             alert(
//                 error.response?.data?.message ||
//                 "Failed to mark settlement as paid"
//             );
//         }
//     };
//     if (isLoading) {
//         return <p>Loading trip...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     if (!trip) {
//         return <p>Trip not found.</p>;
//     }

//     return (
//         <div>
//             <button
//                 onClick={() => {
//                     window.location.href = "/dashboard";
//                 }}
//             >
//                 ← Back to Dashboard
//             </button>

//             <br /><br />

//             <h1>{trip.name}</h1>

//             <p>
//                 Destination: {trip.destination}
//             </p>

//             <p>
//                 Start Date: {trip.startDate}
//             </p>

//             <p>
//                 End Date: {trip.endDate}
//             </p>
//             <button
//                 onClick={() => {
//                     window.location.href = `/trips/${tripId}/chat`;
//                 }}
//             >
//                 Open Trip Chat
//             </button>
//             <button
//                 onClick={() => {
//                     window.location.href = `/trips/${tripId}/gallery`;
//                 }}
//             >
//                 Open Gallery
//             </button>
//             <hr />
//             {isOwner && (
//                 <button onClick={() => {
//                     setEditTripData({
//                         name: trip.name || "",
//                         destination: trip.destination || "",
//                         startDate: trip.startDate
//                             ? trip.startDate.substring(0, 10)
//                             : "",
//                         endDate: trip.endDate
//                             ? trip.endDate.substring(0, 10)
//                             : ""
//                     });

//                     setShowEditTrip(!showEditTrip);
//                 }}>
//                     {showEditTrip ? "Cancel Edit" : "Edit Trip"}
//                 </button>
//             )}
//             {showEditTrip && (
//                 <div>
//                     <h3>Edit Trip</h3>

//                     <form onSubmit={handleEditTrip}>

//                         <input
//                             type="text"
//                             value={editTripData.name}
//                             onChange={(e) =>
//                                 setEditTripData({
//                                     ...editTripData,
//                                     name: e.target.value
//                                 })
//                             }
//                             placeholder="Trip name"
//                             required
//                         />

//                         <br /><br />

//                         <input
//                             type="text"
//                             value={editTripData.destination}
//                             onChange={(e) =>
//                                 setEditTripData({
//                                     ...editTripData,
//                                     destination: e.target.value
//                                 })
//                             }
//                             placeholder="Destination"
//                             required
//                         />

//                         <br /><br />

//                         <label>Start Date</label>
//                         <br />

//                         <input
//                             type="date"
//                             value={editTripData.startDate}
//                             onChange={(e) =>
//                                 setEditTripData({
//                                     ...editTripData,
//                                     startDate: e.target.value
//                                 })
//                             }
//                             required
//                         />

//                         <br /><br />

//                         <label>End Date</label>
//                         <br />

//                         <input
//                             type="date"
//                             value={editTripData.endDate}
//                             onChange={(e) =>
//                                 setEditTripData({
//                                     ...editTripData,
//                                     endDate: e.target.value
//                                 })
//                             }
//                             required
//                         />

//                         <br /><br />

//                         <button type="submit">
//                             Save Changes
//                         </button>

//                     </form>
//                 </div>
//             )}
//             {isOwner && (
//                 <button onClick={handleDeleteTrip}>
//                     Delete Trip
//                 </button>
//             )}




//             <h2>Trip Members</h2>

//             {isOwner && (
//                 <button
//                     onClick={() => setShowAddMember(!showAddMember)}
//                 >
//                     {showAddMember ? "Cancel" : "Add Member"}
//                 </button>
//             )}

//             {showAddMember && (
//                 <div>

//                     <h3>Add Member</h3>

//                     <form onSubmit={handleAddMember}>

//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Member email"
//                             value={memberData.email}
//                             onChange={handleMemberChange}
//                             required
//                         />

//                         <br /><br />

//                         <select
//                             name="role"
//                             value={memberData.role}
//                             onChange={handleMemberChange}
//                         >
//                             <option value="member">
//                                 Member
//                             </option>

//                             <option value="co-organizer">
//                                 Co-organizer
//                             </option>
//                         </select>

//                         <br /><br />

//                         <button type="submit">
//                             Add Member
//                         </button>

//                     </form>

//                 </div>
//             )}

//             <br />

//             {members.length === 0 ? (
//                 <p>No members found.</p>
//             ) : (

//                 <div>

//                     {members.map((member) => (

//                         <div key={member._id}>

//                             <h3>
//                                 {member.user.name}
//                             </h3>

//                             <p>
//                                 Email: {member.user.email}
//                             </p>

//                             <p>
//                                 Role: {member.role}
//                             </p>
//                             {isOwner && member.role !== "owner" && (
//                                 <button
//                                     onClick={() =>
//                                         handleRemoveMember(member.user?._id)
//                                     }
//                                 >
//                                     Remove Member
//                                 </button>
//                             )}

//                             <hr />

//                         </div>

//                     ))}

//                 </div>

//             )}

//             <hr />

//             <h2>Itinerary</h2>

//             <button
//                 onClick={() =>
//                     setShowItineraryForm(!showItineraryForm)
//                 }
//             >
//                 {showItineraryForm
//                     ? "Cancel"
//                     : "Add Activity"}
//             </button>

//             {showItineraryForm && (
//                 <div>

//                     <h3>Add Itinerary Activity</h3>

//                     <form onSubmit={handleAddItinerary}>

//                         <input
//                             type="text"
//                             name="title"
//                             placeholder="Activity title"
//                             value={itineraryData.title}
//                             onChange={handleItineraryChange}
//                             required
//                         />

//                         <br /><br />

//                         <textarea
//                             name="description"
//                             placeholder="Description"
//                             value={itineraryData.description}
//                             onChange={handleItineraryChange}
//                         />

//                         <br /><br />

//                         <label>Date</label>
//                         <br />

//                         <input
//                             type="date"
//                             name="date"
//                             value={itineraryData.date}
//                             onChange={handleItineraryChange}
//                             required
//                         />

//                         <br /><br />

//                         <label>Start Time</label>
//                         <br />

//                         <input
//                             type="time"
//                             name="startTime"
//                             value={itineraryData.startTime}
//                             onChange={handleItineraryChange}
//                         />

//                         <br /><br />

//                         <label>End Time</label>
//                         <br />

//                         <input
//                             type="time"
//                             name="endTime"
//                             value={itineraryData.endTime}
//                             onChange={handleItineraryChange}
//                         />

//                         <br /><br />

//                         <input
//                             type="text"
//                             name="location"
//                             placeholder="Location"
//                             value={itineraryData.location}
//                             onChange={handleItineraryChange}
//                         />

//                         <br /><br />

//                         <button type="submit">
//                             Add Activity
//                         </button>

//                     </form>

//                 </div>
//             )}

//             <br />

//             {itinerary.length === 0 ? (
//                 <p>No itinerary activities yet.</p>
//             ) : (
//                 <div>

//                     {itinerary.map((activity) => (
//                         <div key={activity._id}>

//                             {editingItineraryId === activity._id ? (
//                                 <div>

//                                     <h3>Edit Activity</h3>

//                                     <input
//                                         type="text"
//                                         defaultValue={activity.title}
//                                         id={`title-${activity._id}`}
//                                         placeholder="Activity title"
//                                     />

//                                     <br /><br />

//                                     <textarea
//                                         defaultValue={activity.description}
//                                         id={`description-${activity._id}`}
//                                         placeholder="Description"
//                                     />

//                                     <br /><br />

//                                     <label>Date</label>
//                                     <br />

//                                     <input
//                                         type="date"
//                                         defaultValue={
//                                             activity.date
//                                                 ? activity.date.substring(0, 10)
//                                                 : ""
//                                         }
//                                         id={`date-${activity._id}`}
//                                     />

//                                     <br /><br />

//                                     <label>Start Time</label>
//                                     <br />

//                                     <input
//                                         type="time"
//                                         defaultValue={activity.startTime || ""}
//                                         id={`startTime-${activity._id}`}
//                                     />

//                                     <br /><br />

//                                     <label>End Time</label>
//                                     <br />

//                                     <input
//                                         type="time"
//                                         defaultValue={activity.endTime || ""}
//                                         id={`endTime-${activity._id}`}
//                                     />

//                                     <br /><br />

//                                     <input
//                                         type="text"
//                                         defaultValue={activity.location}
//                                         id={`location-${activity._id}`}
//                                         placeholder="Location"
//                                     />

//                                     <br /><br />

//                                     <button
//                                         onClick={() =>
//                                             handleEditItinerary(activity._id, {
//                                                 title: document.getElementById(
//                                                     `title-${activity._id}`
//                                                 ).value,

//                                                 description: document.getElementById(
//                                                     `description-${activity._id}`
//                                                 ).value,

//                                                 date: document.getElementById(
//                                                     `date-${activity._id}`
//                                                 ).value,

//                                                 startTime: document.getElementById(
//                                                     `startTime-${activity._id}`
//                                                 ).value,

//                                                 endTime: document.getElementById(
//                                                     `endTime-${activity._id}`
//                                                 ).value,

//                                                 location: document.getElementById(
//                                                     `location-${activity._id}`
//                                                 ).value
//                                             })
//                                         }
//                                     >
//                                         Save Changes
//                                     </button>

//                                     <button
//                                         onClick={() =>
//                                             setEditingItineraryId(null)
//                                         }
//                                     >
//                                         Cancel
//                                     </button>

//                                 </div>
//                             ) : (
//                                 <div>

//                                     <h3>{activity.title}</h3>

//                                     <p>
//                                         {activity.description}
//                                     </p>

//                                     <p>
//                                         Date: {activity.date}
//                                     </p>

//                                     <p>
//                                         Time: {activity.startTime}
//                                         {" - "}
//                                         {activity.endTime}
//                                     </p>

//                                     <p>
//                                         Location: {activity.location}
//                                     </p>

//                                     <button
//                                         onClick={() =>
//                                             setEditingItineraryId(activity._id)
//                                         }
//                                     >
//                                         Edit
//                                     </button>

//                                     <button
//                                         onClick={() =>
//                                             handleDeleteItinerary(activity._id)
//                                         }
//                                     >
//                                         Delete
//                                     </button>

//                                     <hr />

//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                     <hr />

//                     <h2>Bookings</h2>

//                     <button
//                         onClick={() =>
//                             setShowBookingForm(!showBookingForm)
//                         }
//                     >
//                         {showBookingForm
//                             ? "Cancel"
//                             : "Add Booking"}
//                     </button>

//                     {showBookingForm && (
//                         <div>

//                             <h3>Add Booking</h3>

//                             <form onSubmit={handleAddBooking}>

//                                 <label>Type</label>
//                                 <br />

//                                 <select
//                                     name="type"
//                                     value={bookingData.type}
//                                     onChange={handleBookingChange}
//                                 >
//                                     <option value="hotel">Hotel</option>
//                                     <option value="flight">Flight</option>
//                                     <option value="train">Train</option>
//                                     <option value="bus">Bus</option>
//                                     <option value="taxi">Taxi</option>
//                                     <option value="other">Other</option>
//                                 </select>

//                                 <br /><br />

//                                 <input
//                                     type="text"
//                                     name="name"
//                                     placeholder="Booking name"
//                                     value={bookingData.name}
//                                     onChange={handleBookingChange}
//                                     required
//                                 />

//                                 <br /><br />

//                                 <input
//                                     type="text"
//                                     name="bookingReference"
//                                     placeholder="Booking reference"
//                                     value={bookingData.bookingReference}
//                                     onChange={handleBookingChange}
//                                 />

//                                 <br /><br />

//                                 <input
//                                     type="number"
//                                     name="price"
//                                     placeholder="Price"
//                                     min="0"
//                                     value={bookingData.price}
//                                     onChange={handleBookingChange}
//                                 />

//                                 <br /><br />

//                                 <label>Status</label>
//                                 <br />

//                                 <select
//                                     name="status"
//                                     value={bookingData.status}
//                                     onChange={handleBookingChange}
//                                 >
//                                     <option value="pending">Pending</option>
//                                     <option value="confirmed">Confirmed</option>
//                                     <option value="cancelled">Cancelled</option>
//                                 </select>

//                                 <br /><br />

//                                 <label>Start Date</label>
//                                 <br />

//                                 <input
//                                     type="date"
//                                     name="startDate"
//                                     value={bookingData.startDate}
//                                     onChange={handleBookingChange}
//                                 />

//                                 <br /><br />

//                                 <label>End Date</label>
//                                 <br />

//                                 <input
//                                     type="date"
//                                     name="endDate"
//                                     value={bookingData.endDate}
//                                     onChange={handleBookingChange}
//                                 />

//                                 <br /><br />

//                                 <input
//                                     type="text"
//                                     name="location"
//                                     placeholder="Location"
//                                     value={bookingData.location}
//                                     onChange={handleBookingChange}
//                                 />

//                                 <br /><br />

//                                 <input
//                                     type="text"
//                                     name="documentUrl"
//                                     placeholder="Document URL"
//                                     value={bookingData.documentUrl}
//                                     onChange={handleBookingChange}
//                                 />

//                                 <br /><br />

//                                 <button type="submit">
//                                     Add Booking
//                                 </button>

//                             </form>

//                         </div>
//                     )}

//                     <br />

//                     {bookings.length === 0 ? (
//                         <p>No bookings yet.</p>
//                     ) : (
//                         <div>

//                             {bookings.map((booking) => (
//                                 <div key={booking._id} className="booking-card">

//                                     {editingBookingId === booking._id ? (
//                                         // EDIT MODE
//                                         <form
//                                             onSubmit={(e) => {
//                                                 e.preventDefault();

//                                                 const formData = new FormData(e.target);

//                                                 const updatedData = {
//                                                     type: formData.get("type"),
//                                                     name: formData.get("name"),
//                                                     bookingReference: formData.get("bookingReference"),
//                                                     price: Number(formData.get("price")),
//                                                     status: formData.get("status"),
//                                                     startDate: formData.get("startDate"),
//                                                     endDate: formData.get("endDate"),
//                                                     location: formData.get("location"),
//                                                     documentUrl: formData.get("documentUrl")
//                                                 };

//                                                 handleEditBooking(booking._id, updatedData);
//                                             }}
//                                         >
//                                             <input
//                                                 name="type"
//                                                 defaultValue={booking.type}
//                                                 placeholder="Booking Type"
//                                             />

//                                             <input
//                                                 name="name"
//                                                 defaultValue={booking.name}
//                                                 placeholder="Booking Name"
//                                                 required
//                                             />

//                                             <input
//                                                 name="bookingReference"
//                                                 defaultValue={booking.bookingReference}
//                                                 placeholder="Booking Reference"
//                                             />

//                                             <input
//                                                 name="price"
//                                                 type="number"
//                                                 step="0.01"
//                                                 defaultValue={booking.price}
//                                                 placeholder="Price"
//                                             />

//                                             <select
//                                                 name="status"
//                                                 defaultValue={booking.status}
//                                             >
//                                                 <option value="pending">Pending</option>
//                                                 <option value="confirmed">Confirmed</option>
//                                                 <option value="cancelled">Cancelled</option>
//                                             </select>

//                                             <input
//                                                 name="startDate"
//                                                 type="date"
//                                                 defaultValue={
//                                                     booking.startDate
//                                                         ? booking.startDate.split("T")[0]
//                                                         : ""
//                                                 }
//                                             />

//                                             <input
//                                                 name="endDate"
//                                                 type="date"
//                                                 defaultValue={
//                                                     booking.endDate
//                                                         ? booking.endDate.split("T")[0]
//                                                         : ""
//                                                 }
//                                             />

//                                             <input
//                                                 name="location"
//                                                 defaultValue={booking.location}
//                                                 placeholder="Location"
//                                             />

//                                             <input
//                                                 name="documentUrl"
//                                                 defaultValue={booking.documentUrl}
//                                                 placeholder="Document URL"
//                                             />

//                                             <button type="submit">
//                                                 Save
//                                             </button>

//                                             <button
//                                                 type="button"
//                                                 onClick={() => setEditingBookingId(null)}
//                                             >
//                                                 Cancel
//                                             </button>
//                                         </form>
//                                     ) : (
//                                         // NORMAL MODE
//                                         <>
//                                             <h3>{booking.name}</h3>

//                                             <p>
//                                                 <strong>Type:</strong> {booking.type}
//                                             </p>

//                                             <p>
//                                                 <strong>Reference:</strong>{" "}
//                                                 {booking.bookingReference || "N/A"}
//                                             </p>

//                                             <p>
//                                                 <strong>Price:</strong> ₹{booking.price}
//                                             </p>

//                                             <p>
//                                                 <strong>Status:</strong> {booking.status}
//                                             </p>

//                                             <p>
//                                                 <strong>Start Date:</strong>{" "}
//                                                 {booking.startDate
//                                                     ? new Date(booking.startDate).toLocaleDateString()
//                                                     : "N/A"}
//                                             </p>

//                                             <p>
//                                                 <strong>End Date:</strong>{" "}
//                                                 {booking.endDate
//                                                     ? new Date(booking.endDate).toLocaleDateString()
//                                                     : "N/A"}
//                                             </p>

//                                             <p>
//                                                 <strong>Location:</strong>{" "}
//                                                 {booking.location || "N/A"}
//                                             </p>

//                                             {booking.documentUrl && (
//                                                 <p>
//                                                     <strong>Document:</strong>{" "}
//                                                     <a
//                                                         href={booking.documentUrl}
//                                                         target="_blank"
//                                                         rel="noreferrer"
//                                                     >
//                                                         View Document
//                                                     </a>
//                                                 </p>
//                                             )}

//                                             <button
//                                                 onClick={() => setEditingBookingId(booking._id)}
//                                             >
//                                                 Edit
//                                             </button>

//                                             <button
//                                                 onClick={() => handleDeleteBooking(booking._id)}
//                                             >
//                                                 Delete
//                                             </button>
//                                         </>
//                                     )}
//                                 </div>
//                             ))}

//                         </div>
//                     )}

//                 </div>
//             )}
//             <hr />

//             <h2>Expenses</h2>

//             <button
//                 onClick={() =>
//                     setShowExpenseForm(!showExpenseForm)
//                 }
//             >
//                 {showExpenseForm
//                     ? "Cancel"
//                     : "Add Expense"}
//             </button>

//             {showExpenseForm && (
//                 <div>

//                     <h3>Add Expense</h3>

//                     <form onSubmit={handleAddExpense}>

//                         <input
//                             type="text"
//                             name="title"
//                             placeholder="Expense title"
//                             value={expenseData.title}
//                             onChange={handleExpenseChange}
//                             required
//                         />

//                         <br /><br />

//                         <input
//                             type="number"
//                             name="amount"
//                             placeholder="Amount"
//                             min="0.01"
//                             step="0.01"
//                             value={expenseData.amount}
//                             onChange={handleExpenseChange}
//                             required
//                         />

//                         <br /><br />

//                         <label>Category</label>
//                         <br />

//                         <select
//                             name="category"
//                             value={expenseData.category}
//                             onChange={handleExpenseChange}
//                         >
//                             <option value="food">Food</option>
//                             <option value="hotel">Hotel</option>
//                             <option value="transport">Transport</option>
//                             <option value="shopping">Shopping</option>
//                             <option value="activity">Activity</option>
//                             <option value="other">Other</option>
//                         </select>

//                         <br /><br />

//                         <label>Paid By</label>
//                         <br />

//                         <select
//                             name="paidBy"
//                             value={expenseData.paidBy}
//                             onChange={handleExpenseChange}
//                             required
//                         >
//                             <option value="">
//                                 Select member
//                             </option>

//                             {members.map((member) => (
//                                 <option
//                                     key={member.user._id}
//                                     value={member.user._id}
//                                 >
//                                     {member.user.name}
//                                 </option>
//                             ))}
//                         </select>

//                         <br />

//                         <label>Split Between</label>

//                         <br />

//                         {members.map((member) => (

//                             <div key={member.user._id}>

//                                 <label>

//                                     <input
//                                         type="checkbox"
//                                         checked={selectedParticipants.includes(
//                                             member.user._id
//                                         )}
//                                         onChange={() =>
//                                             handleParticipantChange(
//                                                 member.user._id
//                                             )
//                                         }
//                                     />

//                                     {" "}

//                                     {member.user.name}

//                                 </label>

//                                 {selectedParticipants.includes(member.user._id) &&
//                                     expenseData.splitType === "exact" && (

//                                         <input
//                                             type="number"
//                                             min="0"
//                                             step="0.01"
//                                             placeholder="Amount"
//                                             value={
//                                                 participantValues[
//                                                 member.user._id
//                                                 ] || ""
//                                             }
//                                             onChange={(e) =>
//                                                 handleParticipantValueChange(
//                                                     member.user._id,
//                                                     e.target.value
//                                                 )
//                                             }
//                                         />
//                                     )}

//                                 {selectedParticipants.includes(member.user._id) &&
//                                     expenseData.splitType === "percentage" && (

//                                         <input
//                                             type="number"
//                                             min="0.01"
//                                             max="100"
//                                             step="0.01"
//                                             placeholder="Percentage"
//                                             value={
//                                                 participantValues[
//                                                 member.user._id
//                                                 ] || ""
//                                             }
//                                             onChange={(e) =>
//                                                 handleParticipantValueChange(
//                                                     member.user._id,
//                                                     e.target.value
//                                                 )
//                                             }
//                                         />
//                                     )}

//                             </div>

//                         ))}
//                         <br /><br />
//                         <label>Split Type</label>
//                         <br />

//                         <select
//                             name="splitType"
//                             value={expenseData.splitType}
//                             onChange={handleExpenseChange}
//                         >
//                             <option value="equal">
//                                 Equal
//                             </option>

//                             <option value="exact">
//                                 Exact
//                             </option>

//                             <option value="percentage">
//                                 Percentage
//                             </option>
//                         </select>

//                         <br /><br />

//                         <textarea
//                             name="description"
//                             placeholder="Description"
//                             value={expenseData.description}
//                             onChange={handleExpenseChange}
//                         />

//                         <br /><br />

//                         <button type="submit">
//                             Add Expense
//                         </button>

//                     </form>

//                 </div>
//             )}

//             <br />

//             {expenses.length === 0 ? (
//                 <p>No expenses yet.</p>
//             ) : (
//                 <div>

//                     {expenses.map((expense) => (
//                         <div key={expense._id} className="expense-card">

//                             {editingExpenseId === expense._id ? (
//                                 // EDIT MODE
//                                 <form
//                                     onSubmit={(e) => {
//                                         e.preventDefault();

//                                         const formData = new FormData(e.target);

//                                         const updatedData = {
//                                             title: formData.get("title"),
//                                             amount: Number(formData.get("amount")),
//                                             category: formData.get("category"),
//                                             description: formData.get("description")
//                                         };

//                                         handleEditExpense(
//                                             expense._id,
//                                             updatedData
//                                         );
//                                     }}
//                                 >
//                                     <input
//                                         name="title"
//                                         defaultValue={expense.title}
//                                         placeholder="Expense title"
//                                         required
//                                     />

//                                     <input
//                                         name="amount"
//                                         type="number"
//                                         step="0.01"
//                                         min="0.01"
//                                         defaultValue={expense.amount}
//                                         placeholder="Amount"
//                                         required
//                                     />

//                                     <select
//                                         name="category"
//                                         defaultValue={expense.category}
//                                     >
//                                         <option value="food">Food</option>
//                                         <option value="hotel">Hotel</option>
//                                         <option value="transport">Transport</option>
//                                         <option value="shopping">Shopping</option>
//                                         <option value="activity">Activity</option>
//                                         <option value="other">Other</option>
//                                     </select>

//                                     <textarea
//                                         name="description"
//                                         defaultValue={expense.description || ""}
//                                         placeholder="Description"
//                                     />

//                                     <button type="submit">
//                                         Save
//                                     </button>

//                                     <button
//                                         type="button"
//                                         onClick={() => setEditingExpenseId(null)}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </form>
//                             ) : (
//                                 // NORMAL MODE
//                                 <>
//                                     <h3>{expense.title}</h3>

//                                     <p>
//                                         <strong>Amount:</strong> ₹{expense.amount}
//                                     </p>

//                                     <p>
//                                         <strong>Category:</strong>{" "}
//                                         {expense.category}
//                                     </p>

//                                     <p>
//                                         <strong>Paid By:</strong>{" "}
//                                         {expense.paidBy?.name ||
//                                             expense.paidBy?.email ||
//                                             "Unknown"}
//                                     </p>

//                                     <p>
//                                         <strong>Split Type:</strong>{" "}
//                                         {expense.splitType}
//                                     </p>

//                                     {expense.description && (
//                                         <p>
//                                             <strong>Description:</strong>{" "}
//                                             {expense.description}
//                                         </p>
//                                     )}

//                                     <button
//                                         onClick={() =>
//                                             setEditingExpenseId(expense._id)
//                                         }
//                                     >
//                                         Edit
//                                     </button>

//                                     <button
//                                         onClick={() =>
//                                             handleDeleteExpense(expense._id)
//                                         }
//                                     >
//                                         Delete
//                                     </button>
//                                 </>
//                             )}

//                         </div>
//                     ))}

//                 </div>
//             )}
//             <hr />

//             <h2>Expense Summary</h2>

//             {expenseSummary && (
//                 <div>

//                     <h3>
//                         Total Trip Expenses: ₹
//                         {expenseSummary.totalExpense}
//                     </h3>

//                     <h3>Member Payments</h3>

//                     {expenseSummary.memberPayments.map((item) => (

//                         <div key={item.user._id}>

//                             <p>
//                                 {item.user.name}
//                                 {" → "}
//                                 Paid ₹{item.paid}
//                             </p>

//                         </div>

//                     ))}

//                     <h3>Balances</h3>

//                     {expenseSummary.balances.map((item) => (

//                         <div key={item.user._id}>

//                             <p>
//                                 <strong>
//                                     {item.user.name}
//                                 </strong>

//                                 {" : ₹"}

//                                 {Math.abs(item.balance)}

//                                 {" — "}

//                                 {item.status === "receive" &&
//                                     "should receive"}

//                                 {item.status === "owe" &&
//                                     "owes"}

//                                 {item.status === "settled" &&
//                                     "settled"}
//                             </p>

//                         </div>

//                     ))}

//                 </div>
//             )}
//             <hr />

//             <h2>Settlements</h2>
//             <button onClick={() => setShowSettlementForm(!showSettlementForm)}>
//                 {showSettlementForm ? "Cancel" : "Create Settlement"}
//             </button>
//             {showSettlementForm && (
//                 <div>
//                     <h3>New Settlement</h3>

//                     <label>Pay From:</label>
//                     <select
//                         value={settlementData.from}
//                         onChange={(e) =>
//                             setSettlementData({
//                                 ...settlementData,
//                                 from: e.target.value
//                             })
//                         }
//                     >
//                         <option value="">Select member</option>

//                         {members.map((member) => (
//                             <option
//                                 key={member.user._id}
//                                 value={member.user._id}
//                             >
//                                 {member.user.name}
//                             </option>
//                         ))}
//                     </select>

//                     <br /><br />

//                     <label>Pay To:</label>
//                     <select
//                         value={settlementData.to}
//                         onChange={(e) =>
//                             setSettlementData({
//                                 ...settlementData,
//                                 to: e.target.value
//                             })
//                         }
//                     >
//                         <option value="">Select member</option>

//                         {members.map((member) => (
//                             <option
//                                 key={member.user._id}
//                                 value={member.user._id}
//                             >
//                                 {member.user.name}
//                             </option>
//                         ))}
//                     </select>

//                     <br /><br />

//                     <label>Amount:</label>
//                     <input
//                         type="number"
//                         step="0.01"
//                         min="0.01"
//                         value={settlementData.amount}
//                         onChange={(e) =>
//                             setSettlementData({
//                                 ...settlementData,
//                                 amount: e.target.value
//                             })
//                         }
//                         placeholder="Enter amount"
//                     />

//                     <br /><br />

//                     <button onClick={handleCreateSettlement}>
//                         Create Settlement
//                     </button>
//                 </div>
//             )}
//             {settlements.length === 0 ? (
//                 <p>No settlements yet.</p>
//             ) : (
//                 settlements.map((settlement) => (
//                     <div key={settlement._id}>
//                         <p>
//                             <strong>
//                                 {settlement.from?.name}
//                             </strong>{" "}
//                             pays{" "}
//                             <strong>
//                                 {settlement.to?.name}
//                             </strong>{" "}
//                             ₹{settlement.amount}
//                         </p>

//                         <p>
//                             Status: {settlement.status}
//                         </p>
//                         {settlement.status === "pending" && (
//                             <button onClick={() => handleMarkSettlementPaid(settlement._id)}>
//                                 Mark as Paid
//                             </button>
//                         )}
//                     </div>
//                 ))
//             )}

//         </div>
//     );
// }

// export default TripDetails;

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import TravelBackground from "../../components/TravelBackground";
import "./TripDetails.css";

function TripDetails() {
    const { tripId } = useParams();
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [trip, setTrip] = useState(null);
    const [members, setMembers] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [showEditTrip, setShowEditTrip] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);

    const [editTripData, setEditTripData] = useState({
        name: "",
        destination: "",
        startDate: "",
        endDate: ""
    });

    const [memberData, setMemberData] = useState({
        email: "",
        role: "member"
    });

    const currentMember = members.find(
        (member) => member.user?.email === user?.email
    );

    const isOwner = currentMember?.role === "owner";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError("");

                const [tripResponse, memberResponse] = await Promise.all([
                    api.get(`/trips/${tripId}`),
                    api.get(`/trip-members/${tripId}`)
                ]);

                setTrip(tripResponse.data.trip);
                setMembers(memberResponse.data.members);
            } catch (error) {
                console.error("Error fetching trip details:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to fetch trip details"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [tripId]);

    const formatDate = (date) => {
        if (!date) return "Not set";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    const handleMemberChange = (e) => {
        setMemberData({
            ...memberData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddMember = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                `/trip-members/${tripId}`,
                memberData
            );

            alert(response.data.message);

            const memberResponse = await api.get(
                `/trip-members/${tripId}`
            );

            setMembers(memberResponse.data.members);

            setMemberData({
                email: "",
                role: "member"
            });

            setShowAddMember(false);
        } catch (error) {
            console.error("Error adding member:", error);

            alert(
                error.response?.data?.message ||
                "Failed to add member"
            );
        }
    };

    const handleRemoveMember = async (memberId) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this member from the trip?"
        );

        if (!confirmed) return;

        try {
            const response = await api.delete(
                `/trip-members/${tripId}/${memberId}`
            );

            alert(response.data.message);

            setMembers((prev) =>
                prev.filter(
                    (member) => member.user?._id !== memberId
                )
            );
        } catch (error) {
            console.error("Error removing member:", error);

            alert(
                error.response?.data?.message ||
                "Failed to remove member"
            );
        }
    };

    const openEditTrip = () => {
        setEditTripData({
            name: trip.name || "",
            destination: trip.destination || "",
            startDate: trip.startDate
                ? trip.startDate.substring(0, 10)
                : "",
            endDate: trip.endDate
                ? trip.endDate.substring(0, 10)
                : ""
        });

        setShowEditTrip(true);
    };

    const handleEditTrip = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(
                `/trips/${tripId}`,
                editTripData
            );

            alert(response.data.message);

            setTrip(response.data.trip);
            setShowEditTrip(false);
        } catch (error) {
            console.error("Error updating trip:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update trip"
            );
        }
    };

    const handleDeleteTrip = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trip?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/trips/${tripId}`);

            alert("Trip deleted successfully");

            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Error deleting trip:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete trip"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="trip-details-state">
                <div className="trip-state-icon">✈</div>
                <h2>Loading trip...</h2>
                <p>Getting everything ready for your journey.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="trip-details-state">
                <div className="trip-state-icon">!</div>
                <h2>Something went wrong</h2>
                <p>{error}</p>

                <Link
                    to="/dashboard"
                    className="trip-state-button"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="trip-details-state">
                <div className="trip-state-icon">?</div>
                <h2>Trip not found</h2>

                <Link
                    to="/dashboard"
                    className="trip-state-button"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="trip-details-page">
            <TravelBackground />

            {/* =========================
                NAVBAR
            ========================= */}
            <header className="trip-details-navbar">
                <Link to="/" className="trip-details-brand">
                    <span className="trip-details-brand-icon">
                        ✈
                    </span>
                    <span>TripMate</span>
                </Link>

                <nav className="trip-details-nav">
                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/notifications">
                        Notifications
                    </Link>

                    <Link to="/profile">
                        Profile
                    </Link>

                    <button
                        className="trip-details-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            {/* =========================
                MAIN
            ========================= */}
            <main className="trip-details-main">

                {/* Back */}
                <Link
                    to="/dashboard"
                    className="trip-back-link"
                >
                    ← Back to Dashboard
                </Link>

                {/* =========================
                    TRIP HERO
                ========================= */}
                <section className="trip-hero-card">

                    <div className="trip-hero-content">

                        <p className="trip-eyebrow">
                            YOUR TRIP
                        </p>

                        <h1>
                            {trip.name}
                            <span>.</span>
                        </h1>

                        <div className="trip-location">
                            <span>📍</span>
                            <span>{trip.destination}</span>
                        </div>

                        <div className="trip-dates">
                            <div>
                                <span>START</span>
                                <strong>
                                    {formatDate(trip.startDate)}
                                </strong>
                            </div>

                            <div className="trip-date-arrow">
                                →
                            </div>

                            <div>
                                <span>END</span>
                                <strong>
                                    {formatDate(trip.endDate)}
                                </strong>
                            </div>
                        </div>

                    </div>

                    {isOwner && (
                        <div className="trip-owner-actions">

                            <button
                                className="trip-edit-button"
                                onClick={openEditTrip}
                            >
                                ✎ Edit Trip
                            </button>

                            <button
                                className="trip-delete-button"
                                onClick={handleDeleteTrip}
                            >
                                Delete Trip
                            </button>

                        </div>
                    )}

                </section>

                {/* =========================
                    QUICK ACTIONS
                ========================= */}
                <section className="trip-section">

                    <div className="trip-section-heading">
                        <div>
                            <p className="trip-section-label">
                                EXPLORE YOUR TRIP
                            </p>

                            <h2>
                                Everything in one place.
                            </h2>

                            <p>
                                Choose a section to manage this
                                part of your journey.
                            </p>
                        </div>
                    </div>

                    <div className="trip-action-grid">

                        <Link
                            to={`/trips/${tripId}/chat`}
                            className="trip-action-card"
                        >
                            <div className="trip-action-icon chat-icon">
                                💬
                            </div>

                            <div>
                                <h3>Trip Chat</h3>
                                <p>
                                    Talk with everyone in your
                                    travel group.
                                </p>
                            </div>

                            <span className="trip-action-arrow">
                                →
                            </span>
                        </Link>

                        <Link
                            to={`/trips/${tripId}/gallery`}
                            className="trip-action-card"
                        >
                            <div className="trip-action-icon gallery-icon">
                                📸
                            </div>

                            <div>
                                <h3>Gallery</h3>
                                <p>
                                    Keep your group's travel
                                    memories together.
                                </p>
                            </div>

                            <span className="trip-action-arrow">
                                →
                            </span>
                        </Link>

                        <Link
                            to={`/trips/${tripId}/expenses`}
                            className="trip-action-card"
                        >
                            <div className="trip-action-icon expense-icon">
                                💰
                            </div>

                            <div>
                                <h3>Expenses</h3>
                                <p>
                                    Track and split your trip
                                    expenses.
                                </p>
                            </div>

                            <span className="trip-action-arrow">
                                →
                            </span>
                        </Link>

                        <Link
                            to={`/trips/${tripId}/itinerary`}
                            className="trip-action-card"
                        >
                            <div className="trip-action-icon itinerary-icon">
                                🗺️
                            </div>

                            <div>
                                <h3>Itinerary</h3>
                                <p>
                                    Organize activities and
                                    your daily plans.
                                </p>
                            </div>

                            <span className="trip-action-arrow">
                                →
                            </span>
                        </Link>

                        <Link
                            to={`/trips/${tripId}/bookings`}
                            className="trip-action-card"
                        >
                            <div className="trip-action-icon booking-icon">
                                🎫
                            </div>

                            <div>
                                <h3>Bookings</h3>
                                <p>
                                    Manage hotels, transport and
                                    other reservations.
                                </p>
                            </div>

                            <span className="trip-action-arrow">
                                →
                            </span>
                        </Link>

                    </div>
                </section>

                {/* =========================
                    MEMBERS
                ========================= */}
                <section className="trip-section members-section">

                    <div className="trip-section-heading members-heading">

                        <div>
                            <p className="trip-section-label">
                                TRAVEL GROUP
                            </p>

                            <h2>
                                Trip Members
                            </h2>

                            <p>
                                The people joining this adventure.
                            </p>
                        </div>

                        {isOwner && (
                            <button
                                className="add-member-button"
                                onClick={() =>
                                    setShowAddMember(!showAddMember)
                                }
                            >
                                {showAddMember
                                    ? "Cancel"
                                    : "+ Add Member"}
                            </button>
                        )}

                    </div>

                    {/* Add member form */}
                    {showAddMember && (
                        <div className="add-member-card">

                            <div className="add-member-heading">
                                <div className="add-member-icon">
                                    +
                                </div>

                                <div>
                                    <h3>Add someone to the trip</h3>
                                    <p>
                                        Enter their registered
                                        TripMate email address.
                                    </p>
                                </div>
                            </div>

                            <form
                                className="add-member-form"
                                onSubmit={handleAddMember}
                            >
                                <div className="member-form-group">
                                    <label htmlFor="member-email">
                                        Email address
                                    </label>

                                    <input
                                        id="member-email"
                                        type="email"
                                        name="email"
                                        placeholder="friend@example.com"
                                        value={memberData.email}
                                        onChange={handleMemberChange}
                                        required
                                    />
                                </div>

                                <div className="member-form-group">
                                    <label htmlFor="member-role">
                                        Role
                                    </label>

                                    <select
                                        id="member-role"
                                        name="role"
                                        value={memberData.role}
                                        onChange={handleMemberChange}
                                    >
                                        <option value="member">
                                            Member
                                        </option>

                                        <option value="co-organizer">
                                            Co-organizer
                                        </option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="member-submit-button"
                                >
                                    Add Member →
                                </button>
                            </form>

                        </div>
                    )}

                    {/* Members */}
                    {members.length === 0 ? (
                        <div className="members-empty">
                            <div>👥</div>
                            <h3>No members yet</h3>
                            <p>
                                Add people to start planning
                                this trip together.
                            </p>
                        </div>
                    ) : (
                        <div className="members-grid">

                            {members.map((member) => {

                                const memberName =
                                    member.user?.name || "Unknown User";

                                const initial =
                                    memberName
                                        .charAt(0)
                                        .toUpperCase();

                                return (
                                    <div
                                        className="member-card"
                                        key={member._id}
                                    >
                                        <div className="member-avatar">
                                            {member.user?.profilePicture ? (
                                                <img
                                                    src={
                                                        member.user.profilePicture
                                                    }
                                                    alt={memberName}
                                                />
                                            ) : (
                                                initial
                                            )}
                                        </div>

                                        <div className="member-info">
                                            <h3>
                                                {memberName}
                                            </h3>

                                            <p>
                                                {member.user?.email}
                                            </p>

                                            <span
                                                className={`member-role member-role-${member.role}`}
                                            >
                                                {member.role}
                                            </span>
                                        </div>

                                        {isOwner &&
                                            member.role !== "owner" && (
                                                <button
                                                    className="remove-member-button"
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            member.user?._id
                                                        )
                                                    }
                                                >
                                                    ×
                                                </button>
                                            )}
                                    </div>
                                );
                            })}

                        </div>
                    )}

                </section>

                {/* =========================
                    EDIT TRIP
                ========================= */}
                {showEditTrip && (
                    <section className="edit-trip-card">

                        <div className="edit-trip-heading">
                            <div>
                                <p className="trip-section-label">
                                    TRIP SETTINGS
                                </p>

                                <h2>
                                    Edit your trip
                                </h2>

                                <p>
                                    Update the basic information
                                    about this journey.
                                </p>
                            </div>

                            <button
                                className="edit-close-button"
                                onClick={() =>
                                    setShowEditTrip(false)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <form
                            className="edit-trip-form"
                            onSubmit={handleEditTrip}
                        >

                            <div className="edit-form-group">
                                <label htmlFor="trip-name">
                                    Trip name
                                </label>

                                <input
                                    id="trip-name"
                                    type="text"
                                    value={editTripData.name}
                                    onChange={(e) =>
                                        setEditTripData({
                                            ...editTripData,
                                            name: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="edit-form-group">
                                <label htmlFor="trip-destination">
                                    Destination
                                </label>

                                <input
                                    id="trip-destination"
                                    type="text"
                                    value={
                                        editTripData.destination
                                    }
                                    onChange={(e) =>
                                        setEditTripData({
                                            ...editTripData,
                                            destination:
                                                e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="edit-form-group">
                                <label htmlFor="trip-start-date">
                                    Start date
                                </label>

                                <input
                                    id="trip-start-date"
                                    type="date"
                                    value={
                                        editTripData.startDate
                                    }
                                    onChange={(e) =>
                                        setEditTripData({
                                            ...editTripData,
                                            startDate:
                                                e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="edit-form-group">
                                <label htmlFor="trip-end-date">
                                    End date
                                </label>

                                <input
                                    id="trip-end-date"
                                    type="date"
                                    value={
                                        editTripData.endDate
                                    }
                                    onChange={(e) =>
                                        setEditTripData({
                                            ...editTripData,
                                            endDate:
                                                e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="edit-trip-actions">

                                <button
                                    type="button"
                                    className="edit-cancel-button"
                                    onClick={() =>
                                        setShowEditTrip(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="edit-save-button"
                                >
                                    Save Changes →
                                </button>

                            </div>

                        </form>

                    </section>
                )}

            </main>

            {/* =========================
                FOOTER
            ========================= */}
            <footer className="trip-details-footer">
                <span>TripMate</span>
                <p>Plan less. Travel more.</p>
            </footer>
        </div>
    );
}

export default TripDetails;