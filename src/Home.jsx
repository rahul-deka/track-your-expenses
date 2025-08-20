import React from 'react';
import styles from './Home.module.css';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  AppBar, 
  Toolbar,
  Chip,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import { 
  Savings as PiggyBankIcon,
  ArrowForward as ArrowRightIcon,
  Security as ShieldIcon,
  Group as UsersIcon,
  Menu as MenuIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';

export default function Home() {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (currentUser) return <Navigate to="/dashboard" />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      {/* Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(229, 231, 235, 1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', height: 64 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#059669',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PiggyBankIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#111827',
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.25rem'
                }}
              >
                Hisap
              </Typography>
            </Box>

            {!isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/login"
                  sx={{ 
                    color: '#374151',
                    borderColor: '#d1d5db',
                    backgroundColor: 'transparent',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    '&:hover': { 
                      bgcolor: '#f9fafb',
                      borderColor: '#d1d5db'
                    }
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/signup"
                  sx={{ 
                    bgcolor: '#059669',
                    color: 'white',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    boxShadow: 'none',
                    '&:hover': { 
                      bgcolor: '#047857',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Get Started Free
                </Button>
              </Box>
            ) : (
              <IconButton>
                <MenuIcon sx={{ color: '#6b7280' }} />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ py: { xs: 6, lg: 8 }, overflow: 'hidden' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center' }}>
            <Chip 
              label="🚀 Now with AI-powered automation"
              sx={{ 
                mb: 4,
                bgcolor: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                fontWeight: 400,
                fontSize: '0.875rem',
                height: 32
              }}
            />
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem', lg: '4.5rem' },
                color: '#111827',
                mb: 4,
                lineHeight: 1.1,
                fontFamily: 'Georgia, serif',
                letterSpacing: '-0.025em'
              }}
            >
              Take Control of Your Expenses <br /> with{' '}
              <Box 
                component="span" 
                sx={{ color: '#059669', fontFamily: 'Georgia, serif' }}
              >
                Hisap
              </Box>
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#6b7280',
                mb: 6,
                maxWidth: 768,
                mx: 'auto',
                lineHeight: 1.75,
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                fontWeight: 400
              }}
            >
              Track. Analyze. Save. Transform your financial habits with our intelligent expense tracking platform that helps you understand where your money goes.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Button 
                size="large" 
                variant="contained"
                component={Link}
                to="/signup"
                endIcon={<ArrowRightIcon sx={{ fontSize: 20 }} />}
                sx={{ 
                  bgcolor: '#059669',
                  color: 'white',
                  fontWeight: 400,
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  fontSize: '1.125rem',
                  borderRadius: '12px',
                  height: 48,
                  boxShadow: 'none',
                  '&:hover': { 
                    bgcolor: '#047857',
                    boxShadow: 'none'
                  }
                }}
              >
                Start Tracking Free
              </Button>
            </Box>
          </Box>
        </Container>

        {/* Hero Image */}
        <Container maxWidth="lg" sx={{ mt: 10 }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '940px',
              height: { xs: 300, md: 500 },
              bgcolor: '#f3f4f6',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              mx: 'auto'
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <img
                src="/dashboard.png"
                alt="Dashboard Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  background: 'white',
                  borderRadius: '8px',
                  maxWidth: '940px'
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <div className={styles.featuresSection}>
        <Container maxWidth="lg">
          <div className={styles.featuresHeader}>
            <Typography variant="h2" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.875rem', md: '2.25rem', lg: '3rem' },
                // color: 'white',
                mb: 4,
                fontFamily: 'Georgia, serif',
                letterSpacing: '-0.025em',
                lineHeight: 1.2
              }}>
              Why Choose Hisap?
            </Typography>
            {/* <Typography variant="h6" className={`${styles.featuresSubtitle} ${styles.centerText}`}>
              Powerful features designed to streamline your workflow and boost productivity
            </Typography> */}
            <p className={`${styles.featuresSubtitle} ${styles.centerText}`}>
              Powerful features designed to streamline your workflow and boost productivity
            </p>
          </div>
          <div className={styles.featuresFlex}>
            {[
              {
                icon: PiggyBankIcon,
                title: 'Boost Productivity Effortlessly',
                description: 'Automate repetitive tasks and focus on what matters most. Our AI-powered engine learns your patterns and optimizes workflows automatically.'
              },
              {
                icon: ShieldIcon,
                title: 'Visual Analytics', 
                description: 'Beautiful charts and insights help you understand spending patterns and identify areas to save money.'
              },
              {
                icon: UsersIcon,
                title: 'Budget Tracking',
                description: 'Work together seamlessly with your team. Share workflows, track progress, and communicate in real-time.'
              }
            ].map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <Card elevation={0} className={styles.featureCard}>
                  <CardContent>
                    <div className={styles.featureIconBox}>
                      <feature.icon sx={{ color: '#059669', fontSize: 24 }} />
                    </div>
                    <Typography variant="h6" className={styles.featureTitle}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" className={styles.featureDesc}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Final CTA Section */}
      <Box sx={{ py: 12, bgcolor: '#059669' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.875rem', md: '2.25rem', lg: '3rem' },
                color: 'white',
                mb: 4,
                fontFamily: 'Georgia, serif',
                letterSpacing: '-0.025em',
                lineHeight: 1.2
              }}
            >
              Ready to Transform Your Spendings?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#a7f3d0',
                mb: 6,
                lineHeight: 1.75,
                fontSize: '1.25rem',
                fontWeight: 400
              }}
            >
              Join thousands of teams who've already streamlined their processes with Hisap. Start your free trial
              today and experience the difference.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Button 
                size="large" 
                variant="contained"
                component={Link}
                to="/signup"
                endIcon={<ArrowRightIcon sx={{ fontSize: 20 }} />}
                sx={{ 
                  bgcolor: 'white',
                  color: '#059669',
                  fontWeight: 400,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.125rem',
                  height: 48,
                  boxShadow: 'none',
                  '&:hover': { 
                    bgcolor: '#f9fafb',
                    boxShadow: 'none'
                  }
                }}
              >
                Get Started Free
              </Button>
            </Box>
            {/* <Typography variant="body2" sx={{ color: '#a7f3d0', fontSize: '0.875rem' }}>
              No credit card required • Setup in under 5 minutes
            </Typography> */}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: '#111827', 
          color: 'white', 
          py: 16 
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            px: { xs: 2, sm: 3, lg: 4 } 
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 1, 
                mb: 6 
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#059669',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PiggyBankIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography 
                variant="h6"
                sx={{ 
                  fontFamily: 'Georgia, serif', 
                  fontWeight: 700, 
                  fontSize: '1.25rem' 
                }}
              >
                Hisap
              </Typography>
            </Box>
            <Typography 
              sx={{ 
                fontFamily: 'Inter, sans-serif', 
                color: '#9ca3af', 
                lineHeight: 1.75, 
                mb: 8, 
                maxWidth: '28rem', 
                mx: 'auto' 
              }}
            >
              Empowering people to make smarter financial decisions through intelligent expense tracking.
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: 'Inter, sans-serif', 
                color: '#9ca3af' 
              }}
            >
              © 2025 Hisap. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}