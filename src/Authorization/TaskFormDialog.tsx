import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { firestoreService } from "./firestoreService";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: "todo" | "in-progress" | "completed";
}

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  fetchTasks: () => void;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onClose,
  userId,
  fetchTasks,
}) => {
  const [task, setTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    category: "",
    dueDate: "",
    status: "todo",
  });

  const handleSaveTask = async () => {
    await firestoreService.addTask(userId, {
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
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { borderRadius: "16px" } } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "white",
          color: "black",
          fontWeight: "bold",
          borderBottom: "2px solid #F5F5F5",
          padding: "15px",
          mb: 3,
        }}
      >
        Create Task
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "gray",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, paddingTop: "10px" }}>
        <TextField
          name="title"
          placeholder="Task Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          fullWidth
          required
          size="small"
          sx={{
            mb: 2,
            backgroundColor: "#F5F5F5",
            "& .MuiInputBase-root": { height: "36px" },
            "& .MuiInputBase-input": { fontSize: "14px", padding: "10px" },
          }}
        />

        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              backgroundColor: "#F5F5F5",
              borderRadius: "8px",
              border: "1px solid #ccc",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              "& .ql-toolbar": {
                order: 2,
                borderTop: "1px solid #ccc",
                backgroundColor: "#F5F5F5",
              },
              "& .ql-container": { order: 1, minHeight: "120px" },
            }}
          >
            <ReactQuill
              value={task.description}
              onChange={(value) => setTask({ ...task, description: value })}
              theme="snow"
              placeholder="Description"
              modules={{
                toolbar: [
                  ["bold", "italic"],
                  [{ list: "ordered" }, { list: "bullet" }],
                ],
              }}
              style={{ minHeight: "150px" }}
            />
            <style>
            {`
            .ql-editor::before {
              font-style: normal !important;
              color: gray; 
              }
            `}
            </style>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant={task.category === "work" ? "contained" : "outlined"}
              onClick={() => setTask({ ...task, category: "work" })}
              sx={{ borderColor: "grey", color: "grey", borderRadius: "20px" }}
            >
              Work
            </Button>
            <Button
              variant={task.category === "personal" ? "contained" : "outlined"}
              onClick={() => setTask({ ...task, category: "personal" })}
              sx={{ borderColor: "grey", color: "grey", borderRadius: "20px" }}
            >
              Personal
            </Button>
          </Box>

          <TextField
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            required
            sx={{ backgroundColor: "#F5F5F5", flex: 1 }}
          />

          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={task.status}
              sx={{ backgroundColor: "#F5F5F5" }}
              onChange={(e) =>
                setTask({
                  ...task,
                  status: e.target.value as
                    | "todo"
                    | "in-progress"
                    | "completed",
                })
              }
              displayEmpty
            >
              <MenuItem value="todo">To-Do</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ color: "#7B1984", fontWeight: "bold" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveTask}
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
  );
};

export default TaskFormDialog;
