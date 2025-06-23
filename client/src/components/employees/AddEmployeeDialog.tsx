import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface SlackUser {
  id: string;
  name: string;
  email: string;
  username: string;
  slackId: string;
}

interface AddEmployeeDialogProps {
  onEmployeeAdded?: () => void;
}

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string) => {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function AddEmployeeDialog({ onEmployeeAdded }: AddEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [slackUsers, setSlackUsers] = useState<SlackUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [addingUsers, setAddingUsers] = useState(false);
  const { toast } = useToast();

  // Fetch Slack users when dialog opens
  useEffect(() => {
    if (open) {
      fetchSlackUsers();
    }
  }, [open]);

  const fetchSlackUsers = async () => {
    setFetchingUsers(true);
    try {
      const response = await apiService.getSlackUsers();
      if (response.error) {
        toast({
          title: "Error",
          description:
            "Failed to fetch Slack users. Please check your Slack token configuration.",
          variant: "destructive",
        });
        return;
      }
      setSlackUsers(response.data?.users || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Slack users",
        variant: "destructive",
      });
    } finally {
      setFetchingUsers(false);
    }
  };

  const filteredUsers = slackUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capitalizeWords(user.name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const addSelectedUsers = async () => {
    if (selectedUsers.size === 0) return;

    setAddingUsers(true);
    const selectedUserData = slackUsers.filter((user) =>
      selectedUsers.has(user.id)
    );

    let successCount = 0;
    let errorCount = 0;

    for (const user of selectedUserData) {
      try {
        const response = await apiService.createUser({
          username: user.username,
          slackId: user.slackId,
        });

        if (response.error) {
          errorCount++;
          console.error(`Failed to add user ${user.name}:`, response.error);
        } else {
          successCount++;
        }
      } catch (error) {
        errorCount++;
        console.error(`Failed to add user ${user.name}:`, error);
      }
    }

    if (successCount > 0) {
      toast({
        title: "Success",
        description: `Successfully added ${successCount} employee(s)${
          errorCount > 0 ? `, ${errorCount} failed` : ""
        }`,
      });
      setSelectedUsers(new Set());
      setOpen(false);
      onEmployeeAdded?.();
    } else {
      toast({
        title: "Error",
        description: `Failed to add ${errorCount} employee(s)`,
        variant: "destructive",
      });
    }

    setAddingUsers(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus size={16} className="mr-2" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add New Employees</DialogTitle>
          <DialogDescription>
            {fetchingUsers
              ? "Loading available employees from Slack..."
              : `Select employees from your Slack workspace to add them to the system. ${filteredUsers.length} available.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <Input
              placeholder="Search employees..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Selected count */}
          {selectedUsers.size > 0 && (
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {selectedUsers.size} employee(s) selected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUsers(new Set())}
              >
                Clear selection
              </Button>
            </div>
          )}

          {/* Users list */}
          <ScrollArea className="h-96 border rounded-md p-4">
            {fetchingUsers ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Fetching Slack users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center text-neutral-500 py-8">
                {searchQuery ? (
                  "No users found matching your search."
                ) : (
                  <div>
                    <p className="mb-2">
                      All Slack users are already in the system!
                    </p>
                    <p className="text-sm">
                      No new employees to add from your Slack workspace.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-neutral-50 cursor-pointer"
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(capitalizeWords(user.name))}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {capitalizeWords(user.name)}
                      </div>
                      <div className="text-sm text-neutral-500 truncate">
                        @{user.username}
                      </div>
                      {user.email && (
                        <div className="text-xs text-neutral-400 truncate">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={addSelectedUsers}
              disabled={selectedUsers.size === 0 || addingUsers}
            >
              {addingUsers && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Add {selectedUsers.size > 0 ? `${selectedUsers.size} ` : ""}
              Employee{selectedUsers.size !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
