import React, { useState, useEffect } from "react";
import { firestoreService } from "./firestoreService";
import TaskFormDialog from "./TaskFormDialog";
import MenuIcon from "@mui/icons-material/Menu";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { styled } from "@mui/material/styles";
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
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
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

  const handleClose = (): void => {
    setOpen(false); // ✅ Closes the dialog
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
              <MenuIcon
                fontSize="small"
                sx={{ marginRight: 1.0, marginLeft: -0.8 }}
              />
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
              <LeaderboardOutlinedIcon
                fontSize="small"
                sx={{ marginRight: 1.0, marginLeft: -0.8 }}
              />
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
          "@media (max-width: 768px)": {
            mt: "80px",
          },
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
              width: "60px",
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
                renderValue={(selected) => (selected ? selected : "Category")}
                sx={{
                  borderRadius: 7.5,
                  "& .MuiSelect-select": {
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    minHeight: "auto",
                  },
                }}
              >
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
              "@media (min-width: 768px)": {
                width: "160px",
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
        onClose={handleClose}
      />
      <TaskFormDialog
        open={open}
        onClose={() => setOpen(false)}
        userId={user.uid}
        fetchTasks={fetchTasks}
      />
    </Box>
  );
};

export default TaskForm;
