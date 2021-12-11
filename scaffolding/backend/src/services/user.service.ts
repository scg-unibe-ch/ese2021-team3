import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

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
                    if (['andy', 'jan', 'florian', 'may'].includes(user.userName.toLowerCase())) {
                        user.admin = true;
                    }
                    return User.create(user).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
                } else { // Returns error if user already created
                    if (userDuplicate.userName === user.userName) {
                        return Promise.reject(
                            { error: 'username_already_exists', message: 'Username ' + userDuplicate.userName + ' already exists.' });
                    } else {
                        return Promise.reject(
                            { error: 'email_already_exists', message: 'Email ' + userDuplicate.email + ' already in use.' });
                    }
                }
            })
            .catch(err => Promise.reject({ message: err }));
    }

    public editUser(user: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        return User.findByPk(user.userId)
            .then(userFromDB => {
                if (userFromDB.password !== user.password) {
                    user.password = bcrypt.hashSync(user.password, saltRounds);
                }
                return userFromDB.update(user);
            })
            .catch(err => Promise.reject({ message: err }));
    }

    public login(loginRequestee: LoginRequest): Promise<User | LoginResponse> {
        const secret = process.env.JWT_SECRET || 'not_secure';
        return User.findOne({
            where: {
                userName: loginRequestee.userName
            }
        })
            .then(user => {
                if (user == null) {
                    return Promise.reject({ error: 'usernameNotFound', message: 'Username not found.' });
                }
                if (bcrypt.compareSync(loginRequestee.password, user.password)) {
                    // compares the hash with the password from the login request
                    const token: string = jwt.sign({ userName: user.userName, userId: user.userId, admin: user.admin }, secret, { expiresIn: '2h' });
                    return Promise.resolve({ user, token });
                } else {
                    return Promise.reject({ error: 'wrongPassword', message: 'Wrong password.' });
                }
            })
            .catch(err => {
                return Promise.reject({ message: err });
            });
    }

    public async getNameForUserID(userID: number): Promise<string> {
        return User.findOne({
            where: {
                userId: userID
            }
        }).then(user => {
            return user.userName;
        })
            .catch(err => Promise.reject({ message: err }));
    }

    public getAll(): Promise<User[]> {
        return User.findAll();
    }

    public getUser(userId: number): Promise<User> {
        return User.findByPk(userId)
            .then(user => Promise.resolve(user))
            .catch(err => Promise.reject({ message: err }));
    }

    public deleteUser(userToDelete: UserAttributes): Promise<UserAttributes> {
        return User.findByPk(userToDelete.userId)
            .then(found => {
                if (!found) {
                    return Promise.reject({error: 'User_not_found', message: 'Cant find User nr.' + userToDelete.userId});
                } else {
                  //  if (userToDelete.userId === requesteeId) {
                        // tslint:disable-next-line:max-line-length
                  //      return Promise.reject({error: 'Cant_delete_oneself', message: 'You cannot delete yourself, User nr. ' + 5});
                  //  }
                    return new Promise<UserAttributes>((resolve, reject) => {
                            found.destroy();
                            resolve(found);
                        });
                }
            });
    }

    private async isAdmin(userId: number): Promise<boolean> {
        return User.findByPk(userId).then(found => {
            if (!found) {
                return false;
            } else {
                return found.admin;
            }
        });
    }
}
