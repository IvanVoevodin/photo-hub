import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import dayjs from "dayjs";
import { USERS_ROUTE } from "../../constant/app-route.constant";
import { Comment } from "../../constant/domain.constant"
import commonStyle from "../../styles/common.style";

const useCommonStyles = makeStyles(() => createStyles(commonStyle));
const useStyles = makeStyles(() =>
    createStyles({
        commentImage: {
            maxWidth: "100%",
            height: 100,
            objectFit: "cover",
            borderRadius: "50%"
        },
        commentData: {
            marginLeft: 20
        }
    })
);

interface CommentsProps {
    readonly comments: Comment[]
}

const Comments: React.FC<CommentsProps> = (props: CommentsProps) => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();

    const {comments} = props;
    return (
        <Grid container>
            {comments.map((comment, index) => {
                const {userName, userImage, message, creationTime} = comment;
                return (
                    <Fragment key={creationTime}>
                        <Grid item sm={12}>
                            <Grid container>
                                <Grid item sm={2}>
                                    <img src={userImage} alt="Comment" className={classes.commentImage}/>
                                </Grid>
                                <Grid item sm={9}>
                                    <div className={classes.commentData}>
                                        <Typography component={Link} color="primary" variant="h5" to={`${USERS_ROUTE}/${userName}`}>
                                            {userName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {dayjs(creationTime).format("h:mm a, MMMM DD YYYY")}
                                        </Typography>
                                        <hr className={commonClasses.invisibleSeparator}/>
                                        <Typography variant="body1">{message}</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        {index !== comments.length - 1 && (
                            <hr className={commonClasses.separator}/>
                        )}
                    </Fragment>
                )
            })}
        </Grid>
    )
};

export default Comments
