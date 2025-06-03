import React from "react";
import { Card, List, Typography } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { ChatMessageComponent } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import type { ChatMessage } from "../../types";

const { Text } = Typography;

interface ChatProps {
  chatMessages: ChatMessage[];
  currentMessage: string;
  isChatting: boolean;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const Chat: React.FC<ChatProps> = ({
  chatMessages,
  currentMessage,
  isChatting,
  onMessageChange,
  onSendMessage,
  onKeyPress,
}) => {
  return (
    <Card
      className="chat-card"
      title={
        <span>
          <RobotOutlined className="card-icon primary" />
          Чат с AI по задаче
        </span>
      }
    >
      <div className="chat-container">
        <div className="chat-messages">
          {chatMessages.length === 0 ? (
            <div className="chat-placeholder">
              <RobotOutlined className="placeholder-icon" />
              <Text type="secondary">
                Начните диалог, чтобы уточнить детали задачи
              </Text>
            </div>
          ) : (
            <List
              dataSource={chatMessages}
              renderItem={(message) => (
                <ChatMessageComponent
                  key={message.timestamp.getTime()}
                  message={message}
                />
              )}
            />
          )}
          {isChatting && <TypingIndicator />}
        </div>

        <ChatInput
          currentMessage={currentMessage}
          isChatting={isChatting}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onKeyPress={onKeyPress}
        />
      </div>
    </Card>
  );
};
