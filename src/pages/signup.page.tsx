import React, { FormEvent, useState } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Link, useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SIGNUP_ROUT } from "../constant/rest-api.constant";
import { HOME_ROUTE, LOGIN_ROUTE } from "../constant/app-route.constant";
import LoginIcon from "../images/login-icon.png";
import { FB_TOKEN_KEY } from "../constant/domain.constant";
import authStyle from "../styles/auth.style";

const useStyles = makeStyles(() =>
    createStyles(authStyle)
);

interface SignupError {
    readonly email?: string;
    readonly password?: string;
    readonly confirmPassword?: string;
    readonly error?: string;
    readonly handle?: string;
}

const Signup: React.FC = () => {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [handle, setHandle] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<SignupError>({});
    const history = useHistory();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        axios.post(SIGNUP_ROUT, {
            email,
            password,
            confirmPassword,
            handle
        }).then(response => {
            localStorage.setItem(FB_TOKEN_KEY, `Bearer ${response.data.token}`);
            setLoading(false);
            history.push(HOME_ROUTE);
        }).catch(error => {
            setErrors(error.response.data);
            setLoading(false);
        })
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
                               helperText={errors.handle} error={!!errors.handle}
                               value={handle} onChange={event => setHandle(event.target.value)}/>
                    <TextField id="email" name="email" type="email" label="Email" fullWidth className={classes.textField}
                               helperText={errors.email} error={!!errors.email}
                               value={email} onChange={event => setEmail(event.target.value)}/>
                    <TextField id="password" name="password" type="password" label="Password" fullWidth className={classes.textField}
                               helperText={errors.password} error={!!errors.password}
                               value={password} onChange={event => setPassword(event.target.value)}/>
                    <TextField id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" fullWidth className={classes.textField}
                               helperText={errors.confirmPassword} error={!!errors.confirmPassword}
                               value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)}/>
                    {errors.error && (<Typography variant="body2" className={classes.customError}>{errors.error}</Typography>)}
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