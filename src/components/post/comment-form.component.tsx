import React, { FormEvent, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { CLEAR_ERRORS, ReducerStateProp, UiCommonState, UserSate } from "../../redux/redux.constant";
import { createComment } from "../../redux/actions/data.action";
import commonStyle from "../../styles/common.style";

const useStyles = makeStyles(() =>
    createStyles(commonStyle)
);

const useCustomStyles = makeStyles(() =>
    createStyles({
        submitButton: {
            position: "relative",
            float: "right",
            marginBottom: "10px"
        }
    })
);

interface CommentFormProps {
    readonly postId: string
}

const CommentForm: React.FC<CommentFormProps> = (props: CommentFormProps) => {
    const classes = useStyles();
    const customClasses = useCustomStyles();

    const [message, setMessage] = useState("");

    const {authenticated, commonErrors: {error}} = useSelector<ReducerStateProp, UserSate & UiCommonState>(state => {
        return {...state.user, commonErrors: state.ui.commonErrors}
    }, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({type: CLEAR_ERRORS})
    }, [dispatch]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const {postId} = props;
        createComment(postId, message, dispatch);
        setMessage("");
    };

    return authenticated ? (
        <Grid item sm={12} style={{textAlign: "center"}}>
            <form onSubmit={handleSubmit}>
                <TextField name="message" type="text" label="Comment on post" fullWidth className={classes.textField} value={message}
                           error={!!error} helperText={error}
                           onChange={event => setMessage(event.target.value)}/>
                <Button type="submit" variant="contained" color="primary" className={customClasses.submitButton}>
                    Submit
                </Button>
            </form>
            <hr className={classes.separator}/>
        </Grid>
    ) : null;
};

export default CommentForm
