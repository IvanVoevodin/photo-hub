import React from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { MuiThemeProvider } from "@material-ui/core";
import Home from "./pages/home.page";
import Login from "./pages/login.page";
import Signup from "./pages/signup.page";
import NavigationBar from "./components/navigation-bar.component";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#515b5f",
            main: "#263238",
            dark: "#1a2327",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ffde33",
            main: "#ffd600",
            dark: "#b29500",
            contrastText: "#000",
        },
    }
});

const App: React.FC = () => {
    return (
        <MuiThemeProvider theme={theme}>
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
        </MuiThemeProvider>
    )
};

export default App
