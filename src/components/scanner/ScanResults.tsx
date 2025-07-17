import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Download, AlertTriangle, Shield, Server, Clock } from "lucide-react";
import { ScanResult } from "../VulnerabilityScanner";

interface ScanResultsProps {
  scan: ScanResult | null;
  isScanning: boolean;
}

export function ScanResults({ scan, isScanning }: ScanResultsProps) {
  if (!scan && !isScanning) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No scan results</h3>
          <p className="text-muted-foreground">Start a scan to see results here</p>
        </CardContent>
      </Card>
    );
  }

  if (isScanning || scan?.status === "running") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 animate-spin" />
            <span>Scanning {scan?.target}...</span>
          </CardTitle>
          <CardDescription>Please wait while the scan completes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={65} className="w-full" />
            <div className="text-sm text-muted-foreground">
              <p>Discovering hosts...</p>
              <p>Port scanning in progress...</p>
              <p>Service detection running...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scan) return null;

  const vulnerabilityCount = scan.ports.reduce((count, port) => 
    count + (port.vulnerabilities?.length || 0), 0);
  
  const criticalVulns = scan.ports.flatMap(p => p.vulnerabilities || [])
    .filter(v => v.severity === "critical").length;
  
  const highVulns = scan.ports.flatMap(p => p.vulnerabilities || [])
    .filter(v => v.severity === "high").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>Scan Results: {scan.target}</span>
              </CardTitle>
              <CardDescription>
                Scanned on {scan.timestamp.toLocaleString()}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{scan.ports.length}</div>
              <div className="text-sm text-muted-foreground">Open Ports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{vulnerabilityCount}</div>
              <div className="text-sm text-muted-foreground">Vulnerabilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{criticalVulns}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{highVulns}</div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {scan.hostInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Host Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Operating System</Label>
                <p className="text-sm text-muted-foreground">{scan.hostInfo.os}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Hostname</Label>
                <p className="text-sm text-muted-foreground">{scan.hostInfo.hostname}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">MAC Address</Label>
                <p className="text-sm text-muted-foreground">{scan.hostInfo.macAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Open Ports & Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scan.ports.map((port, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{port.port}/{port.protocol}</Badge>
                    <Badge variant={port.state === "open" ? "default" : "secondary"}>
                      {port.state}
                    </Badge>
                    <span className="font-medium">{port.service}</span>
                    {port.version && <span className="text-sm text-muted-foreground">{port.version}</span>}
                  </div>
                  {port.vulnerabilities && port.vulnerabilities.length > 0 && (
                    <Badge variant="destructive" className="flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{port.vulnerabilities.length} vuln{port.vulnerabilities.length > 1 ? 's' : ''}</span>
                    </Badge>
                  )}
                </div>
                
                {port.vulnerabilities && port.vulnerabilities.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Vulnerabilities:</h4>
                      {port.vulnerabilities.map((vuln, vIndex) => (
                        <div key={vIndex} className="flex items-start space-x-3 p-2 bg-muted/50 rounded">
                          <Badge 
                            variant={vuln.severity === "critical" ? "destructive" : 
                                   vuln.severity === "high" ? "destructive" : 
                                   vuln.severity === "medium" ? "default" : "secondary"}
                            className="mt-0.5"
                          >
                            {vuln.severity}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{vuln.cve}</p>
                            <p className="text-xs text-muted-foreground">{vuln.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={className}>{children}</label>;
}