import React, { useState } from "react";
import "./OrderPage.scss";

import ViewOrder from "../../components/order/ViewOrder";
import { Steps } from "antd";
import Payment from "../../components/order/Payment";
import SuccessOutlined from "../../components/order/SuccessOutlined";

const OrderPage = () => {
    const [currentSteps, setCurrentSteps] = useState(0);
    return (
        <div style={{ background: "#efefef", padding: "20px 0" }}>
            <div
                className="order-container"
                style={{ maxWidth: 1440, margin: "0 auto" }}
            >
                <div className="order-steps">
                    <Steps
                        size="small"
                        current={currentSteps}
                        status={"finish"}
                        items={[
                            {
                                title: "Đơn hàng",
                            },
                            {
                                title: "Đặt hàng",
                            },
                            {
                                title: "Thanh Toán",
                            },
                        ]}
                    />
                </div>
                {currentSteps === 0 && (
                    <ViewOrder setCurrentSteps={setCurrentSteps}></ViewOrder>
                )}
                {currentSteps === 1 && (
                    <Payment setCurrentSteps={setCurrentSteps}></Payment>
                )}
                {currentSteps === 2 && <SuccessOutlined></SuccessOutlined>}
            </div>
        </div>
    );
};

export default OrderPage;
