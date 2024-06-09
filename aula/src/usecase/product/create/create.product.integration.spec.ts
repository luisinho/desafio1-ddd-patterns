import { Sequelize } from 'sequelize-typescript';

import CreateProductUseCase from './create.product.usecase';
import Product from '../../../domain/product/entity/product';
import ProductModel from '../../../infrastructure/product/repository/sequilize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequilize/product.repository';

describe('Test create product integration use case', () => {

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

    it('should integration create a type product', async () => {

        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            type: 'Product',
            name: 'Product 1',
            price: 2.2,
        };

        const result = await usecase.execute(input);

        expect(result).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });

    it('should integration create a type ProductPrice', async () => {

        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            type: 'ProductPrice',
            name: 'Product 1',
            price: 2.2,
        };

        const result = await usecase.execute(input);

        const price = input.price * 2;

        expect(result).toEqual({
            id: expect.any(String),
            name: input.name,
            price: price,
        });
    });

    it('should integration throw an error when name is missing', async () => {

        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);
        const product = new Product('1', 'Product 1', 2.2);

        const input = {
            type: 'Product',
            name: '',
            price: product.price,
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            'Name is required'
        );
    });

    it('should integration throw an error when price less than zero', async () => {

        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);
        const product = new Product('1', 'Product 1', 2.2);

        const input = {
            type: 'Product',
            name: product.name,
            price: -1,
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            'Price must be greater than zero'
        );
    });

    it('should integration throw an error a product type not supported', async() => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            type: 'ProductUser',
            name: 'Product 1',
            price: 2.2,
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            'Product type not supported'
        );
    });
});