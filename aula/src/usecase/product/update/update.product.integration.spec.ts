import { Sequelize } from 'sequelize-typescript';

import Product from '../../../domain/product/entity/product';
import ProductModel from '../../../infrastructure/product/repository/sequilize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequilize/product.repository';
import UpdateProductUseCase from './update.product.usecase';

describe('Test update product integration use case', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
        
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should integration update a type product', async () => {

        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
        const product = new Product('4', 'Product 4', 1.2);
        await productRepository.create(product);

        const input = {
            id: product.id,
            name: 'Product 4',
            price: 1.2,
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(input);        
    });
});