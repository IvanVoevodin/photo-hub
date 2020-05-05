import React, { useCallback, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Edit as EditIcon } from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { editUserDetails } from "../redux/actions/user.action";
import { UserCredentials } from "../constant/domain.constant";
import IconTooltipButton from "./icon-tooltip-button.component";

const useStyles = makeStyles(() =>
    createStyles({
        button: {
            float: "right"
        },
        textField: {
            margin: "10px auto 10px auto"
        }
    })
);

interface EditDetailsProps {
    readonly credentials: UserCredentials
}

const EditDetails: React.FC<EditDetailsProps> = (props: EditDetailsProps) => {
    const {credentials} = props;
    const classes = useStyles();

    const dispatch = useDispatch();

    const [stateBio, setBio] = useState("");
    const [stateWebsite, setWebsite] = useState("");
    const [stateLocation, setLocation] = useState("");
    const [open, setOpen] = useState(false);

    const setUserDetails = useCallback(() => {
        const {bio, website, location} = credentials;
        setBio(bio || "");
        setWebsite(website || "");
        setLocation(location || "");
    }, [credentials]);

    useEffect(() => {
        setUserDetails()
    }, [setUserDetails]);

    const handleOpen = () => {
        setOpen(true);
        setUserDetails();
    };

    const handleClose = () => {
        setOpen(false)
    };

    const handleSubmit = () => {
        editUserDetails({...props.credentials, bio: stateBio, website: stateWebsite, location: stateLocation}, dispatch);
        handleClose();
    };

    return (
        <>
            <IconTooltipButton title="Edit details" onClick={handleOpen} buttonStyleName={classes.button}>
                <EditIcon color="primary"/>
            </IconTooltipButton>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit your details</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField name="bio" type="text" label="Bio" fullWidth multiline placeholder="A short about yourself" rows={3} className={classes.textField} color="secondary" value={stateBio}
                                   onChange={event => setBio(event.target.value)}/>
                        <TextField name="website" type="text" label="Website" fullWidth multiline placeholder="You personal/professional website" className={classes.textField} color="secondary"
                                   value={stateWebsite}
                                   onChange={event => setWebsite(event.target.value)}/>
                        <TextField name="location" type="text" label="Location" fullWidth multiline placeholder="Where your leave" className={classes.textField} color="secondary" value={stateLocation}
                                   onChange={event => setLocation(event.target.value)}/>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default EditDetails
