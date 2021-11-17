import express, {Request, Response, Router} from 'express';
import {verifyToken} from '../middlewares/checkAuth';
import {OrderService} from '../services/order.service';
import {checkAdmin} from '../middlewares/checkAdmin';

const orderController: Router = express.Router();
const orderService = new OrderService();


orderController.post('/create', verifyToken,
    (req: Request, res: Response) => {
        req.body.userId = req.body.tokenPayload.userId;
        orderService.create(req.body).then(post => res.send(post)).catch(err => {
            res.status(500).send(err);
        });
    }
);

orderController.post('/:id/changeStatus', checkAdmin,
    (req: Request, res: Response) => {
        orderService.changeStatus(req.params.id, req.body.status).then(order => res.send(order)).catch(err => {
            res.status(500).send(err);
        });
    }
);


export const OrderController: Router = orderController;
