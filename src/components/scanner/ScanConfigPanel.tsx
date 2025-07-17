import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Play, Settings2 } from "lucide-react";
import { ScanConfig } from "../VulnerabilityScanner";

interface ScanConfigPanelProps {
  onStartScan: (config: ScanConfig) => void;
  isScanning: boolean;
}

export function ScanConfigPanel({ onStartScan, isScanning }: ScanConfigPanelProps) {
  const [config, setConfig] = useState<ScanConfig>({
    target: "",
    scanType: "quick",
    portRange: "1-1000",
    serviceDetection: true,
    osDetection: false,
    scriptScan: false,
    timing: "normal",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.target.trim()) {
      onStartScan(config);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings2 className="h-5 w-5" />
          <span>Scan Configuration</span>
        </CardTitle>
        <CardDescription>
          Configure your vulnerability scan parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="target">Target (IP/Hostname/CIDR)</Label>
            <Input
              id="target"
              placeholder="192.168.1.1 or example.com or 192.168.1.0/24"
              value={config.target}
              onChange={(e) => setConfig(prev => ({ ...prev, target: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scanType">Scan Type</Label>
              <Select value={config.scanType} onValueChange={(value) => setConfig(prev => ({ ...prev, scanType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">Quick Scan (-T4 -F)</SelectItem>
                  <SelectItem value="intense">Intense Scan (-T4 -A -v)</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive (-T4 -A -v -Pn)</SelectItem>
                  <SelectItem value="stealth">Stealth SYN (-sS)</SelectItem>
                  <SelectItem value="udp">UDP Scan (-sU)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portRange">Port Range</Label>
              <Select value={config.portRange} onValueChange={(value) => setConfig(prev => ({ ...prev, portRange: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-1000">Fast (1-1000)</SelectItem>
                  <SelectItem value="1-65535">All Ports (1-65535)</SelectItem>
                  <SelectItem value="top-100">Top 100 Ports</SelectItem>
                  <SelectItem value="top-1000">Top 1000 Ports</SelectItem>
                  <SelectItem value="22,80,443,3389">Common (22,80,443,3389)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timing">Timing Template</Label>
            <Select value={config.timing} onValueChange={(value) => setConfig(prev => ({ ...prev, timing: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paranoid">Paranoid (-T0)</SelectItem>
                <SelectItem value="sneaky">Sneaky (-T1)</SelectItem>
                <SelectItem value="polite">Polite (-T2)</SelectItem>
                <SelectItem value="normal">Normal (-T3)</SelectItem>
                <SelectItem value="aggressive">Aggressive (-T4)</SelectItem>
                <SelectItem value="insane">Insane (-T5)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Advanced Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="serviceDetection"
                  checked={config.serviceDetection}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, serviceDetection: !!checked }))}
                />
                <Label htmlFor="serviceDetection" className="text-sm">Service Detection (-sV)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="osDetection"
                  checked={config.osDetection}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, osDetection: !!checked }))}
                />
                <Label htmlFor="osDetection" className="text-sm">OS Detection (-O)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scriptScan"
                  checked={config.scriptScan}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, scriptScan: !!checked }))}
                />
                <Label htmlFor="scriptScan" className="text-sm">Script Scan (-sC)</Label>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isScanning || !config.target.trim()} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            {isScanning ? "Scanning..." : "Start Scan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}