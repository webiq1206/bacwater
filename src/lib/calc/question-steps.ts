export interface QuestionState { id: string; complete: boolean }

/** Stable IDs survive conditional steps. A restored result may not bypass a missing answer. */
export function questionIndex(requested: string, questions: readonly QuestionState[]) {
  const index = Math.max(0, questions.findIndex(question => question.id === requested));
  const missing = questions.findIndex(question => !question.complete);
  return missing < 0 ? index : Math.min(index, missing);
}
