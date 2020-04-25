import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { Post as PostType } from "../constant/domain.constant";
import Post from "../components/post.component";
import { POSTS_ROUT } from "../constant/rest-api.constant";
import Profile from "../components/profile.component";

const Home: React.FC = () => {
    const [posts, setPosts] = useState<PostType[]>([]);

    useEffect(() => {
        axios.get(POSTS_ROUT)
            .then(response => setPosts(response.data))
            .catch(error => new Error(error))
    }, []);

    const recentPostsMarkup = posts.length ?
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
