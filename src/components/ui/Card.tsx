import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return <div className={cn("card-surface", className)} {...props} />;
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("flex flex-col gap-1.5 p-5 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: DivProps) {
  return <h3 className={cn("text-sm font-medium text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
