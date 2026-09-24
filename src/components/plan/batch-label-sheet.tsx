"use client";
import { LabelComposer } from "./label-composer";
import type { VialLabelData } from "./vial-label";
export interface BatchLabelPlan extends VialLabelData { planName:string; defaultMixDate:string; }
export function BatchLabelSheet({plans}:{plans:BatchLabelPlan[]}){return <LabelComposer plans={plans}/>;}
