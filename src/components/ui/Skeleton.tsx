import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200/80', className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card border border-border-subtle p-3 flex flex-col gap-3">
      <Skeleton className="w-full aspect-[3/4] rounded-lg" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle/50">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function CategoryCircleSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-2 w-12" />
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-16 rounded-lg" />
          <Skeleton className="h-10 w-16 rounded-lg" />
          <Skeleton className="h-10 w-16 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default Skeleton;
