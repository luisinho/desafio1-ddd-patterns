
import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address-event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerChangedAddressEvent> {

    address: string;

    handle(event: CustomerChangedAddressEvent): void {
        this.address = JSON.stringify(event.eventData.newAddress, null, '\t');
        console.log(`Endereço do cliente: \n id:${event.eventData.id} \n nome:${event.eventData.nome} \n alterado para:${this.address}`);
    }
}