import React, { useState, useEffect } from "react";
import { firestoreService } from "./firestoreService";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Dialog,
  FormControl,
  InputLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  ButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import TaskList from "./TaskList";
import Header from "./Header";
import { Task } from "../type";

const TaskForm = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    category: "",
    dueDate: "",
    status: "todo",
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedDueDate, setSelectedDueDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "board">("board");
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    if (isMobile) {
      setViewMode("list"); // Default to "list" when below 768px
    }
  }, [isMobile, setViewMode]);

  useEffect(() => {
    if (user.uid) {
      fetchTasks();
    }
  }, [user.uid, categoryFilter, statusFilter, selectedDueDate]);

  const fetchTasks = async () => {
    let userTasks = await firestoreService.getUserTasks(user.uid);
    userTasks = userTasks.map((task) => ({
      ...task,
      status:
        "todo" === task.status ||
        "in-progress" === task.status ||
        "completed" === task.status
          ? task.status
          : "todo",
    }));

    if (categoryFilter) {
      userTasks = userTasks.filter(
        (task) => task.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    if (statusFilter) {
      userTasks = userTasks.filter((task) => task.status === statusFilter);
    }
    if (selectedDueDate) {
      userTasks = userTasks.filter((task) => {
        const taskDueDate = task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "";
        return taskDueDate === selectedDueDate;
      });
    }

    setTasks(userTasks);
  };

  const handleDeleteTask = async (taskId: string) => {
    await firestoreService.deleteTask(user.uid, taskId);
    fetchTasks();
  };

  return (
    <Box>
      <Header user={user} />
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginTop: 12.5,
            padding: "0 16px",
          }}
        >
          <ButtonGroup variant="outlined" aria-label="view mode">
            <Button
              variant={viewMode === "list" ? "contained" : "outlined"}
              onClick={() => setViewMode("list")}
              sx={{
                backgroundColor: "transparent",
                color: "black",
                border: "1px solid transparent",
                borderBottom:
                  viewMode === "list"
                    ? "2px solid black"
                    : "1px solid transparent",
                boxShadow: "none",
                "&:hover, &:focus": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}
            >
              List
            </Button>
            <Button
              variant={viewMode === "board" ? "contained" : "outlined"}
              onClick={() => setViewMode("board")}
              sx={{
                backgroundColor: "transparent",
                color: "black",
                border: "1px solid transparent",
                borderBottom:
                  viewMode === "board"
                    ? "2px solid black"
                    : "1px solid transparent",
                boxShadow: "none",
                "&:hover, &:focus": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}
            >
              Board
            </Button>
          </ButtonGroup>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          padding: "16px 16px 0 16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" }, // Default for MUI breakpoints
            alignItems: "center",

            // Apply styles for screens below 768px
            "@media (max-width: 768px)": {
              flexDirection: "column",
              alignItems: "flex-start",
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "12px",
              lineHeight: "140%",
            }}
          >
            Filter by:
          </Typography>

          {/* Wrap Category & Date fields inside another flex box */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: "row", // Keep Category & Date field in same row
              width: "100%", // Ensure proper spacing
            }}
          >
            <FormControl variant="outlined" sx={{ flex: 1 }}>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: 7.5,
                  "& .MuiSelect-select": {
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    minHeight: "auto",
                  },
                }}
              >
                <MenuItem value="">Category</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="personal">Personal</MenuItem>
              </Select>
            </FormControl>

            <TextField
              type="date"
              value={selectedDueDate || ""}
              onChange={(e) => setSelectedDueDate(e.target.value)}
              variant="outlined"
              sx={{
                flex: 1,
                borderRadius: "80px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "80px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                },
                "& .MuiOutlinedInput-input": {
                  paddingTop: "6px",
                  paddingBottom: "6px",
                },
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginTop: {
              xs: "-80px", // Below 500px
              sm: "-80px", // Between 500px and 768px
              md: "0px", // Default for wider screens
            },
            marginLeft: {
              xs: "-80px", // Below 500px
              sm: "0px", // No margin-left above 500px
            },
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#7B1984",
              borderRadius: 41,
              width: {
                xs: "120px", // Below 768px
                md: "160px", // Default width
              },
            }}
            onClick={() => setOpen(true)}
          >
            ADD TASK
          </Button>
        </Box>
      </Box>
      <TaskList
        tasks={tasks}
        fetchTasks={fetchTasks}
        userId={user.uid}
        handleDeleteTask={handleDeleteTask}
        viewMode={viewMode}
      />
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      bgcolor: "#7B1984",
      color: "white",
      fontWeight: "bold",
    }}
  >
    Create Task
  </DialogTitle>

  <DialogContent sx={{ p: 3 }}>
    <TextField
      label="Title"
      name="title"
      value={task.title}
      onChange={(e) => setTask({ ...task, title: e.target.value })}
      fullWidth
      required
      sx={{ mb: 2 }}
    />

    <TextField
      label="Description"
      name="description"
      value={task.description}
      onChange={(e) => setTask({ ...task, description: e.target.value })}
      fullWidth
      required
      multiline
      rows={3}
      sx={{ mb: 2 }}
    />

    <TextField
      type="date"
      name="dueDate"
      value={task.dueDate}
      onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
      fullWidth
      required
      sx={{ mb: 2 }}
    />

    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Category</InputLabel>
      <Select
        name="category"
        value={task.category}
        onChange={(e) => setTask({ ...task, category: e.target.value })}
        displayEmpty
      >
        <MenuItem value="work">Work</MenuItem>
        <MenuItem value="personal">Personal</MenuItem>
      </Select>
    </FormControl>

    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Status</InputLabel>
      <Select
        name="status"
        value={task.status}
        onChange={(e) =>
          setTask({
            ...task,
            status: e.target.value as "todo" | "in-progress" | "completed",
          })
        }
        displayEmpty
      >
        <MenuItem value="todo">To-Do</MenuItem>
        <MenuItem value="in-progress">In Progress</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </Select>
    </FormControl>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 3 }}>
    <Button
      onClick={() => setOpen(false)}
      sx={{ color: "#7B1984", fontWeight: "bold" }}
    >
      Cancel
    </Button>
    <Button
      onClick={async () => {
        await firestoreService.addTask(user.uid, {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        });
        fetchTasks();
        setTask({
          id: "",
          title: "",
          description: "",
          category: "",
          dueDate: "",
          status: "todo",
        });
        setOpen(false);
      }}
      variant="contained"
      sx={{
        backgroundColor: "#7B1984",
        fontWeight: "bold",
        "&:hover": { backgroundColor: "#5A1263" },
      }}
    >
      Add Task
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default TaskForm;
