import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Task {
  id: string;
  title: string;
  description: string;
  category?: string;
  dueDate?: string;
  status: "todo" | "in-progress" | "completed";
}

interface TaskListProps {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  userId: string;
  handleDeleteTask: (taskId: string) => Promise<void>;
  viewMode: "list" | "board";
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  fetchTasks,
  userId,
  handleDeleteTask,
  viewMode,
}) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!editingTask) setOpenEditDialog(false);
  }, [editingTask]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    task: Task
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTask(null);
  };

  const handleEditClick = () => {
    if (!selectedTask) return;
    setEditingTask(selectedTask);
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleDeleteTaskClick = async () => {
    if (!selectedTask) return;
    await handleDeleteTask(selectedTask.id);
    handleMenuClose();
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const taskRef = doc(db, "users", userId, "tasks", taskId);
      await updateDoc(taskRef, { status: newStatus });
      await fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    try {
      const taskRef = doc(db, "users", userId, "tasks", editingTask.id);
      await updateDoc(taskRef, {
        title: editingTask.title,
        description: editingTask.description,
        category: editingTask.category,
        dueDate: editingTask.dueDate || null,
        status: editingTask.status,
      });
      setEditingTask(null);
      setOpenEditDialog(false);
      await fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    await handleStatusChange(taskId, newStatus);
    await fetchTasks();
  };

  return (
    <>
      {viewMode === "list" ? (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 4,
            overflow: "auto",
            margin: "0 16px",
            width: "auto",
          }}
        >
          <Table
            sx={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 12px",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                  }}
                >
                  Task name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                  }}
                >
                  Due on
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                  }}
                >
                  Task Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                  }}
                >
                  Task Category
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {["todo", "in-progress", "completed"].map((status) => (
                <>
                  {/* Status Header Row */}
                  <React.Fragment key={status}>
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{
                          backgroundColor:
                            status === "todo"
                              ? "#DD85D8"
                              : status === "in-progress"
                              ? "#89CFF0"
                              : "#98FB98",
                          fontWeight: "bold",
                          fontSize: { xs: "1rem", md: "1.1rem" },
                          padding: { xs: "8px", md: "12px 16px" },
                        }}
                      >
                        {status === "todo"
                          ? "To-Do"
                          : status === "in-progress"
                          ? "In Progress"
                          : "Completed"}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>

                  {/* Task Rows */}
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <TableRow
                        key={task.id}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "#fafafa" : "white",
                          "&:hover": { backgroundColor: "#f0f0f0" },
                        }}
                      >
                        <TableCell
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {task.title}
                        </TableCell>
                        <TableCell
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {task.description}
                        </TableCell>
                        <TableCell
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {task.dueDate || "No due date"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {status === "todo"
                            ? "To-Do"
                            : status === "in-progress"
                            ? "In Progress"
                            : "Completed"}
                        </TableCell>
                        <TableCell>
                          {task.category || "Uncategorized"}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={(e) => handleMenuOpen(e, task)}>
                            <MoreHorizIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}
          >
            {["todo", "in-progress", "completed"].map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      padding: 2,
                      width: 320,
                      minHeight: 450,
                      backgroundColor:
                        status === "todo"
                          ? "#DD85D8"
                          : status === "in-progress"
                          ? "#89CFF0"
                          : "#98FB98",
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      textAlign="center"
                      sx={{ fontWeight: "bold" }}
                    >
                      {status === "todo"
                        ? "To-Do"
                        : status === "in-progress"
                        ? "In Progress"
                        : "Completed"}
                    </Typography>
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                border: "1px solid gray",
                                borderRadius: 2,
                                padding: 2,
                                marginBottom: 2,
                                backgroundColor: "white",
                                boxShadow: 2,
                              }}
                            >
                              <Typography variant="h6">{task.title}</Typography>
                              <Typography variant="body2">
                                {task.description}
                              </Typography>
                              <Typography variant="caption">
                                Due: {task.dueDate || "No due date"}
                              </Typography>
                              <IconButton
                                onClick={(e) => handleMenuOpen(e, task)}
                              >
                                <MoreHorizIcon />
                              </IconButton>
                            </Box>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Paper>
                )}
              </Droppable>
            ))}
          </Box>
        </DragDropContext>
      )}

      {/* More Options Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteTaskClick}>Delete</MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editingTask?.title || ""}
            onChange={(e) =>
              setEditingTask((prev) =>
                prev ? { ...prev, title: e.target.value } : prev
              )
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editingTask?.description || ""}
            onChange={(e) =>
              setEditingTask((prev) =>
                prev ? { ...prev, description: e.target.value } : prev
              )
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={editingTask?.dueDate || ""}
            onChange={(e) =>
              setEditingTask((prev) =>
                prev ? { ...prev, dueDate: e.target.value } : prev
              )
            }
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <Select
            fullWidth
            value={editingTask?.category || "work"}
            onChange={(e) =>
              setEditingTask((prev) =>
                prev ? { ...prev, category: e.target.value } : prev
              )
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="personel">Personel</MenuItem>
          </Select>
          <Select
            fullWidth
            value={editingTask?.status || "todo"}
            onChange={(e) =>
              setEditingTask((prev) =>
                prev
                  ? { ...prev, status: e.target.value as Task["status"] }
                  : prev
              )
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="todo">To-Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateTask} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskList;
