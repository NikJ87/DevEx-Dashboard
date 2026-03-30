import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/primitives/Card';
import { Button } from '@/components/primitives/Button';

export function DesignSystemView() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
        <p className="text-[var(--color-muted-fg)]">
          Token-driven architecture and component library guidelines.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Colors & Tokens</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <ColorSwatch name="bg" />
          <ColorSwatch name="fg" />
          <ColorSwatch name="primary" />
          <ColorSwatch name="primary-fg" />
          <ColorSwatch name="muted" />
          <ColorSwatch name="muted-fg" />
          <ColorSwatch name="border" />
          <ColorSwatch name="card" />
          <ColorSwatch name="card-fg" />
          <ColorSwatch name="success" />
          <ColorSwatch name="destructive" />
          <ColorSwatch name="warning" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Primitives</h2>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Primary actions and links</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Cards</CardTitle>
            <CardDescription>Used to compose layouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-sm rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-6 shadow-md text-center">
              Sample Card Content inside Card Primitive
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ColorSwatch({ name }: { name: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border bg-white dark:bg-black p-2 shadow-sm">
      <div
        className="h-16 w-full rounded-[var(--radius-sm)] border border-black/10 dark:border-white/10"
        style={{ backgroundColor: `var(--color-${name})` }}
      />
      <span className="text-xs font-mono font-medium text-center">--color-{name}</span>
    </div>
  );
}
