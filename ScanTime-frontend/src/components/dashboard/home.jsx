import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaUsers } from "react-icons/fa"; 
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaUserClock } from "react-icons/fa";
import { TbClockExclamation } from "react-icons/tb";
import { MdNotifications } from 'react-icons/md';
import { MdClose } from 'react-icons/md';

import { PiChecksLight } from 'react-icons/pi';
import { PiChecksBold } from 'react-icons/pi';

import { QRCodeCanvas as QRCode } from "qrcode.react";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { createEmployeeApi } from "../../services/employee";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePage } from "../../store/SlicePage";
import { formatTime } from "../../utilities/utilities";
import { readNotificationApi } from "../../services/notification";

export default function HomeDashboard({ user, employes, positionsList }) {

  // drissi
  const dispatch = useDispatch();
  const queryClient= useQueryClient();

  const [showNotifiction, setShowNotification]=useState(false);


  const [successMessage, setSuccessMessage]= useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // we need postions list if we went add a new employee
  const [positions, setpositions] = useState(positionsList);
  useEffect(() => {
    setpositions(positionsList);
  }, [positionsList]);

  const {handleSubmit, register, formState, reset}=useForm({
    mode:'onBlur'
  });
  const {errors}=formState;

  const createEmployeeMutation = useMutation({
    mutationFn: (EmployeeInfo)=>createEmployeeApi(EmployeeInfo),
    onSuccess:(response, variable, context)=>{
      if(response.message === "An account with this email already exists. Please try register in instead."){
        setErrorMessage("Un compte avec cet e-mail existe déjà. Veuillez essayer de vous inscrire avec un autre.");

      } else if (response.message === "An account with this email is registered, but is not yet active. Please check your email to activate it."){
        setErrorMessage("Un compte avec cet email est enregistré, mais n'est pas encore actif. Veuillez vérifier votre email pour l'activer.");
        
      } else if ( response.message ===  "Account created successfully. Please verify your account via the email we've sent you."){
        setSuccessMessage("Compte créé avec succès. Veuillez vérifier votre compte via l'e-mail que nous vous avons envoyé.");
        queryClient.invalidateQueries(["employees"]);
      }
      
      setTimeout(
        ()=>{
          setErrorMessage(""); 
          setSuccessMessage("");
          if(response.message ===  "Account created successfully. Please verify your account via the email we've sent you."){
            setShowAddForm(false);
            reset()
          }
        }
        ,2000
      )
      
    }
  })

 // for create QRcode
  const generateQRCode = (employee) => {
    const qrData = JSON.stringify({
      name: employee.name,
      email: employee.email,
      timestamp: new Date().toISOString(),
    });
    return qrData;
  };

  // for save employee in database;
  const handleAddEmployee = (formfield) => {
    formfield.role = "employee";
    formfield.QRcode = generateQRCode(formfield);
    createEmployeeMutation.mutate(formfield);
    
  };


  // for know how much any employee work from right now;
  const employeesStatistic = ()=> {
    let numEmployee = employes?.length || 0;
    let currentWorking = 0; // the employees exists into the company
    let completdScans = 0; // the employees completed its scans, that mean all employees workes and completed its day
    let lateEmployees = 0; // any employee starts work late
    let totalDailyHours = []; // 
    let dailyHours = []; // 
    let today =`${new Date(Date.now()).getFullYear()}-${String(new Date(Date.now()).getMonth()+1).padStart(2, '0')}-${String(new Date(Date.now()).getDate()).padStart(2, '0')}`;
    if(employes && employes.length>0){
      employes.forEach((emp)=>{
        let scansToday = 0;
        dailyHours = [];

        emp.employee.scans.forEach(scan => {
          // for know how much scan all users, scansToday is a greate parameter for calculate numbres of hours of working
          if( today == scan.created_at.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0] && (scan.state != "absent" && scan.state != 'holidays' )  ){
            scansToday++;
            const scanDate = new Date(scan.created_at)
            dailyHours.push(scanDate.getTime());
            if( scan.enRetard == true){
              lateEmployees ++;
            }
          }
        });
      
        if(scansToday >= 1 && scansToday <= 3){
          currentWorking++;
        }

        if(scansToday == 4){
          completdScans++;
        }

        if(dailyHours.length > 0){
          dailyHours.sort((a,b)=>a-b);
          const curDate = Date.now();
          let infoChart = {}
          if(dailyHours.length == 1){
            const period = curDate-dailyHours[0]
              infoChart={
                dailyHours: period/(1000*60*60),
                dailyHoursFormat: formatTime(period)
              }
          } else if (dailyHours.length == 2){
            const period = dailyHours[1]-dailyHours[0]
            infoChart={
              dailyHours: period/(1000*60*60),
              dailyHoursFormat: formatTime(period)
            }
          } else if (dailyHours.length == 3){
            const period = dailyHours[1]-dailyHours[0] + curDate - dailyHours[2] ;
            infoChart={
              dailyHours: period/(1000*60*60),
              dailyHoursFormat: formatTime(period)
            }
          } else if(dailyHours.length == 4) {
            const period = dailyHours[1]-dailyHours[0]+dailyHours[3]-dailyHours[2]
            infoChart={
              dailyHours: period/(1000*60*60),
              dailyHoursFormat: formatTime(period)
            }
          }
          totalDailyHours.push({name: emp.name.match(/^[a-zA-z]+/g)[0], ...infoChart})
        }
      })
    }
    
    return {
      'numEmployee': numEmployee, 
      'completdScans': completdScans,
      'currentWorking': currentWorking,
      'lateEmployees': lateEmployees,
      'totaldailyHours' : totalDailyHours
    }
  }
  employeesStatistic()
  // for know how much any employee work from right now;
  

  // for know how much an employee work from right now;
  const curDate = new Date();
  const [selectMonth, setSelectMonth]=useState(curDate.getMonth()+1);
  const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  const employeeStatict = () =>{
    if(user.role == 'employee'){
      const today =`${new Date(Date.now()).getFullYear()}-${String(new Date(Date.now()).getMonth()+1).padStart(2, '0')}-${String(new Date(Date.now()).getDate()).padStart(2, '0')}`;
      const nbrDay = new Date(curDate.getFullYear(), curDate.getMonth(), 0).getDate();
      let presence = 0;
      let retard = 0;

      const scans = user.employee.scans;
      const scansMonthly = [];
      scans.forEach((scan)=> { if(scan.created_at.match(/[0-9]{4}-[0-9]{2}/g)[0] == today.match(/[0-9]{4}-[0-9]{2}/g)[0]){
        if(scan.state == 'arrivalTime'){
          presence++;
          if(scan.enRetard == true){
            retard++;
          }
        }
      }})

      const dailyHour = [];
      for(let i=1; i<=nbrDay; i++){
        const dailyHourTab=[]
        scans.forEach(scan => {
          if(scan.created_at.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0] == `${curDate.getFullYear()}-${String(selectMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`    ){
            dailyHourTab.push( new Date(scan.created_at).getTime())
          }
        })

        dailyHourTab.sort((a,b)=> a - b)
        if(dailyHourTab.length == 1){
          let calcDailyHour = new Date().getTime() - dailyHourTab[0] ;
          calcDailyHour = (calcDailyHour/(1000*60*60) > 8) ? 8*1000*60*60 : calcDailyHour/(1000*60*60);
          dailyHour.push({day: i, hours: calcDailyHour/(1000*60*60), format: formatTime(calcDailyHour)});
        } else if(dailyHourTab.length == 2){
          let calcDailyHour = dailyHourTab[1] - dailyHourTab[0];
          dailyHour.push({day: i, hours: calcDailyHour/(1000*60*60), format: formatTime(calcDailyHour)});
        } else if(dailyHourTab.length == 3){
          let calcDailyHour = dailyHourTab[1] - dailyHourTab[0] + new Date().getTime() - dailyHourTab[2];
          calcDailyHour = (calcDailyHour/(1000*60*60) > 8) ? 8*1000*60*60 : calcDailyHour/(1000*60*60);
          dailyHour.push({day: i, hours: calcDailyHour/(1000*60*60), format: formatTime(calcDailyHour)});
        } else if(dailyHourTab.length == 4){
          let calcDailyHour = dailyHourTab[1] - dailyHourTab[0] + dailyHourTab[3] - dailyHourTab[2];
          dailyHour.push({day: i, hours: calcDailyHour/(1000*60*60), format: formatTime(calcDailyHour)});
        } else {
          dailyHour.push({day: i, hours: 0, format: '00:00'});
        }

      }
      
      return {
        presence: presence,
        retard: retard,
        dailyHour: dailyHour
      }

    }
  }
  // for know how much an employee work from right now;


  const isAdmin = user.role === "director";
  const [timeRange, setTimeRange] = useState("week");
  const [showAddForm, setShowAddForm] = useState(false);

  const [apiMessage, setApiMessage] = useState({ text: "", type: "" });
  const [generatedQR, setGeneratedQR] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);


  // Process employee data for statistics
  const processEmployeeData = () => {
    if (!employes || employes.length === 0) return [];

    return employes.map((employee) => {
      // Calculate total hours worked based on scans
      let totalHours = 0;
      let workingDays = 0;
      let dailyHours = [];

      if (
        employee.employee &&
        employee.employee.scans &&
        employee.employee.scans.length > 0
      ) {
        // Group scans by date
        const scansByDate = {};
        employee.employee.scans.forEach((scan) => {
          // Handle different date formats
          let date;
          if (scan.created_at.includes("T")) {
            date = scan.created_at.split("T")[0];
          } else {
            date = scan.created_at.split(" ")[0];
          }

          if (!scansByDate[date]) {
            scansByDate[date] = [];
          }
          scansByDate[date].push(new Date(scan.created_at));
        });

        // Calculate hours for each day
        Object.entries(scansByDate).forEach(([date, scans]) => {
          if (scans.length >= 2) {
            // Sort scans by time
            scans.sort((a, b) => a - b);

            // Calculate time difference between first and last scan
            const startTime = scans[0];
            const endTime = scans[scans.length - 1];
            const hoursWorked = (endTime - startTime) / (1000 * 60 * 60);

            // Cap at 8 hours maximum per day
            const cappedHours = Math.min(hoursWorked, 8);
            totalHours += cappedHours;
            workingDays++;
            dailyHours.push({
              date,
              hours: parseFloat(cappedHours.toFixed(1)),
            });
          }
        });
      }

      // Calculate average hours per day
      const avgHoursPerDay = workingDays > 0 ? totalHours / workingDays : 0;

      return {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        totalHours: parseFloat(totalHours.toFixed(1)),
        workingDays,
        avgHoursPerDay: parseFloat(avgHoursPerDay.toFixed(1)),
        dailyHours,
        scans: employee.employee ? employee.employee.scans : [],
      };
    });
  };

  // if(employes){
  // }

  // Process data for the current employee (non-admin view)
  const processCurrentEmployeeData = () => {
    if (!user.employee || !user.scans)
      return {
        hoursWorked: 0,
        avgHoursPerDay: 0,
        workingDays: 0,
        weeklyData: [],
        monthlyData: [],
        dailyHours: [],
      };

    // Group scans by date
    const scansByDate = {};
    user.scans.forEach((scan) => {
      // Handle different date formats
      let date;
      if (scan.created_at.includes("T")) {
        date = scan.created_at.split("T")[0];
      } else {
        date = scan.created_at.split(" ")[0];
      }

      if (!scansByDate[date]) {
        scansByDate[date] = [];
      }
      scansByDate[date].push(new Date(scan.created_at));
    });

    // Calculate total hours and working days
    let totalHours = 0;
    let workingDays = 0;
    let dailyHours = [];

    Object.entries(scansByDate).forEach(([date, scans]) => {
      if (scans.length >= 2) {
        // Sort scans by time
        scans.sort((a, b) => a - b);

        // Calculate time difference between first and last scan
        const startTime = scans[0];
        const endTime = scans[scans.length - 1];
        const hoursWorked = (endTime - startTime) / (1000 * 60 * 60);

        // Cap at 8 hours maximum per day
        const cappedHours = Math.min(hoursWorked, 8);
        totalHours += cappedHours;
        workingDays++;
        dailyHours.push({ date, hours: parseFloat(cappedHours.toFixed(1)) });
      }
    });

    // Calculate average hours per day
    const avgHoursPerDay = workingDays > 0 ? totalHours / workingDays : 0;

    // Prepare weekly data
    const weeklyData = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get the current week's dates
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split("T")[0];

      const dayHours = dailyHours.find((dh) => dh.date === dateString);
      weeklyData.push({
        name: daysOfWeek[i],
        hours: dayHours ? dayHours.hours : 0,
      });
    }

    // Prepare monthly data (group by weeks)
    const monthlyData = [];
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    let currentWeekStart = new Date(firstDayOfMonth);
    let weekNumber = 1;

    while (currentWeekStart <= lastDayOfMonth) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);
      if (weekEnd > lastDayOfMonth) weekEnd.setDate(lastDayOfMonth.getDate());

      let weekHours = 0;
      let currentDate = new Date(currentWeekStart);

      while (currentDate <= weekEnd) {
        const dateString = currentDate.toISOString().split("T")[0];
        const dayHours = dailyHours.find((dh) => dh.date === dateString);
        if (dayHours) {
          weekHours += dayHours.hours;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      monthlyData.push({
        name: `Week ${weekNumber}`,
        hours: parseFloat(weekHours.toFixed(1)),
      });

      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      weekNumber++;
    }

    return {
      hoursWorked: parseFloat(totalHours.toFixed(1)),
      avgHoursPerDay: parseFloat(avgHoursPerDay.toFixed(1)),
      workingDays,
      weeklyData,
      monthlyData,
      dailyHours,
    };
  };


  // read notification
  const readNotificationMutation = useMutation({
    mutationFn: (id)=> readNotificationApi(id),
    onSuccess: (data, variable, context)=>{
      queryClient.invalidateQueries(["loggedUser"]);
      


    }
  })





  // read notification



  const employeeStats = processCurrentEmployeeData();
  const processedEmployees = processEmployeeData();

  // Calculate admin statistics
  const adminStats = {
    totalEmployees: processedEmployees.length,
    totalHours: processedEmployees.reduce(
      (sum, emp) => sum + emp.totalHours,
      0
    ),
    avgHoursPerDay:
      processedEmployees.length > 0
        ? processedEmployees.reduce((sum, emp) => sum + emp.avgHoursPerDay, 0) /
          processedEmployees.length
        : 0,
    workingDays: processedEmployees.reduce(
      (sum, emp) => sum + emp.workingDays,
      0
    ),
    // Employee performance data - show actual hours worked
    employeePerformance: processedEmployees.map((emp) => ({
      name: emp.name.split(" ")[0], // Use first name only
      hours: emp.totalHours, // Actual hours worked
      avgHours: emp.avgHoursPerDay, // Average hours per day
    })),
  };




  const handleDownloadQR = () => {
    if (!generatedQR) return;
    const canvas = document.getElementById("employee-qr-code");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-code-${formData.name}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleDownloadEmployeeQR = () => {
    const canvas = document.getElementById("employee-qr-code-display");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-code-${user.name}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };






  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          Hi, {user.name.split(" ")[0]}{" "}
          <img
            src="images/waving-hand-light-skin-tone_1f44b-1f3fb.png"
            alt="fiveicon"
            className="hi-fiveicon"
          />
        </h1>
        {isAdmin && (<>
          <div className="adminSideDashboard" >
            <div className="notification" onClick={()=>setShowNotification(true)} >
              {user.director_notification.reduce((a,b)=>{return  !b.read_at? a+1:a },0)>0 && <span></span>}
              <MdNotifications />
            </div>
            {
              showNotifiction && <div className="showNotifiction">
                <div className="showNotifictionHeader">
                  <p>{user.director_notification.reduce((a,b)=>{return  !b.read_at? a+1:a }, 0  )  } notification</p>
                  <button onClick={()=>setShowNotification(false)}>
                    <MdClose />
                  </button>
                </div>
                <div className="showNotifictionBody" >
                  {
                    user.director_notification.sort((a,b)=> -a.id + b.id).map((item,index)=>{return <div key={index}
                        onClick={()=>readNotificationMutation.mutate(item.id) }
                        style={{backgroundColor:'#eee'}}
                      >
                      <p className="content">{item.content}</p>
                      <p className="time">
                        <p style={item.read_at?{color:"#2563EB"}:{color:"#aaa"}}  ><PiChecksBold /></p>
                        {item.created_at.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)  }</p>
                    </div>  })
                  }
                </div>
                
              </div>

            }
            
            <button
              className="primary-btn"
              onClick={() => {
                setShowAddForm(!showAddForm);
                setShowQRCode(false);
                setGeneratedQR("");
              }}
            >
              + Add Member
            </button>

          </div>
        </>)}
      </div>

      {isAdmin ? (
        <div className="admin-dashboard">
          {/* errors and success message to create a new employee */}
            {
              errorMessage?<div className={`alert alert-error`}>
                    {errorMessage}
              </div>:null
            }
            {
              successMessage?<div className={`alert alert-success`}>
                    {successMessage}
              </div>:null
            }
          {/* errors and success message to create a new employee */}

          {/* Add Staff Form */}
          {showAddForm && (
            <div className="card form-card">
              <h2>Add Staff Member</h2>
              {apiMessage.text && (
                <div className={`alert alert-${apiMessage.type}`}>
                  {apiMessage.text}
                </div>
              )}
              {!showQRCode ? (
                <form onSubmit={handleSubmit(handleAddEmployee)} method="POST">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        {...register('name',{
                          required: {value:true, message: "Name is required"},

                        })}
                        
                        placeholder="Enter full name"
                      />
                      {errors.name && (
                        <span className="error">{errors.name.message}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        {...register('email', {
                          required: {value: true, message: "Email is required"},
                          pattern: {value :/^[A-Za-z]{1,20}[0-9]{0,6}@[A-Za-z]{4,10}\.[A-Za-z]{2,5}$/, message:"L'email est invalide"}
                        })}
                        placeholder="Enter email"
                      />
                      {errors.email && (
                        <span className="error">{errors.email.message}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        {...register('password',{
                          required:{ value:true, message: "le mot de pass est obligatoire"}
                        })}
                        placeholder="Enter password"
                      />
                      {errors.password && (
                        <span className="error">{errors.password.message}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Position</label>
                      <select
                        {...register("position_id", {
                          required:{value: true, message: "la position est obligatiore, determine leur position"},
                        })}
                      >
                        <option value="">Select Position</option>
                        {positions?.map((position) => (
                          <option key={position.id} value={position.id}>
                            {position.name}
                          </option>
                        ))}
                      </select>
                      {errors.position_id && (
                        <span className="error">{errors.position_id.message}</span>
                      )}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => {
                        setShowAddForm(false);
                        // setErrors({});
                        // setApiMessage({ text: "", type: "" });
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="primary-btn">
                      Add Member
                    </button>
                  </div>
                </form>
              ) : (
                <div className="qr-result-section">
                  <h3>Employee QR Code</h3>
                  <p>Scan this QR code for employee identification</p>

                  <div className="qr-code-wrapper">
                    <QRCode
                      id="employee-qr-code"
                      value={generatedQR}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <div className="qr-actions">
                    <button onClick={handleDownloadQR} className="primary-btn">
                      Download QR Code
                    </button>
                    <button
                      onClick={() => {
                        setShowQRCode(false);
                        setShowAddForm(false);
                        setApiMessage({ text: "", type: "" });
                      }}
                      className="secondary-btn"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Admin Statistics */}
          <div className="stats-section">
            <h2>Business Overview</h2>
            <div className="stats-grid">
              <div className="stat-card" onClick={()=>dispatch(changePage('employees'))}>
                <FaUsers className="icon-card" />
                <h3>{employeesStatistic().numEmployee}</h3>
                <p>Total Employees</p>
              </div>
              <div className="stat-card">
                <FaUserClock className="icon-card" />
                <h3>{employeesStatistic().currentWorking}</h3>
                <p>Currently Working</p>
              </div>
              <div className="stat-card">
                <AiOutlineCheckCircle className="icon-card" />
                <h3>{employeesStatistic().completdScans}</h3>
                <p>Completed Scans</p>
              </div>
              <div className="stat-card">
                <TbClockExclamation className="icon-card" />
                <h3>{employeesStatistic().lateEmployees}</h3>
                <p>Late Employees</p>
              </div>
            </div>

            {/* Charts */}
            <div className="chart-container">
              <div className="chart-card">
                <h3>Employee Total Hours Worked</h3>
                <p className="chart-subtitle">
                  Total hours worked by each employee
                </p>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={employeesStatistic().totaldailyHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        label={{
                          value: "hours",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        labelFormatter={(value) => `Employee: ${value}`}
                        formatter={(value, name, props) => [`${props.payload.dailyHoursFormat}`]}
                      />
                      <Bar dataKey="dailyHours" fill="#407bff" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (

        <div className="employee-dashboard">         

          {/* Employee Statistics */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <AiOutlineCheckCircle className="icon-card" />
                <h3>{employeeStatict().presence}</h3>
                <p>Presence</p>
              </div>
              <div className="stat-card">
                <TbClockExclamation className="icon-card" />
                <h3>{employeeStatict().retard}</h3>
                <p>Retard</p>
              </div>
              {/* <div className="stat-card">
                <HiCalendarDays className="icon-card" />
                <h3>{employeeStats.workingDays}</h3>
                <p></p>
              </div> */}
            </div>

            <div className="chart-container">
              <div className="section-header">
                <div className="left">
                  <h2>Vos heures de travail</h2>
                </div>
                <div className="right">
                  <select
                    className="time-selector"
                    value={selectMonth}
                    onChange={(e) => setSelectMonth(e.target.value)}
                  >
                    {
                      mois.map((item, index) => <option value={index+1}>{item}</option>)
                    }
                    
                  </select>
                </div>
              </div>
              <div className="chart-card">
                <h3>Statistique mensuelle</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={employeeStatict().dailyHour}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis
                        domain={[0, 8]}
                        label={{
                          value: "hours",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip 
                      labelFormatter={(value) => `Day: ${value}`}
                      formatter={(value, name, props ) => [`${props.payload.format}`]} 
                      />
                      <Bar dataKey="hours" fill="#407bff" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>  
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
