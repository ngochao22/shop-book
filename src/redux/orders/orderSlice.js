import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    carts: [],
};

export const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            state.isAddBook = true;
            let carts = state.carts;
            const item = action.payload;

            let isExitsIndex = carts.findIndex((c) => c._id === item._id);
            if (isExitsIndex > -1) {
                carts[isExitsIndex].quantity =
                    carts[isExitsIndex].quantity + item.quantity;
                if (
                    carts[isExitsIndex].quantity >
                    carts[isExitsIndex].detail.quantity
                ) {
                    carts[isExitsIndex].quantity =
                        carts[isExitsIndex].detail.quantity;
                }
            } else {
                carts.push({
                    quantity: item.quantity,
                    _id: item._id,
                    detail: item.detail,
                });
            }

            state.carts = carts;
        },

        doUpdateBookAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;

            const isExitsIndex = carts.findIndex((c) => c._id === item._id);
            if (isExitsIndex > -1) {
                carts[isExitsIndex].quantity = item.quantity;
                if (
                    carts[isExitsIndex].quantity >
                    carts[isExitsIndex].detail.quantity
                ) {
                    carts[isExitsIndex].quantity =
                        carts[isExitsIndex].detail.quantity;
                }
            } else {
                carts.push({
                    quantity: item.quantity,
                    _id: item._id,
                    detail: item.detail,
                });
            }

            state.carts = carts;
        },

        doDeleteBookAction: (state, action) => {
            state.carts = state.carts.filter(
                (c) => c._id !== action.payload._id
            );
        },

        doPlaceOrderAction: (state) => {
            state.carts = [];
        },
    },
});

export const {
    doAddBookAction,
    doUpdateBookAction,
    doDeleteBookAction,
    doPlaceOrderAction,
} = orderSlice.actions;

export default orderSlice.reducer;
