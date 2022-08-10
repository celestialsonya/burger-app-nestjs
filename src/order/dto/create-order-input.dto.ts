import { ProductQuantity } from "../../../types";
import { DeliveryDetails } from "../../entities/DeliveryDetails";

export class CreateOrderInputDto {
    cart: ProductQuantity[];
    username: string;
    phone_number: string;
    delivery: boolean;
    delivery_details?: DeliveryDetails;
}
