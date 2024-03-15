"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Order {
    constructor(id, customerId, items) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
    }
    total() {
        return this._items.reduce((acc, item) => acc + item._price, 0);
    }
}
exports.default = Order;
