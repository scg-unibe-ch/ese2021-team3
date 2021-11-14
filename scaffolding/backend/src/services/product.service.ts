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
}
