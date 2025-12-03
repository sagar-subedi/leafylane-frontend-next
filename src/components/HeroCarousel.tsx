"use client";

import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const HeroCarousel = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                margin: 0,
                marginTop: '-1px',
                '& .carousel .slide': {
                    background: 'transparent',
                },
                '& .carousel .control-dots': {
                    bottom: '20px',
                    '& .dot': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        boxShadow: 'none',
                        '&.selected': {
                            backgroundColor: 'white',
                        },
                    },
                },
                '& .carousel .control-arrow': {
                    opacity: 0.7,
                    '&:hover': {
                        opacity: 1,
                    },
                },
            }}
        >
            <Carousel
                autoPlay
                infiniteLoop
                interval={5000}
                showThumbs={false}
                showStatus={false}
                transitionTime={600}
            >
                {/* Slide 1: Welcome */}
                <Box
                    sx={{
                        position: 'relative',
                        py: { xs: 8, md: 10 },
                        minHeight: { xs: '550px', md: '550px' },
                        height: { xs: '550px', md: '550px' },
                        display: 'flex',
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 50%, #52b788 100%)',
                    }}
                >
                    <Container maxWidth={false} sx={{ px: { xs: 3, md: 8 } }}>
                        <Box
                            sx={{
                                textAlign: 'center',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            <Box className="flex justify-center mb-4">
                                <LocalFloristIcon
                                    sx={{
                                        fontSize: { xs: 60, md: 80 },
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 800,
                                    color: 'white',
                                    mb: 2,
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                Welcome to LeafyLane
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 400,
                                    color: 'rgba(255, 255, 255, 0.95)',
                                    mb: 4,
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                                    lineHeight: 1.6,
                                }}
                            >
                                Discover beautiful plants that bring life to your space
                            </Typography>

                            <Link href="/cart" passHref style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        backgroundColor: 'white',
                                        color: '#2D6A4F',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                                        px: { xs: 3, md: 4 },
                                        py: { xs: 1.5, md: 2 },
                                        borderRadius: '50px',
                                        textTransform: 'none',
                                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: '#F8FBF9',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                                        },
                                    }}
                                >
                                    Shop Now
                                </Button>
                            </Link>
                        </Box>
                    </Container>

                    {/* Decorative Elements */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            filter: 'blur(40px)',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -30,
                            left: -30,
                            width: 150,
                            height: 150,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            filter: 'blur(40px)',
                        }}
                    />
                </Box>

                {/* Slide 2: Architecture & Tech Stack */}
                <Box
                    sx={{
                        position: 'relative',
                        py: { xs: 6, md: 7 },
                        minHeight: { xs: '550px', md: '550px' },
                        height: { xs: '550px', md: '550px' },
                        display: 'flex',
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 50%, #52b788 100%)',
                    }}
                >
                    <Container maxWidth={false} sx={{ px: { xs: 3, md: 8 } }}>
                        <Box
                            sx={{
                                textAlign: 'center',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            <Box className="flex justify-center mb-2">
                                <CodeIcon
                                    sx={{
                                        fontSize: { xs: 40, md: 50 },
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 800,
                                    color: 'white',
                                    mb: 1,
                                    fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' },
                                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                Enterprise-Grade Architecture
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 400,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    mb: 2.5,
                                    maxWidth: '700px',
                                    mx: 'auto',
                                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
                                }}
                            >
                                Distributed microservices with cloud-native deployment
                            </Typography>

                            {/* Architecture Grid */}
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                    gap: 2,
                                    px: { xs: 2, md: 0 },
                                }}
                            >
                                {/* Microservices */}
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        p: 2,
                                        textAlign: 'left',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 700,
                                            mb: 2,
                                            fontSize: { xs: '0.95rem', md: '1.1rem' },
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <span style={{ fontSize: '1.3rem' }}>🏗️</span>
                                        Microservices
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {[
                                            { name: 'Account', icon: '👤' },
                                            { name: 'Catalogue', icon: '📦' },
                                            { name: 'Order', icon: '🛒' },
                                            { name: 'Payment', icon: '💳' },
                                            { name: 'Address', icon: '📍' },
                                            { name: 'Gateway', icon: '🌐' },
                                        ].map((service) => (
                                            <Box
                                                key={service.name}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.75,
                                                    px: 1.5,
                                                    py: 0.75,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                    borderRadius: '8px',
                                                    fontSize: { xs: '0.75rem', md: '0.85rem' },
                                                    fontWeight: 600,
                                                    color: 'white',
                                                }}
                                            >
                                                <span style={{ fontSize: '0.9rem' }}>{service.icon}</span>
                                                {service.name}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Backend */}
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        p: 2,
                                        textAlign: 'left',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 700,
                                            mb: 2,
                                            fontSize: { xs: '0.95rem', md: '1.1rem' },
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <span style={{ fontSize: '1.3rem' }}>⚙️</span>
                                        Backend Stack
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {[
                                            { name: 'Spring Boot', icon: '🍃' },
                                            { name: 'Spring Cloud', icon: '☁️' },
                                            { name: 'Eureka', icon: '🔍' },
                                            { name: 'Feign', icon: '🔗' },
                                            { name: 'MySQL', icon: '🐬' },
                                        ].map((tech) => (
                                            <Box
                                                key={tech.name}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.75,
                                                    px: 1.5,
                                                    py: 0.75,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                    borderRadius: '8px',
                                                    fontSize: { xs: '0.75rem', md: '0.85rem' },
                                                    fontWeight: 600,
                                                    color: 'white',
                                                }}
                                            >
                                                <span style={{ fontSize: '1rem' }}>{tech.icon}</span>
                                                {tech.name}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Frontend */}
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        p: 2,
                                        textAlign: 'left',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 700,
                                            mb: 2,
                                            fontSize: { xs: '0.95rem', md: '1.1rem' },
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <span style={{ fontSize: '1.3rem' }}>💻</span>
                                        Frontend Stack
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {[
                                            { name: 'Next.js', icon: '▲' },
                                            { name: 'React', icon: '⚛️' },
                                            { name: 'Redux', icon: '🔄' },
                                            { name: 'TypeScript', icon: '📘' },
                                            { name: 'Material UI', icon: '🎨' },
                                        ].map((tech) => (
                                            <Box
                                                key={tech.name}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.75,
                                                    px: 1.5,
                                                    py: 0.75,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                    borderRadius: '8px',
                                                    fontSize: { xs: '0.75rem', md: '0.85rem' },
                                                    fontWeight: 600,
                                                    color: 'white',
                                                }}
                                            >
                                                <span style={{ fontSize: '1rem' }}>{tech.icon}</span>
                                                {tech.name}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* DevOps & Security */}
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        p: 2,
                                        textAlign: 'left',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 700,
                                            mb: 2,
                                            fontSize: { xs: '0.95rem', md: '1.1rem' },
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <span style={{ fontSize: '1.3rem' }}>🔐</span>
                                        DevOps & Security
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {[
                                            { name: 'Kubernetes', icon: '☸️' },
                                            { name: 'Docker', icon: '🐳' },
                                            { name: 'OAuth2 + JWT', icon: '🔑' },
                                            { name: 'Prometheus', icon: '📊' },
                                            { name: 'Grafana', icon: '📈' },
                                            { name: 'Stripe', icon: '💳' },
                                        ].map((tech) => (
                                            <Box
                                                key={tech.name}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.75,
                                                    px: 1.5,
                                                    py: 0.75,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                    borderRadius: '8px',
                                                    fontSize: { xs: '0.75rem', md: '0.85rem' },
                                                    fontWeight: 600,
                                                    color: 'white',
                                                }}
                                            >
                                                <span style={{ fontSize: '1rem' }}>{tech.icon}</span>
                                                {tech.name}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Container>

                    {/* Decorative Elements */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            filter: 'blur(40px)',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -30,
                            left: -30,
                            width: 150,
                            height: 150,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            filter: 'blur(40px)',
                        }}
                    />
                </Box>
            </Carousel>
        </Box>
    );
};

export default HeroCarousel;
