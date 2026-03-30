import React, { useMemo, useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { DeploymentFrequency } from '@/services/schemas/types';
import { measureRenderTime } from '@/analytics';

export interface BarChartProps {
  data: DeploymentFrequency[];
}

const W = 460;
const H = 280;
const MARGIN = { top: 10, right: 15, bottom: 35, left: 38 };
const BW = W - MARGIN.left - MARGIN.right;
const BH = H - MARGIN.top - MARGIN.bottom;

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const done = measureRenderTime('BarChart');
    done();
  });
  const labels = data.map((d) => new Date(d.date).toLocaleDateString());

  const xScale = useMemo(
    () => d3.scaleBand().domain(labels).range([0, BW]).padding(0.25),
    [labels],
  );

  const yScale = useMemo(() => {
    const max = d3.max(data, (d) => d.devDeployments) || 50;
    return d3.scaleLinear().domain([0, max * 1.1]).range([BH, 0]).nice();
  }, [data]);

  const yTicks = yScale.ticks(5);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 min-h-0">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {yTicks.map((t) => (
              <line key={t} x1={0} x2={BW} y1={yScale(t)} y2={yScale(t)} stroke="var(--color-border)" strokeOpacity={0.4} strokeDasharray="3 3" />
            ))}
            <line y1={0} y2={BH} stroke="var(--color-border)" strokeOpacity={0.6} />
            <line x1={0} x2={BW} y1={BH} y2={BH} stroke="var(--color-border)" strokeOpacity={0.6} />

            {yTicks.map((t) => (
              <text key={t} x={-8} y={yScale(t)} dy="0.32em" textAnchor="end" fontSize="9" fill="var(--color-muted-fg)">{t}</text>
            ))}

            {data.map((d, i) => {
              const x = xScale(labels[i]);
              const y = yScale(d.devDeployments);
              const w = xScale.bandwidth();
              const h = BH - y;
              if (x === undefined) return null;
              return (
                <rect
                  key={i} x={x} y={y} width={w} height={h}
                  fill={hoveredIdx === i ? 'var(--color-accent)' : 'url(#barGradient)'}
                  rx={3}
                  className="transition-all duration-150"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}

            {labels.map((label, i) => {
              if (i % Math.max(1, Math.floor(labels.length / 6)) !== 0) return null;
              const x = xScale(label);
              if (x === undefined) return null;
              return (
                <text key={i} x={x + xScale.bandwidth() / 2} y={BH + 14} fontSize="8" textAnchor="middle" fill="var(--color-muted-fg)">
                  {label.slice(0, 5)}
                </text>
              );
            })}
          </g>
        </svg>

        {hoveredIdx !== null && (
          <div
            className="absolute z-10 px-3 py-2 bg-[var(--color-card)] text-[var(--color-card-fg)] border border-[var(--color-card-border)] shadow-lg rounded-lg text-xs pointer-events-none"
            style={{ left: '50%', top: 4, transform: 'translateX(-50%)' }}
          >
            <div className="font-semibold">{labels[hoveredIdx]}</div>
            <div style={{ color: 'var(--color-chart-1)' }}>Deploys: {data[hoveredIdx].devDeployments}</div>
          </div>
        )}
      </div>
    </div>
  );
};
