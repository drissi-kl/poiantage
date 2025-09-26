import { useQuery, useQueryClient } from "@tanstack/react-query";
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

export default function Dashboard(){
    const queryClient=useQueryClient();
    const dispatch = useDispatch();
    const [user, setUser]=useState(null);
    const [notifications, setNotifications]=useState([]);
    const currentPage=  useSelector(state=>state.currentPage.page)
    console.log(currentPage)

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

    // instead create store by redux and put current page to it, we create a query by only key and save into it value on current page and use cache 
    // const {data: currentPage}=useQuery({
    //     queryKey: ['currentPage'],
    //     queryFn: ()=>'home',
    //     initialData: ()=> queryClient.getQueryData(['currentPage'])
    // })
    
    
    useEffect(
        ()=>{
            // if(queryClient.getQueryData(['user'])){
            //     setUser(queryClient.getQueryData(['user']));
            // } else {
            //     const store =JSON.parse(localStorage.getItem('REACT_QUERY_OFFLINE_CACHE'));
            //     const dd = store.clientState.queries.find((item)=>{return item.queryKey[0]=='user' })
            //     setUser(dd?.state.data)
            // }    
            // if(queryClient.getQueryData(['notifications'])){
            //     setNotifications(queryClient.getQueryData(['notifications']));
            // } else {
            //     const store =JSON.parse(localStorage.getItem('REACT_QUERY_OFFLINE_CACHE'));
            //     const dd = store.clientState.queries.find((item)=>{return item.queryKey[0]=='notifications' })
            //     setNotifications(dd?.state.data)
            // }         
        }
        ,[queryClient]
    )

    useEffect(
        ()=>{
            if(loggedUser){
                setUser(loggedUser.user);
            }
        },[loggedUser]
    )



    // console.log("user", user)
    // console.log("notifications", notifications)
    console.log("employees", employees)
    // console.log("positions", positions)


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
                        currentPage == 'home'?<HomeDashboard user={user} employes={employees} positionsList={positions} />
                        :currentPage == 'scanner'?<Scanner />
                        :currentPage == 'employees'?<EmployeeList employees={employees} />
                        :currentPage == 'settings'? <Settings />
                        :currentPage == 'profile'? <Profile />
                        :<h1>not exists</h1>
                    
                    }
                    
            
                </main>
            </div>
        </div>
        
    }


    </div>
}