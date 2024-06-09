import { Sequelize } from 'sequelize-typescript';
import FindProductUsecase from './find.product.usecase';
import Product from '../../../domain/product/entity/product';
import ProductModel from '../../../infrastructure/product/repository/sequilize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequilize/product.repository';

describe('Test find product integration use case', () => {

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

    it('should integration find a product', async () => {

        const productRepository = new ProductRepository();
        const usecase = new FindProductUsecase(productRepository);

        const product = new Product('1', 'Product 1', 2.2);
        await productRepository.create(product);

        const input = {
            id: "1"
        }

        const output = {
            id: '1',
            name: 'Product 1',
            price: 2.2,
        }

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });

    it('should integration not find a product', async () => {

        const productRepository = new ProductRepository();
        const product = new Product('3', 'Product 2', 2.3);
        await productRepository.create(product);        

        const usecase = new FindProductUsecase(productRepository);

        const input = {
            id: "2"
        }

        expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow('Product not found');
    });
});