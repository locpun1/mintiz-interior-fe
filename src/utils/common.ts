import { AxiosResponse } from 'axios';
import _ from 'lodash';
import Papa from 'papaparse';



export const exportDataCSV = ({ name = '', data = [] as any[] }) => {
  try {
    const csvData = Papa.unparse(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error export file:', error);
  }
};

export const downloadFileCSV = async ({
  name = '',
  request,
}: {
  name?: string;
  request: Promise<any>;
}) => {
  try {
    const response = (await request) as AxiosResponse;
    const bom = '\uFEFF';
    const blob = new Blob([bom + response.data], { type: response.headers['content-type'] });
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

export const findDuplicateKey = (data: any, iteratee: string) => {
  const result = _.chain(data)
    .filter((item) => item[iteratee] != null)
    .countBy(iteratee)
    .pickBy((count) => count > 1)
    .keys()
    .value();
  return result;
};
