export const logEvent = (eventName: string, metadata?: Record<string, unknown>) => {
  console.log(`[Observability:Event] ${eventName}`, metadata || {});
};

export const measureRenderTime = (componentName: string) => {
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(
      `[Observability:Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`,
    );
  };
};

export const logError = (error: Error, metadata?: Record<string, unknown>) => {
  console.error(`[Observability:Error] ${error.message}`, { ...metadata, stack: error.stack });
};
