import {Order, OrderAttributes} from '../models/order.model';

export class OrderService {
    // CRUD Operations
    public create(order: OrderAttributes): Promise<OrderAttributes> {
        return Order.create(order).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
    }
}
