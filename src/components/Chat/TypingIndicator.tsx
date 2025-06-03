import React from "react";
import { Avatar, Spin, Typography } from "antd";
import { RobotOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator">
      <Avatar icon={<RobotOutlined />} className="message-avatar assistant" />
      <div className="typing-bubble">
        <Spin size="small" />
        <Text type="secondary" className="typing-text">
          AI печатает...
        </Text>
      </div>
    </div>
  );
};
