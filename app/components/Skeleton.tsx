import clsx from 'clsx'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-2xl bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 bg-[length:200%_100%]',
        className
      )}
      style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}
    />
  )
}

export function ActivityCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-4 w-full rounded-lg" />
      <Skeleton className="h-4 w-4/5 rounded-lg" />
      <div className="flex gap-4">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-3 w-28 rounded-full" />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-cream-100">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-3 w-32 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-7 h-7 rounded-full border-2 border-white" />
          ))}
        </div>
        <Skeleton className="h-1.5 w-20 rounded-full" />
      </div>
    </div>
  )
}
