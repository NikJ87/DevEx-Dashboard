import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/primitives/Card';
import { MultiLineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { StackedAreaChart } from '@/components/charts/StackedAreaChart';
import { HeatmapChart } from '@/components/charts/HeatmapChart';
import { TrendingUp, Rocket, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  getDataStrategy,
  fetchPipelineData,
  fetchDeploymentData,
  fetchTestResultsData,
  fetchTestSuiteFailuresData,
} from '@/services/api/dataSource';
import { useState, useEffect } from 'react';
import type { 
  PipelineDuration, 
  DeploymentFrequency, 
  TestResults, 
  TestSuiteFailure 
} from '@/services/schemas/types';
import { measureRenderTime } from '@/analytics';

export function Dashboard() {
  const strategy = getDataStrategy();
  
  useEffect(() => {
    const done = measureRenderTime('Dashboard');
    done();
  });
  const [pipelineData, setPipelineData] = useState<PipelineDuration[]>([]);
  const [deploymentData, setDeploymentData] = useState<DeploymentFrequency[]>([]);
  const [testData, setTestData] = useState<TestResults[]>([]);
  const [heatmapData, setHeatmapData] = useState<TestSuiteFailure[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [p, d, t, h] = await Promise.all([
          fetchPipelineData(),
          fetchDeploymentData(),
          fetchTestResultsData(),
          fetchTestSuiteFailuresData(),
        ]);
        setPipelineData(p);
        setDeploymentData(d);
        setTestData(t);
        setHeatmapData(h);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    }
    loadData();
  }, []);

  const latestProd = pipelineData.length > 0 ? pipelineData[pipelineData.length - 1].prodDuration : 0;
  const latestDeploys = deploymentData.length > 0 ? deploymentData[deploymentData.length - 1].devDeployments : 0;
  const latestTest = testData.length > 0 ? testData[testData.length - 1] : null;
  const passRate = latestTest ? ((latestTest.passed / (latestTest.passed + latestTest.failed)) * 100).toFixed(1) : '0';
  const failedCount = latestTest ? latestTest.failed : 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Observability Dashboard</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold uppercase tracking-widest">
            {strategy}
          </span>
        </div>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Pipeline health, deployment velocity, test stability, and failure hotspots.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-destructive)]/20 bg-[var(--color-destructive)]/5 text-[var(--color-destructive)] animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm">Connection Failed</span>
            <span className="text-xs opacity-90">{error}</span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--color-muted-fg)] uppercase tracking-wide">Prod Duration</span>
              <div className="p-1.5 rounded-lg bg-[var(--color-chart-3)]/10">
                <TrendingUp className="h-3.5 w-3.5 text-[var(--color-chart-3)]" />
              </div>
            </div>
            <div className="text-2xl font-bold">{latestProd} min</div>
            <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">Latest pipeline reading</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--color-muted-fg)] uppercase tracking-wide">Deployments</span>
              <div className="p-1.5 rounded-lg bg-[var(--color-chart-1)]/10">
                <Rocket className="h-3.5 w-3.5 text-[var(--color-chart-1)]" />
              </div>
            </div>
            <div className="text-2xl font-bold">{latestDeploys}</div>
            <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">Today&apos;s deploy count</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--color-muted-fg)] uppercase tracking-wide">Pass Rate</span>
              <div className="p-1.5 rounded-lg bg-[var(--color-success)]/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--color-success)]">{passRate}%</div>
            <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">E2E test pass rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--color-muted-fg)] uppercase tracking-wide">Failing</span>
              <div className="p-1.5 rounded-lg bg-[var(--color-destructive)]/10">
                <AlertTriangle className="h-3.5 w-3.5 text-[var(--color-destructive)]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--color-destructive)]">{failedCount}</div>
            <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">Tests needing attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Pipeline Duration Trend</CardTitle>
            <CardDescription>Multi-environment pipeline execution times</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] px-4 pt-0">
            <MultiLineChart data={pipelineData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Deployment Frequency</CardTitle>
            <CardDescription>Daily deployment volume</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] px-4 pt-0">
            <BarChart data={deploymentData} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>E2E Test Results</CardTitle>
            <CardDescription>Pass/fail distribution over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] px-4 pt-0">
            <StackedAreaChart data={testData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>E2E Test Suite Heatmap</CardTitle>
            <CardDescription>Per-suite E2E failure frequency</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] px-4 pt-0">
            <HeatmapChart data={heatmapData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
