import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Header from "./components/Header";
import FetchDetails from "./components/FetchDetails";
import Registration from "./components/Registration";
import User from "./components/user";
import Attendance from "./components/attendance";
import LeaveManagement from "./components/LeaveManagement";
import UserLeaveManagement from "./components/UserLeaveManagement";
import UserFetchDetails from "./components/UserFetchDetails";
import ViewRegistration from "./components/ViewRegistration";
import UpdateDetails from "./components/updateDetails";
import UserAttendance from "./components/UserAttendance";
import FacultyAttendance from "./components/FacultyAttendance";
import LeaveRecord from "./components/LeaveRecord";
import ManPower from "./components/manPower";
import TradeInfo from "./components/TradeInfo";
import Officer from "./components/Officer"; 
import OfficerFetch from "./components/Officerfetch";
import PartIIOrderKindred from "./components/kindredRoll";
import MaritalStatus from "./components/maritalStatus";
import Retirements from "./components/Retirement";
import Status from "./components/status";
import NewUsers from "./components/NewUsers";
import UserList from "./components/userlist";
import Part2order1 from "./components/LeavePartII";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/fetch" element={<FetchDetails />} />
        <Route path="/user" element={<User />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<LeaveManagement />} />
        <Route path="/userFetch" element={<UserFetchDetails />} />
        <Route path="/viewRegistration/:id" element={<ViewRegistration />} />
        <Route path="/updateDetails/:id" element={<UpdateDetails />} />
        <Route path="/userAttendance" element={<UserAttendance />} />
        <Route path="/FacultyAttendance" element={<FacultyAttendance />} />
        <Route path="/user-leave" element={<UserLeaveManagement />} />
        <Route path="/leaveRecord" element={<LeaveRecord />} />
        <Route path="/leaveManagement" element={<LeaveManagement />} />
        <Route path="/manpower" element={<ManPower />} />
        <Route path="/tradeInfo" element={<TradeInfo />} />
        <Route path="/officer" element={<Officer />} />
        <Route path="/officerfetch" element={<OfficerFetch />} />
        <Route path="/manpower" element={<ManPower />} />
        <Route path="/kinderedroll" element={<PartIIOrderKindred />} />
        <Route path="/marital-status" element={<MaritalStatus />} />
        <Route path="/retired" element={<Retirements />} />
        <Route path="/status" element={<Status />} />
        <Route path="/newusers" element={<NewUsers />} />
        <Route path="/users" element={<UserList />} /> 
        <Route path="/part2order" element={<Part2order1 />} />
      </Routes>
    </div>
  );
}

export default App;
