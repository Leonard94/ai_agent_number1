import React, { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Card,
  Typography,
  List,
  Space,
  Row,
  Col,
  Avatar,
  Spin,
  ConfigProvider,
  theme,
} from "antd";
import {
  SendOutlined,
  ClearOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import "./App.scss";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface RequirementAnalysis {
  tldr: string;
  todoList: string[];
  questions: string[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `Ты — технический помощник. Тебе дают бизнес-требование. Выведи:
1. TL;DR задачи.
2. Чеклист технических действий (todo).
3. Вопросы, если что-то неясно.

Ты выступаешь как инженер, который умеет ясно объяснять задачи другим разработчикам. Преобразуй абстрактные требования в конкретные технические действия.

Приоритет задач будет зависеть от направления. Пока смотрим на react разработчиков с таким стеком: typescript, redux toolkit. Задачи только для frontend. На выходе я хочу получить краткое содержание требования касающееся только frontend разработчика.`;

export const App: React.FC = () => {
  const [requirement, setRequirement] = useState<string>("");
  const [analysis, setAnalysis] = useState<RequirementAnalysis | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState<boolean>(false);

  const analyzeRequirement = async () => {
    if (!requirement.trim()) return;

    setIsAnalyzing(true);

    console.log("=== ОТПРАВКА В GIGACHAT API ===");
    console.log("Системный промпт:", SYSTEM_PROMPT);
    console.log("Пользовательское требование:", requirement);
    console.log("================================");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockAnalysis: RequirementAnalysis = {
      tldr: "Создание компонента формы регистрации пользователя с валидацией полей email и пароля, интеграцией с Redux для управления состоянием авторизации.",
      todoList: [
        "Создать компонент RegistrationForm с TypeScript типами",
        "Настроить Redux slice для управления состоянием авторизации",
        "Добавить валидацию email с регулярными выражениями",
        "Реализовать валидацию пароля (минимум 8 символов, спецсимволы)",
        "Создать async thunk для отправки данных на сервер",
        "Добавить обработку ошибок и loading состояний",
        "Написать unit тесты для формы",
        "Добавить accessibility атрибуты (ARIA)",
      ],
      questions: [
        "Какие именно поля кроме email и пароля нужны в форме?",
        "Нужно ли подтверждение пароля?",
        "Какая именно валидация требуется для пароля?",
        "Нужна ли интеграция с социальными сетями?",
        "Какой UI библиотеки использовать (Material-UI, Ant Design, custom)?",
        "Нужно ли сохранение данных в localStorage?",
      ],
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const sendChatMessage = async () => {
    if (!currentMessage.trim() || !analysis) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsChatting(true);

    console.log("=== ЧАТ С GIGACHAT API ===");
    console.log("Контекст анализа:", analysis);
    console.log("Сообщение пользователя:", currentMessage);
    console.log("==========================");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponse: ChatMessage = {
      role: "assistant",
      content: `Понял ваш вопрос по требованию. Вот мой ответ на "${currentMessage}": 

Это типичная задача для React разработчика. Рекомендую начать с создания типов TypeScript для формы, затем настроить Redux Toolkit slice. 

Нужны ли дополнительные уточнения по реализации?`,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, aiResponse]);
    setIsChatting(false);
  };

  const clearAll = () => {
    setRequirement("");
    setAnalysis(null);
    setChatMessages([]);
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#1890ff",
          colorBgContainer: "#1f1f1f",
          colorBgElevated: "#262626",
        },
      }}
    >
      <Layout className="app-layout">
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

        <Content className="app-content">
          <div className="content-wrapper">
            <Card className="input-section" title="Введите требование">
              <TextArea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Вставьте сюда текст функционального требования..."
                rows={6}
                className="requirement-input"
              />
              <Space className="input-actions">
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  onClick={analyzeRequirement}
                  loading={isAnalyzing}
                  disabled={!requirement.trim()}
                  size="large"
                >
                  {isAnalyzing ? "Анализирую..." : "Анализировать"}
                </Button>
                <Button
                  icon={<ClearOutlined />}
                  onClick={clearAll}
                  size="large"
                >
                  Очистить
                </Button>
              </Space>
            </Card>

            {analysis && (
              <Row gutter={[24, 24]} className="results-section">
                <Col xs={24} lg={14}>
                  <Space
                    direction="vertical"
                    size="large"
                    className="analysis-cards"
                  >
                    <Card
                      className="tldr-card"
                      title={
                        <span>
                          <CheckCircleOutlined className="card-icon success" />
                          TL;DR задачи
                        </span>
                      }
                    >
                      <Paragraph className="tldr-content">
                        {analysis.tldr}
                      </Paragraph>
                    </Card>

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
                        dataSource={analysis.todoList}
                        renderItem={(item) => (
                          <List.Item className="todo-item">
                            <CheckCircleOutlined className="todo-icon" />
                            <Text>{item}</Text>
                          </List.Item>
                        )}
                      />
                    </Card>

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
                        dataSource={analysis.questions}
                        renderItem={(item) => (
                          <List.Item className="question-item">
                            <QuestionCircleOutlined className="question-icon" />
                            <Text>{item}</Text>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Space>
                </Col>

                <Col xs={24} lg={10}>
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
                              <List.Item
                                className={`chat-message ${message.role}`}
                              >
                                <div className="message-content">
                                  <Avatar
                                    icon={
                                      message.role === "user" ? (
                                        <UserOutlined />
                                      ) : (
                                        <RobotOutlined />
                                      )
                                    }
                                    className={`message-avatar ${message.role}`}
                                  />
                                  <div className="message-bubble">
                                    <div className="message-text">
                                      {message.content}
                                    </div>
                                    <div className="message-time">
                                      {message.timestamp.toLocaleTimeString()}
                                    </div>
                                  </div>
                                </div>
                              </List.Item>
                            )}
                          />
                        )}
                        {isChatting && (
                          <div className="typing-indicator">
                            <Avatar
                              icon={<RobotOutlined />}
                              className="message-avatar assistant"
                            />
                            <div className="typing-bubble">
                              <Spin size="small" />
                              <Text type="secondary" className="typing-text">
                                AI печатает...
                              </Text>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="chat-input">
                        <Input.Group compact>
                          <Input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onPressEnter={handleKeyPress}
                            placeholder="Задайте вопрос по требованию..."
                            className="message-input"
                            disabled={isChatting}
                          />
                          <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={sendChatMessage}
                            loading={isChatting}
                            disabled={!currentMessage.trim()}
                            className="send-button"
                          />
                        </Input.Group>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            )}

            <Card className="instructions-card" title="Инструкция">
              <List
                dataSource={[
                  "Вставьте текст функционального требования в поле выше",
                  'Нажмите "Анализировать" - запрос отправится в GigaChat API',
                  "Получите структурированный анализ для frontend разработчика",
                  "Используйте чат для уточнения деталей задачи",
                  "⚠️ Пока что все запросы выводятся в console.log для отладки",
                ]}
                renderItem={(item, index) => (
                  <List.Item className="instruction-item">
                    <Text className="instruction-number">{index + 1}.</Text>
                    <Text className={index === 4 ? "warning-text" : ""}>
                      {item}
                    </Text>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};
