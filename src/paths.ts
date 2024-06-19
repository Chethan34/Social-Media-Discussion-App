const paths ={
    home() {
        return '/'
//path finders made easier to redirect to different pages.
    },
    topicShow(topicSlug: string){
        return `/topics/${topicSlug}`;

    },
    postCreate(topicSlug: string){
        return `/topic/${topicSlug}/posts/new`;

    },
    postShow(topicSlug: string, postId: string){
        return `/topics/${topicSlug}/posts/${postId}`

    }
};

export default paths;