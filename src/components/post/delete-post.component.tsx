import React, { useState } from "react";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import { useDispatch } from "react-redux";
import { Dialog } from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { deletePost } from "../../redux/actions/data.action";
import IconTooltipButton from "../icon-tooltip-button.component";

const useStyles = makeStyles(() =>
    createStyles({
        deleteButton: {
            position: "absolute",
            left: "93%",
            top: "5%"
        }
    }),
);

interface DeletePostProps {
    readonly postId: string
}

const DeletePost: React.FC<DeletePostProps> = (props: DeletePostProps) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const handleOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    };

    const handleDeletePost = () => {
        const {postId} = props;
        deletePost(postId, dispatch);
        setOpen(false)
    };

    return (
        <>
            <IconTooltipButton title="Delete post" onClick={handleOpen} buttonStyleName={classes.deleteButton}>
                <DeleteOutline color="secondary"/>
            </IconTooltipButton>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Are you sure you want to delete post?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeletePost} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default DeletePost
