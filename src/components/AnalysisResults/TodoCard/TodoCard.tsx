import React from "react";
import { Card, List, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface TodoCardProps {
  todoList: string[];
}

export const TodoCard: React.FC<TodoCardProps> = ({ todoList }) => {
  return (
    <Card
      className="todo-card"
      title={
        <span>
          <CheckCircleOutlined className="card-icon warning" />
          Чеклист технических действий
        </span>
      }
    >
      <List
        dataSource={todoList}
        renderItem={(item) => (
          <List.Item className="todo-item">
            <CheckCircleOutlined className="todo-icon" />
            <Text>{item}</Text>
          </List.Item>
        )}
      />
    </Card>
  );
};
