import express, {Request, Response, Router} from 'express';
import {UserService} from '../services/user.service';
import {verifyToken} from '../middlewares/checkAuth';
import {checkAdmin} from '../middlewares/checkAdmin';
import {PostService} from '../services/post.service';
import {ProductService} from '../services/product.service';

const productController: Router = express.Router();
const productService = new ProductService();


productController.post('/create', checkAdmin,
    (req: Request, res: Response) => {
        productService.create(req.body).then(post => res.send(post)).catch(err => {
            res.status(500).send(err);
        });
    }
);

productController.delete('/:id', verifyToken,
    (req: Request, res: Response) => {
        req.body.userId = req.body.tokenPayload.userId;
        req.body.productId = req.params.id;
        productService.delete(req.body).then(post => res.send(post)).catch(err => {
            res.status(500).send(err);
        });
    }
);


export const ProductController: Router = productController;
