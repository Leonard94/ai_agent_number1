import React from "react";
import { Card, List, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface QuestionsCardProps {
  questions: string[];
}

export const QuestionsCard: React.FC<QuestionsCardProps> = ({ questions }) => {
  return (
    <Card
      className="questions-card"
      title={
        <span>
          <QuestionCircleOutlined className="card-icon info" />
          Вопросы для уточнения
        </span>
      }
    >
      <List
        dataSource={questions}
        renderItem={(item) => (
          <List.Item className="question-item">
            <QuestionCircleOutlined className="question-icon" />
            <Text>{item}</Text>
          </List.Item>
        )}
      />
    </Card>
  );
};
