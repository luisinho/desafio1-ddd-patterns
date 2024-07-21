import { NotificationErrorProps } from "./notification";

export default class NotificationError extends Error {
    constructor(public errors: NotificationErrorProps[]) {
        super(
            errors.map((error: NotificationErrorProps) => `${error.context}: ${error.message}`).join(',')
        );
    }
}