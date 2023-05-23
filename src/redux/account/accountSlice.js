import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false, //is the user login or not
    user: {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: "",
    },
};

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        doLoginAction: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        doGetAccountAction: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        doLogoutAction: (state) => {
            localStorage.removeItem("access_token");
            state.isAuthenticated = false;
            state.user = {
                email: "",
                phone: "",
                fullName: "",
                role: "",
                avatar: "",
                id: "",
            };
        },
    },
});

export const { doLoginAction, doGetAccountAction, doLogoutAction } =
    accountSlice.actions;

export default accountSlice.reducer;
