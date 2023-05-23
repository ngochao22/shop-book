import { Divider, Form, Input, Modal, message, notification } from "antd";
import React, { useState } from "react";
import { callCreateUser } from "../../../services/api";

const UserModalCreate = ({
    openModalCreate,
    setOpenModalCreate,
    fetchUser,
}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsLoading(true);
        const res = await callCreateUser(fullName, email, password, phone);
        setIsLoading(false);
        if (res.data) {
            setOpenModalCreate(false);
            message.success("Tạo mới user thành công");
            form.resetFields();
            fetchUser();
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
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openModalCreate}
                onOk={() => form.submit()}
                onCancel={() => setOpenModalCreate(false)}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isLoading}
            >
                <Divider></Divider>
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Tên hiển thị"
                        name={"fullName"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên hiển thị!",
                            },
                        ]}
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name={"email"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập Email!",
                            },
                        ]}
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Mật khẩu"
                        name={"password"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu!",
                            },
                        ]}
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name={"phone"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                        ]}
                    >
                        <Input></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserModalCreate;
