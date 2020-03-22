import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Post as PostType } from "../constant/domain.constant";
import { USERS_ROUTE } from "../constant/app-route.constant";

dayjs.extend(relativeTime);

const useStyles = makeStyles(() =>
    createStyles({
        card: {
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
    const {userName, userImage, message, creationTime} = post;
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardMedia image={userImage} title="Profile image" className={classes.image}/>
            <CardContent className={classes.content}>
                <Typography variant="h5" component={Link} to={`${USERS_ROUTE}/${userName}`} color="primary">{userName}</Typography>
                <Typography variant="body2" color="textSecondary">{dayjs(creationTime).fromNow()}</Typography>
                <Typography variant="body1">{message}</Typography>
            </CardContent>
        </Card>
    )
};

export default Post