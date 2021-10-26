import {PostAttributes, Post} from '../models/post.model';

export class PostService {
    // CRUD Operations
    public create(post: PostAttributes): Promise<PostAttributes> {
        if (post.title == null) {
            return Promise.reject({error: 'titleIsEmpty', message: 'Title cannot be emtpy' });
        } else {
            return Post.create(post).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
        }
    }
}
