import express from 'express';
import { Router, Request, Response } from 'express';
import {PostService} from '../services/post.service';
import {verifyToken} from '../middlewares/checkAuth';
import {MulterRequest} from '../models/multerRequest.model';
import {Post} from '../models/post.model';

const postController: Router = express.Router();
const postService = new PostService();

// postController.use(verifyToken);

postController.post('/create',
    (req: Request, res: Response) => {
        req.body.userId = req.body.tokenPayload.userId;
        postService.create(req.body).then(post => res.send(post)).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
    }
);

postController.post('/:id/edit', verifyToken,
    (req: Request, res: Response) => {
        req.body.userId = req.body.tokenPayload.userId;
        req.body.postId = req.params.id;
        postService.edit(req.body).then(post => res.send(post)).catch(err => {
            res.status(500).send(err);
        });
    }
);

postController.post('/:id/image', verifyToken, (req: MulterRequest, res: Response) => {
    req.body.userId = req.body.tokenPayload.userId;
    postService.addImage(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

postController.get('/get',
    (req: Request, res: Response) => {
        Post.findAll()
            .then(list => res.status(200).send(list))
            .catch(err => res.status(500).send(err));
    }
);

export const PostController: Router = postController;
