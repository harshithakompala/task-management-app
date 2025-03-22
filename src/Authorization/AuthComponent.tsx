import React, { useEffect, useState } from "react";
import { auth, googleProvider, db } from "./firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Button, Container, Typography, Box, Paper, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

const AuthComponent = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await saveUserToFirestore(currentUser);
        navigate("/tasks");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      await saveUserToFirestore(result.user);
      setError(null);
      navigate("/tasks");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/auth");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const saveUserToFirestore = async (user: any) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        textAlign="center"
      >
        {/* Branding */}
        <Typography variant="h4" fontWeight="bold" color="purple" sx={{ mb: 1 }}>
          TaskBuddy
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, px: 2 }}>
          Streamline your workflow and track progress effortlessly with our all-in-one task management app.
        </Typography>

        {/* Google Sign-in Button */}
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 300,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <Button
            onClick={user ? handleSignOut : handleSignIn}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "bold",
              py: 1.5,
              borderRadius: "50px",
              "&:hover": { backgroundColor: "#222" },
            }}
          >
            <GoogleIcon sx={{ mr: 1 }} />
            {user ? "Sign Out" : "Continue with Google"}
          </Button>
        </Paper>

        {/* Error Message */}
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Box>
    </Container>
  );
};

export default AuthComponent;
