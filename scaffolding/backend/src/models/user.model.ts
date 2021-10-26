import { TodoItem, TodoItemAttributes, TodoItemCreationAttributes } from './todoitem.model';
import {
    Optional,
    Model,
    Sequelize,
    DataTypes,
    IntegerDataType,
    Association,
    HasManyGetAssociationsMixin
} from 'sequelize';
import {Post} from './post.model';

export interface UserAttributes {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    birthday: number;
    password: string;
    admin: boolean;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {

    public static associations: {
        posts: Association<User, Post>;
    };

    userId!: number;
    userName!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    address!: string;
    phone!: string;
    birthday!: number;
    password!: string;
    admin!: boolean;


    public getPosts!: HasManyGetAssociationsMixin<Post>;


    public static initialize(sequelize: Sequelize) {
        User.init({
            userId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            birthday: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
            {
                sequelize,
                tableName: 'users'
            }
        );
    }

    public static createAssociations() {
        User.hasMany(Post, {
            as: 'Posts',
            foreignKey: 'userId'
        });
    }

}
