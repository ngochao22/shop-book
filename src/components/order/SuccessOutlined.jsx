import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessOutlined = () => {
    const navigate = useNavigate();
    return (
        <Result
            status={"success"}
            title={"Đơn hàng đã được đặt thành công!"}
            extra={[
                <Button type="primary" onClick={() => navigate("/history")}>
                    Xem lịch sử
                </Button>,
            ]}
        ></Result>
    );
};

export default SuccessOutlined;
