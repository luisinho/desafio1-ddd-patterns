import EventDispatcher from "./event-dispatcher";
import ProductCreatedEvent from "../product/product-created.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import EnviaConsoleLogHandler from "../customer/handler/envia-console-log-handler";
import EnviaConsoleLog1Handler from "../customer/handler/envia-console-log1-handler";
import EnviaConsoleLog2Handler from "../customer/handler/envia-console-log2-handler";
import CustomerChangedAddressEvent from "../customer/customer-changed-address-event";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created-handler";

describe('Domain events tests', () => {

    it('should register an event handler', () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined();
        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(1);
        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);
    });

    it('should unregister an event handler', () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined();
        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(0);

    });

    it('should unregister all event handlers', () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeUndefined();
    });

    it('should notify all event handlers', () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, 'handle'); 

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: 'Product 1',
            description: 'Product 1 description',
            price: 10.0
        });

        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it('should notify register Customer an event handler 1', () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog1Handler();
        const spyEventHandler = jest.spyOn(eventHandler, 'handle');

        eventDispatcher.register('CustomerCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toBeDefined();
        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].length).toBe(1);
        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: '1',
            nome: 'Customer 1',
            address: {
                street: 'street 1',
                number: 1,
                zip: 'zip 1',
                city: 'city 1'
            }
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it('should notify register Customer an event handler 2', () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog2Handler();
        const spyEventHandler = jest.spyOn(eventHandler, 'handle');

        eventDispatcher.register('CustomerCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toBeDefined();
        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].length).toBe(1);
        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: '2',
            nome: 'Customer 2',
            address: {
                street: 'street 2',
                number: 2,
                zip: 'zip 2',
                city: 'city 2'
            }
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it('should notify customer changed address event handler', () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandler, 'handle');

        eventDispatcher.register('CustomerChangedAddressEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['CustomerChangedAddressEvent'][0]).toMatchObject(eventHandler);

        const customerChangedAddressEvent = new CustomerChangedAddressEvent({
            id: '1',
            nome: 'Customer 1',
            newAddress: {
                street: 'street 2',
                number: 2,
                zip: 'zip 2',
                city: 'city 2'
            }
        });

        eventDispatcher.notify(customerChangedAddressEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });
});