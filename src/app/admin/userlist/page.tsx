"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { isAdmin } from "@/utils/CommonUtils";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { listUsers, deleteUser } from "@/store/slices/userSlice";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

const UserListScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const userList = useSelector((state: any) => state.user.listUsers);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state: any) => state.user);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state: any) => state.user.deleteUser);
  const { success: successDelete, error: userDeleteError } = userDelete;

  useEffect(() => {
    if (userInfo && isAdmin()) {
      dispatch(listUsers() as any);
    } else {
      router.push("/login");
    }
  }, [dispatch, router, successDelete, userInfo]);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleClickOpen = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const confirmDeleteHandler = () => {
    if (deleteId) {
      dispatch(deleteUser(deleteId) as any);
    }
    handleClose();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: '1px solid var(--color-border-light)',
          background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PeopleAltIcon sx={{ fontSize: 32, color: 'white', mr: 2 }} />
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: 'white',
            }}
          >
            User Management
          </Typography>
        </Box>
      </Paper>

      {userDeleteError && <Message variant="danger">{userDeleteError}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid var(--color-border-light)',
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'var(--color-bg-subtle)' }}>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Roles</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow
                      key={user.userId}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'var(--color-bg-subtle)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        #{user.userId.substring(0, 8)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {user.userName}
                      </TableCell>
                      <TableCell sx={{ color: 'var(--color-text-primary)' }}>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${user.email}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                          {user.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {user.roles.map((role: any) => (
                            <Chip
                              key={role.roleName}
                              icon={role.roleName === "ROLE_ADMIN" ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                              label={role.roleName.replace('ROLE_', '')}
                              size="small"
                              color={role.roleName === "ROLE_ADMIN" ? "success" : "default"}
                              variant={role.roleName === "ROLE_ADMIN" ? "filled" : "outlined"}
                              sx={{ fontWeight: 500 }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Edit User">
                            <IconButton
                              component={Link}
                              href={`/admin/user/${user.userId}/edit`}
                              size="small"
                              sx={{
                                color: 'var(--color-primary)',
                                '&:hover': {
                                  backgroundColor: 'rgba(45, 106, 79, 0.08)',
                                },
                              }}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              onClick={() => handleClickOpen(user.userId)}
                              sx={{
                                color: 'var(--color-accent-warning)',
                                '&:hover': {
                                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                                },
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                borderRadius: 3,
                minWidth: 400,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Confirm Delete
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ color: 'var(--color-text-muted)' }}>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderColor: 'var(--color-border-main)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'var(--color-primary)',
                    backgroundColor: 'rgba(45, 106, 79, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteHandler}
                variant="contained"
                sx={{
                  backgroundColor: 'var(--color-accent-warning)',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#b91c1c',
                  },
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default UserListScreen;