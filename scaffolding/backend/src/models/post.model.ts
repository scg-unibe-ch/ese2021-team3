import {
    Optional,
    Model,
    Sequelize,
    DataTypes,
    IntegerDataType,
    Association,
    HasManyGetAssociationsMixin
} from 'sequelize';
import {TodoList} from './todolist.model';
import {User} from './user.model';
import {Vote} from './vote.model';

export interface PostAttributes {
    postId: number;
    userId: number;
    title: string;
    text: string;
    image: string;
    vote?: number;
    myVote?: number;
    userName?: string;
    category: string;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'postId'> {  }

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {

    public static associations: {
        votes: Association<Post, Vote>;
    };

    image: string;
    userId: number;
    postId: number;
    text: string;
    title: string;
    vote?: number;
    myVote?: number;
    userName?: string;
    category: string;

    public getVotes!: HasManyGetAssociationsMixin<Vote>;

    public static initialize(sequelize: Sequelize) {
        Post.init({
            postId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            text: {
                type: DataTypes.STRING,
                allowNull: true
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true
            },
            category: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
            {
                sequelize,
                tableName: 'posts'
            });
    }

    public static createAssociations() {
        Post.belongsTo(User, {
            targetKey: 'userId',
            as: 'User',
            onDelete: 'cascade',
            foreignKey: 'userId'
        });

        Post.hasMany(Vote, {
            as: 'votes',
            foreignKey: 'postId'
        });
    }
}
