import {PostAttributes, Post} from '../models/post.model';
import {MulterRequest} from '../models/multerRequest.model';
import {ItemImage, ItemImageAttributes} from '../models/itemImage.model';
import {TodoItem} from '../models/todoitem.model';
import {upload} from '../middlewares/fileFilter';

export class PostService {
    // CRUD Operations
    public create(post: PostAttributes): Promise<PostAttributes> {
        if (post.title == null) {
            return Promise.reject({error: 'titleIsEmpty', message: 'Title cannot be emtpy' });
        } else {
            return Post.create(post).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
        }
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
                                found.image = '/images/' + req.file.filename;
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

}
