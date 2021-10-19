import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Op} from 'sequelize';

export class UserService {

    public register(user: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        user.password = bcrypt.hashSync(user.password, saltRounds); // hashes the password, never store passwords as plaintext
        return User.findOne({
            where: {
                    [Op.or]: [
                    { userName: user.userName },
                    { email: user.email }
                ]
            }
        })
            .then(userDuplicate => {
                if (userDuplicate == null) { // Creates new user if user doesn't exist.
                    return User.create(user).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
                } else { // Returns error if user already created
                    if (userDuplicate.userName === user.userName) {
                        return Promise.reject({error: 'username_already_exists', message: userDuplicate.userName + ' already exists'});
                    } else {
                        return Promise.reject({error: 'email_already_exists', message: userDuplicate.email + ' already exists'});
                    }
                }
            })
            .catch(err => Promise.reject({ message: err }));
    }

    public login(loginRequestee: LoginRequest): Promise<User | LoginResponse> {
        const secret = process.env.JWT_SECRET;
        return User.findOne({
            where: {
                userName: loginRequestee.userName
            }
        })
        .then(user => {
            if (user == null) {
                return Promise.reject({error: 'usernameNotFound', message: 'username not found'});
            }
            if (bcrypt.compareSync(loginRequestee.password, user.password)) {// compares the hash with the password from the login request
                const token: string = jwt.sign({ userName: user.userName, userId: user.userId, admin: user.admin }, secret, { expiresIn: '2h' });
                return Promise.resolve({ user, token });
            } else {
                return Promise.reject({error: 'wrongPassword', message: 'wrong password' });
            }
        })
        .catch(err => Promise.reject({ message: err }));
    }

    public getAll(): Promise<User[]> {
        return User.findAll();
    }
}
