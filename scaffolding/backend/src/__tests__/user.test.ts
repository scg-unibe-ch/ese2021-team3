import { Server } from '../server';
import request from 'supertest';
import {User} from '../models/user.model';


let app;
let server;

beforeAll(async () => {
    require('dotenv').config();
    server = new Server(true);
    app = server.server;
    await User.findAll().then(found => {
        if (found) {
            for (const user of found) {
                user.destroy();
            }
        }
    });
});

describe('/user/register', () => {
    it('/user/register valid', async () => {
        const result = await request(app)
            .post('/user/register')
            .send({
                userName: 'test',
                firstName: 'test',
                lastName: 'test',
                email: 'test',
                phone: 'test',
                birthday: 12345,
                password: 'test',
                address: 'test'
            });
        // tslint:disable-next-line:max-line-length
        expect(result.text).toContain('\"userName\":\"test\",\"firstName\":\"test\",\"lastName\":\"test\",\"email\":\"test\",\"phone\":\"test\",\"birthday\":12345,\"password\"');
        expect(result.statusCode).toEqual(200);
    });
    it('/user/register userAlreadyExist', async () => {
        const result = await request(app)
            .post('/user/register')
            .send({
                userName: 'test',
                firstName: 'test',
                lastName: 'test',
                email: 'test',
                phone: 'test',
                birthday: 12345,
                password: 'test',
                address: 'test'
            });
        // tslint:disable-next-line:max-line-length
        expect(result.text).toContain('{\"message\":{\"error\":\"username_already_exists\",\"message\":\"Username test already exists.\"}}');
        expect(result.statusCode).toEqual(500);
    });
    it('/user/register eMailAlreadyExist', async () => {
        const result = await request(app)
            .post('/user/register')
            .send({
                userName: 'test1',
                firstName: 'test',
                lastName: 'test',
                email: 'test',
                phone: 'test',
                birthday: 12345,
                password: 'test',
                address: 'test'
            });
        // tslint:disable-next-line:max-line-length
        expect(result.text).toContain('{\"message\":{\"error\":\"email_already_exists\",\"message\":\"Email test already in use.\"}}');
        expect(result.statusCode).toEqual(500);
    });
    it('/user/login validLogin', async () => {
        const result = await request(app)
            .post('/user/login')
            .send({
                userName: 'test',
                password: 'test'
            });
        // tslint:disable-next-line:max-line-length;
        expect(result.text).toContain(',\"userName\":\"test\",\"firstName\":\"test\",\"lastName\":\"test\",\"email\":\"test\",\"address\":\"test\",\"phone\":\"test\",\"birthday\":');
        expect(result.statusCode).toEqual(200);
    });
    it('/user/login invalidUsername', async () => {
        const result = await request(app)
            .post('/user/login')
            .send({
                userName: 'test1',
                password: 'test'
            });
        // tslint:disable-next-line:max-line-length;
        expect(result.text).toContain('{\"message\":{\"error\":\"usernameNotFound\",\"message\":\"Username not found.\"}}');
        expect(result.statusCode).toEqual(500);
    });
});


