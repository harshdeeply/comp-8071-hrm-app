import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import EmployeeDashboard from "./EmployeeDashboard";
import ManagerDashboard from "./ManagerDashboard";
import AdminDashboard from "./AdminDashboard";
import ProfilePage from "../profile/Profile";
import ManageTeam from "./ManageTeam";
import Reports from "./Reports";

const drawerWidth = 240;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPage, setSelectedPage] = useState<string>("default");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const navLinks: Record<string, string[]> = {
    Employee: ["My Leave Requests", "Profile"],
    Manager: ["Team Leave Requests", "Manage Team", "Profile"],
    Admin: ["User Management", "Reports", "Profile"],
  };

  const renderContent = () => {
    switch (selectedPage) {
      case "Profile":
        return <ProfilePage />;
      case "My Leave Requests":
        return <EmployeeDashboard />;
      case "Team Leave Requests":
        return <ManagerDashboard />;
      case "Manage Team":
        return <ManageTeam />;
      case "User Management":
        return <AdminDashboard />;
      case "Reports":
        return <Reports />;
      case "default":
      default:
        // Default landing if no nav link is selected yet
        switch (user?.role) {
          case "Employee":
            return <EmployeeDashboard />;
          case "Manager":
            return <ManagerDashboard />;
          case "Admin":
            return <AdminDashboard />;
          default:
            return <Typography>Unauthorized</Typography>;
        }
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          HRM Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navLinks[user?.role as keyof typeof navLinks]?.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => setSelectedPage(text)}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Welcome, {user?.email}
          </Typography>
          <IconButton onClick={handleAvatarClick}>
            <Avatar>{user?.email.charAt(0).toUpperCase()}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>{user?.role}</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}
