"use client";

import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Divider } from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from 'next/link';

const Footer = () => {
  const footerLinks = {
    shop: [
      { label: 'All Products', href: '/' },
      { label: 'Indoor Plants', href: '/' },
      { label: 'Outdoor Plants', href: '/' },
      { label: 'Succulents', href: '/' },
      { label: 'Plant Care', href: '/' },
    ],
    account: [
      { label: 'My Account', href: '/profile' },
      { label: 'Order History', href: '/profile' },
      { label: 'Shopping Cart', href: '/cart' },
      { label: 'Wishlist', href: '/profile' },
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Shipping Info', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Plant Care Guide', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, #1B4332 0%, #081C15 100%)',
        color: 'white',
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="xl" sx={{ pt: 10, pb: 6 }}>
        <Grid container spacing={6}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalFloristIcon sx={{ fontSize: 40, mr: 1.5, color: '#95d5b2' }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontFamily: "'Poppins', sans-serif",
                    background: 'linear-gradient(135deg, #95d5b2 0%, #74c69d 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  LeafyLane
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 3,
                  lineHeight: 1.8,
                  fontSize: '0.95rem',
                }}
              >
                Bringing nature to your doorstep. Discover our curated collection of premium plants
                and transform your space into a green paradise.
              </Typography>

              {/* Social Media */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#95d5b2',
                    fontWeight: 600,
                    mb: 1.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[
                    { icon: <FacebookIcon />, href: '#' },
                    { icon: <TwitterIcon />, href: '#' },
                    { icon: <InstagramIcon />, href: '#' },
                    { icon: <GitHubIcon />, href: 'https://github.com/sagar-subedi' },
                  ].map((social, index) => (
                    <IconButton
                      key={index}
                      component="a"
                      href={social.href}
                      target="_blank"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          color: '#95d5b2',
                          backgroundColor: 'rgba(149, 213, 178, 0.1)',
                          borderColor: '#95d5b2',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Shop Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontFamily: "'Poppins', sans-serif",
                color: '#95d5b2',
                fontSize: '1.1rem',
              }}
            >
              Shop
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.shop.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#95d5b2';
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Account Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontFamily: "'Poppins', sans-serif",
                color: '#95d5b2',
                fontSize: '1.1rem',
              }}
            >
              Account
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.account.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#95d5b2';
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontFamily: "'Poppins', sans-serif",
                color: '#95d5b2',
                fontSize: '1.1rem',
              }}
            >
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.support.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#95d5b2';
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={6} sm={12} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontFamily: "'Poppins', sans-serif",
                color: '#95d5b2',
                fontSize: '1.1rem',
              }}
            >
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOnIcon sx={{ fontSize: 20, color: '#95d5b2', mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                  Kathmandu,
                  <br />
                  Nepal
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIcon sx={{ fontSize: 20, color: '#95d5b2' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +977 98********
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ fontSize: 20, color: '#95d5b2' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  hello@leafylane.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Bottom Bar */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} LeafyLane. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Typography
                key={item}
                variant="body2"
                component="a"
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.3s',
                  '&:hover': { color: '#95d5b2' },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
              Made with
            </Typography>
            <FavoriteIcon sx={{ fontSize: 14, color: '#ef4444' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
              by Sagar Subedi
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
