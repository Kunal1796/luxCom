type CheckoutStepperProps = {
  currentStep: number;
};

const steps = ["Shipping", "Payment", "Summary"];

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="flex items-center justify-between px-margin-mobile py-stack-md lg:px-margin-desktop">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isComplete = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={step} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {index > 0 && (
                <div
                  className={`h-0.5 flex-1 ${
                    isComplete || isActive ? "bg-secondary" : "bg-outline-variant"
                  }`}
                />
              )}
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-label-md font-bold ${
                  isComplete
                    ? "bg-secondary text-on-secondary"
                    : isActive
                      ? "bg-primary-container text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {isComplete ? "✓" : stepNum}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    isComplete ? "bg-secondary" : "bg-outline-variant"
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-1 text-label-sm ${
                isActive ? "font-semibold text-primary-container" : "text-on-surface-variant"
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
