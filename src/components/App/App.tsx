import React, { useState } from "react";
import { Layout, Row, Col, Space, ConfigProvider, theme } from "antd";
import { AppHeader } from "../Header/Header";
import { RequirementInput } from "../RequirementInput/RequirementInput";
import "./App.scss";
import type { ChatMessage, RequirementAnalysisWithTodos } from "../../types";
import { TodoCard } from "../AnalysisResults/TodoCard/TodoCard";
import { QuestionsCard } from "../AnalysisResults/QuestionsCard/QuestionsCard";
import { Chat } from "../Chat/Chat";
import { Instructions } from "../Instructions/Instructions";
import { AnalysisSummary } from "../AnalysisSummary/AnalysisSummary";
import { gigachatApi } from "../../services/gigachatApi";

const { Content } = Layout;

export const App: React.FC = () => {
  const [requirement, setRequirement] = useState<string>("");
  const [analysis, setAnalysis] = useState<RequirementAnalysisWithTodos | null>(
    null
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState<boolean>(false);

  const analyzeRequirement = async () => {
    if (!requirement.trim()) return;

    setIsAnalyzing(true);

    try {
      const analysis = await gigachatApi.analyzeRequirement(requirement);
      setAnalysis(analysis);
    } catch (error) {
      console.error("Ошибка анализа требования:", error);
      setAnalysis({
        tldr: "Не удалось выполнить анализ требования. Пожалуйста, попробуйте позже.",
        todoList: [],
        questions: [],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleTodo = (todoId: string) => {
    if (!analysis) return;

    setAnalysis({
      ...analysis,
      todoList: analysis.todoList.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ),
    });
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

Это типичная задача для React разработчика. Рекомендую начать с создания типов TypeScript для состояния, затем настроить Redux Toolkit slice. 

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
                    <AnalysisSummary
                      tldr={analysis.tldr}
                      todoCount={analysis.todoList.length}
                      questionsCount={analysis.questions.length}
                    />
                    {/* ИЗМЕНЕНО: Передаем новые пропсы в TodoCard */}
                    <TodoCard
                      todoList={analysis.todoList}
                      onToggleTodo={handleToggleTodo}
                    />
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

            {!analysis && <Instructions />}
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};
