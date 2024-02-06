import React from 'react';
import { Grid, Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@mui/material';
import { useJobManager } from '../../hooks/useJobManager';
import { useUserManager } from '../../hooks/useUserManager';

const Job = () => {
  const { jobs } = useJobManager();
  const { users } = useUserManager();
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <Paper>
            <Box m={2}>
              <Grid container item xs={12}>
                <h2>Jobs</h2>
              </Grid>
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width="25%">Vehicle</TableCell>
                      <TableCell width="25%">Notes</TableCell>
                      <TableCell width="15%">Type</TableCell>
                      <TableCell width="15%">Status</TableCell>
                      <TableCell width="15%">Assigned To</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobs.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell component="th" scope="row">
                          {row.vehicleId?.make} {row.vehicleId?.model} ({row.vehicleId?.vin})
                        </TableCell>
                        <TableCell>{row.notes}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={
                              row?.status == 'COMPLETED'
                                ? 'success'
                                : row?.status == 'INPROGRESS'
                                ? 'warning'
                                : row?.status == 'CANCELLED'
                                ? 'error'
                                : 'default'
                            }
                          />
                        </TableCell>
                          <TableCell>{users?.find(user => String(user?.userId) == String(row.assignedTo))?.name || 'NA'}</TableCell>
                      </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Job;
