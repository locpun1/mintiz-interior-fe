import type { ListItemMenuItem } from '../components/ListItemMenu';
import Accounting from './Accounting';
import Customer from './Customer';
// Menu
import General from './General';
import Inventory from './Inventory';
import Products from './Products';
import Report from './Report';
import Sale from './Sale';
import Setting from './Setting';
import Discount from './Discount';

// Add more menu here
const sections: ListItemMenuItem[] = [
  General,
  Products,
  Inventory,
  Customer,
  Accounting,
  Report,
  Sale,
  Discount,
  Setting,
];

export default sections;
