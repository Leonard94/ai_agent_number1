import React from "react";
import { Card, Input, Button, Space } from "antd";
import { ThunderboltOutlined, ClearOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface RequirementInputProps {
  requirement: string;
  isAnalyzing: boolean;
  onRequirementChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
}

export const RequirementInput: React.FC<RequirementInputProps> = ({
  requirement,
  isAnalyzing,
  onRequirementChange,
  onAnalyze,
  onClear,
}) => {
  return (
    <Card className="input-section" title="Введите требование">
      <TextArea
        value={requirement}
        onChange={(e) => onRequirementChange(e.target.value)}
        placeholder="Вставьте сюда текст функционального требования..."
        rows={6}
        className="requirement-input"
      />
      <Space className="input-actions">
        <Button
          type="primary"
          icon={<ThunderboltOutlined />}
          onClick={onAnalyze}
          loading={isAnalyzing}
          disabled={!requirement.trim()}
          size="large"
        >
          {isAnalyzing ? "Анализирую..." : "Анализировать"}
        </Button>
        <Button icon={<ClearOutlined />} onClick={onClear} size="large">
          Очистить
        </Button>
      </Space>
    </Card>
  );
};
