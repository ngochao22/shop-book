import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { callHistoryOrder } from "../../services/api";
import moment from "moment";
import JsonView from "react18-json-view";

const History = () => {
    const [listHistoryOrder, setListHistoryOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const columns = [
        {
            title: "STT",
            render: (text, record, index) => <span>{index + 1}</span>,
        },
        {
            title: "Thời gian",
            render: (text, record, index) => (
                <span>
                    {moment(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                </span>
            ),
        },
        {
            title: "Tổng số tiền",
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
            title: "Trạng thái",
            render: (text, record, index) => (
                <Tag color="#87d068">Thành công</Tag>
            ),
        },
        {
            title: "Chi tiết",
            dataIndex: "detail",
            render: (text, record, index) => (
                <JsonView
                    src={record.detail}
                    name="Chi tiết đơn mua hàng: "
                    enableClipboard={false}
                ></JsonView>
            ),
        },
    ];

    useEffect(() => {
        fetchHistoryOrder();
    }, []);

    const fetchHistoryOrder = async () => {
        setIsLoading(true);
        const res = await callHistoryOrder();
        if (res && res.data) {
            setIsLoading(false);
            setListHistoryOrder(res.data);
        }
    };
    return (
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
            <h3 style={{ color: "#514d4d", fontSize: "18px", fontWeight: 600 }}>
                Lịch sử mua hàng:{" "}
            </h3>
            <Table
                columns={columns}
                dataSource={listHistoryOrder}
                loading={isLoading}
                pagination={false}
            ></Table>
        </div>
    );
};

export default History;
