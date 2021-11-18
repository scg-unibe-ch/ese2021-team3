import express, {Request, Response, Router} from 'express';
import {verifyToken} from '../middlewares/checkAuth';
import {checkAdmin} from '../middlewares/checkAdmin';
import {ProductService} from '../services/product.service';
import {Product} from '../models/product.model';
import {Op} from 'sequelize';
const productController: Router = express.Router();
const productService = new ProductService();


productController.post('/create', checkAdmin,
    (req: Request, res: Response) => {
        productService.create(req.body).then(post => res.send(post)).catch(err => {
            res.status(500).send(err);
        });
    }
);

productController.get('/get',
    (req: Request, res: Response) => {
        Product.findAll()
            .then(list => res.status(200).send(list))
            .catch(err => res.status(500).send(err));
    });

productController.delete('/:id', verifyToken,
    (req: Request, res: Response) => {
        req.body.userId = req.body.tokenPayload.userId;
        req.body.productId = req.params.id;
        productService.delete(req.body).then(product => res.send(product)).catch(err => {
            res.status(500).send(err);
        });
    }
);

productController.post('/getfiltered',
    (req: Request, res: Response) => {
        // tslint:disable-next-line:no-shadowed-variable
        const { Op } = require('sequelize');
        Product.findAll( { where: {
                category: {
                    [Op.substring]: req.body.category
                }
            }
        })
            .then(list => res.status(200).send(list))
            .catch(err => res.status(500).send(err));
    }
);


export const ProductController: Router = productController;
