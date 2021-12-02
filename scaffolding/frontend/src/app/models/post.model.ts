// public address: string | undefined;

export class Post {
    constructor(
        public postId: number,
        public userId: number,
        public title: string,
        public text: string,
        public image: string,
        public category: string,
        public username?: string,
        public vote?: number,
        public myVote?: number,
    ) { }
}
