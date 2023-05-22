import React, { useState } from "react";
import { Divider, Form, Input, Button, message, notification } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { callLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlice";

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { username, password } = values;
        setIsLoading(true);
        const res = await callLogin(username, password);
        setIsLoading(false);
        console.log(res);
        if (res?.data?.user) {
            localStorage.setItem("access_token", res.data.access_token);
            dispatch(doLoginAction(res.data.user));
            message.success("Đăng nhập thành công");
            navigate("/");
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
                    <h2 className="text">Đăng nhập</h2>
                    <Divider></Divider>
                </div>
                <Form name="basic" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="username"
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

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    <Divider>Or</Divider>
                    <p className="text-title">
                        Chưa có tài khoản ?
                        <span>
                            <NavLink to={"/register"}> Đăng Kí</NavLink>
                        </span>
                    </p>
                </Form>
            </div>
        </div>
    );
};

export default Login;
