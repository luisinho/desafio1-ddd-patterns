import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address-event";

export default class EnviaConsoleLog2Handler implements EventHandlerInterface<CustomerChangedAddressEvent> {

    handle(event: CustomerChangedAddressEvent): void {
        console.log(`Sending console to ..... ${JSON.stringify(event.eventData)}`);
    }
}