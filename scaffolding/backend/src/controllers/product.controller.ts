import express, {Request, Response, Router} from 'express';
import {verifyToken} from '../middlewares/checkAuth';
import {checkAdmin} from '../middlewares/checkAdmin';
import {ProductService} from '../services/product.service';
import {Product} from '../models/product.model';
import {Op} from 'sequelize';
import {MulterRequest} from '../models/multerRequest.model';
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
            .then(list => {
                const newList: Product[] = [];
                for (let i = 0; i < list.length; i++) {
                    if (!list[i].hidden) {
                        newList.push(list[i]);
                    }
                }
                res.status(200).send(newList);
            })
            .catch(err => res.status(500).send(err));
    });

productController.post('/:id/image', verifyToken,
    // tslint:disable-next-line:no-shadowed-variable
    (req: MulterRequest, res: Response) => {
        req.body.userId = req.body.tokenPayload.userId;
        productService.addImage(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
    });

productController.post('/edit', checkAdmin,
    (req: Request, res: Response) => {
        console.log('test');
        productService.edit(req.body).then(post => res.send(post)).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
    }
);

productController.post('/:id/delete', verifyToken,
    (req: Request, res: Response) => {
        req.body.userId = req.body.tokenPayload.userId;
        req.body.productId = req.params.id;
        productService.hide(req.body).then(product => res.send(product)).catch(err => {
            res.status(500).send(err);
        });
    }
);

productController.get('/:id/single', (req: Request, res: Response) => {
    Product.findByPk(req.params.id).then(async product => {
        res.status(200).send(product);
    })
        .catch(err => res.status(500).send(err));
});


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
            .then(list => {
                const newList: Product[] = [];
                for (let i = 0; i < list.length; i++) {
                    if (!list[i].hidden) {
                        newList.push(list[i]);
                    }
                }
                res.status(200).send(newList);
            })
            .catch(err => res.status(500).send(err));
    }
);


export const ProductController: Router = productController;
