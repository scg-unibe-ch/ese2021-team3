import express, { Application , Request, Response } from 'express';
import morgan from 'morgan';
import { TodoItemController } from './controllers/todoitem.controller';
import { TodoListController } from './controllers/todolist.controller';
import { UserController } from './controllers/user.controller';
import { SecuredController } from './controllers/secured.controller';
import { VoteController } from './controllers/vote.controller';
import { Sequelize } from 'sequelize';
import { TodoList } from './models/todolist.model';
import { TodoItem } from './models/todoitem.model';
import { User } from './models/user.model';


import cors from 'cors';
import {AdminController} from './controllers/admin.controller';
import {ItemImage} from './models/itemImage.model';
import {PostController} from './controllers/post.controller';
import {Post} from './models/post.model';
import {Vote} from './models/vote.model';
import {Product} from './models/product.model';
import {ProductController} from './controllers/product.controller';
import {Order} from './models/order.model';
import {OrderController} from './controllers/order.controller';


export class Server {
    public server: Application;
    public sequelize: Sequelize;
    private port = process.env.PORT || 3000;

    constructor(testing: boolean) {
        this.server = this.configureServer();
        this.sequelize = this.configureSequelize(testing);

        TodoItem.initialize(this.sequelize); // creates the tables if they dont exist
        TodoList.initialize(this.sequelize);
        User.initialize(this.sequelize);
        ItemImage.initialize(this.sequelize);
        Post.initialize(this.sequelize);
        Vote.initialize(this.sequelize);
        Product.initialize(this.sequelize);
        Order.initialize(this.sequelize);

        TodoItem.createAssociations();
        TodoList.createAssociations();
        ItemImage.createAssociations();
        User.createAssociations();
        Post.createAssociations();
        Vote.createAssociations();
        Product.createAssociations();
        Order.createAssociations();





        this.sequelize.sync().then(() => {                           // create connection to the database
            this.server.listen(this.port, () => {                                   // start server on specified port
                console.log(`server listening at http://localhost:${this.port}`);   // indicate that the server has started
            });
        });
    }

    private configureServer(): Application {
        // options for cors middleware
        const options: cors.CorsOptions = {
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
            ],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: `http://localhost:${this.port}`,
            preflightContinue: false,
        };

        return express()
            .use(cors())
            .use(express.json())                    // parses an incoming json to an object
            .use(morgan('tiny'))                    // logs incoming requests
            .use('/todoitem', TodoItemController)   // any request on this path is forwarded to the TodoItemController
            .use('/todolist', TodoListController)
            .use('/user', UserController)
            .use('/secured', SecuredController)
            .use('/admin', AdminController)
            .use('/post', PostController)
            .use('/vote', VoteController)
            .use('/product', ProductController)
            .use('/order', OrderController)
            .options('*', cors(options))
            .use(express.static('./src/public'))
            .use('/images', express.static('./uploads'))
            // this is the message you get if you open http://localhost:3000/ when the server is running
            .get('/', (req, res) => res.send('<h1>Welcome to the ESE-2021 Backend Scaffolding <span style="font-size:50px">&#127881;</span></h1>'));
    }

    private configureSequelize(testing: boolean): Sequelize {
        let database = 'db.sqlite';
        if (testing) {
            database = 'dbTest.sqlite';
        }
        return new Sequelize({
            dialect: 'sqlite',
            storage: database,
            logging: false // can be set to true for debugging
        });
    }
}

const server = new Server(false); // starts the server
