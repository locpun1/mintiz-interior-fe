import { isEmpty } from 'lodash';

const toQueryString = (obj: any, prefix = 'filter'): string | null => {
  if (isEmpty(obj)) {
    return null;
  }
  const parts: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = `${prefix}[${key}]`;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          const nestedResult = toQueryString(item, `${fullKey}[${index}]`);
          if (nestedResult !== null) {
            parts.push(nestedResult);
          }
        } else {
          parts.push(`${encodeURIComponent(fullKey)}[${index}]=${encodeURIComponent(item)}`);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      if ('min' in value && 'max' in value) {
        if (value.min !== null && value.min !== undefined) {
          parts.push(`${encodeURIComponent(fullKey)}[gte]=${encodeURIComponent(value.min.toString())}`);
        }
        if (value.max !== null && value.max !== undefined) {
          parts.push(`${encodeURIComponent(fullKey)}[lte]=${encodeURIComponent(value.max.toString())}`);
        }
        if ('type' in value && value.type !== null && value.type !== undefined) {
          parts.push(`${encodeURIComponent(fullKey)}[type]=${encodeURIComponent(value.type.toString())}`);
        }
      } else {
        const nestedResult = toQueryString(value, fullKey);
        if (nestedResult !== null) {
          parts.push(nestedResult);
        }
      }
    } else {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
      }
    }
  }

  return parts.length > 0 ? parts.join('&') : null;
};

export default toQueryString;
