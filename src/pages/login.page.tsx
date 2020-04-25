import React, { FormEvent, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Link, useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SIGNUP_ROUTE } from "../constant/app-route.constant";
import LoginIcon from "../images/login-icon.png";
import authStyle from "../styles/auth.style"
import { loginUser } from "../redux/actions/user.action";
import { ReducerStateProp, UiLoginState } from "../redux/redux.constant";

const useStyles = makeStyles(() =>
    createStyles(authStyle)
);

const Login: React.FC = () => {
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {loading, loginErrors} = useSelector<ReducerStateProp, UiLoginState>((state: ReducerStateProp) => {
        return {
            loading: state.ui.loading,
            loginErrors: state.ui.loginErrors
        }
    }, shallowEqual);

    const history = useHistory();
    const dispatch = useDispatch();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        loginUser({email, password}, history, dispatch);
    };

    return (
        <Grid container className={classes.form}>
            <Grid item sm/>
            <Grid item sm>
                <img src={LoginIcon} alt="Login" className={classes.image}/>
                <Typography variant="h2" className={classes.pageTitle}>
                    Login
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField id="email" name="email" type="email" label="Email" fullWidth className={classes.textField}
                               helperText={loginErrors.email} error={!!loginErrors.email}
                               value={email} onChange={event => setEmail(event.target.value)}/>
                    <TextField id="password" name="password" type="password" label="Password" fullWidth className={classes.textField}
                               helperText={loginErrors.password} error={!!loginErrors.password}
                               value={password} onChange={event => setPassword(event.target.value)}/>
                    {loginErrors.general && (<Typography variant="body2" className={classes.customError}>{loginErrors.general}</Typography>)}
                    <Button type="submit" variant="contained" color="secondary" className={classes.button} disabled={loading}>
                        Login
                        {loading && (<CircularProgress size={24} className={classes.progress}/>)}
                    </Button>
                    <br/>
                    <small>Dont have a account? Sing up <Link to={SIGNUP_ROUTE}>here</Link></small>
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    )
};

export default Login
