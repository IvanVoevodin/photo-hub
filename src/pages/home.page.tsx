import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import Post from "../components/post.component";
import Profile from "../components/profile.component";
import { loadPosts } from "../redux/actions/data.action";
import { DataState, ReducerStateProp } from "../redux/redux.constant";

const Home: React.FC = () => {
    const dispatch = useDispatch();

    const {posts, loading} = useSelector<ReducerStateProp, DataState>(state => state.data);

    useEffect(() => {
        loadPosts(dispatch);
    }, [dispatch]);

    const recentPostsMarkup = !loading ?
        posts.map(post => <Post key={post.postId} post={post}/>) :
        <p>Loading...</p>;

    return (
        <Grid container spacing={2}>
            <Grid item sm={8} xs={12}>
                {recentPostsMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                <Profile/>
            </Grid>
        </Grid>
    )
};

export default Home
