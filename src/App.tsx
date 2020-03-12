import React from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/home.page";
import Login from "./pages/login.page";
import Signup from "./pages/signup.page";
import NavigationBar from "./components/navigation-bar.component";

const App: React.FC = () => {
    return (
        <div className="App">
            <Router>
                <NavigationBar/>
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/signup" component={Signup}/>
                    </Switch>
                </div>
            </Router>
        </div>
    )
};

export default App
