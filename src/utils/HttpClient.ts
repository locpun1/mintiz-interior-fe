import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import qs from 'qs';

import DateTime from './DateTime';

import { __BASEURL__ } from '@/config';
import { getAccessToken, removeAccessToken, setAccessToken } from './AuthHelper';


const config: AxiosRequestConfig = {
  baseURL: __BASEURL__,
  headers: {
    'Content-Type': 'application/json',
    TimeZone: DateTime.TimeZone(),
  },
  withCredentials: true,
  timeout: 10 * 60 * 1000,
  paramsSerializer: (params) => qs.stringify(params, { skipNulls: true }),
};

class Axios {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{ resolve: (token: string) => void; reject: (error: AxiosError) => void }> = [];

  constructor() {
    const instance = axios.create(config);
    this.setupInterceptors(instance);
    this.instance = instance;
  }

  private setupInterceptors(instance: AxiosInstance) {
    // Request Interceptor: Tự động gắn access token vào mỗi request
    instance.interceptors.request.use(
      (config) => {
        const token = getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response Interceptor: Xử lý khi token hết hạn
    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Chỉ xử lý lỗi 401 Unauthorized và đảm bảo không bị lặp vô hạn
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Nếu đang có một tiến trình refresh token khác chạy, đẩy request này vào hàng đợi
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Gọi API refresh token
            const { data } = await instance.post('/auth/refresh-token');
            const newAccessToken = data.data.accessToken;

            // Cập nhật token mới vào storage
            setAccessToken(newAccessToken);
            
            // Xử lý các request trong hàng đợi với token mới
            this.processQueue(null, newAccessToken);
            
            // Thực hiện lại request gốc đã thất bại
            originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);

          } catch (refreshError) {
            this.processQueue(refreshError as AxiosError, null);
            
            // Nếu refresh token thất bại, xóa token cũ và logout
            console.error('Session expired, logging out.', refreshError);
            removeAccessToken();
            // Chuyển hướng về trang đăng nhập
            // Cách tốt nhất là dispatch một action logout ở đây
            window.location.href = '/login'; 
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }
        
        // Trả về lỗi cho các trường hợp khác (ví dụ: 403, 404, 500)
        return Promise.reject(error.response?.data);
      }
    );
  }
  
  private processQueue(error: AxiosError | null, token: string | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token!);
      }
    });
    this.failedQueue = [];
  }

  public get Instance(): AxiosInstance {
    return this.instance;
  }

  // Create
  public post<D = any>(url: string): Promise<D>;
  public post<D = any, R = any>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<R>;
  public post<D = any, R = any>(
    url: string,
    data: D,
    config: AxiosRequestConfig<D> & { integrity: true },
  ): Promise<AxiosResponse<R, D>>;
  public post<D, R>(url: string, data?: D, config: any = {}): Promise<unknown> {
    const { integrity, ...rest } = config;
    return new Promise((resolve, reject) => {
      this.Instance.post<D, AxiosResponse<R>>(url, data, rest)
        .then((response) => resolve(integrity ? response : response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }

  // Read
  public get<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.get<T, AxiosResponse<R>, D>(url, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => {
          reject(error.response?.data);
        });
    });
  }

  // Update
  public put<D = any, R = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.put<D, AxiosResponse<R>>(url, data, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }

  public patch<D = any, R = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.patch<D, AxiosResponse<R>>(url, data, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }

  // Delete
  public delete<D = any, R = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.delete<D, AxiosResponse<R>>(url, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }
}

const HttpClient = new Axios();
export default HttpClient;
