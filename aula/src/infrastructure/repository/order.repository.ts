import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item: OrderItem) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            })),
        },
        {
            include: [{model: OrderItemModel, as: 'items'}],
        });
    }

    async update(entity: Order): Promise<void> {
      const order = await OrderModel.findByPk(entity.id, {
        include: ['items'],
      });
      await order
        .update({
          total: entity.total(),
        }).then(() => {
            
            OrderItemModel.bulkCreate(
                entity.items.map((item: OrderItem) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  order_id: order.id,
                  product_id: item.productId,
                })),
                {
                  updateOnDuplicate: ['name', 'price', 'product_id', 'quantity']
                }
            );
        });
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({ 
            where: { id }, 
            include: ['items'] 
        });

        let item: OrderItem;
        let items: OrderItem[] = [];

        orderModel.items.map((itemModel: OrderItemModel) => {
            item = new OrderItem(itemModel.id, itemModel.name, itemModel.price, itemModel.product_id, itemModel.quantity);
            items.push(item);
        });

        return new Order(
            orderModel.id,
            orderModel.customer_id,
            items
        );
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({include: ['items']});

        let orders: Order[] = [];
        let item: OrderItem;
        let items: OrderItem[];      

        orderModels.map((orderModel) => {

            items = [];
            let itemsModel = orderModel.items.filter(item => item.order_id === orderModel.id);

            itemsModel.map((itemModel: OrderItemModel) => {
                item = new OrderItem(itemModel.id, itemModel.name, itemModel.price, itemModel.product_id, itemModel.quantity);
                items.push(item);
            });

            orders.push(new Order(orderModel.id, orderModel.customer_id, items));
       });

       return orders;
    }
}