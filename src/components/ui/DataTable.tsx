import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Column<T> {
  key: keyof T | string; // Allow string keys for actions/computed columns
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  viewMode?: 'table' | 'grid';
  renderCard?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  isLoading,
  onRowClick,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  viewMode = 'table',
  renderCard
}: DataTableProps<T>) {
  if (isLoading) {
    return (
        <div className="w-full space-y-4">
            {viewMode === 'table' ? (
                <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-xs">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4 items-center">
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="p-4 border border-border rounded-xl bg-card space-y-3">
                            <Skeleton className="h-32 w-full rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="w-full shadow-2xl rounded-xl overflow-hidden shadow-black/10 dark:shadow-black/40 border border-white/5 dark:border-white/5">
      <div className="w-full overflow-hidden bg-card rounded-t-xl">
        {viewMode === 'table' ? (
          <Table>
            <TableHeader className="bg-muted dark:bg-muted/20">
              <TableRow className="hover:bg-transparent  border-none">
                
                {columns.map((col) => (
                  <TableHead 
                    key={String(col.key)} 
                    className={cn(
                      "text-[11px]  uppercase tracking-wider font-extrabold text-muted-foreground py-5 px-6",
                      col.label === 'Cost' ? "text-right" : ""
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {/* <div className="flex flex-col -space-y-1 opacity-50 scale-75">
                        <span className="text-[8px]">▲</span>
                        <span className="text-[8px]">▼</span>
                      </div> */}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="border-b border-border">
              {data.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground font-medium italic border-none">
                     No records found.
                   </TableCell>
                 </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow 
                    key={item.id} 
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      "border-border/40 transition-colors group",
                      onRowClick ? "cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10" : ""
                    )}
                  >
                    {columns.map((col) => (
                      <TableCell 
                        key={String(col.key)} 
                        className={cn(
                          "py-5 px-6 text-[15px] text-foreground/90 dark:text-foreground/90 font-medium",
                          col.label === 'Cost' ? "text-right font-mono" : ""
                        )}
                      >
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="p-1">
            {data.length === 0 ? (
              <div className="py-20 text-center bg-card/20 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground font-medium italic">No records found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.map((item) => (
                  <div key={item.id} onClick={() => onRowClick?.(item)} className={onRowClick ? "cursor-pointer" : ""}>
                    {renderCard ? renderCard(item) : (
                      <div className="p-4 border border-border rounded-xl bg-card">
                        <p className="font-bold">{String(item.id)}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* {(onPageChange && totalPages > 1) && ( */}
        <div className={cn(
            "flex items-center justify-between py-6 px-6 bg-secondary/50 dark:bg-secondary/20",
            viewMode === 'table' ? "rounded-b-xl" : "border border-border/30 rounded-xl"
        )}>
          <div className="text-sm font-medium text-muted-foreground">
            {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, data.length * totalPages)} of {data.length * totalPages}
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              Rows per page: 
              <div className="flex items-center gap-1 text-foreground cursor-pointer hover:text-primary transition-colors">
                10 <span className="text-[10px] opacity-50">▼</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                disabled={currentPage === 1}
                onClick={() => onPageChange?.(currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center border border-border/80 rounded-xl bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md group"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={3} />
              </button>
              
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border/50 rounded-full shadow-inner shadow-black/5">
                <span className="text-sm font-bold text-foreground">{currentPage}</span>
                <span className="text-muted-foreground/30 text-xs">/</span>
                <span className="text-sm font-medium text-muted-foreground">{totalPages}</span>
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => onPageChange?.(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center border border-border/80 rounded-xl bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md group"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      {/* )} */}
    </div>
  )
}

