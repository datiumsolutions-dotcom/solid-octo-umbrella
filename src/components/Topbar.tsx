export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Operations</p>
          <p className="text-xs text-muted-foreground">Base44-like shell preview</p>
        </div>
        <div className="text-xs text-muted-foreground">Actions slot</div>
      </div>
    </header>
  );
}
