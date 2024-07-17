import Order from "../../../../domain/checkout/entity/order";
import OrderModel from "./order.model";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";

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
       try {
            let sequelize = OrderModel.sequelize;
            await sequelize.transaction(async (ts) => {
              await OrderItemModel.destroy({
                where: { order_id: entity.id },
                transaction: ts,
              });
              const items = entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
              }
      
              ));
              await OrderItemModel.bulkCreate(items, { transaction: ts });
              await OrderModel.update(
                { total: entity.total() },
                { where: { id: entity.id }, transaction: ts }
              );
       });
       } catch (error) {
          throw new Error('Failed to update order');
       }
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