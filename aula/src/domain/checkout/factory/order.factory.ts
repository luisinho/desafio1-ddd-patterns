import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderInterface from "../entity/order.interface";
import OrderFactoryPropsInterface from "../entity/order.factory.props.interface";

export default class OrderFactory {

    public static create(orderProps: OrderFactoryPropsInterface): OrderInterface {

        const items = orderProps.items.map((item) => {
            return new OrderItem(
                item.id,
                item.name,
                item.price,
                item.productId,
                item.quantity
            )
        });

        return new Order(orderProps.id, orderProps.customerId, items);
    }
}