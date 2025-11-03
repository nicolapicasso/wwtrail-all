import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export function CompetitionCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <CardHeader className="pb-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Location */}
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
        </div>

        {/* Date */}
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div className="text-center space-y-1">
            <div className="h-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <div className="h-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-3">
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
      </CardFooter>
    </Card>
  );
}

export function CompetitionGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CompetitionCardSkeleton key={index} />
      ))}
    </div>
  );
}
