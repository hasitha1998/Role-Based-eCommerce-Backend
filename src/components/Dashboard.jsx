import React, { useEffect, useState } from 'react';
import { Box, H2, H5 } from '@adminjs/design-system';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <Box padding="xxl">
      <H2>Admin Dashboard</H2>
      <Box display="flex" gap="lg" marginTop="xl">
        <Box
          bg="primary"
          color="white"
          padding="xl"
          borderRadius="default"
          flex="1"
        >
          <H5>Total Users</H5>
          <Box fontSize="xxl" fontWeight="bold">{stats.users}</Box>
        </Box>
        <Box
          bg="success"
          color="white"
          padding="xl"
          borderRadius="default"
          flex="1"
        >
          <H5>Total Orders</H5>
          <Box fontSize="xxl" fontWeight="bold">{stats.orders}</Box>
        </Box>
        <Box
          bg="info"
          color="white"
          padding="xl"
          borderRadius="default"
          flex="1"
        >
          <H5>Total Products</H5>
          <Box fontSize="xxl" fontWeight="bold">{stats.products}</Box>
        </Box>
        <Box
          bg="warning"
          color="white"
          padding="xl"
          borderRadius="default"
          flex="1"
        >
          <H5>Total Revenue</H5>
          <Box fontSize="xxl" fontWeight="bold">${stats.revenue}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;