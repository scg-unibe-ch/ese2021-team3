import express from 'express';
import { Router, Request, Response } from 'express';
import {PostService} from '../services/post.service';
import {verifyToken} from '../middlewares/checkAuth';
import {MulterRequest} from '../models/multerRequest.model';
import {Post} from '../models/post.model';
import {VoteService} from '../services/vote.service';
import {UserService} from '../services/user.service';

const postController: Router = express.Router();
const postService = new PostService();
const voteService = new VoteService();
const userService = new UserService();

// postController.use(verifyToken);

postController.post('/create', verifyToken,
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
            .then(async list => {
                for (const post of list) {
                    post.setDataValue('vote', await voteService.calculateVotes(post.postId));
                    post.setDataValue('userName', await userService.getNameForUserID(post.userId));
                    if (req.body.userId !== undefined) {
                        post.setDataValue('myVote', await voteService.voteOfUser(post.postId, req.body.userId));
                    }
                }
                res.status(200).send(list);
            })
            .catch(err => res.status(500).send(err));
    }
);

export const PostController: Router = postController;
