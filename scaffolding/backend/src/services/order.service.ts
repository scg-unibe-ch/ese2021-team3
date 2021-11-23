import {Order, OrderAttributes} from '../models/order.model';
import {Post} from '../models/post.model';
import {or} from 'sequelize';
import {User} from '../models/user.model';

export class OrderService {
    // CRUD Operations
    public create(order: OrderAttributes): Promise<OrderAttributes> {
        order.status = 'Pending';
        return Order.create(order).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
    }

    public changeStatus(orderId: string, newStatus: string): Promise<OrderAttributes> {
        return Order.findByPk(orderId)
            .then(found => {
                if (!found) {
                    return Promise.reject({error: 'cant_find_order', message: 'Cannot find order nr: ' + orderId});
                }
                found.update({
                    status: newStatus
                });
                return found;
            });
    }

    public cancel(orderId: string, userId: string) {
        return Order.findByPk(orderId)
            .then (found => {
                if (!found) {
                    return Promise.reject({error: 'cant_find_order', message: 'Cannot find order nr: ' + orderId});
                }
                if (found.userId.toString() !== userId.toString()) {
                    return Promise.reject({error: 'Unauthorized', message: 'Youre not allowed to change order nr: ' + orderId});
                }
                found.update({
                    status: 'canceled'
                });
                return found;
            });
    }

    public getAll(): Promise<Order[]> {
        return Order.findAll();
    }
}
