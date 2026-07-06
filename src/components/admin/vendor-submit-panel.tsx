"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { draftVendorSubmission, sendVendorSubmission, markVendorConfirmed } from "@/lib/admin-actions";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";

interface Props {
  order: { publicId: string };
  vendors: Array<{ id: string; name: string; contactEmail: string }>;
  submissions: Array<{
    id: string;
    vendorId: string;
    vendor: { name: string; contactEmail: string };
    status: string;
    subject: string;
    body: string;
    sentAt: Date | null;
    confirmationRef: string | null;
    createdAt: Date;
  }>;
}

export function VendorSubmitPanel({ order, vendors, submissions }: Props) {
  const [vendorId, setVendorId] = useState(vendors[0]?.id || "");
  const [pending, setPending] = useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Vendor submissions</h3>
          <Badge variant="outline">{submissions.length} on file</Badge>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className="h-10 rounded-lg border border-input bg-card px-3 text-sm">
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name} ({v.contactEmail})</option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={async () => {
              if (!vendorId) return;
              setPending(true);
              try {
                await draftVendorSubmission(order.publicId, vendorId);
                toast({ title: "Draft prepared", variant: "success" });
              } catch (e) {
                toast({ title: "Could not draft", description: (e as Error).message, variant: "destructive" });
              } finally {
                setPending(false);
              }
            }}
            disabled={pending || !vendorId}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Draft vendor email
          </Button>
        </div>

        <ul className="mt-4 space-y-4">
          {submissions.map((s) => (
            <li key={s.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">{s.vendor.name}</div>
                  <div className="text-xs text-muted-foreground">{s.vendor.contactEmail} · {formatDate(s.createdAt)}</div>
                </div>
                <Badge variant={s.status === "sent" || s.status === "confirmed" ? "brand" : s.status === "failed" ? "destructive" : "outline"}>
                  {s.status}
                </Badge>
              </div>
              <SubmissionEditor
                submissionId={s.id}
                initialSubject={s.subject}
                initialBody={s.body}
                canSend={s.status !== "sent" && s.status !== "confirmed"}
              />
              {s.status === "sent" ? (
                <ConfirmForm submissionId={s.id} />
              ) : null}
              {s.confirmationRef ? (
                <div className="mt-2 text-xs text-muted-foreground">Confirmation: {s.confirmationRef}</div>
              ) : null}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SubmissionEditor({ submissionId, initialSubject, initialBody, canSend }: { submissionId: string; initialSubject: string; initialBody: string; canSend: boolean }) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [sending, setSending] = useState(false);
  return (
    <div className="mt-3 space-y-2">
      <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="text-sm" />
      <Textarea rows={9} value={body} onChange={(e) => setBody(e.target.value)} className="text-sm font-mono" />
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant={canSend ? "brand" : "outline"}
          disabled={sending || !canSend}
          onClick={async () => {
            setSending(true);
            const res = await sendVendorSubmission(submissionId, body, subject);
            setSending(false);
            if (res.ok) toast({ title: "Vendor email sent", variant: "success" });
            else toast({ title: "Draft saved", description: res.error, variant: "destructive" });
          }}
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {canSend ? "Send now" : "Sent"}
        </Button>
      </div>
    </div>
  );
}

function ConfirmForm({ submissionId }: { submissionId: string }) {
  const [ref, setRef] = useState("");
  return (
    <div className="mt-3 flex items-center gap-2">
      <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Vendor confirmation # / tracking" className="text-sm" />
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          if (!ref) return;
          await markVendorConfirmed(submissionId, ref);
          toast({ title: "Confirmation logged", variant: "success" });
        }}
      >Log confirmation</Button>
    </div>
  );
}
