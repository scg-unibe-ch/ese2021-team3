import {Order, OrderAttributes} from '../models/order.model';
import {Post} from '../models/post.model';

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
                    return Promise.reject({error: 'Upload_Error', message: 'Cant upload image!'});
                }
                found.update({
                    status: newStatus
                });
                return found;
            });
    }
}
