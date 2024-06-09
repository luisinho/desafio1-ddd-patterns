import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.create('Product', 'Product 1', 1.1);

const input = {
    id: product.id,
    name: 'Product 2',
    price: 2.2,
};

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn()
    };
};

describe('Unit test for product update use case', () => {

    it('should update a product', async () => {
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        const output = await productUpdateUseCase.execute(input);

        expect(output.id).toBe(input.id);
        expect(output.name).toBe(input.name);
        expect(output.price).toBe(input.price);
    });

    it('should throw an error when name is missing', async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new UpdateProductUseCase(productRepository);

        input.name = '';

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            'Name is required'
        );
    });

    it('should throw an error when price less than zero', async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new UpdateProductUseCase(productRepository);

        input.name = 'Product 1';
        input.price = -1;

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            'Price must be greater than zero'
        );
    });
});