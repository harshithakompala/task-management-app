import React from "react";
import { AppBar, Toolbar, Typography, Button, Avatar, Box, useMediaQuery } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

interface HeaderProps {
  user: any;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/auth"); // Redirect to sign-in page
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "white", height: 60, boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Application Name */} 
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#2F2F2F", fontSize: 24, lineHeight: "140%", letterSpacing: 0 }}>
        <AssignmentOutlinedIcon fontSize="large" sx={{ color: "#2F2F2F", transform: "translateY(8px)" }} />TaskBuddy
        </Typography>

        {/* User Profile & Sign Out */}
        {user && (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexDirection: "column", marginTop: isMobile ? "4px" : "48px" }}>
        <Box sx={{ display: "flex", alignItems: "center", maxWidth: "100%", width: 120, gap: 1, justifyContent: isMobile ? "flex-end" : "flex-start" }}>
          <Avatar src={user.photoURL} alt={user.displayName.split(" ")[0]} />
          {!isMobile && (
            <Typography variant="body1" sx={{ fontWeight: 700, color: "#00000099", fontSize: 16, letterSpacing: "140%" }}>
              {user.displayName.split(" ")[0]}
            </Typography>
          )}
        </Box>
        {!isMobile && (
          <Button sx={{ borderRadius: 12, border: "1px solid #7B198426", color: "#000000", padding: "8px 32px", textTransform: "none", fontWeight: 600, fontSize: 12, lineHeight: "140%", width: 120 }} onClick={handleSignOut}>
            <LogoutIcon fontSize="small"/>Logout
          </Button>
        )}
      </Box>
    )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
