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
import TaskFormDialog from "./TaskFormDialog";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useAuthState } from "react-firebase-hooks/auth"; 

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
  const [openDialog, setOpenDialog] = useState(false);


  useEffect(() => {
    if (!editingTask) setOpenEditDialog(false);
  }, [editingTask]);

  const handleOpenDialog=()=> {
    setOpenDialog(true);
  }
  const handleCloseDialog= () =>{
    setOpenDialog(false);
  }
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

  const [expandedSections, setExpandedSections] = useState({
    todo: true,
    "in-progress": true,
    completed: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <>
      {viewMode === "list" ? (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
            overflow: "auto",
            margin: "0 16px",
            width: "auto",
          }}
        >
          <Table
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              border: "none",
            }}
          >
            <TableHead sx={{ borderTop: "1px solid #0000001A" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Task name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Due on</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Task Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Task Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(["todo", "in-progress", "completed"] as const).map((status) => (
                <React.Fragment key={status}>
                  <TableRow
                    onClick={() => toggleSection(status)}
                    sx={{
                      cursor: "pointer",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                      overflow: "hidden",
                      "& td:first-of-type": {
                        borderTopLeftRadius: "12px",
                      },
                      "& td:last-of-type": {
                        borderTopRightRadius: "12px",
                      },
                      borderTop: "2px solid transparent",
                    }}
                  >
                    <TableCell
                      colSpan={5}
                      sx={{
                        backgroundColor:
                          status === "todo"
                            ? "#DD85D8"
                            : status === "in-progress"
                            ? "#89CFF0"
                            : "#98FB98",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        padding: "12px 16px",
                        position: "relative",
                      }}
                    >
                      {(status === "todo"
                        ? "Todo"
                        : status === "in-progress"
                        ? "In-Progress"
                        : "Completed") +
                        ` (${
                          tasks.filter((task) => task.status === status).length
                        })`}
                      <IconButton
                        sx={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "inherit",
                        }}
                      >
                        {expandedSections[status] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {expandedSections[status] &&
                    (tasks.filter((task) => task.status === status).length >
                    0 ? (
                      tasks
                        .filter((task) => task.status === status)
                        .map((task, index, taskArray) => (
                          <TableRow
                            key={task.id}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#fafafa" : "white",
                              "&:hover": { backgroundColor: "#f0f0f0" },
                              ...(index === taskArray.length - 1 && {
                                "& td:first-of-type": {
                                  borderBottomLeftRadius: "12px",
                                },
                                "& td:last-of-type": {
                                  borderBottomRightRadius: "12px",
                                },
                              }),
                            }}
                          >
                            <TableCell>{task.title}</TableCell>
                            <TableCell>
                              {task.dueDate || "No due date"}
                            </TableCell>
                            <TableCell>
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
                              <IconButton
                                onClick={(e) => handleMenuOpen(e, task)}
                              >
                                <MoreHorizIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <>
                        {status === "todo" && (
                          <>
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              sx={{
                                textAlign: "left",
                                padding: "12px 12px 12px 60px",
                              }}
                            >
                              <Button
                                variant="text"
                                sx={{
                                  color: "black",
                                  backgroundColor: "transparent",
                                  fontWeight: 700,
                                }}
                                onClick={handleOpenDialog}
                              >
                                + ADD TASK
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TaskFormDialog open={openDialog} onClose={() => setOpenDialog(false)} userId={userId} fetchTasks={fetchTasks}/>
                        </>
                        )}
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            sx={{
                              textAlign: "center",
                              padding: "60px 12px",
                              borderBottomLeftRadius: "12px",
                              borderBottomRightRadius: "12px",
                            }}
                          >
                            No tasks in{" "}
                            {status === "todo"
                              ? "To-Do"
                              : status === "in-progress"
                              ? "Progress"
                              : "Completed"}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  <br />
                </React.Fragment>
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
                      backgroundColor: "#58575112",
                      borderRadius: 2,
                      boxShadow: 3,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Status Heading (Aligned to the Top Left) */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "500",
                        backgroundColor:
                          status === "todo"
                            ? "#DD85D8"
                            : status === "in-progress"
                            ? "#89CFF0"
                            : "#98FB98",
                        fontSize: "14px",
                        padding: "4px 10px",
                        width: "fit-content",
                        borderRadius: "4px",
                        mb: 3,
                      }}
                    >
                      {status === "todo"
                        ? "TO-DO"
                        : status === "in-progress"
                        ? "IN-PROGRESS"
                        : "COMPLETED"}
                    </Typography>

                    {/* Tasks Container with Centered "No Tasks" Message */}
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent:
                          tasks.filter((task) => task.status === status)
                            .length === 0
                            ? "center"
                            : "flex-start",
                        padding: "0 16px"
                      }}
                    >
                      {tasks.filter((task) => task.status === status).length ===
                      0 ? (
                        <Typography
                          variant="body2"
                          sx={{ textAlign: "center", color: "gray" }}
                        >
                          No tasks in {status.replace("-", " ")}
                        </Typography>
                      ) : (
                        tasks
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
                                    padding: "8px 16px",
                                    marginBottom: 2,
                                    backgroundColor: "white",
                                    boxShadow: 2,
                                    width: "100%",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: "700",
                                        fontSize: "16px",
                                      }}
                                    >
                                      {task.title}
                                    </Typography>
                                    <IconButton
                                      onClick={(e) => handleMenuOpen(e, task)}
                                    >
                                      <MoreHorizIcon />
                                    </IconButton>
                                  </Box>

                                  {/* Footer with Category and Due Date */}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginTop: 5,
                                      fontSize: "10px",
                                      color: "gray",
                                    }}
                                  >
                                    <Typography>{task.category}</Typography>
                                    <Typography>
                                      {task.dueDate
                                        ? new Date(
                                            task.dueDate
                                          ).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })
                                        : "-"}
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </Draggable>
                          ))
                      )}
                      {provided.placeholder}
                    </Box>
                  </Paper>
                )}
              </Droppable>
            ))}
          </Box>
        </DragDropContext>
      )}
      <TaskFormDialog open={openDialog} onClose={handleCloseDialog} userId={userId} fetchTasks={fetchTasks}/>
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
