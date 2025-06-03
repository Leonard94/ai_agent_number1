import React, { useState } from "react";
import { Layout, Row, Col, Space, ConfigProvider, theme } from "antd";
import { SYSTEM_PROMPT } from "../../constants";
import { AppHeader } from "../Header/Header";
import { RequirementInput } from "../RequirementInput/RequirementInput";
import "./App.scss";
import type { ChatMessage, RequirementAnalysis } from "../../types";
import { TldrCard } from "../AnalysisResults/TldrCard/TldrCard";
import { TodoCard } from "../AnalysisResults/TodoCard/TodoCard";
import { QuestionsCard } from "../AnalysisResults/QuestionsCard/QuestionsCard";
import { Chat } from "../Chat/Chat";
import { Instructions } from "../Instructions/Instructions";

const { Content } = Layout;

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
        <AppHeader />

        <Content className="app-content">
          <div className="content-wrapper">
            <RequirementInput
              requirement={requirement}
              isAnalyzing={isAnalyzing}
              onRequirementChange={setRequirement}
              onAnalyze={analyzeRequirement}
              onClear={clearAll}
            />

            {analysis && (
              <Row gutter={[24, 24]} className="results-section">
                <Col xs={24} lg={14}>
                  <Space
                    direction="vertical"
                    size="large"
                    className="analysis-cards"
                  >
                    <TldrCard tldr={analysis.tldr} />
                    <TodoCard todoList={analysis.todoList} />
                    <QuestionsCard questions={analysis.questions} />
                  </Space>
                </Col>

                <Col xs={24} lg={10}>
                  <Chat
                    chatMessages={chatMessages}
                    currentMessage={currentMessage}
                    isChatting={isChatting}
                    onMessageChange={setCurrentMessage}
                    onSendMessage={sendChatMessage}
                    onKeyPress={handleKeyPress}
                  />
                </Col>
              </Row>
            )}

            <Instructions />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};
