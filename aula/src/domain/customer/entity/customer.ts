import Address from "../value-object/address";
import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";

export default class Customer extends Entity {
/* Complexidade de negocio
    Uma Entity sempre tem que auto validar
    Domain
    - Entity
      - - customer.ts (regra de negocio)

    Complexidade acidental
    Infra -> (Fala com o mundo exteno)
     - Entity / Model
     - customer.ts (get, set)*/

    // sudo docker run --rm -it -v $(pwd)/:/usr/src/app node:15 bash /usr/src/app -> conteiner com o volume

    // private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        super();
        this._id = id;
        this._name = name;
        this.validate();

        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    get name(): string {
        return this._name;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    validate(): void {
       if (this.id.length === 0) {
          this.notification.addError({
            context: 'customer',
            message: 'Id is required',
          });
        }
        if (this._name.length === 0) {
            this.notification.addError({
                context: 'customer',
                message: 'Name is required',
            });            
        }
    }

    changeName(name: string): void {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
    }

    isActive(): boolean {
        return this._active;
    }

    activate() {
        if (this._address === undefined) {
            throw new Error('Address is mandatory to activate a customer');
        }    
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    get address(): Address {
        return this._address
    }    

    set address(address: Address) {
        this._address = address;
    }
}
