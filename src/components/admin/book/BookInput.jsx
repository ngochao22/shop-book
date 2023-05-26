import { Button, Col, Form, Input, Row } from "antd";
import React from "react";

const BookInput = ({ handleSearch }) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        let query = "";
        if (values.mainText) {
            query += `&mainText=/${values.mainText}/i`;
        }

        if (values.author) {
            query += `&author=/${values.author}/i`;
        }

        if (values.category) {
            query += `&category=/${values.category}/i`;
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
                        label="Tên sách"
                        name={"mainText"}
                    >
                        <Input></Input>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Tác giả"
                        name={"author"}
                    >
                        <Input></Input>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Thể loại"
                        name={"category"}
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

export default BookInput;
