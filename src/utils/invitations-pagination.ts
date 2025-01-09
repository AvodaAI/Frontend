// src/utils/invitations-pagination.ts
import { useMemo, useState } from "react";

export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
}

export const usePagination = (items: any[], initialItemsPerPage = 10) => {
    const [paginationState, setPaginationState] = useState<PaginationState>({
        currentPage: 1,
        itemsPerPage: initialItemsPerPage,
        totalItems: items.length
    });    // Calculate paginated items
    const paginatedItems = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
        const endIndex = startIndex + paginationState.itemsPerPage;
        return items.slice(startIndex, endIndex);
    }, [items, paginationState]);    // Total number of pages
    const totalPages = useMemo(() =>
        Math.ceil(items.length / paginationState.itemsPerPage),
        [items.length, paginationState.itemsPerPage]
    );    // Page change handlers
    const goToNextPage = () => {
        setPaginationState(prev => ({
            ...prev,
            currentPage: Math.min(prev.currentPage + 1, totalPages)
        }));
    };    const goToPreviousPage = () => {
        setPaginationState(prev => ({
            ...prev,
            currentPage: Math.max(prev.currentPage - 1, 1)
        }));
    };    const goToPage = (page: number) => {
        setPaginationState(prev => ({
            ...prev,
            currentPage: Math.max(1, Math.min(page, totalPages))
        }));
    };

    return {
        paginatedItems,
        paginationState,
        totalPages,
        goToNextPage,
        goToPreviousPage,
        goToPage
    };
};


// import * as React from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { buttonVariants } from "@/components/ui/button"

// const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
//   <nav
//     role="navigation"
//     aria-label="pagination"
//     className={cn("mx-auto flex w-full justify-center", className)}
//     {...props}
//   />
// )
// Pagination.displayName = "Pagination"

// const PaginationContent = React.forwardRef<
//   HTMLUListElement,
//   React.ComponentProps<"ul">
// >(({ className, ...props }, ref) => (
//   <ul
//     ref={ref}
//     className={cn("flex flex-row items-center gap-1", className)}
//     {...props}
//   />
// ))
// PaginationContent.displayName = "PaginationContent"

// const PaginationItem = React.forwardRef<
//   HTMLLIElement,
//   React.ComponentProps<"li">
// >(({ className, ...props }, ref) => (
//   <li ref={ref} className={cn("", className)} {...props} />
// ))
// PaginationItem.displayName = "PaginationItem"

// interface PaginationLinkProps
//   extends React.ComponentProps<typeof buttonVariants>,
//     React.ComponentProps<"button"> {
//   isActive?: boolean
// }

// const PaginationLink = ({
//   className,
//   isActive,
//   size = "icon",
//   ...props
// }: PaginationLinkProps) => (
//   <button
//     aria-current={isActive ? "page" : undefined}
//     className={cn(
//       buttonVariants({
//         variant: isActive ? "outline" : "ghost",
//         size,
//       }),
//       "w-10 h-10 p-0",
//       className
//     )}
//     {...props}
//   />
// )
// PaginationLink.displayName = "PaginationLink"

// const PaginationPrevious = ({
//   className,
//   ...props
// }: React.ComponentProps<typeof PaginationLink>) => (
//   <PaginationLink
//     aria-label="Go to previous page"
//     size="default"
//     className={cn("gap-1 pl-2.5", className)}
//     {...props}
//   >
//     <ChevronLeft className="h-4 w-4" />
//     <span>Previous</span>
//   </PaginationLink>
// )
// PaginationPrevious.displayName = "PaginationPrevious"

// const PaginationNext = ({
//   className,
//   ...props
// }: React.ComponentProps<typeof PaginationLink>) => (
//   <PaginationLink
//     aria-label="Go to next page"
//     size="default"
//     className={cn("gap-1 pr-2.5", className)}
//     {...props}
//   >
//     <span>Next</span>
//     <ChevronRight className="h-4 w-4" />
//   </PaginationLink>
// )
// PaginationNext.displayName = "PaginationNext"

// export {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// }