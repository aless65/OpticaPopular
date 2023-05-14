import merge from 'lodash/merge';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
// components
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------


// const CHART_DATA = [
//   {
//     year: 2019,
//     data: [
//       { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
//       { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
//     ],
//   },
// ];

export default function AppAreaInstalled() {
  const [seriesData, setSeriesData] = useState(2019);

  const [dataSucursales, setDataSucursales] = useState([]);

  useEffect(() => {
    fetch('http://opticapopular.somee.com/api/Ordenes/GraficaXSucursales')
      .then(response => response.json())
      .then(data => {
        // console.log(data.data);
        const newData = data.data.map(item => ({
          name: item.name,
          data: [
            item.jan, item.feb, item.mar, item.apr, item.may, item.jun, item.jul, item.aug, item.sep
          ],
        }));
        // console.log(newData[0].name); // Optional: Log the new data
        // Set the new data to CHART_DATA
        setDataSucursales([{
          year: 2019,
          data: newData
        }]);
      })
      .catch(error => console.error(error));
  }, [])

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
  });

  return (
    <Card>
      <CardHeader
        title="Sucursales con más órdenes"
        subheader="Las dos sucursales más exitosas"
      // action={
      //   <TextField
      //     select
      //     fullWidth
      //     // value={seriesData}
      //     SelectProps={{ native: true }}
      //     onChange={handleChangeSeriesData}
      //     sx={{
      //       '& fieldset': { border: '0 !important' },
      //       '& select': {
      //         pl: 1,
      //         py: 0.5,
      //         pr: '24px !important',
      //         typography: 'subtitle2',
      //       },
      //       '& .MuiOutlinedInput-root': {
      //         borderRadius: 0.75,
      //         bgcolor: 'background.neutral',
      //       },
      //       '& .MuiNativeSelect-icon': {
      //         top: 4,
      //         right: 0,
      //         width: 20,
      //         height: 20,
      //       },
      //     }}
      //   >
      //     {CHART_DATA.map((option) => (
      //       <option key={option.year} value={option.year}>
      //         {option.year}
      //       </option>
      //     ))}
      //   </TextField>
      // }
      />

      {dataSucursales.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="line" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
