import React, { useEffect, Component } from "react";
// import { useEmployeeContext } from "../../utils/GlobalState";
import API from "../../utils/API";

class EmployeeList extends Component{
    
  state = {
    employees: []
  }

  getEmployees = () => {
    API.getEmployees()      
      .then(results => {
        this.setState({ employees: results.data})
      })
      .catch(err => console.log(err))
  }
  
  componentDidMount = () => {
    this.getEmployees()
  }

  render(){
    return(
    <div>
      {this.state.employees.length ? (
        <div>
          {this.state.employees.map( employee => (
            <ul class="list-group">
              <li className="list-group-item">{employee._id}</li>
              <li className="list-group-item">{employee.name}</li>
              <li className="list-group-item">{employee.position}</li>
              <li className="list-group-item">{employee.phonenumber}</li>
              <li className="list-group-item">{employee.email}</li>
            </ul>
          ))}
        </div>    
      ) : (
        <div>
            <h1>No current employees in the database, please add some people!</h1>
        </div>
      )}
    </div>
    )
  }


}

export default EmployeeList;