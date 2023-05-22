import React, { useState } from "react";
import { Divider, Form, Input, Button, message, notification } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import "./Register.scss";
import { callRegister } from "../../services/api";

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsLoading(true);
        const res = await callRegister(fullName, email, password, phone);
        setIsLoading(false);
        if (res?.data?._id) {
            message.success("Đăng kí tài khoản thành công");
            navigate("/login");
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message)
                        ? res.message[0]
                        : res.message,
                duration: 5,
            });
        }
    };
    return (
        <div className="register-page">
            <div className="container">
                <div className="heading">
                    <h2 className="text">Đăng kí tài khoản</h2>
                    <Divider></Divider>
                </div>
                <Form name="basic" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Họ tên"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: "Họ tên không được để trống!",
                            },
                        ]}
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Email không được để trống!",
                            },
                        ]}
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu không được để trống!",
                            },
                        ]}
                    >
                        <Input.Password></Input.Password>
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Số điện thoại không được để trống!",
                            },
                        ]}
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                        >
                            Đăng kí
                        </Button>
                    </Form.Item>
                    <Divider>Or</Divider>
                    <p className="text-title">
                        Đã có tài khoản ?
                        <span>
                            <NavLink to={"/login"}> Đăng nhập</NavLink>
                        </span>
                    </p>
                </Form>
            </div>
        </div>
    );
};

export default Register;
