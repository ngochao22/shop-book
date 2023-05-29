import React, { useEffect, useState } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import {
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    Radio,
    Row,
    message,
    notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
    doDeleteBookAction,
    doPlaceOrderAction,
    doUpdateBookAction,
} from "../../redux/orders/orderSlice";
import TextArea from "antd/es/input/TextArea";
import { callPlaceOrder } from "../../services/api";

const Payment = ({ setCurrentSteps }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const carts = useSelector((state) => state.order.carts);
    const [totalPrice, setTotalPrice] = useState();
    const user = useSelector((state) => state.account.user);

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

    const onFinish = async (values) => {
        const detailOrder = carts.map((item) => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id,
            };
        });

        const data = {
            name: values.fullName,
            address: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: detailOrder,
        };

        const res = await callPlaceOrder(data);
        if (res && res.data) {
            message.success("Đặt hàng thành công!!");
            dispatch(doPlaceOrderAction());
            setCurrentSteps(2);
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message,
            });
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
                            <Form
                                form={form}
                                onFinish={onFinish}
                                labelCol={{ span: 8 }}
                                autoComplete="off"
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Tên người nhận"
                                    name="fullName"
                                    initialValue={user?.fullName}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập tên hiển thị",
                                        },
                                    ]}
                                >
                                    <Input></Input>
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Số điện thoại"
                                    name="phone"
                                    initialValue={user?.phone}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập sô điện thoại",
                                        },
                                    ]}
                                >
                                    <Input></Input>
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập sô điện thoại",
                                        },
                                    ]}
                                >
                                    <TextArea></TextArea>
                                </Form.Item>
                                <Form.Item>
                                    <Radio value="1" checked="true">
                                        Thanh toán khi nhận hàng
                                    </Radio>
                                </Form.Item>
                            </Form>
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
                            <button
                                onClick={() => {
                                    form.submit();
                                }}
                            >
                                Đặt Hàng ({carts.length ?? 0})
                            </button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Payment;
