export class Order {
    constructor(
        public orderId: number,
        public address: string,
        public userId: number,
        public productId: number[],
        public status: string,
        public paymentMethod: string,
    ) { }
}