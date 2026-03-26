import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  "Select Your Item",
  "Complete Your Payment",
  "Receive Your Order",
];

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-0 py-6 px-4">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "px-4 py-2 rounded-full border-2 text-sm font-medium whitespace-nowrap transition-all",
              index <= currentStep
                ? "border-foreground bg-background text-foreground font-semibold"
                : "border-border bg-background text-muted-foreground"
            )}
          >
            {step}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-8 h-0.5",
                index < currentStep ? "bg-foreground" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
