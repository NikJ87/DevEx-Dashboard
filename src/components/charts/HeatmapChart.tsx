import React, { useMemo, useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { TestSuiteFailure } from '@/services/schemas/types';
import { measureRenderTime } from '@/analytics';

export interface HeatmapChartProps {
  data: TestSuiteFailure[];
}

const W = 500;
const H = 300;
const MARGIN = { top: 15, right: 15, bottom: 30, left: 70 };
const BW = W - MARGIN.left - MARGIN.right;
const BH = H - MARGIN.top - MARGIN.bottom;

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ data }) => {
  const [hovered, setHovered] = useState<{
    suite: string;
    date: string;
    failures: number;
    cx: number;
    cy: number;
  } | null>(null);

  useEffect(() => {
    const done = measureRenderTime('HeatmapChart');
    done();
  });

  const dates = useMemo(
    () =>
      Array.from(new Set(data.map((d) => new Date(d.date).toLocaleDateString()))).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
      ),
    [data],
  );

  const suites = useMemo(
    () => Array.from(new Set(data.map((d) => d.suite))).sort(),
    [data],
  );

  const xScale = useMemo(
    () => d3.scaleBand().domain(dates).range([0, BW]).padding(0.08),
    [dates],
  );

  const yScale = useMemo(
    () => d3.scaleBand().domain(suites).range([0, BH]).padding(0.08),
    [suites],
  );

  const colorScale = useMemo(() => {
    const max = d3.max(data, (d) => d.failures) || 10;
    return d3.scaleSequential(d3.interpolateYlOrRd).domain([0, max]);
  }, [data]);

  return (
    <div className="w-full h-full relative">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full" onMouseLeave={() => setHovered(null)}>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Cells */}
          {data.map((d, i) => {
            const xVal = new Date(d.date).toLocaleDateString();
            const x = xScale(xVal);
            const y = yScale(d.suite);
            if (x === undefined || y === undefined) return null;
            const w = xScale.bandwidth();
            const h = yScale.bandwidth();
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={3}
                fill={d.failures === 0 ? '#f1f5f9' : colorScale(d.failures)}
                stroke={hovered?.suite === d.suite && hovered.date === xVal ? 'var(--color-fg)' : 'transparent'}
                strokeWidth={2}
                onMouseEnter={() =>
                  setHovered({
                    suite: d.suite,
                    date: xVal,
                    failures: d.failures,
                    cx: x + w / 2,
                    cy: y + h / 2,
                  })
                }
              />
            );
          })}

          {/* Cell value text */}
          {data.map((d, i) => {
            const xVal = new Date(d.date).toLocaleDateString();
            const x = xScale(xVal);
            const y = yScale(d.suite);
            if (x === undefined || y === undefined || d.failures === 0) return null;
            return (
              <text
                key={`t-${i}`}
                x={x + xScale.bandwidth() / 2}
                y={y + yScale.bandwidth() / 2 + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill={d.failures > 5 ? 'white' : '#333'}
                pointerEvents="none"
              >
                {d.failures}
              </text>
            );
          })}

          {/* Y labels (suite names) */}
          {suites.map((s) => {
            const y = yScale(s);
            if (y === undefined) return null;
            return (
              <text key={s} x={-8} y={y + yScale.bandwidth() / 2 + 4} textAnchor="end" fontSize="11" fill="var(--color-muted-fg)">
                {s}
              </text>
            );
          })}

          {/* X labels (dates) */}
          {dates.map((date, i) => {
            const x = xScale(date);
            if (x === undefined) return null;
            return (
              <text key={i} x={x + xScale.bandwidth() / 2} y={BH + 16} fontSize="9" textAnchor="middle" fill="var(--color-muted-fg)">
                {date.slice(0, 5)}
              </text>
            );
          })}
        </g>
      </svg>

      {hovered && (
        <div
          className="absolute z-10 px-3 py-2 bg-[var(--color-card)] text-[var(--color-card-fg)] border border-[var(--color-card-border)] shadow-lg rounded-lg text-xs pointer-events-none whitespace-nowrap"
          style={{ left: '50%', top: 8, transform: 'translateX(-50%)' }}
        >
          <div className="font-semibold">{hovered.suite}</div>
          <div>{hovered.date} — <span style={{ color: '#ef4444' }}>{hovered.failures} failures</span></div>
        </div>
      )}
    </div>
  );
};
