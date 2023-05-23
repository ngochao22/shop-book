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
                    </Route>
                    <Route
                        path={"/admin"}
                        element={<LayoutAdmin></LayoutAdmin>}
                    >
                        <Route index element={<AdminPage></AdminPage>}></Route>
                        <Route
                            path="/admin/user"
                            element={<UserTable></UserTable>}
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
