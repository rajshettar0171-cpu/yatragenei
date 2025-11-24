import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Info, Calendar, CloudRain } from "lucide-react";
import type { Alert } from "@shared/schema";

export default function AlertsPanel() {
  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-destructive/10 border-destructive/30 text-destructive";
      case "medium":
        return "bg-accent text-accent-foreground border-accent-foreground/30";
      case "low":
        return "bg-chart-2/10 border-chart-2/30 text-chart-2";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "road_closure":
        return AlertTriangle;
      case "weather":
        return CloudRain;
      case "event":
        return Calendar;
      default:
        return Info;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Real-time Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No active alerts at the moment
            </div>
          ) : (
            alerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              const severityClass = getSeverityColor(alert.severity);

              return (
                <Card
                  key={alert.id}
                  className={`border-l-4 ${severityClass}`}
                  data-testid={`alert-${alert.id}`}
                >
                  <CardContent className="p-4 space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <Badge variant="outline" className="text-xs">
                          {alert.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {alert.severity}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {alert.description}
                      </p>
                    </div>

                    {/* Affected Areas */}
                    {alert.affectedAreas && alert.affectedAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {alert.affectedAreas.map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="text-xs text-muted-foreground pt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
