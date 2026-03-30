import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { PipelineDuration } from '@/services/schemas/types';
import { logEvent, measureRenderTime } from '@/analytics';

export interface MultiLineChartProps {
  data: PipelineDuration[];
}

const W = 560;
const H = 280;
const MARGIN = { top: 10, right: 15, bottom: 30, left: 42 };
const BW = W - MARGIN.left - MARGIN.right;
const BH = H - MARGIN.top - MARGIN.bottom;

export const MultiLineChart: React.FC<MultiLineChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<{
    x: number;
    date: string;
    dev: number;
    staging: number;
    prod: number;
  } | null>(null);
  
  const [activeSeries, setActiveSeries] = useState<Set<keyof PipelineDuration>>(
    new Set(['devDuration', 'stagingDuration', 'prodDuration'])
  );

  useEffect(() => {
    const done = measureRenderTime('MultiLineChart');
    done();
  });

  const toggleSeries = (key: keyof PipelineDuration) => {
    setActiveSeries(prev => {
      const next = new Set(prev);
      const wasActive = next.has(key);
      if (wasActive) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      
      logEvent('chart_legend_filter', { 
        chart: 'MultiLineChart', 
        series: key, 
        action: wasActive ? 'hide' : 'show' 
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
      d3.max(data, (d) => Math.max(d.devDuration, d.stagingDuration, d.prodDuration)) || 50;
    return d3.scaleLinear().domain([0, max * 1.15]).range([BH, 0]).nice();
  }, [data]);

  const makeLine = (key: keyof PipelineDuration) =>
    d3
      .line<PipelineDuration>()
      .x((d) => xScale(new Date(d.date)))
      .y((d) => yScale(d[key] as number))
      .curve(d3.curveMonotoneX);

  const makeArea = (key: keyof PipelineDuration) =>
    d3
      .area<PipelineDuration>()
      .x((d) => xScale(new Date(d.date)))
      .y0(BH)
      .y1((d) => yScale(d[key] as number))
      .curve(d3.curveMonotoneX);

  const handleMouseMove = (e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const px = svgP.x - MARGIN.left;
    if (px < 0 || px > BW) { setHovered(null); return; }

    const date = xScale.invert(px);
    const bisect = d3.bisector((d: PipelineDuration) => new Date(d.date)).left;
    const idx = bisect(data, date, 1);
    const d0 = data[idx - 1];
    const d1 = data[idx];
    if (!d0 || !d1) return;
    const d =
      date.getTime() - new Date(d0.date).getTime() >
      new Date(d1.date).getTime() - date.getTime()
        ? d1 : d0;

    setHovered({
      x: xScale(new Date(d.date)),
      date: new Date(d.date).toLocaleDateString(),
      dev: d.devDuration,
      staging: d.stagingDuration,
      prod: d.prodDuration,
    });
  };

  const yTicks = yScale.ticks(5);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Legend — placed ABOVE the chart */}
      <div className="flex items-center gap-4 mb-2 px-1">
        <button 
          onClick={() => toggleSeries('devDuration')}
          className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80 focus:outline-none"
          style={{ opacity: activeSeries.has('devDuration') ? 1 : 0.4 }}
        >
          <span className="w-3 h-[3px] rounded-full" style={{ background: 'var(--color-chart-1)' }} />
          <span className="text-[10px] text-[var(--color-muted-fg)] font-medium">Dev</span>
        </button>
        <button 
          onClick={() => toggleSeries('stagingDuration')}
          className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80 focus:outline-none"
          style={{ opacity: activeSeries.has('stagingDuration') ? 1 : 0.4 }}
        >
          <span className="w-3 h-[3px] rounded-full" style={{ background: 'var(--color-chart-2)' }} />
          <span className="text-[10px] text-[var(--color-muted-fg)] font-medium">Staging</span>
        </button>
        <button 
          onClick={() => toggleSeries('prodDuration')}
          className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80 focus:outline-none"
          style={{ opacity: activeSeries.has('prodDuration') ? 1 : 0.4 }}
        >
          <span className="w-3 h-[3px] rounded-full" style={{ background: 'var(--color-chart-3)' }} />
          <span className="text-[10px] text-[var(--color-muted-fg)] font-medium">Prod</span>
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
            <linearGradient id="devGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="stgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="prdGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {/* Grid lines */}
            {yTicks.map((t) => (
              <line key={t} x1={0} x2={BW} y1={yScale(t)} y2={yScale(t)} stroke="var(--color-border)" strokeOpacity={0.5} strokeDasharray="3 3" />
            ))}

            {/* Area Fills */}
            {activeSeries.has('devDuration') && <path d={makeArea('devDuration')(data) || ''} fill="url(#devGrad)" className="transition-all duration-300" />}
            {activeSeries.has('stagingDuration') && <path d={makeArea('stagingDuration')(data) || ''} fill="url(#stgGrad)" className="transition-all duration-300" />}
            {activeSeries.has('prodDuration') && <path d={makeArea('prodDuration')(data) || ''} fill="url(#prdGrad)" className="transition-all duration-300" />}

            {/* Axes */}
            <line y1={0} y2={BH} stroke="var(--color-border)" strokeOpacity={0.6} />
            <line x1={0} x2={BW} y1={BH} y2={BH} stroke="var(--color-border)" strokeOpacity={0.6} />

            {/* Y labels */}
            {yTicks.map((t) => (
              <text key={t} x={-8} y={yScale(t)} dy="0.32em" textAnchor="end" fontSize="9" fill="var(--color-muted-fg)">{t}m</text>
            ))}

            {/* Lines */}
            {activeSeries.has('devDuration') && <path d={makeLine('devDuration')(data) || ''} fill="none" stroke="var(--color-chart-1)" strokeWidth={2} strokeLinecap="round" className="transition-all duration-300" />}
            {activeSeries.has('stagingDuration') && <path d={makeLine('stagingDuration')(data) || ''} fill="none" stroke="var(--color-chart-2)" strokeWidth={2} strokeLinecap="round" className="transition-all duration-300" />}
            {activeSeries.has('prodDuration') && <path d={makeLine('prodDuration')(data) || ''} fill="none" stroke="var(--color-chart-3)" strokeWidth={2.5} strokeLinecap="round" className="transition-all duration-300" />}

            {/* Hover crosshair */}
            {hovered && (
              <g transform={`translate(${hovered.x},0)`}>
                <line y1={0} y2={BH} stroke="var(--color-muted-fg)" strokeDasharray="3 3" strokeOpacity={0.5} />
                {activeSeries.has('devDuration') && <circle cy={yScale(hovered.dev)} r={4} fill="var(--color-chart-1)" stroke="var(--color-card)" strokeWidth={2} />}
                {activeSeries.has('stagingDuration') && <circle cy={yScale(hovered.staging)} r={4} fill="var(--color-chart-2)" stroke="var(--color-card)" strokeWidth={2} />}
                {activeSeries.has('prodDuration') && <circle cy={yScale(hovered.prod)} r={4} fill="var(--color-chart-3)" stroke="var(--color-card)" strokeWidth={2} />}
              </g>
            )}
          </g>
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute z-10 px-3 py-2 bg-[var(--color-card)] text-[var(--color-card-fg)] border border-[var(--color-card-border)] shadow-lg rounded-lg text-xs pointer-events-none"
            style={{ left: '50%', top: 4, transform: 'translateX(-50%)' }}
          >
            <div className="font-semibold mb-1">{hovered.date}</div>
            <div className="flex gap-3">
              {activeSeries.has('devDuration') && <span style={{ color: 'var(--color-chart-1)' }}>Dev: {hovered.dev}m</span>}
              {activeSeries.has('stagingDuration') && <span style={{ color: 'var(--color-chart-2)' }}>Stg: {hovered.staging}m</span>}
              {activeSeries.has('prodDuration') && <span style={{ color: 'var(--color-chart-3)' }}>Prod: {hovered.prod}m</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
