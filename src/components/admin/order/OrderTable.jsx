import { Col, Row, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { callGetListOrder } from "../../../services/api";

const OrderTable = () => {
    const [listOrder, setListOrder] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [current, pageSize]);

    const fetchOrder = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        const res = await callGetListOrder(query);
        console.log(res);
        if (res && res.data) {
            setIsLoading(false);
            setListOrder(res.data?.result);
            setTotal(res.data?.meta?.total);
        }
    };

    const onChange = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const columns = [
        {
            title: "Id",
            render: (text, record, index) => <a href="#">{record._id}</a>,
        },
        {
            title: "Price",
            render: (text, record, index) => (
                <span>
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(record.totalPrice)}
                </span>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Address",
            dataIndex: "address",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
        },
        {
            title: "Ngày cập nhật",
            render: (text, record, index) => (
                <span>
                    {moment(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                </span>
            ),
        },
    ];
    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Table
                        columns={columns}
                        dataSource={listOrder}
                        loading={isLoading}
                        onChange={onChange}
                        rowKey={"_id"}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            total: total,
                            showSizeChanger: true,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default OrderTable;
