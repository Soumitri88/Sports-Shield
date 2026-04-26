import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Bell, Shield, Cpu, Globe, Key, Webhook } from "lucide-react";

export default function Settings() {
  const [autoEnforce, setAutoEnforce] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [contentPoisoning, setContentPoisoning] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState([75]);
  const [webhook, setWebhook] = useState("https://hooks.shield.io/incidents");
  const [orgName, setOrgName] = useState("Premier Broadcast Group");

  const save = () => toast.success("Settings saved", { icon: <Shield className="h-4 w-4 text-sky-400" /> });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Configure detection thresholds, automation policies, and integrations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Organization</CardTitle>
          <CardDescription>Identity used in DMCA notices and platform reports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Organization name</Label>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Region</Label>
              <Input defaultValue="EU · UK · APAC" className="mt-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5 text-primary" /> Detection Engine</CardTitle>
          <CardDescription>Tune the AI model that scores incoming streams.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Risk score threshold</Label>
              <Badge variant="outline" className="font-mono">{riskThreshold[0]}/100</Badge>
            </div>
            <Slider value={riskThreshold} onValueChange={setRiskThreshold} min={50} max={99} step={1} />
            <p className="text-xs text-muted-foreground mt-2">Streams scoring above this threshold are flagged for enforcement review.</p>
          </div>
          <Separator />
          <ToggleRow label="Content poisoning injection" desc="Inject corrupted segments into confirmed pirated streams." checked={contentPoisoning} onChange={setContentPoisoning} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Automation</CardTitle>
          <CardDescription>What the agent is allowed to do without human approval.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <ToggleRow label="Auto-dispatch DMCA takedowns" desc="Send takedowns automatically when score ≥ threshold and platform is supported." checked={autoEnforce} onChange={setAutoEnforce} />
          <Separator />
          <ToggleRow label="Critical incident alerts" desc="Push notifications for Critical risk incidents to on-call." checked={criticalAlerts} onChange={setCriticalAlerts} />
          <Separator />
          <ToggleRow label="Daily email digest" desc="Summary of incidents, takedowns, and revenue recovered." checked={emailDigest} onChange={setEmailDigest} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Webhook className="h-5 w-5 text-primary" /> Integrations</CardTitle>
          <CardDescription>Forward events to your security stack.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Incident webhook URL</Label>
            <Input value={webhook} onChange={(e) => setWebhook(e.target.value)} className="mt-1.5 font-mono text-sm" />
          </div>
          <div>
            <Label className="flex items-center gap-2"><Key className="h-3.5 w-3.5" /> API Key</Label>
            <div className="flex gap-2 mt-1.5">
              <Input readOnly value="ssk_live_••••••••••••••••3a91" className="font-mono text-sm" />
              <Button variant="outline">Rotate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notifications</CardTitle>
          <CardDescription>Where alerts are delivered.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Slack channel</Label>
              <Input defaultValue="#shield-incidents" className="mt-1.5 font-mono text-sm" />
            </div>
            <div>
              <Label>Escalation email</Label>
              <Input defaultValue="security@premier-broadcast.com" className="mt-1.5 font-mono text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Discard</Button>
        <Button onClick={save}>Save Changes</Button>
      </div>
    </motion.div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <Label className="text-sm">{label}</Label>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
