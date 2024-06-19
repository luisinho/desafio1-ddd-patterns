import { Sequelize } from 'sequelize-typescript';

import ListProductUseCase from './list.product.usecase';
import Product from '../../../domain/product/entity/product';
import ProductModel from '../../../infrastructure/product/repository/sequilize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequilize/product.repository';

describe('Test list product integration use case', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
        
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should integration list a product', async () => {

        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const product1 = new Product('1', 'Product 1', 2.2);
        const product2 = new Product('2', 'Product 2', 1.2);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const output = [
           {
              id: '1',
              name: 'Product 1',
              price: 2.2,
           },
           {
              id: '2',
              name: 'Product 2',
              price: 1.2,
           },
        ];

        const result = await usecase.execute({});

        expect(result.products.length).toBe(output.length);

        expect(result.products[0].id).toEqual(output[0].id);
        expect(result.products[0].name).toEqual(output[0].name);
        expect(result.products[0].price).toEqual(output[0].price);

        expect(result.products[1].id).toEqual(output[1].id);
        expect(result.products[1].name).toEqual(output[1].name);
        expect(result.products[1].price).toEqual(output[1].price);
    });

    it('should integration empty list a product', async () => {

        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const result = await usecase.execute({});

        expect(result.products.length).toBe(0);
    });
});