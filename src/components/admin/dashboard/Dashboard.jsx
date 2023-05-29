import { Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { callDashboard } from "../../../services/api";

const Dashboard = () => {
    const [user, setUser] = useState(0);
    const [order, setOrder] = useState(0);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        const res = await callDashboard();
        if (res && res.data) {
            setOrder(res.data?.countOrder);
            setUser(res.data?.countUser);
        }
    };
    return (
        <div>
            <Row gutter={16}>
                <Col span={10}>
                    <Card
                        title="Tổng Users"
                        bordered={false}
                        style={{ fontSize: "24px" }}
                    >
                        {user}
                    </Card>
                </Col>
                <Col span={10}>
                    <Card
                        title="Tổng đơn hàng"
                        bordered={false}
                        style={{ fontSize: "24px" }}
                    >
                        {order}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
