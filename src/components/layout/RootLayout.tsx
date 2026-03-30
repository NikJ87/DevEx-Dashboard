import { useTheme } from '@/hooks/useTheme';
import { WHITELABELS } from '@/themes/types';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Switch from '@radix-ui/react-switch';
import { Link, Outlet } from '@tanstack/react-router';

// Wait, lucide-react, not lucide-center
import {
  Check as CheckIcon,
  ChevronDown as ChevronIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
} from 'lucide-react';

export function RootLayout() {
  const { theme, setTheme, whiteLabel, setWhiteLabel } = useTheme();
  const currentWhiteLabel = WHITELABELS.find((s) => s.id === whiteLabel) || WHITELABELS[0];

  return (
    <div className="min-h-screen flex flex-col">
      {/*  Top Navigation Bar  */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur-xl backdrop-saturate-150">
        <div className="container mx-auto flex h-14 items-center px-4 justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 font-semibold tracking-tight text-sm">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary-fg)] text-xs font-bold shadow-sm">
                DA
              </div>
              <span className="hidden sm:inline">DevEx Analytics</span>
            </div>

            <nav className="flex items-center gap-1 text-sm">
              <Link
                to="/"
                className="px-3 py-1.5 rounded-md text-[var(--color-muted-fg)] transition-all duration-200 hover:text-[var(--color-fg)] hover:bg-[var(--color-muted)] [&.active]:text-[var(--color-primary)] [&.active]:bg-[var(--color-primary)]/10 [&.active]:font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/design"
                className="px-3 py-1.5 rounded-md text-[var(--color-muted-fg)] transition-all duration-200 hover:text-[var(--color-fg)] hover:bg-[var(--color-muted)] [&.active]:text-[var(--color-primary)] [&.active]:bg-[var(--color-primary)]/10 [&.active]:font-medium"
              >
                Design System
              </Link>
            </nav>
          </div>

          {/* Right: WhiteLabel Persona Selector + Theme Toggle */}
          <div className="flex items-center gap-3">
            {/*  WhiteLabel Persona Selector (Radix Dropdown Menu) */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-sm font-medium transition-all duration-200 hover:border-[var(--color-primary)]/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
                  <span className="text-base">{currentWhiteLabel.emoji}</span>
                  <span className="hidden sm:inline text-[var(--color-fg)]">
                    {currentWhiteLabel.shortName}
                  </span>
                  <ChevronIcon className="h-3.5 w-3.5 text-[var(--color-muted-fg)]" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-[100] min-w-[220px] rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-1.5 shadow-lg"
                  sideOffset={6}
                  align="end"
                >
                  <DropdownMenu.Label className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-fg)]">
                    Switch WhiteLabel Persona
                  </DropdownMenu.Label>
                  <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-border)]" />

                  {WHITELABELS.map((w) => (
                    <DropdownMenu.Item
                      key={w.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 outline-none data-[highlighted]:bg-[var(--color-muted)] group"
                      onSelect={() => setWhiteLabel(w.id)}
                    >
                      <span className="text-lg">{w.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--color-fg)] group-data-[highlighted]:text-[var(--color-primary)]">
                          {w.name}
                        </div>
                        <div className="text-xs text-[var(--color-muted-fg)] truncate">
                          {w.description}
                        </div>
                      </div>
                      {whiteLabel === w.id && (
                        <CheckIcon className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                      )}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Theme Toggle Switch */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-border)]">
              <SunIcon className="h-3.5 w-3.5 text-[var(--color-warning)]" />
              <Switch.Root
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                className="relative h-6 w-10 rounded-full bg-[var(--color-muted)] transition-colors duration-300 data-[state=checked]:bg-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
              >
                <Switch.Thumb className="block h-4.5 w-4.5 rounded-full bg-white shadow-md transition-transform duration-300 translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
              </Switch.Root>
              <MoonIcon className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
