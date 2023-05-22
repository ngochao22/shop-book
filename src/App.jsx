import { Routes, Route } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import { useDispatch } from "react-redux";
import { callFetchAccount } from "./services/api";
import { doGetAccountAction } from "./redux/account/accountSlice";
import { useEffect } from "react";

function App() {
    const dispatch = useDispatch();
    const getAccount = async () => {
        const res = await callFetchAccount();
        if (res && res.data) {
            dispatch(doGetAccountAction(res.data));
        }
    };
    useEffect(() => {
        getAccount();
    }, []);
    return (
        <div>
            <Routes>
                <Route
                    path={"/register"}
                    element={<Register></Register>}
                ></Route>
                <Route path={"/login"} element={<Login></Login>}></Route>
            </Routes>
        </div>
    );
}

export default App;
