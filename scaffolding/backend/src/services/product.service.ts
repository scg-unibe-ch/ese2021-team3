import {Post, PostAttributes} from '../models/post.model';
import {MulterRequest} from '../models/multerRequest.model';
import {upload} from '../middlewares/fileFilter';
import {User} from '../models/user.model';
import {Product, ProductAttributes} from '../models/product.model';

export class ProductService {
    // CRUD Operations
    public create(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.create(product).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
    }

    public delete(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.findByPk(product.productId)
            .then(found => {
                if (!found) {
                    return Promise.reject({error: 'Product_not_found', message: 'Cant find Product nr.' + product.productId});
                } else {
                    // @ts-ignore
                    return this.isAdmin(product.userId).then( isAdmin => {
                        if (!isAdmin) { /*Check if user is owner of Post or Admin*/
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
