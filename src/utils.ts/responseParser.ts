import type { RequirementAnalysis } from "../types";

export const parseTldr = (response: string): string => {
  const tldrMatch = response.match(
    /\*\*TL;?DR:\*\*\s*\n?([\s\S]*?)(?=\n\*\*TODO:\*\*|\n\*\*ВОПРОСЫ:\*\*|$)/i
  );

  const tldr = tldrMatch?.[1]?.trim();
  return tldr || "Не удалось извлечь краткое описание";
};

export const parseTodoList = (response: string): string[] => {
  const todoSectionMatch = response.match(
    /\*\*TODO:\*\*\s*\n?([\s\S]*?)(?=\n\*\*ВОПРОСЫ:\*\*|$)/i
  );

  if (!todoSectionMatch) {
    return ["Не удалось извлечь технические задачи"];
  }

  const todoText = todoSectionMatch[1];
  const todoList = todoText
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, ""))
    .filter(Boolean);

  return todoList.length > 0
    ? todoList
    : ["Не удалось извлечь технические задачи"];
};

export const parseQuestions = (response: string): string[] => {
  const questionsSectionMatch = response.match(
    /\*\*ВОПРОСЫ:\*\*\s*\n?([\s\S]*?)$/i
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
