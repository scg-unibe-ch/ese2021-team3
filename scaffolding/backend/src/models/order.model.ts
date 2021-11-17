import {DataTypes, Model, Optional, Sequelize} from 'sequelize';
import {Vote} from './vote.model';
import {User} from './user.model';

export interface OrderAttributes {
    orderId: number;
    adress: string;
    userId: number;
    productId: number[];
    status: string;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'orderId'> {  }

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    orderId: number;
    adress: string;
    userId: number;
    productId: number[];
    status: string;
    public static initialize(sequelize: Sequelize) {
        Order.init({
                orderId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                adress: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                userId: {
                    type: DataTypes.NUMBER,
                    allowNull: false
                },
                productId: {
                    type: DataTypes.JSON,
                    allowNull: false
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
            },
            {
                sequelize,
                tableName: 'orders'
            });
    }

    public static createAssociations() {
        Order.belongsTo(User, {
            targetKey: 'userId',
            as: 'User',
            onDelete: 'cascade',
            foreignKey: 'userId'
        });
    }
}
