import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteEmployeeApi } from "../../../services/employee";
import EmployeeList from "./employee";


export default function EmployeeDelete({employee, closeEmployeeDelete}){
    const queryClient = useQueryClient();

    const deleteEmployeeMutation = useMutation({
        mutationFn: (emp)=>deleteEmployeeApi(emp.id),
        mutationKey: ["deleteEmployee"],
        onSuccess: (data, variable, context)=>{
            queryClient.invalidateQueries(["employees"]);
            closeEmployeeDelete();
        }
    })
    const deleteEmployee = (emp) => {
        deleteEmployeeMutation.mutate(emp)
    }

    return <div className="employeeDelete">
        <div className="container">
            <h1 className="title">suppresion d'employee</h1>
            <div className="image">
                <img src="/images/defaultImg.webp" alt="" />
            </div>

            <div className="subtitle">
                <p>are you sure to want delete the employee:</p>
                <p><span>name: </span>{employee.name}</p>
                <p><span>email: </span>{employee.email}</p>
                <p><span>positiion: </span>{employee.employee.position.name}</p>
            </div>

            <div className="buttons">
                <button className="deleteBtn"
                    onClick={()=>deleteEmployee(employee)}
                >suprimer</button>
                
                <button className="closeBtn" 
                    onClick={()=>closeEmployeeDelete()}
                >ferme</button>

            </div>
        </div>
    </div>
}











