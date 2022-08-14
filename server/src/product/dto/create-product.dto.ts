import {IsEmail, IsEnum, IsNotEmpty, isNotEmpty, IsNumber, IsString, isString} from "class-validator";

export enum ProductCategories {
    drinks = "drinks",
    burgers = "burgers",
    snacks = "snacks",
    desserts = "desserts"
}

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    description: string;
    @IsNotEmpty()
    @IsNumber()
    price: number;
    @IsEnum(ProductCategories, {each: true})
    category: ProductCategories;
}

