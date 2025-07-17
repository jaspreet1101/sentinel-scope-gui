import { Shield, Activity } from "lucide-react";

export function ScannerHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Vulnerability Scanner</h1>
      </div>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Automated network vulnerability assessment using Nmap. Scan targets for open ports, 
        services, and potential security vulnerabilities.
      </p>
      <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Activity className="h-4 w-4" />
          <span>Real-time scanning</span>
        </div>
        <div className="flex items-center space-x-1">
          <Shield className="h-4 w-4" />
          <span>CVE database integration</span>
        </div>
      </div>
    </div>
  );
}