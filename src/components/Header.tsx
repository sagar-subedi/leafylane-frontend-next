"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { isAdmin } from "@/utils/CommonUtils";
import { logout } from "@/store/slices/userSlice";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Badge,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const cart = useSelector((state: any) => state.cart);
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setUserInfo(user.userInfo);
  }, [user.userInfo]);

  useEffect(() => {
    if (cart?.cartItems) {
      const count = cart.cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartItemsCount(count);
    }
  }, [cart]);

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
    dispatch(logout() as any);
    router.push("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(45, 106, 79, 0.15)',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar className="flex justify-between py-2">
          {/* Brand */}
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Box className="flex items-center gap-2 cursor-pointer group">
              <LocalFloristIcon
                sx={{
                  fontSize: 32,
                  color: 'white',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(15deg)',
                  }
                }}
              />
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.5px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    letterSpacing: '0px',
                  }
                }}
              >
                LeafyLane
              </Typography>
            </Box>
          </Link>

          {/* Navigation */}
          <Box className="flex items-center gap-2">
            {/* Cart */}
            <Link href="/cart" passHref style={{ textDecoration: 'none' }}>
              <IconButton
                sx={{
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <Badge
                  badgeContent={cartItemsCount}
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#D8572A',
                      color: 'white',
                      fontWeight: 600,
                    }
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
                <Typography
                  variant="body1"
                  className="ml-2 hidden sm:inline"
                  sx={{ fontWeight: 500 }}
                >
                  Cart
                </Typography>
              </IconButton>
            </Link>

            {userInfo ? (
              <>
                {/* User Dropdown */}
                <IconButton
                  sx={{
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.05)',
                    }
                  }}
                  onClick={handleMenuOpen}
                  aria-controls="user-menu"
                  aria-haspopup="true"
                >
                  <AccountCircle />
                </IconButton>

                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                      minWidth: 180,
                    }
                  }}
                >
                  <MenuItem
                    onClick={handleMenuClose}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(45, 106, 79, 0.08)',
                        color: '#2D6A4F',
                      },
                      padding: '12px 20px',
                      borderRadius: '8px',
                      margin: '4px 8px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Link href="/userProfile" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Profile
                      </Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={logoutHandler}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(216, 87, 42, 0.08)',
                        color: '#D8572A',
                      },
                      padding: '12px 20px',
                      borderRadius: '8px',
                      margin: '4px 8px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>

                {/* Admin Dropdown */}
                {isAdmin() && (
                  <>
                    <IconButton
                      sx={{
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'scale(1.05)',
                        }
                      }}
                      onClick={handleAdminMenuOpen}
                      aria-controls="admin-menu"
                      aria-haspopup="true"
                    >
                      <MenuIcon />
                    </IconButton>

                    <Menu
                      id="admin-menu"
                      anchorEl={adminAnchorEl}
                      open={Boolean(adminAnchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          borderRadius: 2,
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                          minWidth: 180,
                        }
                      }}
                    >
                      <MenuItem
                        onClick={handleMenuClose}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(45, 106, 79, 0.08)',
                            color: '#2D6A4F',
                          },
                          padding: '12px 20px',
                          borderRadius: '8px',
                          margin: '4px 8px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Link href="/admin/userlist" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Users
                          </Typography>
                        </Link>
                      </MenuItem>
                      <MenuItem
                        onClick={handleMenuClose}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(45, 106, 79, 0.08)',
                            color: '#2D6A4F',
                          },
                          padding: '12px 20px',
                          borderRadius: '8px',
                          margin: '4px 8px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Link href="/admin/productlist" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Products
                          </Typography>
                        </Link>
                      </MenuItem>
                      <MenuItem
                        onClick={handleMenuClose}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(45, 106, 79, 0.08)',
                            color: '#2D6A4F',
                          },
                          padding: '12px 20px',
                          borderRadius: '8px',
                          margin: '4px 8px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Link href="/admin/orderlist" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Orders
                          </Typography>
                        </Link>
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </>
            ) : (
              <Link href="/login" passHref style={{ textDecoration: 'none' }}>
                <IconButton
                  sx={{
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  <AccountCircle />
                  <Typography
                    variant="body1"
                    className="ml-2 hidden sm:inline"
                    sx={{ fontWeight: 500 }}
                  >
                    Sign In
                  </Typography>
                </IconButton>
              </Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;