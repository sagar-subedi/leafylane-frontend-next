"use client"
import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { isAdmin } from '@/utils/CommonUtils';
import { logout } from '@/store/slices/userSlice';

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState(null); // Local state for userInfo

  useEffect(() => {
    // Set userInfo after the component has mounted
    setUserInfo(user.userInfo);
  }, [user.userInfo]);


  const logoutHandler = () => {
    dispatch(logout());
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <header>
      <Navbar
        style={{
          background: 'linear-gradient(142deg, rgba(0, 128, 0, 1) 0%, rgba(34, 139, 34, 1) 68%, rgba(152, 251, 152, 1) 100%)', // Earthy green gradient
          border: '0',
          color: '#ffffff',
        }}
        className="navbar navbar-expand-lg navbar-dark"
        collapseOnSelect
      >
        <Container>
          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand className="leafylane-brand" style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>LeafyLane</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="navbar-nav ml-auto">
              <Link href="/cart" className="nav-link">
                <i className="p-1 fas fa-shopping-cart"></i>Cart
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.userName} id="username">
                  <Link href="/userProfile" className="dropdown-item">
                    Profile
                  </Link>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link href="/login" className="nav-link">
                  <i className="p-1 fas fa-user"></i>Sign In
                </Link>
              )}
              {userInfo && isAdmin() && (
                <NavDropdown title="Admin" id="adminmenu">
                  <Link href="/admin/userlist" className="dropdown-item">
                    Users
                  </Link>
                  <Link href="/admin/productlist" className="dropdown-item">
                    Products
                  </Link>
                  <Link href="/admin/orderlist" className="dropdown-item">
                    Orders
                  </Link>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
