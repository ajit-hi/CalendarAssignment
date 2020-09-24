import React, { useReducer } from "react"
import { workOrderList, employeeList } from "../dummyData/dummyData"
import JobOrderDashboard from "../views/JobOrderDashboard"
import axios from "axios"

// Define two action types
// when a user is assigned a task
const ASSIGN_JOB = "ASSIGN_JOB"
// when an assignment to user is cancelled.
const CANCEL_ASSIGNMENT = "CANCEL_ASSIGNMENT"

// define constants for dates

const day1 = "2020-04-20T00:00:00.000Z"
const day2 = "2020-04-21T00:00:00.000Z"
const day3 = "2020-04-22T00:00:00.000Z"
const day4 = "2020-04-23T00:00:00.000Z"
const day5 = "2020-04-24T00:00:00.000Z"
const day6 = "2020-04-25T00:00:00.000Z"

// Define an object dateIndex that will tell the index of a given date in table and if
// date is not present in calendar view then undefined.

let dateIndex = {
  [day1]: 1,
  [day2]: 2,
  [day3]: 3,
  [day4]: 4,
  [day5]: 5,
  [day6]: 6,
}

const initialState = workOrderList

// Define reducer for updating Calendar State
function reducer(state, action) {
  let updatedJob
  switch (action.type) {
    case ASSIGN_JOB:
      updatedJob = state.job.map((job) => {
        if (job.jobname === action.value.job) {
          let workOrderCloneArray = job.workorders
          let updatedWorkOrders = workOrderCloneArray.map((workorder) => {
            if (workorder.name === action.value.workOrder.name) {
              return {
                ...workorder,
                Employee: action.employee.Name,
                job: job.jobname,
              }
            } else return workorder
          })
          return { jobname: job.jobname, workorders: updatedWorkOrders }
        } else return job
      })
      let newState = { job: updatedJob }
      return newState
    case CANCEL_ASSIGNMENT:
      updatedJob = state.job.map((job) => {
        if (job.jobname === action.job) {
          let updatedWorkOrders = job.workorders.map((workorder) => {
            if (workorder.name === action.name) {
              let clonedWorkOrder = { ...workorder }
              delete clonedWorkOrder.Employee
              return clonedWorkOrder
            } else return workorder
          })
          return { jobname: job.jobname, workorders: updatedWorkOrders }
        } else return job
      })
      let updatedStateAfterRemove = { job: updatedJob }
      return updatedStateAfterRemove
    default:
      return state
  }
}

// function generateTableData generates table data from the state.

function generateTableData(state) {
  // Table Heading - dates here, first one is null as it is column of row headings.
  const calendarHeadingRowOfDates = [
    null,
    { cellType: "text", data: day1 },
    { cellType: "text", data: day2 },
    { cellType: "text", data: day3 },
    { cellType: "text", data: day4 },
    { cellType: "text", data: day5 },
    { cellType: "text", data: day6 },
  ]
  // for employees first col represents employee name.
  const employeeRows = employeeList.Employess.map((employee) => [
    employee,
    null,
    null,
    null,
    null,
    null,
    null,
  ])
  // unassigned joborders in an array of array grouped according to their dates
  const unAssignedJobOrders = [null, [], [], [], [], [], []]
  const jobRows = state.job.map((job) => {
    let jobRowArray = [null, null, null, null, null, null, null]
    const { workorders } = job
    for (const workOrder of workorders) {
      // defines the table column for workorder based on date of work order
      let tableColumn = dateIndex[workOrder.Date]
      if (tableColumn) {
        // Check if this work order is assigned to some Employee.
        if (workOrder.Employee) {
          // need to change this to indexOf instead of workOrder.Employee
          let indexOfEmployeeInEmployeeList
          for (let i = 0; i < employeeList.Employess.length; i++) {
            if (employeeList.Employess[i].Name === workOrder.Employee) {
              indexOfEmployeeInEmployeeList = i
              break
            }
          }
          employeeRows[indexOfEmployeeInEmployeeList][tableColumn] = workOrder
          continue
        }
        jobRowArray[tableColumn] = { type: "jobRowData", data: workOrder }
        unAssignedJobOrders[tableColumn].push({ job: job.jobname, workOrder })
      }
    }
    return { job: job.jobname, rowData: jobRowArray }
  })
  return {
    dateHeading: calendarHeadingRowOfDates,
    employeeRows,
    unAssignedJobOrders,
    jobRows,
  }
}

function handleSave(state) {
  axios
    .post("http://wakencode.com/assignment/", state)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => console.log(err))
}

const TableRenderer = () => {
  // Describe the calendar state here
  // Calendar state will consist of three parts. First part with
  // 1. rows for assigned jobs per date to a user.
  // 2. rows of jobs available and unassigned workorder per date
  // 3. unassigned work orders on particular date
  const [calendarState, dispatchCalendarAction] = useReducer(
    reducer,
    workOrderList
  )

  return (
    <>
      <JobOrderDashboard
        tableData={generateTableData(calendarState)}
        dispatchCalendarAction={dispatchCalendarAction}
        handleSave={() => handleSave(calendarState)}
      />
    </>
  )
}

export default TableRenderer
export { ASSIGN_JOB, CANCEL_ASSIGNMENT }
