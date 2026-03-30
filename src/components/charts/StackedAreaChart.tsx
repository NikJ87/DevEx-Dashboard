import { logEvent, measureRenderTime } from '@/analytics';
import type { TestResults } from '@/services/schemas/types';
import * as d3 from 'd3';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface StackedAreaChartProps {
  data: TestResults[];
}

const W = 460;
const H = 280;
const MARGIN = { top: 10, right: 15, bottom: 30, left: 42 };
const BW = W - MARGIN.left - MARGIN.right;
const BH = H - MARGIN.top - MARGIN.bottom;

export const StackedAreaChart: React.FC<StackedAreaChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<
    | ({
        x: number;
      } & TestResults)
    | null
  >(null);

  const [activeSeries, setActiveSeries] = useState<Set<keyof TestResults>>(
    new Set(['passed', 'failed']),
  );

  useEffect(() => {
    const done = measureRenderTime('StackedAreaChart');
    done();
  });

  const toggleSeries = (key: keyof TestResults) => {
    setActiveSeries((prev) => {
      const next = new Set(prev);
      const wasActive = next.has(key);
      if (wasActive) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }

      logEvent('chart_legend_filter', {
        chart: 'StackedAreaChart',
        series: key,
        action: wasActive ? 'hide' : 'show',
      });

      return next;
    });
  };

  const xScale = useMemo(
    () =>
      d3
        .scaleTime()
        .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
        .range([0, BW]),
    [data],
  );

  const yScale = useMemo(() => {
    const max =
      d3.max(data, (d) => {
        let sum = 0;
        if (activeSeries.has('passed')) sum += d.passed;
        if (activeSeries.has('failed')) sum += d.failed;
        return sum;
      }) || 500;
    return d3
      .scaleLinear()
      .domain([0, max * 1.05])
      .range([BH, 0])
      .nice();
  }, [data, activeSeries]);

  const activeKeys = ['passed', 'failed'].filter((k) =>
    activeSeries.has(k as keyof TestResults),
  ) as ('passed' | 'failed')[];

  // Order stacks by the lowest rate first on baseline
  const stack = d3.stack<TestResults>().keys(activeKeys).order(d3.stackOrderAscending);

  // Safe stacking mapping missing data to 0
  const seriesData = data.map((d) => {
    const obj: TestResults = { date: d.date, passed: 0, failed: 0 };
    if (activeSeries.has('passed')) obj.passed = d.passed;
    if (activeSeries.has('failed')) obj.failed = d.failed;
    return obj;
  });

  const layers = activeKeys.length > 0 ? stack(seriesData) : [];

  const areaGen = d3
    .area<d3.SeriesPoint<TestResults>>()
    .x((d) => xScale(new Date(d.data.date)))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(d3.curveMonotoneX);

  const chartColorMap: Record<'passed' | 'failed', string> = {
    passed: 'var(--color-chart-4)',
    failed: 'var(--color-chart-3)',
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const px = svgP.x - MARGIN.left;
    if (px < 0 || px > BW) {
      setHovered(null);
      return;
    }

    const date = xScale.invert(px);
    const bisect = d3.bisector((d: TestResults) => new Date(d.date)).left;
    const idx = bisect(data, date, 1);
    const d0 = data[idx - 1];
    const d1 = data[idx];
    if (!d0 || !d1) return;
    const d =
      date.getTime() - new Date(d0.date).getTime() > new Date(d1.date).getTime() - date.getTime()
        ? d1
        : d0;

    setHovered({
      x: xScale(new Date(d.date)),
      date: new Date(d.date).toLocaleDateString(),
      passed: d.passed,
      failed: d.failed,
    });
  };

  const yTicks = yScale.ticks(5);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Legend above chart */}
      <div className="flex items-center gap-4 mb-2 px-1">
        <button
          onClick={() => toggleSeries('passed')}
          className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80 focus:outline-none"
          style={{ opacity: activeSeries.has('passed') ? 1 : 0.4 }}
        >
          <span className="w-3 h-2.5 rounded-sm" style={{ background: 'var(--color-chart-4)' }} />
          <span className="text-[10px] text-[var(--color-muted-fg)] font-medium">Passed</span>
        </button>
        <button
          onClick={() => toggleSeries('failed')}
          className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80 focus:outline-none"
          style={{ opacity: activeSeries.has('failed') ? 1 : 0.4 }}
        >
          <span className="w-3 h-2.5 rounded-sm" style={{ background: 'var(--color-chart-3)' }} />
          <span className="text-[10px] text-[var(--color-muted-fg)] font-medium">Failed</span>
        </button>
      </div>

      <div className="relative flex-1 min-h-0">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id="passedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-4)" stopOpacity={0.8} />
              <stop offset="100%" stopColor="var(--color-chart-4)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.8} />
              <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {yTicks.map((t) => (
              <line
                key={t}
                x1={0}
                x2={BW}
                y1={yScale(t)}
                y2={yScale(t)}
                stroke="var(--color-border)"
                strokeOpacity={0.4}
                strokeDasharray="3 3"
              />
            ))}

            {layers.map((layer) => {
              const color = chartColorMap[layer.key as 'passed' | 'failed'];
              const gradientId =
                layer.key === 'passed' ? 'url(#passedGradient)' : 'url(#failedGradient)';
              return (
                <path
                  key={layer.key}
                  d={areaGen(layer) || ''}
                  fill={gradientId}
                  stroke={color}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              );
            })}

            <line y1={0} y2={BH} stroke="var(--color-border)" strokeOpacity={0.6} />
            <line x1={0} x2={BW} y1={BH} y2={BH} stroke="var(--color-border)" strokeOpacity={0.6} />

            {yTicks.map((t) => (
              <text
                key={t}
                x={-8}
                y={yScale(t)}
                dy="0.32em"
                textAnchor="end"
                fontSize="9"
                fill="var(--color-muted-fg)"
              >
                {t}
              </text>
            ))}

            {hovered && (
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1={0}
                y2={BH}
                stroke="var(--color-fg)"
                strokeDasharray="3 3"
                strokeOpacity={0.4}
              />
            )}
          </g>
        </svg>

        {hovered && (
          <div
            className="absolute z-10 px-3 py-2 bg-[var(--color-card)] text-[var(--color-card-fg)] border border-[var(--color-card-border)] shadow-lg rounded-lg text-xs pointer-events-none"
            style={{ left: '50%', top: 4, transform: 'translateX(-50%)' }}
          >
            <div className="font-semibold mb-1">{hovered.date}</div>
            <div className="flex gap-3">
              {activeSeries.has('passed') && (
                <span style={{ color: 'var(--color-chart-4)' }}>✓ {hovered.passed}</span>
              )}
              {activeSeries.has('failed') && (
                <span style={{ color: 'var(--color-chart-3)' }}>✗ {hovered.failed}</span>
              )}
              <span className="text-[var(--color-muted-fg)]">
                Σ{' '}
                {(activeSeries.has('passed') ? hovered.passed : 0) +
                  (activeSeries.has('failed') ? hovered.failed : 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
