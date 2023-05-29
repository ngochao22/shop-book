import React, { useEffect, useState } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { Col, Divider, InputNumber, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
    doDeleteBookAction,
    doUpdateBookAction,
} from "../../redux/orders/orderSlice";

const ViewOrder = ({ setCurrentSteps }) => {
    const dispatch = useDispatch();
    const carts = useSelector((state) => state.order.carts);
    const [totalPrice, setTotalPrice] = useState();

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map((item) => {
                sum += item.quantity * item.detail.price;
            });
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);

    const handleChangeInput = (value, book) => {
        console.log("<<< check value, book: ", value, book);
        if (!value && value < 1) return;
        if (!isNaN(value)) {
            dispatch(
                doUpdateBookAction({
                    quantity: value,
                    _id: book._id,
                    detail: book,
                })
            );
        }
    };

    return (
        <div style={{ background: "#efefef", padding: "20px 0" }}>
            <div
                className="order-container"
                style={{ maxWidth: 1440, margin: "0 auto" }}
            >
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
                        {carts.length > 0 &&
                            carts.map((item) => (
                                <div className="order-book" key={item._id}>
                                    <div className="book-content">
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/images/book/${
                                                item.detail.thumbnail
                                            }`}
                                            alt=""
                                        />
                                        <div className="title">
                                            {item.detail.mainText}
                                        </div>
                                        <div className="price">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(item.detail.price)}
                                        </div>
                                    </div>
                                    <div className="action">
                                        <div className="quantity">
                                            <InputNumber
                                                onChange={(value) =>
                                                    handleChangeInput(
                                                        value,
                                                        item
                                                    )
                                                }
                                                value={item.quantity}
                                            ></InputNumber>
                                        </div>
                                        <div className="sum">
                                            Tổng:{" "}
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(
                                                item.quantity *
                                                    item.detail.price
                                            )}
                                        </div>
                                        <DeleteTwoTone
                                            style={{ cursor: "pointer" }}
                                            twoToneColor="#eb2f96"
                                            onClick={() =>
                                                dispatch(
                                                    doDeleteBookAction({
                                                        _id: item._id,
                                                    })
                                                )
                                            }
                                        ></DeleteTwoTone>
                                    </div>
                                </div>
                            ))}
                    </Col>
                    <Col md={6} xs={24}>
                        <div className="order-sum">
                            <div className="calculate">
                                <span> Tạm tính</span>
                                <span>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(totalPrice)}
                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }}></Divider>
                            <div className="calculate">
                                <span> Tổng tiền</span>
                                <div className="sum-final">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(totalPrice)}
                                </div>
                            </div>
                            <Divider style={{ margin: "10px 0" }}></Divider>
                            <button onClick={() => setCurrentSteps(1)}>
                                Mua Hàng ({carts.length ?? 0})
                            </button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ViewOrder;
