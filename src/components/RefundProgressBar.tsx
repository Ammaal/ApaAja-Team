import { CheckCircle, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefundProgressBarProps {
  currentStatus: "requested" | "verified" | "processing_bank" | "sent" | "completed" | "rejected";
}

const RefundProgressBar = ({ currentStatus }: RefundProgressBarProps) => {
  const steps = [
    { key: "requested", label: "Requested" },
    { key: "verified", label: "Verified" },
    { key: "processing_bank", label: "Bank Processing" },
    { key: "sent", label: "Sent" },
    { key: "completed", label: "Completed" },
  ];

    const statusIndex = steps.findIndex((step) => step.key === currentStatus);
  const isRejected = currentStatus === "rejected";

  const progress = statusIndex / (steps.length - 1);
  const progressPercentage = isRejected ? 100 : progress * 100;

  return (
    <div className="py-8">
      <div className="relative">
        <div
          className="absolute bg-muted h-1 top-1/2 -translate-y-1/2 left-0 w-full"
          style={{ top: "18px" }}
        ></div>
        <div
          className={cn(
            "absolute h-1 top-1/2 -translate-y-1/2 left-0",
            isRejected ? "bg-destructive" : "bg-success"
          )}
          style={{ width: `${progressPercentage}%`, top: "18px" }}
        ></div>

        <div className="flex justify-between items-start">
          {steps.map((step, index) => {
            const isCompleted = index < statusIndex;
            const isCurrent = index === statusIndex;
            const isActive = isCompleted || isCurrent;

            return (
              <div
                key={step.key}
                className="relative flex flex-col items-center text-center"
                style={{ width: "80px" }}
              >
                <div
                  className={cn(
                    "rounded-full p-2 transition-all z-10",
                    "bg-background",
                    isActive && !isRejected
                      ? "bg-success text-success-foreground"
                      : isRejected && isCurrent
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Clock className="h-5 w-5 animate-pulse" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2",
                    isActive && !isRejected
                      ? "text-success font-semibold"
                      : isRejected && isCurrent
                      ? "text-destructive font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {isRejected && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive font-medium">
            Refund request was rejected. Please contact customer support for details.
          </p>
        </div>
      )}
    </div>
  );
};

export default RefundProgressBar;
