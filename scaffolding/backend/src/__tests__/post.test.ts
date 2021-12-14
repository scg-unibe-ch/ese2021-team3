import { Server } from '../server';
import request from 'supertest';
import {Post} from '../models/post.model';
import {UserService} from '../services/user.service';
import {LoginRequest, LoginResponse} from '../models/login.model';


let app;
let server;
let token: string;
const userService = new UserService();

class MockLoginRequest implements LoginRequest {
    password: string;
    userName: string;
}

beforeAll(() => {
    server = new Server(true);
    app = server.server;
    Post.findAll().then(found => {
        if (found) {
            for (const post of found) {
                post.destroy();
            }
        }
    });

    const mockLoginRequest = new MockLoginRequest();
    mockLoginRequest.userName = 'test';
    mockLoginRequest.password = 'test';

    userService.login(mockLoginRequest).then(login => {
        if (!login) {
            console.log('COULDNT LOGIN');
        } else {
            token = (<LoginResponse>login).token;
            console.log(token);
        }
    });
});

describe('/post/', () => {
    console.log(token);
    it('post/create unathorized', async () => {
        const result = await request(app)
            .post('/post/create')
            .set('Authorization', 'bearer ' + token)
            .send({
                title: 'test',
                text: 'test',
                image: '',
                category: '["category"]'
            });
        // tslint:disable-next-line:max-line-length
        expect(result.text).toContain('{\"message\":\"Unauthorized\"}');
        expect(result.statusCode).toEqual(403);
    });
});
