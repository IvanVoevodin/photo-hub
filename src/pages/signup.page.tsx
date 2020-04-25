import React, { FormEvent, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Link, useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { LOGIN_ROUTE } from "../constant/app-route.constant";
import LoginIcon from "../images/login-icon.png";
import authStyle from "../styles/auth.style";
import { signupUser } from "../redux/actions/user.action";
import { ReducerStateProp, UiSignupState } from "../redux/redux.constant";

const useStyles = makeStyles(() =>
    createStyles(authStyle)
);

const Signup: React.FC = () => {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [handle, setHandle] = useState("");

    const {loading, signupErrors} = useSelector<ReducerStateProp, UiSignupState>((state: ReducerStateProp) => {
        return {
            loading: state.ui.loading,
            signupErrors: state.ui.signupErrors
        }
    }, shallowEqual);

    const history = useHistory();
    const dispatch = useDispatch();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        signupUser({email, password, confirmPassword, handle}, history, dispatch);
    };

    return (
        <Grid container className={classes.form}>
            <Grid item sm/>
            <Grid item sm>
                <img src={LoginIcon} alt="Login" className={classes.image}/>
                <Typography variant="h2" className={classes.pageTitle}>
                    Signup
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField id="handle" name="handle" type="text" label="Name" fullWidth className={classes.textField}
                               helperText={signupErrors.handle} error={!!signupErrors.handle}
                               value={handle} onChange={event => setHandle(event.target.value)}/>
                    <TextField id="email" name="email" type="email" label="Email" fullWidth className={classes.textField}
                               helperText={signupErrors.email} error={!!signupErrors.email}
                               value={email} onChange={event => setEmail(event.target.value)}/>
                    <TextField id="password" name="password" type="password" label="Password" fullWidth className={classes.textField}
                               helperText={signupErrors.password} error={!!signupErrors.password}
                               value={password} onChange={event => setPassword(event.target.value)}/>
                    <TextField id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" fullWidth className={classes.textField}
                               helperText={signupErrors.confirmPassword} error={!!signupErrors.confirmPassword}
                               value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)}/>
                    {signupErrors.error && (<Typography variant="body2" className={classes.customError}>{signupErrors.error}</Typography>)}
                    <Button type="submit" variant="contained" color="secondary" className={classes.button} disabled={loading}>
                        Signup
                        {loading && (<CircularProgress size={24} className={classes.progress}/>)}
                    </Button>
                    <br/>
                    <small>Already have an account? Login <Link to={LOGIN_ROUTE}>here</Link></small>
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    )
};

export default Signup
