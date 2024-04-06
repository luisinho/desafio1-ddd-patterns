import OrderItem from "./order_item";

export default class Order {

    private _id: string;
    private _customerId: string; // Se esta em diferente agregado faz relacionamento com ID
    private _items: OrderItem[]; // Se esta no mesmo agregado mesmo Objeto (OrderItem)
    private _total: number;

    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.total();
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    get items(): OrderItem[] {
        return this._items;
    }   

    changeItems(items: OrderItem[]) {
        this._items = items;
        this._total = this.total();
    }

    addItems(item: OrderItem) {
        this._items.push(item);
    }

    validate(): boolean {
        if (this._id.length === 0) {
            throw new Error('Id is required');
        }
        if (this._customerId.length === 0) {
            throw new Error('CustomerId is required');
        }
        if (this._items.length === 0) {
            throw new Error('Item are required');
        }
        if (this._items.some(item => item.quantity <= 0)) {
            throw new Error('Quantity must be greater than 0');
        }
        return true;
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
    }
}