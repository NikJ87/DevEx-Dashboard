import { http, HttpResponse, passthrough } from 'msw';
import { whiteLabelThemes } from '../../themes';
import {
  generateDeployments as fakerDeploys,
  generateTestSuiteFailures as fakerFailures,
  generatePipelineDurations as fakerPipeline,
  generateTestResults as fakerTests,
} from '../api/devex';
import {
  generateDeployments as genDeploys,
  generateTestSuiteFailures as genFailures,
  generatePipelineDurations as genPipeline,
  generateTestResults as genTests,
} from '../api/generators';

const dataApiBase = import.meta.env.VITE_API_BASE_URL || 'https://api.devex-analytics.com';
const themeApiBase = import.meta.env.VITE_THEME_API_URL || 'https://api.devex-analytics/theme/v1/';

const dataStrategy = import.meta.env.VITE_DATA_STRATEGY || 'mock';
const dataMockStrategy = import.meta.env.VITE_DATA_MOCK_STRATEGY || 'msw';

export const handlers = [
  // Data Handlers
  http.get(`${dataApiBase}/pipeline-durations`, () => {
    if (dataStrategy === 'api') return passthrough();

    const useFaker = dataStrategy === 'mock' && dataMockStrategy === 'fakerjs';
    const data = useFaker ? fakerPipeline(30) : genPipeline(30);
    return HttpResponse.json(data);
  }),

  http.get(`${dataApiBase}/deployments`, () => {
    if (dataStrategy === 'api') return passthrough();

    const useFaker = dataStrategy === 'mock' && dataMockStrategy === 'fakerjs';
    // Updated to 15 days
    const data = useFaker ? fakerDeploys(15) : genDeploys(15);
    return HttpResponse.json(data);
  }),

  http.get(`${dataApiBase}/test-results`, () => {
    if (dataStrategy === 'api') return passthrough();

    const useFaker = dataStrategy === 'mock' && dataMockStrategy === 'fakerjs';
    const data = useFaker ? fakerTests(30) : genTests(30);
    return HttpResponse.json(data);
  }),

  http.get(`${dataApiBase}/test-suite-failures`, () => {
    if (dataStrategy === 'api') return passthrough();

    const useFaker = dataStrategy === 'mock' && dataMockStrategy === 'fakerjs';
    // Updated to 15 days
    const data = useFaker ? fakerFailures(10) : genFailures(10);
    return HttpResponse.json(data);
  }),

  // Theme Handlers
  http.get(`${themeApiBase}/themes/:whiteLabelId`, ({ params }) => {
    const { whiteLabelId } = params;
    const theme = whiteLabelThemes[whiteLabelId as string] || whiteLabelThemes.hm;
    return HttpResponse.json(theme);
  }),
];
