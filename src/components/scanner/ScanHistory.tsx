import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Eye, Trash2, AlertTriangle } from "lucide-react";
import { ScanResult } from "../VulnerabilityScanner";

interface ScanHistoryProps {
  scans: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
}

export function ScanHistory({ scans, onSelectScan }: ScanHistoryProps) {
  if (scans.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No scan history</h3>
          <p className="text-muted-foreground">Your completed scans will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Scan History</span>
        </CardTitle>
        <CardDescription>View and manage your previous scans</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scans.map((scan) => {
            const vulnerabilityCount = scan.ports.reduce((count, port) => 
              count + (port.vulnerabilities?.length || 0), 0);
            
            const criticalVulns = scan.ports.flatMap(p => p.vulnerabilities || [])
              .filter(v => v.severity === "critical").length;

            return (
              <div key={scan.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-medium">{scan.target}</h3>
                      <Badge variant={scan.status === "completed" ? "default" : 
                                   scan.status === "failed" ? "destructive" : "secondary"}>
                        {scan.status}
                      </Badge>
                      {vulnerabilityCount > 0 && (
                        <Badge variant="destructive" className="flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{vulnerabilityCount} vuln{vulnerabilityCount > 1 ? 's' : ''}</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{scan.timestamp.toLocaleString()}</span>
                      <span>{scan.ports.length} open ports</span>
                      {criticalVulns > 0 && (
                        <span className="text-destructive font-medium">
                          {criticalVulns} critical
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onSelectScan(scan)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}