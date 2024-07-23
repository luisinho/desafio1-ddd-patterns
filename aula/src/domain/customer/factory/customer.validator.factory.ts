import Customer from "../entity/customer";
import CustomerYupValidator from "../validator/customer.yup.validator";
import ValidatorInterface from "../../@shared/validator/validator.interface";

export default class CustomerValidatorFactory {
    static create(): ValidatorInterface<Customer> {
        return new CustomerYupValidator();
    }
}