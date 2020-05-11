import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Chat as ChatIcon } from "@material-ui/icons";
import { shallowEqual, useSelector } from "react-redux";
import { Post as PostType } from "../../constant/domain.constant";
import { USERS_ROUTE } from "../../constant/app-route.constant";
import IconTooltipButton from "../icon-tooltip-button.component";
import { ReducerStateProp, UserSate } from "../../redux/redux.constant";
import DeletePost from "./delete-post.component";
import PostDialog from "./post-dialog.component";
import LikeButton from "./like-button.component";

dayjs.extend(relativeTime);

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            position: "relative",
            display: "flex",
            marginBottom: 20
        },
        image: {
            minWidth: 200
        },
        content: {
            padding: 25,
            objectFit: "cover"
        }
    }),
);

interface PostProps {
    readonly post: PostType
}

const Post: React.FC<PostProps> = (props: PostProps) => {
    const {post} = props;
    const {postId, userName, userImage, message, creationTime, likeCount, commentCount} = post;
    const classes = useStyles();

    const {authenticated, credentials: {handle}} = useSelector<ReducerStateProp, UserSate>(state => state.user, shallowEqual);

    const deleteButton = authenticated && handle === userName ? (
        <DeletePost postId={postId}/>
    ) : null;

    return (
        <Card className={classes.card}>
            <CardMedia image={userImage} title="Profile image" className={classes.image}/>
            <CardContent className={classes.content}>
                <Typography variant="h5" component={Link} to={`${USERS_ROUTE}/${userName}`} color="primary">{userName}</Typography>
                {deleteButton}
                <Typography variant="body2" color="textSecondary">{dayjs(creationTime).fromNow()}</Typography>
                <Typography variant="body1">{message}</Typography>
                <LikeButton postId={postId}/>
                <span>{likeCount} Likes</span>
                <IconTooltipButton title="Comments">
                    <ChatIcon color="primary"/>
                </IconTooltipButton>
                <span>{commentCount} Comments</span>
                <PostDialog postId={postId}/>
            </CardContent>
        </Card>
    )
};

export default Post
