export type PipelineDuration = {
  date: string;
  devDuration: number;
  stagingDuration: number;
  prodDuration: number;
};

export type DeploymentFrequency = {
  date: string;
  devDeployments: number;
};

export type TestResults = {
  date: string;
  passed: number;
  failed: number;
};

export type TestSuiteFailure = {
  suite: string;
  date: string;
  failures: number;
};

export type TrendData = {
  date: string;
  value: number;
};
