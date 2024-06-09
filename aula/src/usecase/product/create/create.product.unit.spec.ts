import CreateProductUseCase from "./create.product.usecase";

const input = {
    type: 'Product',
    name: 'Product 1',
    price: 2.2,
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe('Unit test create product use case', () => {

    it('should create a type Product', async() => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const output = await productCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });

    it('should create a type ProductPrice', async() => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const price = input.price * 2;

        input.type = 'ProductPrice';

        const output = await productCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: price,
        });
    });

    it('should throw an error when name is missing', async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        input.name = '';

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            'Name is required'
        );
    });

    it('should throw an error when price less than zero', async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        input.name = 'Product 1';
        input.price = -1;

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            'Price must be greater than zero'
        );
    });

    it('should throw an error a product type not supported', async() => {

        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        input.type = 'ProductUse';

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            'Product type not supported'
        );
    });
});