import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Add as AddIcon, Close as CloseIcon } from "@material-ui/icons";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { Dialog } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ReducerStateProp, UiCommonState } from "../../redux/redux.constant";
import IconTooltipButton from "../icon-tooltip-button.component";
import { createPost } from "../../redux/actions/data.action";
import clearErrors from "../../redux/actions/ui.action";

const useStyles = makeStyles(() =>
    createStyles({
        textField: {
            marginBottom: "20px"
        },
        submitButton: {
            position: "relative",
            float: "right",
            marginBottom: "10px"
        },
        progressSpinner: {
            position: "absolute"
        },
        closeButton: {
            position: "absolute",
            left: "90%",
            top: "5%"
        }
    }),
);

const CreatePost: React.FC = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const {loading, commonErrors: {error}} = useSelector<ReducerStateProp, UiCommonState>(state => state.ui, shallowEqual);
    const dispatch = useDispatch();

    const handleOpen = () => {
        setOpen(true)
    };

    const handleClose = useCallback(() => {
        clearErrors(dispatch);
        setOpen(false);
    }, [dispatch]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        createPost(message, dispatch);
        setMessage("");
    };

    useEffect(() => {
        if (!error && !loading) {
            handleClose()
        }
    }, [error, handleClose, loading]);

    return (
        <>
            <IconTooltipButton title="Make a post" onClick={handleOpen}>
                <AddIcon/>
            </IconTooltipButton>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <IconTooltipButton title="Close" onClick={handleClose} buttonStyleName={classes.closeButton}>
                    <CloseIcon/>
                </IconTooltipButton>
                <DialogTitle>Make new post</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField name="message" type="text" label="Post" multiline rows={3} fullWidth placeholder="Make new post for all" error={!!error} helperText={error}
                                   className={classes.textField} onChange={event => setMessage(event.target.value)}/>
                        <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={loading}>
                            Submit
                            {loading && <CircularProgress size={30} className={classes.progressSpinner}/>}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
};

export default CreatePost
