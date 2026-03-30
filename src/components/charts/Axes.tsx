import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface AxisProps {
  scale:
    | d3.ScaleContinuousNumeric<number, number>
    | d3.ScaleTime<number, number>
    | d3.ScaleBand<string>;
  orientation: 'bottom' | 'left' | 'bottom-time' | 'bottom-band';
  innerHeight?: number;
  ticks?: number;
  tickFormat?: (d: any) => string;
}

export const Axis: React.FC<AxisProps> = ({
  scale,
  orientation,
  innerHeight = 0,
  ticks,
  tickFormat,
}) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Select the SVG group
    const svgElement = d3.select(ref.current);

    // Create correct D3 axis based on orientation
    let axisGenerator: any;
    if (
      orientation === 'bottom' ||
      orientation === 'bottom-time' ||
      orientation === 'bottom-band'
    ) {
      axisGenerator = d3.axisBottom(scale as d3.AxisScale<any>);
    } else if (orientation === 'left') {
      axisGenerator = d3.axisLeft(scale as d3.AxisScale<any>);
    }

    if (ticks && axisGenerator.ticks) {
      axisGenerator.ticks(ticks);
    }
    if (tickFormat && axisGenerator.tickFormat) {
      axisGenerator.tickFormat(tickFormat);
    }

    // Apply the axis to the group with transitions for smooth updates
    svgElement.transition().duration(500).call(axisGenerator);

    /** Styling the generated axis using D3 selection instead of CSS for more robust SVG rendering.
        Tailwind CSS colors are not resolved at SVG runtime without fetching computed properties,
        so we force them to inherit color and then control `.domain` and `.tick line` generically. */
    svgElement.selectAll('.domain').attr('stroke', 'var(--color-border)');
    svgElement.selectAll('.tick line').attr('stroke', 'var(--color-border)');
    svgElement
      .selectAll('.tick text')
      .attr('fill', 'var(--color-muted-fg)')
      .attr('font-size', '10px');
  }, [scale, orientation, ticks, tickFormat]);

  const transform =
    orientation === 'bottom' || orientation === 'bottom-time' || orientation === 'bottom-band'
      ? `translate(0, ${innerHeight})`
      : `translate(0, 0)`;

  return <g ref={ref} transform={transform} />;
};
