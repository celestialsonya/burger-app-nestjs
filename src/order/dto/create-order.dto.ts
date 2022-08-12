import { DeliveryDetails } from "../../entities/DeliveryDetails";

export class CreateOrderDto {
    username: string;
    phone_number: string;
    delivery: boolean;
    userId: number;
    cartProducts: string[];
    amount: number;
    deliveryDetails: DeliveryDetails;
    date: string;
}
