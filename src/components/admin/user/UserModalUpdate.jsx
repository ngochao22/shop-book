import { Divider, Form, Input, Modal, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { callUpdateUser } from "../../../services/api";

const UserModalUpdate = ({
    openModalUpdate,
    setOpenModalUpdate,
    dataUpdate,
    fetchUser,
}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values) => {
        const { _id, fullName, phone } = values;
        setIsLoading(true);
        const res = await callUpdateUser(_id, fullName, phone);
        setIsLoading(false);
        if (res && res.data) {
            message.success("Cập nhật thành công");
            await fetchUser();
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

    useEffect(() => {
        form.setFieldsValue(dataUpdate);
    }, [dataUpdate]);
    return (
        <>
            <Modal
                title="Cập nhật người dùng"
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => setOpenModalUpdate(false)}
                okText="Cập nhật"
                cancelText="Hủy"
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
                        label="Id"
                        name={"_id"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập id",
                            },
                        ]}
                        hidden
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Tên hiển thị"
                        name={"fullName"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên hiển thị",
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
                                message: "Vui lòng nhập email",
                            },
                        ]}
                    >
                        <Input disabled></Input>
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name={"phone"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại",
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

export default UserModalUpdate;
