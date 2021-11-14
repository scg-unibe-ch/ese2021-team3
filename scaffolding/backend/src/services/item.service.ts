import {upload} from '../middlewares/fileFilter';
import {TodoItem} from '../models/todoitem.model';
import {ItemImage, ItemImageAttributes} from '../models/itemImage.model';
import {MulterRequest} from '../models/multerRequest.model';
import {Console} from 'inspector';
import multer from 'multer';

export class ItemService {

    public addImage(req: MulterRequest): Promise<ItemImageAttributes> {
        console.log(req.params.id);
        return TodoItem.findByPk(req.params.id)
            .then(found => {
                if (!found) {
                    return Promise.reject('Product not found!');
                } else {
                    return new Promise<ItemImageAttributes>((resolve, reject) => {
                        upload.single('image')(req, null, (error: any) => {
                            ItemImage.create({ fileName: req.file.filename, todoItemId: found.todoItemId })
                                .then(created => resolve(created))
                                .catch(err => reject('Could not upload image! ' + err));
                        });
                    });
                }
            })
            .catch(err => Promise.reject('Could not upload image!' + err));
    }

    public getImageItem(imageId: number): Promise<ItemImage> {
        return ItemImage.findByPk(imageId)
            .then(image => {
                if (image) {
                    return Promise.resolve(image);
                } else {
                    return Promise.reject('image not found!');
                }
            })
            .catch(() => Promise.reject('could not fetch the image!'));
    }



}
