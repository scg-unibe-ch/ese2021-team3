import {PostAttributes, Post} from '../models/post.model';
import {MulterRequest} from '../models/multerRequest.model';
import {upload} from '../middlewares/fileFilter';
import {User} from '../models/user.model';

export class PostService {
    // CRUD Operations
    public create(post: PostAttributes): Promise<PostAttributes> {
        return this.isAdmin(post.userId).then(isAdmin => {
            if (!isAdmin) { /*Reject request if user is admin*/
                if ((post.title == null) || (post.title === '')) {
                    return Promise.reject({error: 'titleIsEmpty', message: 'Title cannot be emtpy' });
                } else if ((post.category == null) || (post.category === '')) {
                    return Promise.reject({error: 'categoryEmpty', message: 'Category cannot be emtpy' });
                } else {
                    return Post.create(post).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
                }
            }
            return Promise.reject({error: 'not_authorized', message: 'Admins are not authorized to create Posts' });
        });
    }

    public edit(post: PostAttributes): Promise<PostAttributes> {
        return Post.findByPk(post.postId)
            .then(found => {
                if (!found) {
                    return Promise.reject({error: 'Post_not_found', message: 'Cant find Post nr.' + post.postId});
                } else {
                    return this.isAdmin(post.userId).then( isAdmin => {
                        if ((found.userId !== post.userId) && (!isAdmin)) { /*Check if user is owner of Post or Admin*/
                            // tslint:disable-next-line:max-line-length
                            return Promise.reject({error: 'not_authorized', message: 'Youre not authorized to modify post: ' + post.postId});
                        }
                        return new Promise<PostAttributes>((resolve, reject) => {
                            post.userId = found.userId; /*To surpress overwrite of userid in case of an admin is editing the post*/
                            found.update(post);
                            resolve(found);
                        });
                    });
                }
            });
    }

    public delete(post: PostAttributes): Promise<PostAttributes> {
        return Post.findByPk(post.postId)
            .then(found => {
                if (!found) {
                    return Promise.reject({error: 'Post_not_found', message: 'Cant find Post nr.' + post.postId});
                } else {
                    return this.isAdmin(post.userId).then( isAdmin => {
                        if ((found.userId !== post.userId) && (!isAdmin)) { /*Check if user is owner of Post or Admin*/
                            // tslint:disable-next-line:max-line-length
                            return Promise.reject({error: 'not_authorized', message: 'Youre not authorized to modify post: ' + post.postId});
                        }
                        return new Promise<PostAttributes>((resolve, reject) => {
                            found.destroy();
                            resolve(found);
                        });
                    });
                }
            });
    }

    public addImage(req: MulterRequest): Promise<PostAttributes> {
        return Post.findByPk(req.params.id)
            .then(found => {
                if (!found) {
                    return Promise.reject({error: 'Post_not_found', message: 'Cant find Post nr.' + req.params.id});
                } else {
                    console.log(found.userId + ' ' + req.body.userId);
                    if (found.userId !== req.body.userId) {
                        return Promise.reject({error: 'not_authorized', message: 'Youre not authorized to modify post: ' + req.params.id});
                    }
                    return new Promise<PostAttributes>((resolve, reject) => {
                        upload.single('image')(req, null, (error: any) => {
                            if ((error === undefined) && (req.file !== undefined)) {
                                found.image = 'images/' + req.file.filename;
                                found.update({
                                    image: found.image
                                });
                                resolve(found);
                            } else {
                                reject({error: 'Upload_Error', message: 'Cant upload image!'});
                            }
                        });
                    });
                }
            });
            /*.catch(err => Promise.reject({error: 'Upload_Error', message: 'Cant upload image! '}));*/
    }

    private async isAdmin(userId: number): Promise<boolean> {
        return User.findByPk(userId).then(found => {
            if (!found) {
                return false;
            } else {
                return found.admin;
            }
        });
    }
}
