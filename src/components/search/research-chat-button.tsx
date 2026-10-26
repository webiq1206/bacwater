"use client";

import { MessageCircle } from "lucide-react";
import { useResearchAssistant } from "@/components/search/research-assistant-provider";
import { Button } from "@/components/ui/button";

/** Opens the research assistant. This is not a contact or lead form. */
export function ResearchChatButton() {
  const { openAssistant } = useResearchAssistant();
  return (
    <Button type="button" variant="brand" size="lg" onClick={(event) => openAssistant(event.currentTarget)}>
      <MessageCircle aria-hidden="true" />
      Chat
    </Button>
  );
}
