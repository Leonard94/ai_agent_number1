import type { RequirementAnalysis } from "../types";

export const parseTldr = (response: string): string => {
  const tldrMatch = response.match(
    /### 1\. T[LS];?DR[\s\S]*?\n\n([\s\S]*?)(?=---|### 2\.|$)/i
  );

  return tldrMatch?.[1]?.trim() || "Не удалось извлечь краткое описание";
};

export const parseTodoList = (response: string): string[] => {
  const todoSectionMatch = response.match(
    /### 2\. Чеклист технических действий[\s\S]*?\n\n([\s\S]*?)(?=---|### 3\.|$)/i
  );

  if (!todoSectionMatch) {
    return ["Не удалось извлечь технические задачи"];
  }

  const todoText = todoSectionMatch[1];
  const todoList = todoText
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- ") && !line.startsWith("- **"))
    .map((line) => line.replace(/^- /, ""))
    .filter(Boolean);

  return todoList.length > 0
    ? todoList
    : ["Не удалось извлечь технические задачи"];
};

export const parseQuestions = (response: string): string[] => {
  const questionsSectionMatch = response.match(
    /### 3\. Вопросы[\s\S]*?\n\n([\s\S]*?)$/i
  );

  if (!questionsSectionMatch) {
    return ["Не удалось извлечь вопросы"];
  }

  const questionsText = questionsSectionMatch[1];
  const questions = questionsText
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, ""))
    .filter(Boolean);

  return questions.length > 0 ? questions : ["Не удалось извлечь вопросы"];
};

export const parseAiResponse = (response: string): RequirementAnalysis => {
  console.log("=== ПАРСИНГ ОТВЕТА МОДЕЛИ ===");
  console.log("Исходный ответ:", response);

  const result: RequirementAnalysis = {
    tldr: parseTldr(response),
    todoList: parseTodoList(response),
    questions: parseQuestions(response),
  };

  console.log("Результат парсинга:", result);
  return result;
};
