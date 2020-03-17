import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE } from "../constant/app-route.constant";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
        },
    }),
);

const NavigationBar: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>Photo Hub</Typography>
                    <Button color="inherit" component={Link} to={HOME_ROUTE}>Home</Button>
                    <Button color="inherit" component={Link} to={LOGIN_ROUTE}>Login</Button>
                    <Button color="inherit" component={Link} to={SIGNUP_ROUTE}>Signup</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
};

export default NavigationBar