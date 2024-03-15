import { Sequelize } from "sequelize-typescript";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";

import Order from "../../domain/entity/order";
import Product from "../../domain/entity/product";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import OrderItem from "../../domain/entity/order_item";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";
import CustomerRepository from "./customer.repository";

describe('Order repository test', () => {

    let sequileze: Sequelize;

    beforeEach(async () => {
        
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true},
        });

        sequileze.addModels([OrderItemModel, OrderModel, CustomerModel, ProductModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await  sequileze.close();
    });

    it('should create a new order', async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 123, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            2
        );

        const orderRepository = new OrderRepository();
        const order = new Order('1', customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                 id: orderItem.id,
                 name: orderItem.name,
                 quantity: orderItem.quantity,
                 price: orderItem.price,
                 order_id: order.id,
                 product_id: product.id
                }
            ]
        });
    });

    it('should update a order change quantity item', async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 123, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItemInsert = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            2
        );

        const orderRepository = new OrderRepository();
        const order = new Order('1', customer.id, [orderItemInsert]);
        await orderRepository.create(order);

        const orderModelInsert = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModelInsert.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                 id: orderItemInsert.id,
                 name: orderItemInsert.name,
                 quantity: orderItemInsert.quantity,
                 price: orderItemInsert.price,
                 order_id: order.id,
                 product_id: product.id
                }
            ]
        });
        
        const orderItemUpdate = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            3
        );

        order.changeItems([orderItemUpdate]);
        await orderRepository.update(order);

        const orderModelUpdate = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModelUpdate.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                 id: orderItemUpdate.id,
                 name: orderItemUpdate.name,
                 quantity: orderItemUpdate.quantity,
                 price: orderItemUpdate.price,
                 order_id: order.id,
                 product_id: product.id
                }
            ]
        });
    });

    it('should update a order change product item', async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 123, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product('123', 'Product 1', 10);
        const product2 = new Product('1234', 'Product 2', 30);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const orderItemInsert = new OrderItem(
            '1',
            product1.name,
            product1.price,
            product1.id,
            2
        );

        const orderRepository = new OrderRepository();
        const order = new Order('1', customer.id, [orderItemInsert]);
        await orderRepository.create(order);

        const orderModelInsert = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModelInsert.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                 id: orderItemInsert.id,
                 name: orderItemInsert.name,
                 quantity: orderItemInsert.quantity,
                 price: orderItemInsert.price,
                 order_id: order.id,
                 product_id: product1.id
                }
            ]
        });
        
        const orderItemUpdate = new OrderItem(
            '1',
            product2.name,
            product2.price,
            product2.id,
            4
        );

        order.changeItems([orderItemUpdate]);
        await orderRepository.update(order);

        const orderModelUpdate = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModelUpdate.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                 id: orderItemUpdate.id,
                 name: orderItemUpdate.name,
                 quantity: orderItemUpdate.quantity,
                 price: orderItemUpdate.price,
                 order_id: order.id,
                 product_id: product2.id
                }
            ]
        });
    });

    it('should find a order', async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 123, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            3
        );

        const orderRepository = new OrderRepository();
        const order = new Order('1', customer.id, [orderItem]);
        await orderRepository.create(order);

        const findOrderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ['items'],
        });

        const findOrder = await orderRepository.find(order.id);

        expect(findOrderModel.toJSON()).toStrictEqual({
            id: findOrder.id,
            customer_id: findOrder.customerId,
            total: findOrder.total(),
            items: findOrder.items.map((item: OrderItem) => ({
                id: item.id,
                 name: item.name,
                 quantity: item.quantity,
                 price: item.price,
                 order_id: findOrder.id,
                 product_id: item.productId
            })),
        });
    });

    it('should find all orders', async () => {

        const customerRepository = new CustomerRepository();
        const customer1 = new Customer('123', 'Customer 1');
        const address1 = new Address('Street 1', 123, 'Zipcode 1', 'City 1');
        customer1.changeAddress(address1);
        await customerRepository.create(customer1);

        const productRepository = new ProductRepository();
        const product1 = new Product('123', 'Product 1', 10);
        await productRepository.create(product1);

        const orderItem1 = new OrderItem(
            '1',
            product1.name,
            product1.price,
            product1.id,
            3
        );

        const orderRepository = new OrderRepository();
        const order1 = new Order('1', customer1.id, [orderItem1]);
        await orderRepository.create(order1);

        const customer2 = new Customer('12', 'Customer 2');
        const address2 = new Address('Street 2', 1234, 'Zipcode 2', 'City 2');
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);
        
        const product2 = new Product('34', 'Product 2', 30);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem(
            '2',
            product2.name,
            product2.price,
            product2.id,
            3
        );

        const order2 = new Order('2', customer2.id, [orderItem2]);        
        await orderRepository.create(order2);
        
        const foundOrders = await orderRepository.findAll();

        const orders = [order1, order2];

        expect(orders).toEqual(foundOrders);
        expect(orders.length).toBe(foundOrders.length);
        expect(foundOrders.length).toBe(2);
        expect(foundOrders[0].items.length).toBe(1);
        expect(foundOrders[1].items.length).toBe(1);
        expect(foundOrders[0].items[0].name).toBe(product1.name);
        expect(foundOrders[1].items[0].name).toBe(product2.name);
    });
});