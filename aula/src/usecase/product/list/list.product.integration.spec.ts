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

    it('should integration list a product', async () => {

        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const product = new Product('1', 'Product 1', 2.2);
        await productRepository.create(product);

        const output = {
            id: '1',
            name: 'Product 1',
            price: 2.2,
        }

        const result = await usecase.execute({});        

        expect(result.products[0].id).toEqual(output.id);
        expect(result.products[0].name).toEqual(output.name);
        expect(result.products[0].price).toEqual(output.price);
    });
});