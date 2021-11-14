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
            console.log(err);
            res.status(500).send(err);
        });
    }
);


export const ProductController: Router = productController;
