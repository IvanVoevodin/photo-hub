import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Post as PostType } from "../constant/domain.constant";

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
    post: PostType
}

const Post: React.FC<PostProps> = (props: PostProps) => {
    const {post} = props;
    const {userName, userImage, message, creationTime} = post;
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardMedia image={userImage} title="Profile image" className={classes.image}/>
            <CardContent className={classes.content}>
                <Typography variant="h5" component={Link} to={`/users/${userName}`} color="primary">{userName}</Typography>
                <Typography variant="body2" color="textSecondary">{creationTime}</Typography>
                <Typography variant="body1">{message}</Typography>
            </CardContent>
        </Card>
    )
};

export default Post