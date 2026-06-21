interface SkeletonProps {
  className?: string
  rounded?: string
}

export function Skeleton({ className = '', rounded = 'rounded-xl' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] ${rounded} ${className}`}
      style={{ animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%' }}
    />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex justify-between mb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9" rounded="rounded-xl" />
            </div>
            <Skeleton className="h-10 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
            <Skeleton className="h-5 w-32" />
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex justify-between py-2 border-b border-gray-50">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-16" rounded="rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SchemesSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
          <Skeleton className="h-6 w-28" rounded="rounded-lg" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-full" rounded="rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1" rounded="rounded-xl" />
            <Skeleton className="h-9 w-20" rounded="rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MapSkeleton() {
  return (
    <div className="h-[600px] bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <Skeleton className="h-full w-full" rounded="rounded-2xl" />
    </div>
  )
}
