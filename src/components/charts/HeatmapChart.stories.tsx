import { generateTestSuiteFailures } from '@/services/api/generators';
import type { Meta, StoryObj } from '@storybook/react';
import { HeatmapChart } from './HeatmapChart';

const meta = {
  title: 'Charts/ETestSuiteHeatmap',
  component: HeatmapChart,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof HeatmapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate 10 days of data for the story
const mockData = generateTestSuiteFailures(10);

export const Default: Story = {
  args: {
    data: mockData,
  },
  render: (args) => (
    <div className="w-[800px] h-[400px] bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-card-border)] shadow-sm flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-[var(--color-fg)]">E2E Test Suite Heatmap</h3>
      <div className="flex-1 w-full min-h-0">
        <HeatmapChart {...args} />
      </div>
    </div>
  ),
};
