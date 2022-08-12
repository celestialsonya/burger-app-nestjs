import {ValidationError, ValidatorOptions} from "class-validator";

export {};

import {Request} from "express"

export interface UserData {
	userId: number,
    role: Role
}

export interface ExtendedRequest extends Request {
	userData: UserData
}

export type CountableProduct = {
    price: number;
    quantity: number;
};

export type ProductQuantity = {
    product_id: number;
    quantity: number;
};

export enum Role {
    USER = "user",
    ADMIN = "admin",
    WORKER = "worker"
}
