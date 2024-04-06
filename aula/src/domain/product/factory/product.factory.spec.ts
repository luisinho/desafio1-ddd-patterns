import ProductFactory from "./product.factory";

describe('Product factory unit test', () => {

    it('should create a type product', () => {

        const product = ProductFactory.create('Product', 'Product 1', 1);
        expect(product.id).toBeDefined();
        expect(product.name).toBe('Product 1');
        expect(product.price).toBe(1);
        expect(product.constructor.name).toBe('Product');

    });

    it('should create a type product price', () => {

        const product = ProductFactory.create('ProductPrice', 'Product 2', 1);
        expect(product.id).toBeDefined();
        expect(product.name).toBe('Product 2');
        expect(product.price).toBe(2);
        expect(product.constructor.name).toBe('ProductPrice');

    });

    it('should throw an error when product type is not supported', () => {

        expect(() => ProductFactory.create('P1', 'Product 1', 1)).toThrow('Product type not supported');
    });
});