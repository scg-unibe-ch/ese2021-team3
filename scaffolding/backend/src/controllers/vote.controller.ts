import express, { Router, Request, Response } from 'express';
import { verifyToken } from '../middlewares/checkAuth';
import {VoteService} from '../services/vote.service';

const voteController: Router = express.Router();
const voteService = new VoteService();

voteController.use(verifyToken);

voteController.post('/create',
    (req: Request, res: Response) => {
        req.body.userId = req.body.tokenPayload.userId;
        voteService.create(req.body).then(post => res.send(post)).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
    }
);

export const VoteController: Router = voteController;
