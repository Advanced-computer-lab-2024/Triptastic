import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const UserStatistics = ({ statistics }) => {
  const data = Object.entries(statistics.monthlyUsers || {}).map(([month, count]) => ({
    name: month,
    users: count,
  }));

  return (
    <div style={styles.statisticsContainer}>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#0F5132" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = {
  statisticsContainer: {
    margin: '20px auto',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0F5132',
    marginBottom: '20px',
  },
};

export default UserStatistics;
