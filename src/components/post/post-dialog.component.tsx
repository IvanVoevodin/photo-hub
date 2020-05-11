import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Chat as ChatIcon, Close as CloseIcon, UnfoldMore } from "@material-ui/icons";
import { Dialog } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import IconTooltipButton from "../icon-tooltip-button.component";
import { Post } from "../../constant/domain.constant";
import { ReducerStateProp } from "../../redux/redux.constant";
import { getPost } from "../../redux/actions/data.action";
import { USERS_ROUTE } from "../../constant/app-route.constant";
import LikeButton from "./like-button.component";
import Comments from "./comments.component";
import commonStyle from "../../styles/common.style";
import CommentForm from "./comment-form.component";

const useCommonStyles = makeStyles(() => createStyles(commonStyle));
const useStyles = makeStyles(() =>
    createStyles({
        profileImage: {
            maxWidth: 200,
            height: 200,
            borderRadius: "50%",
            objectFit: "cover"
        },
        dialogContent: {
            padding: 20
        },
        closeButton: {
            marginTop: "8px",
            position: "absolute",
            left: "90%"
        },
        expandButton: {
            position: "absolute",
            left: "93%"
        },
        spinnerDiv: {
            textAlign: "center",
            marginTop: 50,
            marginBottom: 50
        }
    })
);

interface PostDialogProps {
    readonly postId: string
}

const PostDialog: React.FC<PostDialogProps> = (props: PostDialogProps) => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();

    const [open, setOpen] = useState(false);

    const {loading, post} = useSelector<ReducerStateProp, {loading: boolean, post?: Post}>(state => {
        return {loading: state.ui.loading, post: state.data.post}
    }, shallowEqual);
    const dispatch = useDispatch();

    const handleOpen = () => {
        setOpen(true);

        const {postId} = props;
        getPost(postId, dispatch);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!post) {
        return (
            <>
                <IconTooltipButton title="Expand post" onClick={handleOpen} buttonStyleName={classes.expandButton}>
                    <UnfoldMore color="primary"/>
                </IconTooltipButton>
            </>
        )
    }

    const {postId, userName, userImage, creationTime, message, likeCount, commentCount, comments} = post;

    const dialogMarkup = loading ? (
        <div className={classes.spinnerDiv}>
            <CircularProgress size={200} thickness={2}/>
        </div>
    ) : (
        <Grid container spacing={2}>
            <Grid item sm={5}>
                <img src={userImage} alt="Profile" className={classes.profileImage}/>
            </Grid>
            <Grid item sm={7}>
                <Typography component={Link} color="primary" variant="h5" to={`${USERS_ROUTE}/${userName}`}>
                    @{userName}
                </Typography>
                <hr className={commonClasses.invisibleSeparator}/>
                <Typography variant="body2" color="textSecondary">
                    {dayjs(creationTime).format("h:mm a, MMMM DD YYYY")}
                </Typography>
                <hr className={commonClasses.invisibleSeparator}/>
                <Typography variant="body1">{message}</Typography>

                <LikeButton postId={postId}/>
                <span>{likeCount} Likes</span>

                <IconTooltipButton title="Comments">
                    <ChatIcon color="primary"/>
                </IconTooltipButton>
                <span>{commentCount} Comments</span>
            </Grid>
            <hr className={commonClasses.separator}/>
            <CommentForm postId={postId}/>
            <Comments comments={comments}/>
        </Grid>
    );

    return (
        <>
            <IconTooltipButton title="Expand post" onClick={handleOpen} buttonStyleName={classes.expandButton}>
                <UnfoldMore color="primary"/>
            </IconTooltipButton>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <IconTooltipButton title="Close" onClick={handleClose} buttonStyleName={classes.closeButton}>
                    <CloseIcon/>
                </IconTooltipButton>
                <DialogContent className={classes.dialogContent}>
                    {dialogMarkup}
                </DialogContent>
            </Dialog>
        </>
    )
};

export default PostDialog
