
import express, { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { verifyToken } from '../middlewares/checkAuth';
import { checkAdmin } from '../middlewares/checkAdmin';

const userController: Router = express.Router();
const userService = new UserService();

userController.post('/register',
    (req: Request, res: Response) => {
        userService.register(req.body).then(registered => res.send(registered)).catch(err => res.status(500).send(err));
    }
);

userController.post('/edit', checkAdmin,
    (req: Request, res: Response) => {
        userService.editUser(req.body).then(registered => res.send(registered)).catch(err => {
            res.status(500).send(err);
        });
    }
);

userController.post('/login',
    (req: Request, res: Response) => {
        userService.login(req.body).then(login => res.send(login)).catch(err => res.status(500).send(err));
    }
);

userController.get('/all', checkAdmin, // you can add middleware on specific requests like that
    (req: Request, res: Response) => {
        userService.getAll().then(users => res.send(users)).catch(err => res.status(500).send(err));
    }
);

userController.delete('/:id', verifyToken,
    (req: Request, res: Response) => {
         // req.body.userId = req.body.tokenPayload.userId;
         req.body.userId = req.params.id;
         userService.deleteUser(req.body)
            .then(user => res.send(user))
            .catch(err => {
            res.status(500).send(err);
        });
    }
);

userController.get('/', verifyToken,
    (req: Request, res: Response) => {
        userService.getUser(req.body.tokenPayload.userId)
            .then(user => res.send(user))
            .catch(err => res.status(500).send(err));
    }
);

userController.get('/single/:id', checkAdmin,
    (req: Request, res: Response) => {
        userService.getUser(+req.params.id)
            .then(user => {
                res.send(user);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    }
);

export const UserController: Router = userController;
