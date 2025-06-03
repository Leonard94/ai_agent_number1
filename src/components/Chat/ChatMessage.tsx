import React from "react";
import { List, Avatar } from "antd";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";
import type { ChatMessageProps } from "../../types";

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
}) => {
  const isUser = message.role === "user";

  return (
    <List.Item className={`chat-message ${message.role}`}>
      <div className="message-content">
        <Avatar
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          className={`message-avatar ${message.role}`}
        />
        <div className="message-bubble">
          <div className="message-text">{message.content}</div>
          <div className="message-time">
            {message.timestamp.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </List.Item>
  );
};
