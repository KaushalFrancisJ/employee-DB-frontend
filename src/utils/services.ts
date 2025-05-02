import axios from 'axios';
import { EMPLOYEE_END } from '../assets/apiLinks';
import { RawData } from '../components/datagridLayouts/PageDataGrid';

export const getApiData = async (id: string = '') => {
  try {
    const res = await axios.get(EMPLOYEE_END + id);
    return res.data;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
};

export const delApiData = async (id: string) => {
  try {
    await axios.delete(EMPLOYEE_END + id);
    return true;
  } catch (err) {
    console.error('Error deleting data:', err);
    throw err;
  }
};

export const createApiData = async (obj: RawData) => {
  try {
    const response = await axios.post(EMPLOYEE_END, obj);
    return response.data;
  } catch (err) {
    console.error('Error creating data:', err);
    throw err;
  }
};

export const updateApiData = async (id: string, obj: RawData) => {
  try {
    const response = await axios.put(EMPLOYEE_END + id, obj);
    return response.data;
  } catch (err) {
    console.error('Error updating data:', err);
    throw err;
  }
};

export const delAllData = async () => {
  try {
    const res: RawData[] = await getApiData();
    await Promise.all(res.map((item) => delApiData(String(item.id))));
    return true;
  } catch (err) {
    console.error('Error deleting all data:', err);
    throw err;
  }
};
