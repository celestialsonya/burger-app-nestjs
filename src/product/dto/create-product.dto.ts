export class CreateProductDto {
    name: string;
    description: string;
    price: number;
    category: ProductCategories;
}

enum ProductCategories {
    drinks = "drinks",
    burgers = "burgers",
    snacks = "snacks",
    desserts = "desserts"
}
