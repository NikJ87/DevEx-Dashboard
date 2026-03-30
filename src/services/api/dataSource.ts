/**
 * Unified Data Source Service
 *
 * Orchestrates data fetching based on:
 * - VITE_DATA_STRATEGY: "api" | "mock"
 * - VITE_DATA_MOCK_STRATEGY: "static" | "fakerjs" | "msw"
 */

import type {
  DeploymentFrequency,
  PipelineDuration,
  TestResults,
  TestSuiteFailure,
} from '../schemas/types';
import { logEvent } from '@/analytics';

import {
  MOCK_DEPLOYMENTS,
  MOCK_PIPELINE_DURATIONS,
  MOCK_TEST_RESULTS,
  MOCK_TEST_SUITE_FAILURES,
} from './mockData';

import {
  generateDeployments as genDeploys,
  generateTestSuiteFailures as genFailures,
  generatePipelineDurations as genPipeline,
  generateTestResults as genTests,
} from './generators';

import {
  generateDeployments as fakerDeploys,
  generateTestSuiteFailures as fakerFailures,
  generatePipelineDurations as fakerPipeline,
  generateTestResults as fakerTests,
} from './devex';

export type DataStrategy = 'api' | 'mock';
export type DataMockStrategy = 'static' | 'fakerjs' | 'msw';

export function getDataStrategy(): DataStrategy {
  const env = (import.meta.env.VITE_DATA_STRATEGY as string) || 'mock';
  return env === 'api' || env === 'mock' ? env : 'mock';
}

export function getDataMockStrategy(): DataMockStrategy {
  const env = (import.meta.env.VITE_DATA_MOCK_STRATEGY as string) || 'msw';
  return env === 'static' || env === 'fakerjs' || env === 'msw' ? env : 'msw';
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.devex-analytics.com';

/**
 * Core fetch wrapper with hierarchical error and mock handling.
 */
async function fetchWithFallback<T>(url: string, staticData: T, generatorFn: () => T): Promise<T> {
  const strategy = getDataStrategy();
  const mockStrategy = getDataMockStrategy();

  // 1. Instant Static Mock (Zero Network)
  if (strategy === 'mock' && mockStrategy === 'static') return staticData;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API fetch failed (Status: ${res.status})`);
    return await res.json();
  } catch (error) {
    // 2. API Mode Connection Failure Notice
    if (strategy === 'api') {
      throw new Error(
        'Real-world API connection failed. Please switch VITE_DATA_STRATEGY to "mock" for demonstration purposes.',
      );
    }

    // 3. Mock Interception / Fallback
    console.log(
      `[DataSource] Network fetch bypassed/failed for ${url}, fallback to generators. Error:`,
      error,
    );
    return generatorFn();
  }
}

// Public Async Fetchers
export const fetchPipelineData = async (): Promise<PipelineDuration[]> => {
  const mockStrategy = getDataMockStrategy();
  logEvent('data_load_start', { dataset: 'pipeline_durations' });
  const data = await fetchWithFallback(
    `${API_BASE}/pipeline-durations`,
    MOCK_PIPELINE_DURATIONS,
    mockStrategy === 'fakerjs' ? fakerPipeline : genPipeline,
  );
  logEvent('data_load_complete', { dataset: 'pipeline_durations', count: data.length });
  return data;
};

export const fetchDeploymentData = async (): Promise<DeploymentFrequency[]> => {
  const mockStrategy = getDataMockStrategy();
  logEvent('data_load_start', { dataset: 'deployments' });
  const data = await fetchWithFallback(
    `${API_BASE}/deployments`,
    MOCK_DEPLOYMENTS,
    mockStrategy === 'fakerjs' ? () => fakerDeploys(15) : () => genDeploys(15),
  );
  logEvent('data_load_complete', { dataset: 'deployments', count: data.length });
  return data;
};

export const fetchTestResultsData = async (): Promise<TestResults[]> => {
  const mockStrategy = getDataMockStrategy();
  logEvent('data_load_start', { dataset: 'test_results' });
  const data = await fetchWithFallback(
    `${API_BASE}/test-results`,
    MOCK_TEST_RESULTS,
    mockStrategy === 'fakerjs' ? fakerTests : genTests,
  );
  logEvent('data_load_complete', { dataset: 'test_results', count: data.length });
  return data;
};

export const fetchTestSuiteFailuresData = async (): Promise<TestSuiteFailure[]> => {
  const mockStrategy = getDataMockStrategy();
  logEvent('data_load_start', { dataset: 'test_suite_failures' });
  const data = await fetchWithFallback(
    `${API_BASE}/test-suite-failures`,
    MOCK_TEST_SUITE_FAILURES,
    mockStrategy === 'fakerjs' ? () => fakerFailures(15) : () => genFailures(15),
  );
  logEvent('data_load_complete', { dataset: 'test_suite_failures', count: data.length });
  return data;
};
