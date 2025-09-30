import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../../components/dashboard/sidebar";
import HomeDashboard from "../../components/dashboard/home";
import Scanner from "../../components/dashboard/scanner";
import EmployeeList from "../../components/dashboard/employee/employee";

import Lottie from "lottie-react";
import scanLoadingAnimation from '../../animation/scanLoadingAnimation.json';

import { getAllEmployeeApi } from "../../services/employee";
import { getAllPositionApi } from "../../services/position";
import { loggedUserApi } from "../../services/auth";
import { changePage } from "../../store/SlicePage";
import Settings from "../../components/dashboard/settings";
import Profile from "../../components/dashboard/profile";
import { checkAbsenceApi } from "../../services/scan";
import TimeSheet from "../../components/dashboard/employee/timeSheet";
import QRCode from "../../components/dashboard/employee/qrcode";
import QRCodeEmp from "../../components/dashboard/employee/qrcode";

export default function Dashboard(){
    // controleRoute function determines the routes allow if token exists and the routes don't allow if token not ex


    const queryClient=useQueryClient();
    const dispatch = useDispatch();
    const [user, setUser]=useState(null);
    const [notifications, setNotifications]=useState([]);
    const currentPage=  useSelector(state=>state.currentPage.page)

    useEffect(
        ()=>{
            dispatch(changePage('home'))
        },[]
    )
    
    // for get logged user with any reload to page rather get it in first login and keep it in localStorage;
    const {data: loggedUser}=useQuery({
        queryKey: ['loggedUser'],
        queryFn: loggedUserApi,
    })

    // for get employees for database
    const {data:employees}=useQuery({
        queryKey:["employees"],
        queryFn: getAllEmployeeApi
    })

    // for get position for database
    const {data:positions}=useQuery({
        queryKey:['positions'],
        queryFn: getAllPositionApi,
    })


    useEffect(
        ()=>{
            if(loggedUser){
                setUser(loggedUser.user);
            }
        },[loggedUser]
    )



    console.log("user", user)
   



    const checkAbsenceMutation = useMutation({
        mutationFn: checkAbsenceApi,
        onSuccess: (data, variable, context)=>{
            console.log("data", data);
            queryClient.invalidateQueries(["employees"]);
        }
    })

    const checkAbsence = () =>{
        checkAbsenceMutation.mutate()
    }

    // for check absence for every 18 hour;
    useEffect(
        ()=>{
            const checkAbsencePeriod = setInterval(
                ()=>{
                    const curTime = new Date().getHours();
                    if(curTime>=12 && curTime<=13){
                        checkAbsence();
                    }
                }, 1000*60*60
            )

            return ()=>clearInterval(checkAbsencePeriod)
        }, []
    )



    return <div>

    {
        !user?<div style={{ width: "100vh", height: "100vw" }}>
            <Lottie 
                animationData={scanLoadingAnimation} 
                loop={true}   // or false if you want it to stop
                autoplay={true} 
            />
        </div>
        :<div className="dashboard">
            <div className="part-one">
                <Sidebar user={user} />:null
            </div>

            <div className="part-two">
                <main className="main-content">
                    {   
                        currentPage == 'home'?<HomeDashboard user={user} employes={employees || []} positionsList={positions || []} />
                        :(currentPage == 'scanner' && user.role == 'director')?<Scanner />
                        :(currentPage == 'employees' && user.role == 'director')?<EmployeeList employees={employees} />
                        :(currentPage == 'settings' && user.role == 'director')? <Settings />
                        :(currentPage == 'timesheet' && user.role == 'employee')? <TimeSheet employee={user} closeTimeSheet={()=> dispatch(changePage('home')) } />
                        :(currentPage == 'qrcode' && user.role == 'employee') ? <QRCodeEmp employee={user} />
                        :currentPage == 'profile'? <Profile />
                        :<h1>not exists</h1>
                    
                    }
                    
            
                </main>
            </div>
        </div>
        
    }


    </div>
}