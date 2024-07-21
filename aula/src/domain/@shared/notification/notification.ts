export type NotificationErrorProps = {
    message: string;
    context: string;
}

export default class Notification {

    private errors: NotificationErrorProps [] = [];

    addError(error: NotificationErrorProps) {
        this.errors.push(error);
    }

    cleanError(): void {
        this.errors = [];
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    getErrors(): NotificationErrorProps[] {
        return this.errors;
    }

    messages(context?: string): string {
        let message = '';
        this.errors.forEach((error: NotificationErrorProps) => {
            if (context === undefined || error.context === context) {
                message += `${error.context}: ${error.message},`;
            }
        });
        return message;
    }
}