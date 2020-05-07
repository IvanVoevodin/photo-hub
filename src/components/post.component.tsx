import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Chat as ChatIcon, Favorite as FavoriteIcon, FavoriteBorder } from "@material-ui/icons";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Post as PostType } from "../constant/domain.constant";
import { LOGIN_ROUTE, USERS_ROUTE } from "../constant/app-route.constant";
import IconTooltipButton from "./icon-tooltip-button.component";
import { ReducerStateProp, UserSate } from "../redux/redux.constant";
import { likePost, unlikePost } from "../redux/actions/data.action";
import DeletePost from "./delete-post.component";
import PostDialog from "./post-dialog.component";

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
    const dispatch = useDispatch();

    const {authenticated, likes, credentials: {handle}} = useSelector<ReducerStateProp, UserSate>(state => state.user, shallowEqual);

    const isPostLiked = (): boolean => !!likes.find(like => like.postId === postId);
    const likeThisPost = () => likePost(postId, dispatch);
    const unlikeThisPost = () => unlikePost(postId, dispatch);

    const authLikeButton = isPostLiked() ? (
        <IconTooltipButton title="Unlike" onClick={unlikeThisPost}>
            <FavoriteIcon color="primary"/>
        </IconTooltipButton>
    ) : (
        <IconTooltipButton title="Like" onClick={likeThisPost}>
            <FavoriteBorder color="primary"/>
        </IconTooltipButton>
    );

    const likeButton = !authenticated ? (
        <IconTooltipButton title="Like">
            <Link to={LOGIN_ROUTE}>
                <FavoriteBorder color="primary"/>
            </Link>
        </IconTooltipButton>
    ) : authLikeButton;

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
                {likeButton}
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
