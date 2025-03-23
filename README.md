# TaskBuddy

## Project Overview
TaskBuddy is a responsive task management application built with React and Firebase. It enables users to manage their tasks efficiently with features like authentication, task categorization, drag-and-drop functionality, batch actions. The application supports both list and board views, providing a seamless user experience across different screen sizes.

Here I have provided the Deployment URL: https://tasks-90d23.web.app
---

## Features Implemented

### **Authentication**
- User sign-up and login using Firebase Authentication.
- Secure session management.

### **Task Management**
- Create, edit, delete, and update tasks.
- Categorization into **To-Do, In Progress, and Completed** sections.
- Drag-and-drop functionality for easy status updates.

### **Task Organization**
- **List View**: Displays tasks in a structured list format.
- **Board View**: Visual representation of tasks in categorized columns.
- **Filtering & Sorting**: Users can filter tasks by category or due date.
- **Batch Actions**: Mark multiple tasks as completed or delete them in bulk.

### **Additional Enhancements**
- Due date selection with a dropdown-style calendar.
- Mobile and desktop responsiveness using Material UI (MUI).

---

## How to Run the Project

### **Prerequisites**
Ensure you have the following installed:
- **Node.js** (latest LTS version recommended)
- **Git**
- **Firebase CLI** (for Firebase setup)

### **Setup Instructions**
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repository/taskbuddy.git
   cd taskbuddy
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore Database & Authentication.
   - Copy Firebase config and create a `.env` file:
     ```env
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     ```
4. **Start the development server**
   ```bash
   npm start
   ```
5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Challenges Faced & Solutions Implemented

### 1. **Task Drag-and-Drop Implementation**
   **Challenge:** Ensuring smooth drag-and-drop behavior while maintaining real-time updates.
   **Solution:** Used `react-beautiful-dnd` to manage drag-and-drop and synchronized data updates with Firestore.

### 2. **State Management for Large-Scale Tasks**
   **Challenge:** Handling task updates efficiently without excessive re-renders.
   **Solution:** Integrated React Query for optimized data fetching and caching.

### 3. **Due Date Picker UX Issues**
   **Challenge:** Centering the due date label and adding a dropdown calendar icon.
   **Solution:** Styled the `MobileDatePicker` component with `InputAdornment` to include a dropdown icon and ensured text alignment.

### 4. **Ensuring Mobile & Desktop Responsiveness**
   **Challenge:** Maintaining a consistent UI across various devices.
   **Solution:** Used Material UI's responsive design utilities and CSS flexbox/grid for adaptive layouts.

---

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes:
   ```bash
   git add .
   git commit -m "Implemented new feature"
   ```
4. Push and create a Pull Request:
   ```bash
   git push origin feature-name
   ```

---

## License
This project is licensed under the MIT License. Feel free to modify and use it for your own projects.

---

## Contact
For any queries or contributions, reach out via GitHub Issues or email: kompalaharshitha@gmail.com.

