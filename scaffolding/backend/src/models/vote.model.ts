import {Optional, Model, Sequelize, DataTypes, IntegerDataType} from 'sequelize';
import {TodoList} from './todolist.model';
import {User} from './user.model';
import {Post} from './post.model';

export interface VoteAttributes {
    voteId: number;
    postId: number;
    userId: number;
    vote: number;
}

export interface VoteCreationAttributes extends Optional<VoteAttributes, 'voteId'> {  }

export class Vote extends Model<VoteAttributes, VoteCreationAttributes> implements VoteAttributes {
    voteId: number;
    userId: number;
    postId: number;
    vote: number;

    public static initialize(sequelize: Sequelize) {
        Vote.init({
                voteId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                postId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                vote: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                sequelize,
                tableName: 'votes'
            });
    }

    public static createAssociations() {

        Vote.belongsTo(Post, {
            targetKey: 'postId',
            as: 'posts',
            onDelete: 'cascade',
            foreignKey: 'postId'
        });
    }
}
