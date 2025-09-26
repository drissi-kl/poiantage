import React, { useState, useEffect } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { Ri24HoursFill } from "react-icons/ri";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { FaRegListAlt } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
// import { useDispatch } from "react-redux";
// import { setCurrentPage } from "../../store/scantimeSlice";
// import { logout } from "../../store/scantimeSlice";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { changePage } from "../../store/SlicePage";
import { logoutApi } from "../../services/auth";
import customAPI from "../../services/customAPI";
import { getToken } from "../../utilities/utilities";
// import { baseurlapi } from "../../store/scantimeSlice";
// import getCookie from "../../store/getcookies";
// import { getDecryptedToken } from "../../store/getcookies";
// import { useSelector } from "react-redux";




export default function Sidebar({ user }) {
  // const secretKey = useSelector((s) => s.scantime.secretKey);
  // const [token, settoken] = useState("");
  
  // useEffect(() => {
  //   const encrypted = getCookie("token");
  //   if (encrypted) {
  //     const token = getDecryptedToken(secretKey);
  //     settoken(token);
  //   } else {
  //     //console.log("token cookie not found");
  //   }
  // }, []);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentPage=  useSelector(state=>state.currentPage.page)

  const switchPage=(page)=>{
    dispatch(changePage(page));
  }
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async ()=> {
    try{
      console.log('you click on logout button');
      const response = await logoutApi();
      document.cookie= `token=${getToken()}; expires=${new Date(Date.now()).toUTCString()}`;
      queryClient.removeQueries();
      navigate('/');
      console.log(response);
    }catch(error){
      console.log(error.message);
    }
  }
  
  // const handleLogout = async () => {
  //   try {
  //     // Call the logout API endpoint
  //     const response = await fetch(`${baseurlapi}/logout`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //       }
  //     });
      
  //     if (response.ok) {
  //       // Clear token and user cookies
  //       document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //       document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
  //       // Dispatch Redux logout action
  //       dispatch(logout());
        
  //       // Navigate to login page
  //       navigate('/');
  //     } else {
  //       console.error('Logout failed:', response.statusText);
  //       // Fallback: still clear cookies and redirect even if API call fails
  //       document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //       document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //       dispatch(logout());
  //       navigate('/login');
  //     }
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //     // Fallback: still clear cookies and redirect even if API call fails
  //     document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //     document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //     dispatch(logout());
  //     navigate('/login');
  //   }
  // };
  
  return (
    <>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h1>
            <img
              src="/images/ScanTime.png"
              alt="ScanTime"
              className="sidebar-logo"
            />
            <span className="sidebar-title">ScanTime</span>
          </h1>
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {user.role === "director" ? (
              <>
                <li
                  className={`item ${currentPage === "home" ? "active" : ""}`}
                  onClick={() =>{switchPage("home"); }
                  }
                >
                  <HiOutlineHome className="icon" />{" "}
                  {!isCollapsed && <span>Home</span>}
                </li>

                <li
                  className={`item ${currentPage === "scanner" ? "active" : ""}`}
                  onClick={() =>
                    switchPage("scanner")
                  }
                >
                  <MdOutlineQrCodeScanner className="icon" />
                  {!isCollapsed && <span>Scanner</span>}
                </li>

                <li
                  className={`item ${currentPage === "employees" ? "active" : ""}`}
                  onClick={() =>
                    switchPage("employees")
                  }
                >
                  <FaRegListAlt className="icon" />
                  {!isCollapsed && <span>Employees</span>}
                </li>
                <li
                  className={`item ${currentPage === "settings" ? "active" : ""}`}
                  onClick={() =>
                    switchPage("settings")
                  }
                >
                  <CiSettings className="icon" />
                  {!isCollapsed && <span>Parameters</span>}
                </li>
              </>
            ) : (
              <>
                {/* <li
                  className={`item ${currentPage === "home" ? "active" : ""}`}
                  onClick={() =>
                    chagePage("home")
                  }
                >
                  <HiOutlineHome className="icon" />{" "}
                  {!isCollapsed && <span>Home</span>}
                </li>
                <li
                  className={`item ${currentPage === "Timetable" ? "active" : ""}`}
                  onClick={() =>
                    chagePage("Timetable")
                  }
                >
                  <Ri24HoursFill className="icon" />
                  {!isCollapsed && <span>Timetable</span>}
                </li>
                <li
                  className={`item ${currentPage === "profile" ? "active" : ""}`}
                  onClick={() =>
                    chagePage("profile")
                  }
                >
                  <CiSettings className="icon" />
                  {!isCollapsed && <span>Settings</span>}
                </li> */}
              </>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div
            className="user-profile"
            onClick={() => switchPage('profile') }
          >
            <img
              src={user?.profile || "images/user.png"}
              alt={user?.name}
              className="profile-pic"
            />
            {!isCollapsed && (
              <div className="user-info">
                <h3>
                  {user?.name?.length > 20
                    ? user?.name.substring(0, 20) + "..."
                    : user?.name}
                </h3>
                <p>
                  {user?.email?.length > 20
                    ? user?.email.substring(0, 20) + "..."
                    : user?.email}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button className="logout-btn" 
            onClick={()=>handleLogout()}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}