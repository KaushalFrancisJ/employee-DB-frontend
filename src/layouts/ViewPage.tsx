import { Box, Button, Card, Typography } from '@mui/material';
import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RecordsData } from '../contexts/dataContexts';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';

const ViewPage = () => {
  const { id } = useParams();
  const { records } = useContext(RecordsData);
  const viewElement = records.find((value) => value.id === Number(id));
  console.log(viewElement);

  return (
    <Card className="m-2 p-4 flex flex-col gap-4">
      <Box className="flex flex-row gap-4">
        <Box>
          <Typography fontWeight={500} variant="h4">
            Name:
          </Typography>
          <Typography fontWeight={500} variant="h4">
            Organization:
          </Typography>
          <Typography fontWeight={500} variant="h4">
            Position:
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4">{viewElement?.name}</Typography>
          <Typography variant="h4">{viewElement?.organization}</Typography>
          <Typography variant="h4">
            {viewElement?.position.length ? viewElement.position : 'none'}
          </Typography>
        </Box>
      </Box>

      {viewElement?.address?.map((elem) => (
        <Card
          key={elem.id}
          className=" p-4 flex flex-row gap-4"
          sx={{ backgroundColor: '#98F5F9' }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Address:
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              Location:
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              Pin:
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              Contact:
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1">{elem.address}</Typography>
            <Typography variant="subtitle1">{elem.location}</Typography>
            <Typography variant="subtitle1">{elem.pin}</Typography>
            <Typography variant="subtitle1">{elem.contactNo}</Typography>
          </Box>
        </Card>
      ))}
      <Link to={'/'} className="flex justify-end">
        <Button variant="contained" color="info" startIcon={<HomeFilledIcon />}>
          Home
        </Button>
      </Link>
    </Card>
  );
};

export default ViewPage;
