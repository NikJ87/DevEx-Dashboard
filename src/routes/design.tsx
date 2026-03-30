import { createFileRoute } from '@tanstack/react-router';
import { DesignSystemView } from '@/components/design/DesignSystemView';

export const Route = createFileRoute('/design')({
  component: DesignSystemView,
});
