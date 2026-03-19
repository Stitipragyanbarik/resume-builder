// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// import ResumeBuilder from "./pages/ResumeBuilder.jsx";
// import AdminPanel from "./components/AdminPanel.jsx";

// function App() {
//   return (
//     <>
//       <ResumeBuilder />
//       <AdminPanel />
//     </>
//   );
// }

// export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);