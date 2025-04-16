import * as React from "react";
import { Grid, TextField, Button, Box, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../../../Redux/Auth/Action";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

export default function LoginUserForm({ handleNext }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const { auth } = useSelector((store) => store);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [resetMessage, setResetMessage] = useState({ type: "", message: "" });
  
  const handleCloseSnakbar = () => setOpenSnackBar(false);

  useEffect(() => {
    if (auth.user?.jwt) {
      setIsLoading(false);
      setOpenSnackBar(true);
      
      const timer = setTimeout(() => {
        handleCloseSnakbar();
        const redirectPath = auth.user.role === "ADMIN" ? '/admin' : '/';
        navigate(redirectPath);
        
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 100);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    if (auth.error) {
      setIsLoading(false);
      setOpenSnackBar(true);
    }
  }, [auth.user, auth.error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    
    const userData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    
    try {
      await dispatch(login(userData));
    } catch (error) {
      setIsLoading(false);
      setOpenSnackBar(true);
    }
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setEmail("");
    setResetMessage({ type: "", message: "" });
  };

  const handleForgotPasswordSubmit = async () => {
    if (!email) {
      setResetMessage({ type: "error", message: "Please enter your email address" });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password-request`, { email });
      setResetMessage({ type: "success", message: "Password reset link has been sent to your email" });
      setIsLoading(false);
      
      // Close the dialog after 3 seconds on success
      setTimeout(() => {
        handleForgotPasswordClose();
      }, 3000);
    } catch (error) {
      setResetMessage({ 
        type: "error", 
        message: error.response?.data?.message || "Failed to send reset link. Please try again." 
      });
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="shadow-lg p-5 rounded-md">
        <form className="w-full" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="email"
                name="email"
                label="Email"
                fullWidth
                autoComplete="email"
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="password"
                name="password"
                label="Password"
                fullWidth
                autoComplete="current-password"
                type="password"
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                className="bg-[#9155FD] w-full"
                type="submit"
                variant="contained"
                size="large"
                sx={{padding:".8rem 0"}}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
            </Grid>
          </Grid>
        </form>
        <div className="flex justify-center flex-col items-center">
          <div className="py-3 flex items-center">
            <p className="m-0 p-0">don't have account ?</p>
            <Button 
              onClick={() => navigate("/register")} 
              className="ml-5" 
              size="small"
              disabled={isLoading}
            >
              Register
            </Button>
          </div>
          <Button
            onClick={handleForgotPasswordOpen}
            size="small"
            sx={{ mt: 1 }}
            disabled={isLoading}
          >
            Forgot Password?
          </Button>
        </div>
        
        {/* Forgot Password Dialog */}
        <Dialog open={forgotPasswordOpen} onClose={handleForgotPasswordClose}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="reset-email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {resetMessage.message && (
              <Alert severity={resetMessage.type} sx={{ mt: 2 }}>
                {resetMessage.message}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleForgotPasswordClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleForgotPasswordSubmit} 
              variant="contained" 
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Send Reset Link"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={openSnackBar} 
          autoHideDuration={6000} 
          onClose={handleCloseSnakbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnakbar} 
            severity={auth.error ? "error" : "success"} 
            sx={{ width: '100%' }}
            elevation={6}
            variant="filled"
          >
            {auth.error ? auth.error : auth.user ? "Login Successful" : ""}
          </Alert>
        </Snackbar>
      </div>
    </React.Fragment>
  );
}
