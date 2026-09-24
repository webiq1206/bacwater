"use client";
import { useMemo } from "react";
import { LabelComposer } from "./label-composer";
import type { VialLabelData } from "./vial-label";
export function LabelSheet(props:VialLabelData){const plans=useMemo(()=>[props],[props.publicId,props.peptideName,props.vialStrengthMg,props.bacWaterMl,props.concentration,props.defaultMixDate]);return <LabelComposer plans={plans}/>;}
