import { CustomerServiceType } from '@/types/customer-service-type';

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'CANCELLED'] as const;
const BILLING_STATUS = ['PAID', 'PENDING', 'OVERDUE'] as const;
const DEVICE_HISTORIES = [
  'Installation completed',
  'Pending installation',
  'Regular maintenance',
  'Repair needed',
] as const;

// Helper functions
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomElement = <T>(array: readonly T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const getRandomBoolean = () => Math.random() < 0.5;

const getRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  ).toISOString();
};

const generateRandomString = (length: number, type: 'numeric' | 'alpha' = 'numeric') => {
  const chars = type === 'numeric' ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateFakeCustomerServices = (count: number = 10): CustomerServiceType[] => {
  const now = new Date();
  const pastDate = new Date(now.getFullYear() - 1, 0, 1);
  const futureDate = new Date(now.getFullYear() + 1, 11, 31);

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    code: `SRV-${generateRandomString(3)}`,
    customerId: getRandomInt(100, 999),
    status: getRandomElement(STATUS_OPTIONS),
    productItemId: getRandomInt(200, 999),
    deviceId: getRandomInt(300, 999),
    packageId: getRandomInt(400, 999),
    startDate: getRandomDate(pastDate, now),
    endDate: getRandomBoolean() ? getRandomDate(now, futureDate) : null,
    isAutoRenew: getRandomBoolean(),
    createdAt: getRandomDate(pastDate, now),
    updatedAt: getRandomDate(pastDate, now),
    deletedAt: getRandomBoolean() ? getRandomDate(pastDate, now) : null,
    monthlyPrice: getRandomInt(100000, 1000000),
    needToPay: getRandomBoolean(),
    customer: {
      id: getRandomInt(1, 1000),
      name: `Customer ${index + 1}`,
      phone: `09${generateRandomString(8)}`,
      email: `customer${index + 1}@example.com`,
    },
    package: {
      id: getRandomInt(1, 100),
      name: `Package ${generateRandomString(3, 'alpha')}`,
      code: `PKG-${generateRandomString(3)}`,
      price: getRandomInt(100000, 1000000),
    },
    billings: Array.from({ length: getRandomInt(0, 5) }, (_, billIndex) => ({
      id: getRandomInt(500, 999),
      amount: getRandomInt(100000, 1000000),
      status: getRandomElement(BILLING_STATUS),
      dueDate: getRandomDate(now, futureDate),
      paidDate: getRandomBoolean() ? getRandomDate(pastDate, now) : null,
    })),
    deviceDeposit: getRandomInt(500000, 2000000),
    serviceFee: getRandomInt(50000, 200000),
    deviceCode: `DEV-${generateRandomString(3)}`,
    deviceHistory: getRandomElement(DEVICE_HISTORIES),
  }));
};

// Usage example:
// const fakeData = generateFakeCustomerServices(5);
