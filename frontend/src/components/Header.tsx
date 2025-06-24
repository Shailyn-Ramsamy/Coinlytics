import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SavingsIcon from "@mui/icons-material/Savings";
import { useNavigate, useLocation } from "react-router-dom";

const pages = ["Home", "My Dashboard", "News"];
const settings = ["Logout"];

function Header() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNews = () => {
    navigate("/news");
  };
  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    handleCloseUserMenu();
    navigate("/");
  };

  return (
    <header>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <SavingsIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={handleDashboard}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Coinlytics
            </Typography>
            {!isLoginPage && (
              <>
                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: "block", md: "none" } }}
                  >
                      <MenuItem onClick={handleDashboard}>
                        <Typography sx={{ textAlign: "center" }}>
                          My Dashboard
                        </Typography>
                      </MenuItem>
                      <MenuItem onClick={handleNews}>
                        <Typography sx={{ textAlign: "center" }}>
                          News
                        </Typography>
                      </MenuItem>
                  </Menu>
                </Box>
                <SavingsIcon
                  sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                />
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  onClick={handleDashboard}
                  sx={{
                    mr: 2,
                    display: { xs: "flex", md: "none" },
                    flexGrow: 1,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  {isLoginPage ? "Coinlytics" : ""}
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                    <Button
                      onClick={handleDashboard}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      My Dashboard
                    </Button>
                    <Button
                      onClick={handleNews}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      News
                    </Button>
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={userInfo.name}
                        src={userInfo.picture}
                        imgProps={{
                            referrerPolicy: "no-referrer",
                            crossOrigin: "anonymous",
                            onError: (e) => (e.currentTarget.src = '/default-avatar.png')
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </header>
  );
}

export default Header;
