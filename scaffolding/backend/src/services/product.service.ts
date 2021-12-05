import {MulterRequest} from '../models/multerRequest.model';
import {upload} from '../middlewares/fileFilter';
import {User} from '../models/user.model';
import {Product, ProductAttributes} from '../models/product.model';
import {Post, PostAttributes} from '../models/post.model';

export class ProductService {
    // CRUD Operations
    public create(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.create(product).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
    }

    public addImage(req: MulterRequest): Promise<ProductAttributes> {
        return Product.findByPk(req.params.id)
            .then(found => {
                if (!found) {
                    return Promise.reject({error: 'Product_not_found', message: 'Cant find Product nr.' + req.params.id});
                } else {
                    console.log(found.userId + ' ' + req.body.userId);
                    if (found.userId !== req.body.userId) {
                        return Promise.reject({
                            error: 'not_authorized',
                            message: 'Youre not authorized to modify product: ' + req.params.id
                        });
                    }
                    return new Promise<ProductAttributes>((resolve, reject) => {
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
    }

    public hide(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.findByPk(product.productId)
            .then(found => {
                if (!found) {
                    return Promise.reject({error: 'Product_not_found', message: 'Cant find Product nr.' + product.productId});
                } else {
                    return this.isAdmin(product.userId).then( isAdmin => {
                        if (!isAdmin) {
                            // tslint:disable-next-line:max-line-length
                            return Promise.reject({error: 'not_authorized', message: 'Youre not authorized to modify product: ' + product.productId});
                        }
                        return new Promise<ProductAttributes>((resolve, reject) => {
                            found.update({
                                hidden: true
                            });
                            resolve(found);
                        });
                    });
                }
            });
    }

    public edit(product: ProductAttributes): Promise<ProductAttributes> {

        return Product.findByPk(product.productId)
            .then(found => {
                if (!found) {
                    return Promise.reject({error: 'Product_not_found', message: 'Cant find Product no:' + product.productId});
                } else {
                    return new Promise<ProductAttributes>((resolve, reject) => {
                        if (product.image !== undefined) {
                            // tslint:disable-next-line:max-line-length
                            product.image = null; /*Remove image URL if anything is changed in image attribut (Only backend is able to define URL's)*/
                        }
                        found.update(product);
                        resolve(found);
                    });
                }
            });
    }

    public delete(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.findByPk(product.productId)
            .then(found => {
                if (!found) {
                    return Promise.reject({error: 'Product_not_found', message: 'Cant find Product nr.' + product.productId});
                } else {
                    // @ts-ignore
                    return this.isAdmin(product.userId).then( isAdmin => {
                        if (!isAdmin) {
                            // tslint:disable-next-line:max-line-length
                            return Promise.reject({error: 'not_authorized', message: 'Youre not authorized to modify product: ' + product.productId});
                        }
                        return new Promise<ProductAttributes>((resolve, reject) => {
                            found.destroy();
                            resolve(found);
                        });
                    });
                }
            });
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
