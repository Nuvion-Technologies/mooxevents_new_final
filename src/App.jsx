import React from "react";
import AppRoutes from "./routes";
import '@fortawesome/fontawesome-free/css/all.min.css';
import CustomCursor from "./components/CustomCursor";


const App = () => {
  return (
    < >
      <CustomCursor />
      <div className="">
        <AppRoutes />
      </div>
    </>
  );
};

export default App;
