import { ProductQuantity } from "../../../types";
import { DeliveryDetails } from "../../entities/DeliveryDetails";
import {ArrayContains, ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsPhoneNumber, IsString} from "class-validator";

export class CreateOrderInputDto {
    @ArrayNotEmpty()
    cart: ProductQuantity[];
    @IsNotEmpty()
    @IsString()
    username: string;
    @IsPhoneNumber()
    phone_number: string;
    @IsBoolean()
    delivery: boolean;
    delivery_details?: DeliveryDetails;
}
