import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmployeesOnLeaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employees: string[];
  loading: boolean;
  error: string | null;
}

export function EmployeesOnLeaveDialog({
  isOpen,
  onClose,
  employees,
  loading,
  error,
}: EmployeesOnLeaveDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>On Leave Today</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm text-neutral-600">
              Loading employees on leave...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-6 text-sm text-red-600">
              {error}
            </div>
          ) : employees.length === 0 ? (
            <div className="flex items-center justify-center py-6 text-sm text-neutral-600">
              No one is on leave today.
            </div>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto">
              {employees.map((name) => (
                <li
                  key={name}
                  className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-neutral-800">{name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

