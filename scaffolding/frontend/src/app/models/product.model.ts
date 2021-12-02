export class Product {
    constructor(
        public productId: number,
        public title: string,
        public description: string,
        public image: string,
        public price: number,
        public category: string,
        public userId: number,
    ) { }
}