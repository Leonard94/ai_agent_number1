import React from "react";
import { Card, Typography, Tag, Space } from "antd";
import { InfoCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

interface AnalysisSummaryProps {
  tldr: string;
  todoCount: number;
  questionsCount: number;
}

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  tldr,
  todoCount,
  questionsCount,
}) => {
  return (
    <Card className="analysis-summary-card">
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div className="summary-header">
          <InfoCircleOutlined className="summary-icon" />
          <Title level={4} className="summary-title">
            Анализ требования завершен
          </Title>
        </div>

        <Paragraph className="summary-description">
          <Text strong>Задача для разработчика:</Text> {tldr}
        </Paragraph>

        <Space size="middle" className="summary-stats">
          <Tag icon={<ClockCircleOutlined />} color="processing">
            {todoCount} задач
          </Tag>
          <Tag icon={<InfoCircleOutlined />} color="warning">
            {questionsCount} вопросов
          </Tag>
        </Space>

        <Text type="secondary" className="summary-hint">
          Используйте чат справа для уточнения деталей задачи
        </Text>
      </Space>
    </Card>
  );
};
