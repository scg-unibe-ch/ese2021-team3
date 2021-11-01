// public address: string | undefined;

export class Post {
    constructor(
        public postId: number,
        public userId: number,
        public title: string,
        public text: string,
        public image: string,
    ) { }
}