import React from "react";
import { Card, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

interface TldrCardProps {
  tldr: string;
}

export const TldrCard: React.FC<TldrCardProps> = ({ tldr }) => {
  return (
    <Card
      className="tldr-card"
      title={
        <span>
          <CheckCircleOutlined className="card-icon success" />
          TL;DR задачи
        </span>
      }
    >
      <Paragraph className="tldr-content">{tldr}</Paragraph>
    </Card>
  );
};
