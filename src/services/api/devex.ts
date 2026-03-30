import { faker } from '@faker-js/faker';
import type {
  DeploymentFrequency,
  PipelineDuration,
  TestResults,
  TestSuiteFailure,
  TrendData,
} from '../schemas/types';

// Delay simulation for realistic network requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generatePipelineDurations = (days = 30): PipelineDuration[] => {
  return Array.from({ length: days }, () => ({
    date: faker.date.recent({ days }).toISOString(),
    devDuration: faker.number.int({ min: 5, max: 20 }),
    stagingDuration: faker.number.int({ min: 10, max: 30 }),
    prodDuration: faker.number.int({ min: 15, max: 45 }),
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const generateDeployments = (days = 30): DeploymentFrequency[] => {
  return Array.from({ length: days }, () => ({
    date: faker.date.recent({ days }).toISOString(),
    devDeployments: faker.number.int({ min: 5, max: 50 }),
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const generateTestResults = (days = 30): TestResults[] => {
  return Array.from({ length: days }, () => {
    const total = faker.number.int({ min: 200, max: 500 });
    const failed = faker.number.int({ min: 0, max: 50 });

    return {
      date: faker.date.recent({ days }).toISOString(),
      passed: total - failed,
      failed,
    };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const suites = ['Auth', 'Checkout', 'Profile', 'Search', 'Settings'];

export const generateTestSuiteFailures = (days = 14): TestSuiteFailure[] => {
  return suites.flatMap((suite) =>
    Array.from({ length: days }, () => ({
      suite,
      date: faker.date.recent({ days }).toISOString(),
      failures: faker.number.int({ min: 0, max: 10 }),
    })),
  );
};

export const generateTrendData = (days = 30): TrendData[] => {
  return Array.from({ length: days }, () => ({
    date: faker.date.recent({ days }).toISOString(),
    value: faker.number.int({ min: 50, max: 100 }),
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// --- Mock API Fetchers --- //

export const fetchPipelineDurations = async (): Promise<PipelineDuration[]> => {
  await delay(800);
  return generatePipelineDurations();
};

export const fetchDeployments = async (): Promise<DeploymentFrequency[]> => {
  await delay(600);
  return generateDeployments();
};

export const fetchTestResults = async (): Promise<TestResults[]> => {
  await delay(1000);
  return generateTestResults();
};

export const fetchTestSuiteFailures = async (): Promise<TestSuiteFailure[]> => {
  await delay(500);
  return generateTestSuiteFailures();
};

export const fetchTrendData = async (): Promise<TrendData[]> => {
  await delay(400);
  return generateTrendData();
};
