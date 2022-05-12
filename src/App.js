import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//pages
import Register from "./pages/Register"
import Login from "./pages/Login"
import Room from "./pages/Room"

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={"/register"} component={Register} />
        <Route exact path={"/login"} component={Login} />
        <Route exact path={"/"} component={Room} />
      </Switch>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme={"colored"}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  )
}

export default App;