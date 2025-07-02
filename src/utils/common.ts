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

export const resizeImage = (
        file: File,
        maxSize: number
    ): Promise<{ blob: Blob; previewUrl: string }> => {
        return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
            img.src = reader.result;
            }
        };

        img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (width > height) {
            if (width > maxSize) {
                height = Math.round((height *= maxSize / width));
                width = maxSize;
            }
            } else {
            if (height > maxSize) {
                width = Math.round((width *= maxSize / height));
                height = maxSize;
            }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Canvas context not found"));

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
            (blob) => {
                if (blob) {
                resolve({
                    blob,
                    previewUrl: URL.createObjectURL(blob),
                });
                } else {
                reject(new Error("Resize failed"));
                }
            },
            "image/jpeg",
            0.8
            );
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
        });
    };
