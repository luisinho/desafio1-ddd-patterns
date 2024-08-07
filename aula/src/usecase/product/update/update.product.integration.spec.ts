import { Sequelize } from 'sequelize-typescript';

import UpdateProductUseCase from './update.product.usecase';
import Product from '../../../domain/product/entity/product';
import ProductModel from '../../../infrastructure/product/repository/sequilize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequilize/product.repository';

describe('Test update product integration use case', () => {

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

    it('should integration update a type product', async () => {

        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
        const product = new Product('4', 'Product 4', 1.2);
        await productRepository.create(product);

        const input = {
            id: '4',
            name: 'Product 1',
            price: 1.1,
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(input);        
    });

    it('should integration throw an error when name is missing', async () => {

        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
        const product = new Product('5', 'Product 5', 2.2);
        await productRepository.create(product);

        const input = {
            id: '5',
            name: '',
            price: 2.2,
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            'product: Name is required'
        );
    });

    it('should integration throw an error when price less than zero', async () => {

        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
        const product = new Product('5', 'Product 5', 2.2);
        await productRepository.create(product);

        const input = {
            id: '5',            
            name: 'Product 5',
            price: -1,
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            'product: Price must be greater than zero'
        );
    });

    it('should integration throw an error when name is missing and price less than zero', async () => {

        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
        const product = new Product('5', 'Product 5', 2.2);
        await productRepository.create(product);

        const input = {
            id: '5',
            name: '',
            price: -1,
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            'product: Name is required,product: Price must be greater than zero'
        );
    });
});