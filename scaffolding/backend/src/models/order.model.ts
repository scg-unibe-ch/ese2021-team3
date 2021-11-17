import {DataTypes, Model, Optional, Sequelize} from 'sequelize';
import {Vote} from './vote.model';
import {User} from './user.model';

export interface OrderAttributes {
    orderId: number;
    address: string;
    userId: number;
    productId: number[];
    status: string;
    paymentMethod: string;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'orderId'> {  }

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    orderId: number;
    address: string;
    userId: number;
    productId: number[];
    status: string;
    paymentMethod: string;

    public static initialize(sequelize: Sequelize) {
        Order.init({
                orderId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                userId: {
                    type: DataTypes.NUMBER,
                    allowNull: false
                },
                productId: {
                    type: DataTypes.NUMBER,
                    allowNull: false
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                paymentMethod: {
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
