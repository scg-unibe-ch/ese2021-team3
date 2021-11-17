import express, {Request, Response, Router} from 'express';
import {verifyToken} from '../middlewares/checkAuth';
import {OrderService} from '../services/order.service';

const orderController: Router = express.Router();
const orderService = new OrderService();


orderController.post('/create', verifyToken,
    (req: Request, res: Response) => {
        orderService.create(req.body).then(post => res.send(post)).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
    }
);


export const OrderController: Router = orderController;
