import React, { useState, useEffect } from 'react'
import './Employee.css'


const baseUrl = "http://localhost:5000/api"

const Employee = () => {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [department,setDepartment] = useState('')
    const [employeeDetails, setEmployeeDetails] = useState([])
    const [edtingId, setEdtingId] = useState(null);

    useEffect(()=>{
        fetchEmployeeDetails();
    },[])

    const fetchEmployeeDetails = async() =>{
        try{
            const res = await fetch(`${baseUrl}/fetchall`)
            const data = await res.json();
            setEmployeeDetails(data)
        }catch(err){
            console.log(err)
        }
    }

    const resetForm = () =>{
        setName(''),
        setEmail(''),
        setPhone(''),
        setDepartment(''),
        setEdtingId(null);
    }

    const addHandler = async() =>{
        try{
        const empDetails = {
            name,
            email,
            phone,
            department
        }
        console.log(empDetails)

        const empRecord = await fetch(`${baseUrl}/add`,{
            method:'POST',
            headers:{
                "Content-Type":"application/json",

            },
            body:JSON.stringify(empDetails)
        })
        if(empRecord.ok){
            await fetchEmployeeDetails();
            alert("Record Added Successfully!")
        }else{
            alert("Failed to Submit!")
        }
    }catch(err){
        console.log('error in adding employee record',err)
    }
    resetForm();
    }

    const updatehandler = async() =>{

        const empDetails = {name,email,phone,department}

        try{
            const empRecord = await fetch(`${baseUrl}/singlupdate/${edtingId}`,{
                method: 'PUT',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(empDetails)
            })
            if(empRecord.ok){
                const updatedEmpRecord = employeeDetails.map((emp)=>
                    emp._id === edtingId ? {...emp,...empDetails} : emp 
                );
                setEmployeeDetails(updatedEmpRecord)
                alert('Employee Details updated');
                resetForm();
            }else{
                alert('Failed to update the employeeDetails');
            }
        }catch(err){
            console.log('Error in updating record:',err);
        }

    }

    const deleteHandler = async(id) =>{
        const confirm_delete = window.confirm("Are you sure you want delete employee record!")

        if(!confirm_delete) return ;

       try{
         const deleteEmployee = await fetch(`${baseUrl}/deleterecord/${id}`,{
            method:'DELETE'
        })
        if(deleteEmployee.ok){
            setEmployeeDetails(employeeDetails.filter((emp)=> emp._id !== id))
            alert("Record has been Deleted Successfully");
        }else{
            alert('Failed to delete the employe Record!');
        }
       }catch(err){
        console.log("Error in delete the record",err);
       }

    }

    const handleEmpEdit= (emp) =>{
        setEdtingId(emp._id);
        setName(emp.name);
        setEmail(emp.email);
        setPhone(emp.phone);
        setDepartment(emp.department);
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        if(edtingId){
            updatehandler();
        }else{
            addHandler();
        }
    }


    

  return (
    <div className="EmployeeContainer">
        <h1 className='heading'>Employee Management System</h1>
      <form className="formsection" onSubmit={handleSubmit}>
        <div className="empname">
            <label >EmployeeName:</label><br />
            <input type="text" name="name" value={name} onChange={(e)=>setName(e.target.value)}/>
        </div>
        <div className="empname">
            <label >EmployeeEmail:</label><br />
            <input type="text" name="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className="empname">
            <label >EmployeePhone:</label><br />
            <input type="text" name="phone" value={phone} onChange={(e)=>setPhone(e.target.value)}/>
        </div>
        <div className="empname">
            <label >EmployeeDepartment:</label><br />
            <input type="text" name="department" value={department} onChange={(e)=>setDepartment(e.target.value)}/>
        </div>
        <button type="submit" className='button'>{edtingId ? "update Employee" :"Add Employee"}</button>
       { edtingId && (<button type="button" onClick={resetForm}>cancel</button>)}
      </form>
    <hr className='line'/>
      <h1 className='Employee-heading'>EmloyeeDetails</h1>
      {employeeDetails.length === 0 ? (<p>No records Found</p>):(
      <ul className="employeeDetailsCard">
        {employeeDetails.map((emp)=>(
            <li key={emp._id}>
                <p className="text">{emp.name}</p>
                <p className="text">{emp.email}</p>
                <p className="text">{emp.phone}</p>
                <p className="text">{emp.department}</p>
                <div className="buttonsArea">
                    <button onClick={()=> handleEmpEdit(emp)}>Edit</button>
                    <button onClick={()=> deleteHandler(emp._id)}>Delete</button>
                </div>
            </li>
        ))}
      </ul>)}
    </div>
  )
}

export default Employee
