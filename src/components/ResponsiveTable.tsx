
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  renderCard?: (item: any, index: number) => React.ReactNode;
  className?: string;
  emptyMessage?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  headers,
  data,
  renderRow,
  renderCard,
  className,
  emptyMessage = "Nenhum dado encontrado"
}) => {
  const isMobile = useIsMobile();

  if (data.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-muted-foreground mobile-body">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // Mobile view - Cards only (no table at all)
  if (isMobile && renderCard) {
    return (
      <div className="px-3 py-4 space-y-3 max-w-full overflow-hidden">
        {data.map((item, index) => renderCard(item, index))}
      </div>
    );
  }

  // Desktop view - Table
  return (
    <div className={cn("cyber-table overflow-hidden hidden md:block", className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="cyber-table-header">
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="font-semibold whitespace-nowrap">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => renderRow(item, index))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
