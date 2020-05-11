import React from "react";
import { Favorite as FavoriteIcon, FavoriteBorder } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { LOGIN_ROUTE } from "../../constant/app-route.constant";
import IconTooltipButton from "../icon-tooltip-button.component";
import { likePost, unlikePost } from "../../redux/actions/data.action";
import { ReducerStateProp, UserSate } from "../../redux/redux.constant";

interface LikeButtonProps {
    readonly postId: string
}

const LikeButton: React.FC<LikeButtonProps> = (props: LikeButtonProps) => {
    const {postId} = props;
    const dispatch = useDispatch();

    const {likes, authenticated} = useSelector<ReducerStateProp, UserSate>(state => state.user, shallowEqual);

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

    return !authenticated ? (
        <IconTooltipButton title="Like">
            <Link to={LOGIN_ROUTE}>
                <FavoriteBorder color="primary"/>
            </Link>
        </IconTooltipButton>
    ) : authLikeButton
};

export default LikeButton
