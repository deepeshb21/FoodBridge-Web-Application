import DashboardHome from "../DashboardHome";
import ManageNGOs from "../ManageNGOs";
import AllDonations from "../AllDonations";

const adminRoutes = [
  { path: "", element: <DashboardHome /> },         
  { path: "ngos", element: <ManageNGOs /> },        
  { path: "donations", element: <AllDonations /> }, 
];


export default adminRoutes;

