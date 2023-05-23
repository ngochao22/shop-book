import { Button, Col, Form, Input, Row } from "antd";
import React from "react";

const UserInput = ({ handleSearch }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
        let query = "";
        if (values.fullName) {
            query += `&fullName=/${values.fullName}/i`;
        }

        if (values.email) {
            query += `&email=/${values.email}/i`;
        }

        if (values.phone) {
            query += `&phone=/${values.phone}/i`;
        }

        if (query) {
            handleSearch(query);
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form form={form} name="advanced_search" onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`fullName`}
                        label={`Name`}
                    >
                        <Input></Input>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`email`}
                        label={`Email`}
                    >
                        <Input></Input>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`phone`}
                        label={`Số điện thoại`}
                    >
                        <Input></Input>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Search
                </Button>
                <Button type="link" htmlType="button" onClick={onReset}>
                    Reset
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UserInput;
