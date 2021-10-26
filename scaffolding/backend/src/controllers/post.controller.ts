import express from 'express';
import { Router, Request, Response } from 'express';
import {PostService} from '../services/post.service';
import {verifyToken} from '../middlewares/checkAuth';

const postController: Router = express.Router();
const postService = new PostService();

postController.use(verifyToken);

postController.post('/create',
    (req: Request, res: Response) => {
        req.body.userId = req.body.tokenPayload.userId;
        postService.create(req.body).then(post => res.send(post)).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
    }
);

export const PostController: Router = postController;
