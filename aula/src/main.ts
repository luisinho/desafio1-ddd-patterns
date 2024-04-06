import Order from "./domain/checkout/entity/order";
import Customer from "./domain/customer/entity/customer";
import Address from "./domain/customer/value-object/address";
import OrderItem from "./domain/checkout/entity/order_item";

let customer = new Customer('123', "Wesley");
const address = new Address('Rua dois', 3, '12345-100', 'São Paulo');
customer.address = address;
customer.activate();
// Relação desse agregado é por ID

// Relação desse agregado é por Objeto - Entidade
const item1 = new OrderItem('1', 'Item 1', 30, 'p1', 2);
const item2 = new OrderItem('2', 'Item 2', 15, 'p2', 2);
const order = new Order('1', '123', [item1, item2]);

/*transform: {
    '^.+\.(t|j)sx?$': '@swc/jest',
  },*/