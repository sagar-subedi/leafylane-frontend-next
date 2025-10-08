"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { isAdmin } from "@/utils/CommonUtils";
import { logout } from "@/store/slices/userSlice";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);

  React.useEffect(() => {
    setUserInfo(user.userInfo);
  }, [user.userInfo]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAdminAnchorEl(null);
  };

  const logoutHandler = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'green', // Set a custom color
      }}
      className= ""
    >
      <Toolbar className="flex justify-between">
        {/* Brand */}
        <Link href="/" passHref>
          <Typography
            variant="h6"
            component="div"
            className="cursor-pointer font-bold text-xl"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            LeafyLane
          </Typography>
        </Link>

        {/* Navigation */}
        <Box className="flex items-center space-x-4">
          <Link href="/cart" passHref>
            <IconButton color="inherit">
              <ShoppingCartIcon />
              <Typography variant="body1" className="ml-1 hidden sm:inline">
                Cart
              </Typography>
            </IconButton>
          </Link>

          {userInfo ? (
            <>
              {/* User Dropdown */}
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                aria-controls="user-menu"
                aria-haspopup="true"
              >
                <AccountCircle />
              </IconButton>
              {/* User Dropdown */}
<Menu
  id="user-menu"
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
>
  <MenuItem
    onClick={handleMenuClose}
    sx={{
      '&:hover': {
        backgroundColor: 'rgba(0, 128, 0, 0.1)', // Light green hover effect
        color: 'green', // Text color on hover
      },
      padding: '10px 20px',
      borderRadius: '4px',
    }}
  >
    <Link href="/userProfile" passHref>
      <Typography variant="body1" className="cursor-pointer">
        Profile
      </Typography>
    </Link>
  </MenuItem>
  <MenuItem
    onClick={logoutHandler}
    sx={{
      '&:hover': {
        backgroundColor: 'rgba(255, 0, 0, 0.1)', // Light red hover effect for logout
        color: 'red', // Text color on hover
      },
      padding: '10px 20px',
      borderRadius: '4px',
    }}
  >
    Logout
  </MenuItem>
</Menu>

              {/* Admin Dropdown */}
              {isAdmin() && (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleAdminMenuOpen}
                    aria-controls="admin-menu"
                    aria-haspopup="true"
                  >
                    <MenuIcon />
                  </IconButton>
                  {/* Admin Dropdown */}
<Menu
  id="admin-menu"
  anchorEl={adminAnchorEl}
  open={Boolean(adminAnchorEl)}
  onClose={handleMenuClose}
>
  <MenuItem
    onClick={handleMenuClose}
    sx={{
      '&:hover': {
        backgroundColor: 'rgba(0, 128, 0, 0.1)',
        color: 'green',
      },
      padding: '10px 20px',
      borderRadius: '4px',
    }}
  >
    <Link href="/admin/userlist" passHref>
      <Typography variant="body1" className="cursor-pointer">
        Users
      </Typography>
    </Link>
  </MenuItem>
  <MenuItem
    onClick={handleMenuClose}
    sx={{
      '&:hover': {
        backgroundColor: 'rgba(0, 128, 0, 0.1)',
        color: 'green',
      },
      padding: '10px 20px',
      borderRadius: '4px',
    }}
  >
    <Link href="/admin/productlist" passHref>
      <Typography variant="body1" className="cursor-pointer">
        Products
      </Typography>
    </Link>
  </MenuItem>
  <MenuItem
    onClick={handleMenuClose}
    sx={{
      '&:hover': {
        backgroundColor: 'rgba(0, 128, 0, 0.1)',
        color: 'green',
      },
      padding: '10px 20px',
      borderRadius: '4px',
    }}
  >
    <Link href="/admin/orderlist" passHref>
      <Typography variant="body1" className="cursor-pointer">
        Orders
      </Typography>
    </Link>
  </MenuItem>
</Menu>
                </>
              )}
            </>
          ) : (
            <Link href="/login" passHref>
              <IconButton color="inherit">
                <AccountCircle />
                <Typography variant="body1" className="ml-1 hidden sm:inline">
                  Sign In
                </Typography>
              </IconButton>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;