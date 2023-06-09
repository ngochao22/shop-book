import { Routes, Route } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import { useDispatch, useSelector } from "react-redux";
import { callFetchAccount } from "./services/api";
import { doGetAccountAction } from "./redux/account/accountSlice";
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import Home from "./components/home/Home";
import Loading from "./components/loading/Loading";
import NotFoundPage from "./pages/notFound/NotFoundPage";
import LayoutAdmin from "./components/layout/LayoutAdmin";
import AdminPage from "./pages/admin/AdminPage";
import UserTable from "./components/admin/user/UserTable";
import BookTable from "./components/admin/book/BookTable";
import BookPage from "./pages/book/BookPage";
import OrderPage from "./pages/order/OrderPage";
import History from "./pages/history/History";
import Dashboard from "./components/admin/dashboard/Dashboard";
import OrderTable from "./components/admin/order/OrderTable";

function App() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(
        (state) => state.account.isAuthenticated
    );
    const getAccount = async () => {
        if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/register"
        )
            return;
        const res = await callFetchAccount();
        if (res && res.data) {
            dispatch(doGetAccountAction(res.data));
        }
    };
    useEffect(() => {
        getAccount();
    }, []);
    return (
        <>
            {isAuthenticated ||
            window.location.pathname === "/login" ||
            window.location.pathname === "/register" ||
            window.location.pathname === "/" ? (
                <Routes>
                    <Route path="/" element={<Layout></Layout>}>
                        <Route index element={<Home></Home>}></Route>
                        <Route
                            path="/book/:slug"
                            element={<BookPage></BookPage>}
                        ></Route>
                        <Route
                            path="/order"
                            element={<OrderPage></OrderPage>}
                        ></Route>
                        <Route
                            path="/history"
                            element={<History></History>}
                        ></Route>
                    </Route>
                    <Route
                        path={"/admin"}
                        element={<LayoutAdmin></LayoutAdmin>}
                    >
                        <Route index element={<Dashboard></Dashboard>}></Route>
                        <Route
                            path="/admin/user"
                            element={<UserTable></UserTable>}
                        ></Route>
                        <Route
                            path="/admin/book"
                            element={<BookTable></BookTable>}
                        ></Route>
                        <Route
                            path="/admin/order"
                            element={<OrderTable></OrderTable>}
                        ></Route>
                    </Route>
                    <Route
                        path={"/register"}
                        element={<Register></Register>}
                    ></Route>
                    <Route path={"/login"} element={<Login></Login>}></Route>
                    <Route
                        path={"*"}
                        element={<NotFoundPage></NotFoundPage>}
                    ></Route>
                </Routes>
            ) : (
                <Loading></Loading>
            )}
        </>
    );
}

export default App;
