import React from 'react';
import { Grid, Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@mui/material';
import { usePartManager } from '../../hooks/usePartManager';

const Part = () => {
  const { parts } = usePartManager();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <Paper>
          {/* @ts-ignore */}
          <Box m={2}>
            <Grid container item xs={12}>
              <h2>Parts</h2>
            </Grid>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell width="20%">Part Name</TableCell>
                    <TableCell width="20%">Part Number</TableCell>
                    <TableCell width="25%">Vehicle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parts.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell component="th" scope="row">
                        {row.partName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.partNum}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {row.vehicleId?.make} {row.vehicleId?.model} ({row.vehicleId?.vin})
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Part;
