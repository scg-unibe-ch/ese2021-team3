import {DataTypes, Model, Optional, Sequelize} from 'sequelize';
import {Post} from './post.model';

export interface ProductAttributes {
    productId: number;
    title: string;
    description: string;
    image: string;
    price: number;
    category: string;
    userId: number;
    hidden: boolean;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'productId'> {  }

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    productId: number;
    title: string;
    description: string;
    image: string;
    price: number;
    category: string;
    userId: number;
    hidden: boolean;

    public static initialize(sequelize: Sequelize) {
        Product.init({
                productId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                image: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                price: {
                    type: DataTypes.NUMBER,
                    allowNull: false
                },
                category: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                hidden: {
                    type: DataTypes.BOOLEAN
                }
            },
            {
                sequelize,
                tableName: 'products'
            });
    }

    public static createAssociations() {

    }
}
