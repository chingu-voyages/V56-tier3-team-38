'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getActivePatientsForBoard } from '@/services/patientService';
import { PatientStatus, STATUS_COLORS } from '@/types/patient';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

/**
 * Row type rendered in the table.
 */
type Row = {
  id: string;
  status: PatientStatus;
  name: string;
};

/**
 * Keeps UI structure intact while replacing logic with:
 * - Loading active patients (status != "Dismissal")
 * - Live updates via Supabase Realtime
 * - Auto page rotation every 20 seconds
 */
export function StatusTable() {
  // Table data
  const [rows, setRows] = useState<Row[]>([]);

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6); // Small-screen default

  /**
   * Responsive page size:
   * - sm and up: 10 rows
   * - below sm: 6 rows
   */
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)'); // Tailwind sm breakpoint
    const apply = () => setPageSize(mql.matches ? 10 : 6);
    apply();
    mql.addEventListener?.('change', apply);
    return () => mql.removeEventListener?.('change', apply);
  }, []);

  /**
   * Initial load of active patients for the board.
   * Assumes getActivePatientsForBoard() excludes "Dismissal".
   */
  useEffect(() => {
    (async () => {
      const data = await getActivePatientsForBoard();
      setRows(data.map((d) => ({ id: d.id, status: d.status, name: d.name })));
      setPage(0);
    })().catch(console.error);
  }, []);

  /**
   * Realtime subscription:
   * Re-fetch whenever patients table changes (INSERT/UPDATE/DELETE).
   * Make sure Realtime is enabled for "patients" in Supabase dashboard.
   */
  useEffect(() => {
    const channel = supabase
      .channel('public:patients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, async () => {
        const data = await getActivePatientsForBoard();
        setRows(data.map((d) => ({ id: d.id, status: d.status, name: d.name })));
        setPage(0);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  /**
   * Derive current page slice and total pages.
   */
  const { totalPages, current } = useMemo(() => {
    const total = Math.max(1, Math.ceil(rows.length / pageSize));
    const start = page * pageSize;
    const end = start + pageSize;
    return { totalPages: total, current: rows.slice(start, end) };
  }, [rows, page, pageSize]);

  /**
   * Auto-rotate pages every 20 seconds (as required).
   */
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setPage((p) => {
        const total = Math.max(1, Math.ceil(rows.length / pageSize));
        return total <= 1 ? 0 : (p + 1) % total;
      });
    }, 20_000) as unknown as number;

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [rows.length, pageSize]);

  /**
   * Pagination handlers compatible with the existing Pagination UI.
   */
  const goto = (n: number) => setPage(Math.min(Math.max(n, 0), totalPages - 1));
  const onPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    goto((page - 1 + totalPages) % totalPages);
  };
  const onNext = (e: React.MouseEvent) => {
    e.preventDefault();
    goto((page + 1) % totalPages);
  };
  const onPage = (n: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    goto(n);
  };

  /**
   * Badge style: use centralized STATUS_COLORS.
   */
  const badgeStyle = (status: PatientStatus) => ({
    backgroundColor: STATUS_COLORS[status],
    color: '#fff',
  });

  /**
   * Simple page list:
   * Show first 3 pages; if there are more, show an ellipsis and a jump to the last page.
   * (Keeps original look-and-feel.)
   */
  const visiblePages = useMemo(() => {
    return Array.from({ length: Math.min(3, totalPages) }, (_, i) => i);
  }, [totalPages]);

  return (
    <div className="w-full pb-8 px-8">
      <div className="border rounded-lg max-w-[640px] mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] sm:w-[100px] pl-4 text-xs sm:text-sm">ID</TableHead>
              <TableHead className="text-xs sm:text-sm">STATUS</TableHead>
              <TableHead className="text-xs sm:text-sm">NAME</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.length === 0 ? (
              <TableRow>
                <TableCell className="pl-4 text-xs sm:text-sm" colSpan={3}>
                  No active patients to display.
                </TableCell>
              </TableRow>
            ) : (
              current.map((record) => (
                <TableRow key={`${record.id}-${record.status}`}>
                  <TableCell className="font-medium text-left pl-4 text-xs sm:text-sm">
                    {record.id}
                  </TableCell>
                  <TableCell className="text-left">
                    <Badge className="text-xs px-2 py-1" style={badgeStyle(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left text-xs sm:text-sm">{record.name}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent className="flex-wrap">
            <PaginationItem>
              <PaginationPrevious href="#" className="text-xs sm:text-sm" onClick={onPrev} />
            </PaginationItem>

            {visiblePages.map((n) => (
              <PaginationItem key={n}>
                <PaginationLink
                  href="#"
                  isActive={page === n}
                  className="text-xs sm:text-sm"
                  onClick={onPage(n)}
                >
                  {n + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 3 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className="text-xs sm:text-sm"
                    onClick={onPage(totalPages - 1)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext href="#" className="text-xs sm:text-sm" onClick={onNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
