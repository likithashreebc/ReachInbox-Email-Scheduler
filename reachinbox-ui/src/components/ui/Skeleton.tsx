import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />;
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-[#f5f5f5]">
      <Skeleton className="h-3.5 w-40" />
      <Skeleton className="h-3.5 w-56 flex-1" />
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-3.5 w-32" />
      <Skeleton className="h-5 w-16 rounded" />
    </div>
  );
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-4 flex flex-col gap-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}
