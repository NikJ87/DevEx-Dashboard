import { generateTestResults } from '@/services/api/generators';
import { StackedAreaChart } from './StackedAreaChart';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Charts/ETestResults',
  component: StackedAreaChart,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof StackedAreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate 20 days of data for the story
const mockData = generateTestResults(20);

export const Default: Story = {
  args: {
    data: mockData,
  },
  render: (args) => (
    <div className="w-[800px] h-[400px] bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-card-border)] shadow-sm flex flex-col">
      <h3 className="text-lg font-bold mb-2 text-[var(--color-fg)]">E2E Test Results</h3>
      <div className="text-[var(--color-muted-fg)] text-xs mb-4">
        Smallest value (lowest rate) is automatically stacked at the bottom baseline.
      </div>
      <div className="flex-1 w-full min-h-0">
        <StackedAreaChart {...args} />
      </div>
    </div>
  ),
};

export const FailureDisaster: Story = {
  args: {
    data: mockData.map(d => ({
      ...d,
      passed: 10,
      failed: 400 + Math.random() * 50
    }))
  },
  render: (args) => (
    <div className="w-[800px] h-[400px] bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-card-border)] shadow-sm flex flex-col">
      <h3 className="text-lg font-bold mb-2 text-[var(--color-fg)]">E2E Test Results (Disaster Mode)</h3>
      <div className="text-[var(--color-muted-fg)] text-xs mb-4">
        Simulates Failed &gt; Passed. Observe the Green sliver move to the anchor baseline.
      </div>
      <div className="flex-1 w-full min-h-0">
        <StackedAreaChart {...args} />
      </div>
    </div>
  ),
};
