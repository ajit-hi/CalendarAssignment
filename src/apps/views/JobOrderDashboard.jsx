import React from "react"
import styled from "styled-components"
import { makeStyles } from "@material-ui/core/styles"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormHelperText from "@material-ui/core/FormHelperText"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import { ASSIGN_JOB, CANCEL_ASSIGNMENT } from "../components/TableRenderer"
import ClearIcon from "@material-ui/icons/Clear"
import Button from "@material-ui/core/Button"
import format from "date-fns/format"

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const Container = styled.div`
  padding: 35px 100px;
`
const PanelHeading = styled.h1`
  text-align: center;
  color: #707070;
  text-decoration: underline;
  font-family: "Kumbh Sans", sans-serif;
  font-size: 25px;
`

const TableContainer = styled.div`
  position: absolute;
`

const Table = styled.table`
  border-collapse: collapse;
  width: 800px;
`
const Tr = styled.tr`
  border-collapse: collapse;
  height: 50px;
`
const Td = styled.td`
  border-collapse: collapse;
  border: 1px solid gray;
  border-bottom: 1px dashed gray;
  border-top: 1px dashed gray;
`

const Th = styled.th`
  border: 1px solid gray;
  ${(props) =>
    props.scope === "row"
      ? `border-bottom: 1px dashed gray; border-top: 1px dashed gray;border-left:none;`
      : ""}
  min-width: 100px;
`
const ThTopRow = styled.th`
  border: 1px solid gray;
  ${(props) =>
    props.scope === "row"
      ? `border-bottom: 1px dashed gray; border-top: 1px dashed gray;border-left:none;`
      : null}
  ${(props) => (props.hasData ? "" : "border: none;")}
`

/* 
This component renders into view the Panel of work order. This is a top level component
which is composed of several components required for the app. like heading on top, table of job assignment.
*/
const JobOrderDashboard = ({
  tableData,
  dispatchCalendarAction,
  handleSave,
}) => {
  const classes = useStyles()
  return (
    <Container>
      <PanelHeading>WorkOrder Assignment tool</PanelHeading>
      <TableContainer>
        <div style={{ margin: 10, textAlign: "right" }}>
          <Button variant={"outlined"} onClick={handleSave}>
            Save
          </Button>
        </div>
        <Table style={{ borderCollapse: "collapse" }}>
          <thead>
            <Tr style={{ height: 50 }}>
              {tableData.dateHeading.map((item, index) => {
                return (
                  <ThTopRow key={index} hasData={item}>
                    {item && format(new Date(item.data), "dd-MMM-yy")}
                  </ThTopRow>
                )
              })}
            </Tr>
          </thead>
          <tbody>
            {tableData.employeeRows.map((rowData, rowIndex) => {
              return (
                <Tr key={rowIndex}>
                  {rowData.map((data, colIndex) => {
                    return colIndex ? (
                      <Td key={rowIndex + colIndex}>
                        {data ? (
                          <>
                            {data.name}
                            <Button
                              color="secondary"
                              variant="contained"
                              size={"small"}
                              onClick={() =>
                                dispatchCalendarAction({
                                  type: CANCEL_ASSIGNMENT,
                                  ...data,
                                })
                              }
                            >
                              <ClearIcon /> Unassign
                            </Button>
                          </>
                        ) : (
                          <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label"></InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={""}
                              onChange={(event) =>
                                dispatchCalendarAction({
                                  type: ASSIGN_JOB,
                                  value: event.target.value,
                                  employee: rowData[0],
                                })
                              }
                            >
                              {tableData.unAssignedJobOrders[colIndex].map(
                                (item) => {
                                  return (
                                    <MenuItem
                                      key={item.workOrder.name}
                                      value={item}
                                    >
                                      {item.workOrder.name}
                                    </MenuItem>
                                  )
                                }
                              )}
                            </Select>
                          </FormControl>
                        )}
                      </Td>
                    ) : (
                      <Th
                        key={data.Name}
                        scope={"row"}
                        style={rowIndex ? {} : { border: "none" }}
                      >
                        {data.Name}
                      </Th>
                    )
                  })}
                </Tr>
              )
            })}
          </tbody>
          <tfoot>
            {tableData.jobRows.map((row, rowIndex) => (
              <Tr style={{ border: "none" }} key={rowIndex}>
                {row.rowData.map((cellData, colIndex) => (
                  <Td style={{ border: "none" }} key={rowIndex + colIndex}>
                    {cellData ? (
                      <div
                        style={{
                          border: "1px solid gray",
                          width: "90%",
                          margin: "auto",
                          padding: "0 2px",
                        }}
                      >
                        <div style={{ borderBottom: "1px solid gray" }}>
                          {row.job}
                        </div>
                        <div>{cellData.data.name}</div>
                      </div>
                    ) : null}
                  </Td>
                ))}
              </Tr>
            ))}
          </tfoot>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default JobOrderDashboard
