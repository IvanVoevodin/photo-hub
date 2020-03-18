import React, { FormEvent, useState } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Link, useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { LOGIN_ROUT } from "../constant/rest-api.constant";
import { HOME_ROUTE, SIGNUP_ROUTE } from "../constant/app-route.constant";
import LoginIcon from "../images/login-icon.png";

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            textAlign: "center"
        },
        image: {
            height: "164px",
            marginTop: "20px"
        },
        textField: {
            margin: "10px auto 10px auto"
        },
        pageTitle: {
            margin: "10px auto 10px auto"
        },
        button: {
            margin: "20px auto 10px auto"
        },
        customError: {
            color: "red",
            fontSize: "0.8rem",
            marginTop: 10
        },
        progress: {
            margin: "20px auto 10px auto"
        }
    })
);

interface LoginError {
    readonly email?: string;
    readonly password?: string;
    readonly general?: string;
}

const Login: React.FC = () => {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<LoginError>({});
    const history = useHistory();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        axios.post(LOGIN_ROUT, {
            email,
            password
        }).then(() => {
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
                    Login
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField id="email" name="email" type="email" label="Email" fullWidth className={classes.textField}
                               helperText={errors.email} error={!!errors.email}
                               value={email} onChange={event => setEmail(event.target.value)}/>
                    <TextField id="password" name="password" type="password" label="Password" fullWidth className={classes.textField}
                               helperText={errors.password} error={!!errors.password}
                               value={password} onChange={event => setPassword(event.target.value)}/>
                    {errors.general && (<Typography variant="body2" className={classes.customError}>{errors.general}</Typography>)}
                    <Button type="submit" variant="contained" color="secondary" className={classes.button} style={loading ? {display: "none"} : {}}>
                        Login
                    </Button>
                    {loading && (<CircularProgress className={classes.progress}/>)}
                    <br/>
                    <small>Dont have a account? Sing up <Link to={SIGNUP_ROUTE}>here</Link></small>
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    )
};

export default Login