import { v4 as uuid } from 'uuid';

import Product from "../entity/product";
import ProductInterface from "../entity/product.interface";
import ProductPrice from '../entity/product-price';

export default class ProductFactory {

    public static create(type: string, name: string, price: number): ProductInterface {
        switch (type) {
          case 'Product':
            return new Product(uuid(), name, price);
          case 'ProductPrice':
            return new ProductPrice(uuid(), name, price);
          default:
            throw new Error('Product type not supported');
        }
    }
}