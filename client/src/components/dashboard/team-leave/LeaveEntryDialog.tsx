
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { leaveTypes } from "./types";
import { useToast } from "@/hooks/use-toast";
import { Leave } from "./types";
import { employees } from "@/services/employees/data";

interface LeaveEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  employeeId: string | null;
  editMode: boolean;
  currentLeave: Leave | null;
  onSave: (leaveData: Leave) => void;
  onDelete: () => void;
}

const formSchema = z.object({
  type: z.string({
    required_error: "Please select a leave type",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
});

export function LeaveEntryDialog({
  isOpen,
  onClose,
  selectedDate,
  employeeId,
  editMode,
  currentLeave,
  onSave,
  onDelete,
}: LeaveEntryDialogProps) {
  const { toast } = useToast();

  // Get employee gender to filter leave types
  const employee = employees.find(emp => emp.id === employeeId);
  const employeeGender = employee?.gender;

  // Filter leave types based on gender
  const getFilteredLeaveTypes = () => {
    return leaveTypes.filter(type => {
      if (employeeGender === "Male") {
        // Males cannot apply for menstrual and maternity leaves
        return type.id !== "menstrual" && type.id !== "maternity";
      } else if (employeeGender === "Female") {
        // Females cannot apply for paternity leaves
        return type.id !== "paternity";
      }
      return true; // Show all types if gender is not specified
    });
  };

  const filteredLeaveTypes = getFilteredLeaveTypes();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: currentLeave?.type || "vacation",
      startDate: currentLeave?.startDate || selectedDate || new Date(),
      endDate: currentLeave?.endDate || selectedDate || new Date(),
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        type: currentLeave?.type || "vacation",
        startDate: currentLeave?.startDate || selectedDate || new Date(),
        endDate: currentLeave?.endDate || selectedDate || new Date(),
      });
    }
  }, [isOpen, currentLeave, selectedDate, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const leaveData: Leave = {
      employeeId: employeeId || "",
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    onSave(leaveData);
    
    toast({
      title: editMode ? "Leave updated" : "Leave added",
      description: `${editMode ? "Updated" : "Added"} ${format(data.startDate, "MMM d")} - ${format(data.endDate, "MMM d")} leave`,
    });
    
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    
    toast({
      title: "Leave deleted",
      description: "The leave entry has been removed",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Leave Entry" : "Add New Leave Entry"}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? "Update the leave details below"
              : `Fill in the details to add a new leave${employee ? ` for ${employee.name}` : ""}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredLeaveTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span> {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a start date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick an end date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          defaultMonth={form.watch("startDate")}
                          fromDate={form.watch("startDate")}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              {editMode && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button type="submit">{editMode ? "Update" : "Add"} Leave</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
