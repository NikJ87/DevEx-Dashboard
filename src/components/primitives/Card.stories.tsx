import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Activity } from 'lucide-react';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a standard modernized WhiteLabel card.',
    className: 'w-[350px] p-6',
  },
};

export const WithKPI: Story = {
  render: () => (
    <Card className="w-[350px] p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-[var(--color-muted-fg)] uppercase tracking-wider mb-2">
          Total Pipelines
        </p>
        <div className="text-4xl font-black text-[var(--color-fg)] tracking-tight">
          14,204
        </div>
        <div className="mt-2 text-xs text-[var(--color-success)] font-medium">
          +4.2% since last week
        </div>
      </div>
      <div className="h-12 w-12 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] flex items-center justify-center text-[var(--color-primary)]">
        <Activity className="h-6 w-6" />
      </div>
    </Card>
  ),
};
