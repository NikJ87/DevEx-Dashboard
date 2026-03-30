import { generatePipelineDurations } from '@/services/api/generators';
import { MultiLineChart } from './LineChart';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Charts/PipelineDurationTrend',
  component: MultiLineChart,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MultiLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate 30 days of data for the story
const mockData = generatePipelineDurations(30);

export const Default: Story = {
  args: {
    data: mockData,
  },
  render: (args) => (
    <div className="w-[800px] h-[400px] bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-card-border)] shadow-sm flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-[var(--color-fg)]">Pipeline Duration Trend</h3>
      <div className="flex-1 w-full min-h-0">
        <MultiLineChart {...args} />
      </div>
    </div>
  ),
};
