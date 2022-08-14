import {makeAutoObservable} from "mobx";

export default class ProductStore {
    constructor(props) {
        this._products = [
            {id: 1, name: "coca-cola", description: "original", price: 250, category: "drinks"},
            {id: 2, name: "coca-cola", description: "original", price: 250, category: "drinks"},
            {id: 3, name: "coca-cola", description: "original", price: 250, category: "drinks"}
        ]
        makeAutoObservable(this)
    }

    setProducts(products){
        this._products = products
    }

    get products(){
        return this._products
    }

}