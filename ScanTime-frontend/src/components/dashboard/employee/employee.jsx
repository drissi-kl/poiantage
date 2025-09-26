import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";

import { BsFileEarmarkSpreadsheet } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { HiMiniInformationCircle } from 'react-icons/hi2';

import '../../../employeesStyle.css';
import TimeSheet from "./timeSheet";
import EmployeeDetails from "./employeeDetails";
import { deleteEmployeeApi } from "../../../services/employee";
import EmployeeDelete from "./employeeDelete";
import LeaveRequest from "./leaveRequest";


export default function EmployeeList(){
    // get employees from cache
    const queryClient = useQueryClient();
    const employees = queryClient.getQueryData(["employees"]);
    console.log('employees for employe page', employees)
    // const {data: employees }=useQuery()

    // for search form and filter employee you want to show
    const [filteredEmployees, setFilteredEmployees] = useState(employees);
    const searchEmployees = (search) =>{
        setFilteredEmployees(
            employees.filter((emp)=>emp.name.includes(search) )
        )
    }

    // for fill filteredEmployees at first render by employees list, 
    // also if change data of any employees rerender it automaticlly
    // because if this useEffect not exists when you change any thing in cache, not change at UI because UI linked with filteredEmployees state
    useEffect(
        ()=>setFilteredEmployees(employees),
        [employees]
    )

    const [showTimeSheet, setShowTimeSheet]=useState(false);
    const [showEmployeeDetails, setShowEmployeeDetails]=useState(false);
    const [showEmployeeDelete, setShowEmployeeDelete]=useState(false);
    const [showLeaveRequest, setShowLeaveRequest]=useState(false);

    const [employee, setEmployee]=useState(null);
    // for open time sheet employee model
    const openTimeSheet = (emp) => {
        setEmployee(emp)
        setShowTimeSheet(true);
    }

    // for open employee details model
    const openEmployeeDetails = (emp) => {
        setEmployee(emp)
        setShowEmployeeDetails(true)
    }

    // for open pop up as alert before delete
    const deleteEmployeePopUp = (employee)=>{
        setEmployee(employee)
        setShowEmployeeDelete(true);
    } 

    // for open leave Request form
    const opentLeaveRequest = () =>{
        setShowLeaveRequest(true);
    }

    
    return (
        <div className="employee-list-container">

            <div className="employee-list-header">
                <h1>Liste des Employés</h1>
                <div className="header-actions">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Rechercher un employé..."
                            onChange={(e) => searchEmployees(e.target.value)}
                        />
                    </div>
                    <button className="leave-request-btn" 
                        onClick={()=>opentLeaveRequest()} 
                    >
                        Demande de Congé
                    </button>
                </div>
            </div>

            <div className="employee-table-container">
                {filteredEmployees && <table className="employee-table">
                    <thead>
                        <tr>
                        <th className="th-top-left">Nom Complet</th>
                        <th>Poste</th>
                        <th className="th-top-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.name}</td>
                                <td>{employee.employee.position.name}</td>
                                <td className="actions">
                                    <button className="actionBtn sheetBtn" 
                                        onClick={()=>{openTimeSheet(employee)}}
                                    >
                                        <BsFileEarmarkSpreadsheet />
                                        TimeSheet
                                    </button>
                                    <button className="actionBtn informationBtn"
                                        onClick={()=>{openEmployeeDetails(employee)}}
                                    >
                                        <HiMiniInformationCircle />
                                        Information
                                    </button>
                                    <button className="actionBtn deleteBtn"
                                        onClick={()=>deleteEmployeePopUp(employee)}
                                    >
                                        <MdDelete />
                                        Delete
                                    </button>
                                </td>
                            </tr>))
                        }
                    </tbody>
                </table>
                }

            </div> 
            
            {
                showTimeSheet && <TimeSheet employee={employee} closeTimeSheet={()=>{setShowTimeSheet(false); setEmployee(null)}}  />
            }

            {
                showEmployeeDetails && <EmployeeDetails employee={employee} closeEmployeeDetails={()=>{
                    setShowEmployeeDetails(false); 
                    setEmployee(null)}}  
                    />
            }
            
            {
                showEmployeeDelete && <EmployeeDelete employee={employee} closeEmployeeDelete={()=>{setShowEmployeeDelete(false); setEmployee(null)}}   />
            }

            {
                showLeaveRequest && <LeaveRequest closeLeaveRequest={()=>{setShowLeaveRequest(false)}} />
            }

        </div>
    )

}