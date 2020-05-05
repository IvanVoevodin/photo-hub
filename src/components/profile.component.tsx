import React, { ChangeEvent } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { Link as ReactLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { CalendarToday, Edit as EditIcon, KeyboardReturn, Link as LinkIcon, LocationOn } from "@material-ui/icons";
import dayjs from "dayjs";
import Button from "@material-ui/core/Button";
import { LOGIN_ROUTE, SIGNUP_ROUTE, USERS_ROUTE } from "../constant/app-route.constant";
import profileStyle from "../styles/profile.style";
import { ReducerStateProp, UserSate } from "../redux/redux.constant";
import { logoutUser, uploadImage } from "../redux/actions/user.action";
import EditDetails from "./edit-details.component";
import IconTooltipButton from "./icon-tooltip-button.component";

const useStyles = makeStyles(() =>
    createStyles(profileStyle)
);

const Profile: React.FC = () => {
    const classes = useStyles();

    const {authenticated, loading, credentials} = useSelector<ReducerStateProp, UserSate>(state => state.user, shallowEqual);
    const dispatch = useDispatch();

    if (loading) {
        return <p>loading...</p>
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const image = event.target.files?.item(0);
        if (image) {
            const formData = new FormData();
            formData.append("image", image, image.name);
            uploadImage(formData, dispatch);
        }
    };

    const handleEditPicture = () => {
        const fileEdit = document.getElementById("imageInput");
        if (fileEdit) {
            fileEdit.click()
        }
    };

    const handleLogout = () => {
        logoutUser(dispatch)
    };

    return authenticated ? (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={credentials.imageUrl} alt="Profile" className="profile-image"/>
                    <input type="file" id="imageInput" hidden onChange={handleImageChange}/>
                    <IconTooltipButton title="Edit profile picture" onClick={handleEditPicture} buttonStyleName="button">
                        <EditIcon color="primary"/>
                    </IconTooltipButton>
                </div>
                <hr/>
                <div className="profile-details">
                    <Link component={ReactLink} to={`${USERS_ROUTE}/${credentials.handle}`} color="primary" variant="h5">
                        @{credentials.handle}
                    </Link>
                    <hr/>
                    {credentials.bio && <Typography variant="body2">{credentials.bio}</Typography>}
                    <hr/>
                    {credentials.location && (
                        <>
                            <LocationOn color="primary"/>
                            <span>{credentials.location}</span>
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
                    <CalendarToday color="primary" style={{paddingRight: "5px"}}/>
                    <span>Joined {dayjs(credentials.creationTime).format("MMM YYYY")}</span>
                </div>
                <IconTooltipButton title="Logout" onClick={handleLogout}>
                    <KeyboardReturn color="primary"/>
                </IconTooltipButton>
                <EditDetails credentials={credentials}/>
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
