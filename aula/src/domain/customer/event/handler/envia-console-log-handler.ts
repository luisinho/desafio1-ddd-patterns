
import CustomerChangedAddressEvent from "../customer-changed-address-event";
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerChangedAddressEvent> {

    address: string;

    handle(event: CustomerChangedAddressEvent): void {
        this.address = JSON.stringify(event.eventData.newAddress, null, '\t');
        console.log(`Endereço do cliente: \n id:${event.eventData.id} \n nome:${event.eventData.nome} \n alterado para:${this.address}`);
    }
}