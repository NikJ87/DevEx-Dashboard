import { generateDeployments } from '@/services/api/generators';
import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta = {
  title: 'Charts/DeploymentFrequency',
  component: BarChart,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate 15 days of data for the story
const mockData = generateDeployments(15);

export const Default: Story = {
  args: {
    data: mockData,
  },
  render: (args) => (
    <div className="w-[800px] h-[400px] bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-card-border)] shadow-sm flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-[var(--color-fg)]">Deployment Frequency</h3>
      <div className="flex-1 w-full min-h-0">
        <BarChart {...args} />
      </div>
    </div>
  ),
};
