import FindProductUsecase from "./find.product.usecase";
import Product from "../../../domain/product/entity/product";

const product = new Product('1', 'Product 1', 2.2);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe('Unit Test find product use case', () => {

    it('should find a product', async () => {

        const productRepository = MockRepository();
        const usecase = new FindProductUsecase(productRepository);

        const input = {
            id: "1"
        }

        const output = {
            id: '1',
            name: 'Product 1',
            price: 2.2
        }

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });

    it('should not find a product', async () => {

        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error('Product not found');
        });

        const usecase = new FindProductUsecase(productRepository);

        const input = {
            id: "1"
        }

        expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow('Product not found');
    });
});