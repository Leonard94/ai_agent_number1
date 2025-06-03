import React from "react";
import { Card, List, Typography } from "antd";

const { Text } = Typography;

const INSTRUCTIONS = [
  "Вставьте текст функционального требования в поле выше",
  'Нажмите "Анализировать" - запрос отправится в GigaChat API',
  "Получите структурированный анализ для frontend разработчика",
  "Используйте чат для уточнения деталей задачи",
];

export const Instructions: React.FC = () => {
  return (
    <Card className="instructions-card" title="Инструкция">
      <List
        dataSource={INSTRUCTIONS}
        renderItem={(item, index) => (
          <List.Item className="instruction-item">
            <Text className="instruction-number">{index + 1}.</Text>
            <Text className={index === 4 ? "warning-text" : ""}>{item}</Text>
          </List.Item>
        )}
      />
    </Card>
  );
};
