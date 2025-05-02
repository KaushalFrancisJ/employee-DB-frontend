import {
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import PageDataGrid from '../components/datagridLayouts/PageDataGrid';
import { useNavigate } from 'react-router-dom';
import { RecordsData } from '../contexts/dataContexts';
import { useContext, useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { getApiData, delAllData } from '../utils/services';

const HomePage = () => {
  const { records, setRecords } = useContext(RecordsData);
  const navigate = useNavigate();

  const [filteredRecords, setFilteredRecords] = useState(records);
  const [searchText, setSearchText] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchText, 300);

  // Fetch data function that can be called to refresh
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getApiData();
      if (Array.isArray(data)) {
        setRecords(data);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredRecords(records); // refresh when context records change
  }, [records]);

  useEffect(() => {
    handleSearchAndFilter();
  }, [debouncedSearch, selectedOrganization, records]);

  const handleSearchAndFilter = () => {
    let updatedRecords = [...records];

    if (selectedOrganization) {
      updatedRecords = updatedRecords.filter(
        (item) => item.organization === selectedOrganization,
      );
    }

    if (debouncedSearch) {
      const lowercased = debouncedSearch.toLowerCase();
      updatedRecords = updatedRecords.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercased) ||
          item.position.toLowerCase().includes(lowercased) ||
          item.organization.toLowerCase().includes(lowercased),
      );
    }

    setFilteredRecords(updatedRecords);
  };

  const handleFilterClick = () => {
    setFilterActive((prev) => !prev);

    // If hiding the filter, reset organization selection
    if (filterActive) {
      setSelectedOrganization('');
    }
  };

  const clearFilter = () => {
    setSelectedOrganization('');
    setFilterActive(false);
  };

  const handleDeleteAll = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete all records? This action cannot be undone.',
      )
    ) {
      setLoading(true);
      try {
        await delAllData();
        await fetchData(); // Refresh data after deletion
      } catch (error) {
        console.error('Failed to delete all records:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Get unique organizations
  const organizations = Array.from(new Set(records.map((r) => r.organization)));

  return (
    <Card className="m-2 p-4 flex flex-col gap-4">
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', fontWeight: 500, mb: 4 }}
      >
        Employee Database
      </Typography>

      <Box className="flex justify-between align-middle">
        <Box className="flex gap-2">
          <TextField
            type="search"
            label="Search Here!"
            size="small"
            className="w-100"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton color="warning" onClick={handleFilterClick}>
            <FilterListIcon />
          </IconButton>
        </Box>

        <Box className="flex gap-2">
          <Button variant="contained" color="error" onClick={handleDeleteAll}>
            <DeleteIcon />
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/add');
            }}
          >
            <AddBoxIcon />
          </Button>
        </Box>
      </Box>

      {/* Filter dropdown and clear button */}
      {filterActive && (
        <Box className="flex gap-2 items-center mt-4">
          <Select
            value={selectedOrganization}
            className="w-100"
            onChange={(e) => setSelectedOrganization(e.target.value)}
            size="small"
            displayEmpty
          >
            <MenuItem value="">
              <em>Select Organization</em>
            </MenuItem>
            {organizations.map((org, index) => (
              <MenuItem key={index} value={org}>
                {org}
              </MenuItem>
            ))}
          </Select>

          <IconButton color="error" onClick={clearFilter}>
            <FilterListOffIcon />
          </IconButton>
        </Box>
      )}

      {/* Data grid showing filtered results */}
      {loading ? (
        <Box className="flex justify-center p-8">
          <CircularProgress />
        </Box>
      ) : (
        <PageDataGrid rows={filteredRecords} onDataChange={fetchData} />
      )}
    </Card>
  );
};

export default HomePage;
