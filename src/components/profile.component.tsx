import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { Link as ReactLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { CalendarToday, Link as LinkIcon, LocationOn } from "@material-ui/icons";
import dayjs from "dayjs";
import Button from "@material-ui/core/Button";
import { LOGIN_ROUTE, SIGNUP_ROUTE, USERS_ROUTE } from "../constant/app-route.constant";
import profileStyle from "../styles/profile.style";
import { ReducerStateProp, UserSate } from "../redux/redux.constant";

const useStyles = makeStyles(() =>
    createStyles(profileStyle)
);

const Profile: React.FC = () => {
    const classes = useStyles();

    const {authenticated, loading, credentials} = useSelector<ReducerStateProp, UserSate>(state => state.user, shallowEqual);

    if (loading) {
        return <p>loading...</p>
    }

    return authenticated ? (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={credentials.imageUrl} alt="Profile" className="profile-image"/>
                </div>
                <hr/>
                <div className="profile-details">
                    <Link component={ReactLink} to={`${USERS_ROUTE}/${credentials.handle}`} color="primary" variant="h5">
                        @{credentials.handle}
                    </Link>
                </div>
                <hr/>
                {credentials.bio && <Typography variant="body2">{credentials.bio}</Typography>}
                <hr/>
                {credentials.location && (
                    <>
                        <LocationOn color="primary"/>
                        <span>credentials.location</span>
                        <hr/>
                    </>
                )}
                {credentials.website && (
                    <>
                        <LinkIcon color="primary"/>
                        <a href={credentials.website} target="_blank" rel="noopener noreferrer">
                            {credentials.website}
                        </a>
                        <hr/>
                    </>
                )}
                <div className="calendar-wrapper">
                    <CalendarToday color="primary" style={{paddingRight: "5px"}}/>
                    <span>Joined {dayjs(credentials.creationTime).format("MMM YYYY")}</span>
                </div>
            </div>
        </Paper>
    ) : (
        <Paper className={classes.paper}>
            <Typography variant="body2" align="center">
                No profile found, please login again
            </Typography>
            <div className={classes.buttons}>
                <Button variant="contained" color="primary" component={ReactLink} to={LOGIN_ROUTE}>Login</Button>
                <Button variant="contained" color="secondary" component={ReactLink} to={SIGNUP_ROUTE}>Signup</Button>
            </div>
        </Paper>
    )
};

export default Profile
