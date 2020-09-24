import React from "react"
import logo from "./logo.svg"
import "./App.css"
import JobOrderDashboard from "./apps/views/JobOrderDashboard"
import TableRenderer from "./apps/components/TableRenderer"

function App() {
  return (
    <div className="App">
      <TableRenderer />
    </div>
  )
}

export default App
