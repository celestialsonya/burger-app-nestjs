import React, {useContext} from 'react';
import {Routes, Route, Navigate} from "react-router-dom"
import {authRoutes, publicRoutes} from "../Routes";
import {CATALOG_ROUTE} from "../consts/Consts";
import {Context} from "../index";

const AppRouter = () => {

    const {user} = useContext(Context)
    console.log(user)

    return (
        <Routes>

            {user.isAuth && authRoutes.map( ({path, Element}) =>
                <Route key={path} path={path} element={<Element/>} exact/>
            )}

            {publicRoutes.map( ({path, Element}) =>
                <Route key={path} path={path} element={<Element/>} exact/>
            )}

            <Route path="*" element={<Navigate to={CATALOG_ROUTE} />}/>

        </Routes>
    );
};

export default AppRouter;