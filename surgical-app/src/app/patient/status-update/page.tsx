import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function StatusUpdate() {
  return (
    <section>
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-bold text-2xl text-center mb-8 sm:text-3xl">Update Patient Status</h1>

        <div className="space-y-6 max-w-sm mx-auto">
          {/* Enter Patient Number to Search */}
          <div className="flex items-center gap-2">
            <label htmlFor="patient-number" className="whitespace-nowrap">
              Patient Number:
            </label>
            <Input id="patient-number" className="max-w-xs" />
            <Button variant="secondary">Search</Button>
          </div>

          {/* Display Patient Info Table After Search(Initially Hidden) */}
          <div className="hidden">
            <label htmlFor="patient-info" className="whitespace-nowrap">
              Patient Info:
            </label>
            <Table className="mt-4">
              <TableBody>
                <TableRow>
                  <TableHead className="w-48">First Name</TableHead>
                  <TableCell>John</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Last Name</TableHead>
                  <TableCell>Doe</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableCell>123 Alpha Drive</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>City</TableHead>
                  <TableCell>Los Angeles</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableCell>California</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Phone Number</TableHead>
                  <TableCell>123-456-7890</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Show Current Status (Read-only) */}
          <div className="flex items-center gap-2">
            <label htmlFor="current-status" className="whitespace-nowrap">
              Current Status:
            </label>
            <Input id="current-status" readOnly className="max-w-xs" />
          </div>

          {/* Select New Status (Only Next or Prior in Real Logic) */}
          <div className="flex items-center gap-2">
            <label htmlFor="new-status" className="whitespace-nowrap">
              New Status:
            </label>
            <div className="w-full max-w-xs">
              <Select>
                <SelectTrigger id="new-status" className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="pre-procedure">Pre-procedure</SelectItem>
                  <SelectItem value="in-progress">In-progress</SelectItem>
                  <SelectItem value="closing">Closing</SelectItem>
                  <SelectItem value="recovery">Recovery</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="dismissal">Dismissal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="secondary">Cancel</Button>
            <Button>Add / Update</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
