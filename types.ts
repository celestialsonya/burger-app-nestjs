export {};

declare global {
    namespace Express {
        interface Request {
            userData: any;
        }
    }
}

export type CountableProduct = {
    price: number;
    quantity: number;
};

export type ProductQuantity = {
    product_id: number;
    quantity: number;
};
