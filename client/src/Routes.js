import Admin from "./pages/Admin";
import {ADMIN_ROUTE, BASKET_ROUTE, CATALOG_ROUTE} from "./consts/Consts";
import Catalog from "./pages/Catalog";
import Basket from "./pages/Basket";

export const publicRoutes = [
    {
        path: CATALOG_ROUTE,
        Element: Catalog
    },
    {
        path: BASKET_ROUTE,
        Element: Basket
    }
]

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Element: Admin
    }
]