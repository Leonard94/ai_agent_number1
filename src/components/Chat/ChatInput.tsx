import React from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

interface ChatInputProps {
  currentMessage: string;
  isChatting: boolean;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  currentMessage,
  isChatting,
  onMessageChange,
  onSendMessage,
  onKeyPress,
}) => {
  return (
    <div className="chat-input">
      <Input.Group compact>
        <Input
          value={currentMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onPressEnter={onKeyPress}
          placeholder="Задайте вопрос по требованию..."
          className="message-input"
          disabled={isChatting}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={onSendMessage}
          loading={isChatting}
          disabled={!currentMessage.trim()}
          className="send-button"
        />
      </Input.Group>
    </div>
  );
};
