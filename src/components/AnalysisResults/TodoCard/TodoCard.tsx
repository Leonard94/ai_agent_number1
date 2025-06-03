import React from "react";
import { Card, List, Typography, Checkbox } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { TodoItem } from "../../../types";

const { Text } = Typography;

interface TodoCardProps {
  todoList: TodoItem[];
  onToggleTodo: (todoId: string) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todoList,
  onToggleTodo,
}) => {
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
            <Checkbox
              checked={item.completed}
              onChange={() => onToggleTodo(item.id)}
              className="todo-checkbox"
            />

            <Text
              className={`todo-text ${item.completed ? "completed" : ""}`}
              onClick={() => onToggleTodo(item.id)}
              style={{
                textDecoration: item.completed ? "line-through" : "none",
                opacity: item.completed ? 0.6 : 1,
                cursor: "pointer",
                flex: 1,
                marginLeft: 8,
              }}
            >
              {item.text}
            </Text>
          </List.Item>
        )}
      />
    </Card>
  );
};
