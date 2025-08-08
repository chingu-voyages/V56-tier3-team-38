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

// データの型定義
type Status = 'Checked In' | 'In-progress' | 'Pre-Procedure';

interface Record {
  id: string;
  status: Status;
  name: string;
}

// サンプルデータ
const records: Record[] = [
  { id: 'FIG123', status: 'Checked In', name: 'John Smith' },
  { id: 'FIG123', status: 'In-progress', name: 'John Smith' },
  { id: 'FIG123', status: 'Pre-Procedure', name: 'John Smith' },
  { id: 'FIG123', status: 'Checked In', name: 'John Smith' },
  { id: 'FIG123', status: 'In-progress', name: 'John Smith' },
  { id: 'FIG123', status: 'Pre-Procedure', name: 'John Smith' },
];

// ステータスに応じたBadgeのスタイルを返すヘルパーオブジェクト
const statusStyles: { [key in Status]: string } = {
  'Checked In': 'bg-gray-800 text-white',
  'In-progress': 'bg-gray-500 text-white',
  'Pre-Procedure': 'bg-gray-200 text-gray-800',
};

export function StatusTable() {
  return (
    <div className="w-full max-w-full overflow-x-auto pb-8 px-8">
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
            {records.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-left pl-4 text-xs sm:text-sm">
                  {record.id}
                </TableCell>
                <TableCell className="text-left">
                  <Badge className={`${statusStyles[record.status]} text-xs px-2 py-1`}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-left text-xs sm:text-sm">{record.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent className="flex-wrap">
            <PaginationItem>
              <PaginationPrevious href="#" className="text-xs sm:text-sm" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive className="text-xs sm:text-sm">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="text-xs sm:text-sm">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="text-xs sm:text-sm">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="text-xs sm:text-sm" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
