import React from 'react';
import { Box, Container, Typography, Paper, Chip } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HubIcon from '@mui/icons-material/Hub';

const TechStackSection = () => {
    return (
        <Box sx={{ py: 8, backgroundColor: 'var(--color-bg-subtle)' }}>
            <Container maxWidth="xl">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            mb: 2,
                        }}
                    >
                        Built for Scale & Performance
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'var(--color-text-muted)',
                            maxWidth: '800px',
                            mx: 'auto',
                            fontWeight: 400,
                        }}
                    >
                        A modern, cloud-native distributed application leveraging microservices architecture for robustness and scalability.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    {/* Architecture Overview */}
                    <Box sx={{ flex: 1 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                border: '1px solid var(--color-border-light)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 'var(--shadow-md)',
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <HubIcon sx={{ fontSize: 40, color: 'var(--color-primary)', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                                    Microservice Architecture
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ color: 'var(--color-text-muted)', mb: 3, lineHeight: 1.7 }}>
                                The application is decomposed into independent, domain-specific services to ensure loose coupling and high maintainability.
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                {[
                                    { name: 'Account Service', desc: 'Auth & User Management' },
                                    { name: 'Catalogue Service', desc: 'Product & Inventory' },
                                    { name: 'Order Service', desc: 'Order Processing' },
                                    { name: 'Payment Service', desc: 'Stripe Integration' },
                                    { name: 'Address Service', desc: 'Location Management' },
                                    { name: 'Service Registry', desc: 'Eureka Discovery' },
                                ].map((service) => (
                                    <Box key={service.name} sx={{ p: 2, backgroundColor: 'rgba(45, 106, 79, 0.04)', borderRadius: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                            {service.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                                            {service.desc}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Box>

                    {/* Tech Stack Details */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Backend */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid var(--color-border-light)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <StorageIcon sx={{ color: 'var(--color-primary)', mr: 1.5 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Backend Ecosystem</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {['Spring Boot', 'Spring Cloud Gateway', 'Eureka', 'Feign Client', 'Spring Security', 'OAuth2', 'JWT', 'MySQL'].map((tech) => (
                                    <Chip key={tech} label={tech} size="small" sx={{ backgroundColor: 'rgba(45, 106, 79, 0.1)', color: 'var(--color-primary-dark)', fontWeight: 500 }} />
                                ))}
                            </Box>
                        </Paper>

                        {/* Frontend */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid var(--color-border-light)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CodeIcon sx={{ color: 'var(--color-primary)', mr: 1.5 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Frontend Experience</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {['Next.js', 'React', 'Redux Toolkit', 'TypeScript', 'Material UI', 'Tailwind CSS'].map((tech) => (
                                    <Chip key={tech} label={tech} size="small" sx={{ backgroundColor: 'rgba(45, 106, 79, 0.1)', color: 'var(--color-primary-dark)', fontWeight: 500 }} />
                                ))}
                            </Box>
                        </Paper>

                        {/* DevOps & Monitoring */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid var(--color-border-light)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <MonitorHeartIcon sx={{ color: 'var(--color-primary)', mr: 1.5 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>DevOps & Monitoring</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {['Kubernetes', 'Docker', 'Prometheus', 'Grafana', 'Zipkin (Planned)'].map((tech) => (
                                    <Chip key={tech} label={tech} size="small" sx={{ backgroundColor: 'rgba(45, 106, 79, 0.1)', color: 'var(--color-primary-dark)', fontWeight: 500 }} />
                                ))}
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default TechStackSection;
