import type { RequirementAnalysisWithTodos, TodoItem } from "../types";
import { v4 as uuidv4 } from "uuid";

export const parseTldr = (response: string): string => {
  const tldrMatch = response.match(
    /\*\*TL;?DR:\*\*\s*\n?([\s\S]*?)(?=\n\*\*TODO:\*\*|\n\*\*ВОПРОСЫ:\*\*|$)/i
  );

  const tldr = tldrMatch?.[1]?.trim();
  return tldr || "Не удалось извлечь краткое описание";
};

export const parseTodoList = (response: string): TodoItem[] => {
  const todoSectionMatch = response.match(
    /\*\*TODO:\*\*\s*\n?([\s\S]*?)(?=\n\*\*ВОПРОСЫ:\*\*|$)/i
  );

  if (!todoSectionMatch) {
    return [
      {
        id: uuidv4(),
        text: "Не удалось извлечь технические задачи",
        completed: false,
      },
    ];
  }

  const todoText = todoSectionMatch[1];
  const todoList = todoText
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, ""))
    .filter(Boolean)
    .map((text) => ({
      id: uuidv4(),
      text,
      completed: false,
    }));

  return todoList.length > 0
    ? todoList
    : [
        {
          id: uuidv4(),
          text: "Не удалось извлечь технические задачи",
          completed: false,
        },
      ];
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

export const parseAiResponse = (
  response: string
): RequirementAnalysisWithTodos => {
  console.log("=== ПАРСИНГ ОТВЕТА МОДЕЛИ ===");
  console.log("Исходный ответ:", response);

  const result: RequirementAnalysisWithTodos = {
    tldr: parseTldr(response),
    todoList: parseTodoList(response),
    questions: parseQuestions(response),
  };

  console.log("Результат парсинга:", result);
  return result;
};
