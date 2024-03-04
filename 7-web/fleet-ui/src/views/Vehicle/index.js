import React from 'react';
import { Grid, Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@mui/material';

import { useVehicleManager } from '../../hooks/useVehicleManager';
import { useJobManager } from '../../hooks/useJobManager';

const Vehicle = () => {
  const { vehicles } = useVehicleManager();
  const { jobs } = useJobManager();

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <Paper>
            <Box m={2}>
              <Grid container item xs={12}>
                <h2>Vehicles</h2>
              </Grid>
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width="20%">Make</TableCell>
                      <TableCell width="25%">Model</TableCell>
                      <TableCell width="25%">VIN</TableCell>
                      <TableCell width="45%">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicles.map((row, idx) => {
                      let vJob = jobs?.find(
                        (job) => String(job?.vehicleId._id) == String(row?._id) && ['TODO', 'INPROGRESS'].includes(job.status)
                      );
                      let status = vJob ? 'Requires Maintenance' : 'Healthy';
                      return (
                        <TableRow style={{ backgroundColor: status == 'Requires Maintenance' ? '#faf2f1' : '#ecfff2' }} key={idx}>
                          <TableCell component="th" scope="row">
                            {row.make}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.model}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.vin}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {status}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

export default Vehicle;
