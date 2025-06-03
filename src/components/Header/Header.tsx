import React from "react";
import { Layout, Typography } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title, Paragraph } = Typography;

export const AppHeader: React.FC = () => {
  return (
    <Header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <ThunderboltOutlined className="header-icon" />
          <Title level={2} className="header-text">
            AI Анализатор Требований
          </Title>
        </div>
        <Paragraph className="header-description">
          Преобразование бизнес-требований в технические задачи для React
          разработчиков
        </Paragraph>
      </div>
    </Header>
  );
};
