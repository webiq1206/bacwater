"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { questionIndex, type QuestionState } from "@/lib/calc/question-steps";
import styles from "@/components/brand/hero-calculator.module.css";

export interface Question extends QuestionState { title: string; label: string; content: ReactNode; hint?: string }
export function QuestionSteps({ questions, current, onStep, onClear, finalAction, children }: {
  questions: Question[]; current: string; onStep: (id: string) => void; onClear: () => void;
  finalAction?: ReactNode; children?: ReactNode;
}) {
  const index = questionIndex(current, questions), question = questions[index];
  const root = useRef<HTMLDivElement>(null), previous = useRef(question.id), focusNext = useRef(false);
  const last = index === questions.length - 1;
  useEffect(() => { if (current !== question.id) onStep(question.id); }, [current, question.id, onStep]);
  useEffect(() => {
    const changed = previous.current !== question.id;
    previous.current = question.id;
    if (!changed && !focusNext.current) return;
    focusNext.current = false;
    root.current?.querySelector<HTMLElement>("[data-guided-heading]")?.focus({ preventScroll: true });
    root.current?.querySelector<HTMLElement>("[data-step-scroll]")?.scrollTo({ top: 0, behavior: "instant" });
    root.current?.closest<HTMLElement>("[data-calculator-scroll], [data-hero-scroll]")?.scrollTo({ top: 0, behavior: "instant" });
  }, [question.id]);
  function move(id: string) { focusNext.current = true; onStep(id); }
  return <div ref={root} className={styles.guided} data-hero-guided data-guided-step={question.id}>
    <div className={styles.progress} role="group" aria-label={`Step ${index + 1} of ${questions.length}: ${question.label}`}>
      <div aria-hidden="true">{questions.map((item, i) => <span key={item.id} data-complete={i <= index}/>)}</div>
      <p><span>Step {index + 1} of {questions.length}</span><span>{question.label}</span></p>
    </div>
    <h2 data-guided-heading tabIndex={-1} className={styles.stepTitle}>{question.title}</h2>
    <div className={styles.stepScroll} data-step-scroll tabIndex={0} role="region" aria-label={`${question.label} step fields`}>
      {question.hint && <p className={styles.stepHint}>{question.hint}</p>}
      <div className={styles.stepFields} key={question.id}>{question.content}</div>
    </div>
    <div className={styles.stepNavigation}>
      {index > 0 ? <button type="button" onClick={() => move(questions[index - 1].id)}><ArrowLeft size={17} aria-hidden="true"/>Back</button> : <span/>}
      <button type="button" className={styles.clearStep} aria-label="Clear" title="Clear entries" onClick={() => { onClear(); move(questions[0].id); }}><RotateCcw size={16} aria-hidden="true"/></button>
      {last ? finalAction : <button type="button" data-guided-next className={styles.stepPrimary} disabled={!question.complete} onClick={() => move(questions[index + 1].id)}>Next<ArrowRight size={17} aria-hidden="true"/></button>}
    </div>
    {children}
  </div>;
}
