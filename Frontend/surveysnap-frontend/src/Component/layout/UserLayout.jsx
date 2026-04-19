// UserLayout.jsx - Logged-in user section ka wrapper layout
// UserNavbar hamesha upar rahega, neeche Outlet ke through page render hoga
import { Outlet } from "react-router-dom";
import UserNavbar from "../user/UserNavbar";

export default function UserLayout() {
  return (
    <>
      {/* Navbar - Dashboard, CreateSurvey, MySurvey links ke saath */}
      <UserNavbar />

      {/* Page content - Dashboard / Analytics / ViewSurvey yahan render hoga */}
      <div className="p-6">
        <Outlet />
      </div>
    </>
  );
}
