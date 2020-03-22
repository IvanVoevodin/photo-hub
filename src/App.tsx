import React, { useEffect, useState } from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { MuiThemeProvider } from "@material-ui/core";
import JwtDecode from "jwt-decode";
import Home from "./pages/home.page";
import Login from "./pages/login.page";
import Signup from "./pages/signup.page";
import NavigationBar from "./components/navigation-bar.component";
import { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE } from "./constant/app-route.constant";
import themeOptions from "./styles/theme.style";
import FB_TOKEN_KEY, { TokenDto } from "./constant/domain.constant";
import AuthRoute from "./components/auth-route.component";

const theme = createMuiTheme(themeOptions);

const App: React.FC = () => {
    const [authentication, setAuthentication] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem(FB_TOKEN_KEY);
        if (token) {
            const decodedToken = JwtDecode<TokenDto>(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                setAuthentication(false);
            } else {
                setAuthentication(true);
            }
        }
    }, []);

    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <Router>
                    <NavigationBar/>
                    <div className="container">
                        <Switch>
                            <Route exact path={HOME_ROUTE} component={Home}/>
                            <AuthRoute path={LOGIN_ROUTE} component={Login} authenticated={authentication}/>
                            <AuthRoute path={SIGNUP_ROUTE} component={Signup} authenticated={authentication}/>
                        </Switch>
                    </div>
                </Router>
            </div>
        </MuiThemeProvider>
    )
};

export default App
