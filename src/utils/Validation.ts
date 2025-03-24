import dayjs from 'dayjs';
import mapValues from 'lodash/mapValues';
import type { AnyObjectSchema, AnySchema, ObjectShape, Schema, ValidationError } from 'yup';
import { addMethod, array, bool, date, lazy, mixed, number, object, setLocale, string } from 'yup';

import { formatPrice } from './FormatPrice';
import { getTranslation } from './getTranslation';
import Numeral from './Numeral';
import Regexs from './Regexs';

addMethod(object, 'dayjs', function method(message) {
  return this.test('dayjs', message, function validate(value) {
    if (!value) {
      return true;
    }
    return dayjs.isDayjs(value);
  });
});

const t = getTranslation('error');

class Validation {
  constructor() {
    setLocale({
      mixed: {
        required: 'schema.required',
      },
      string: {
        trim: 'schema.trim',
        max: 'schema.maxLength',
      },
    });
  }

  public mixed() {
    return mixed();
  }

  public array() {
    return array();
  }

  public boolean() {
    return bool();
  }

  public resolver(error: ValidationError) {
    return error.message;
  }

  public validate(validate?: AnySchema) {
    return async (value: any) => {
      if (!validate) return true;

      const message = await validate
        .validate(value)
        .then(() => void 0)
        .catch(this.resolver);

      return message;
    };
  }

  public shape<T extends ObjectShape>(additions: T, excludes?: [string, string][]) {
    return object().shape<T>(additions, excludes);
  }

  public text() {
    return string().trim().default('');
  }

  public string(length?: number) {
    const maxLength = length ?? 255;
    return string()
      .ensure()
      .required()
      .max(maxLength, `Độ dài không được vượt quá ${maxLength} ký tự`)
      .trim()
      .default('');
  }

  public number() {
    return number().required();
  }

  public positiveNumber(field: string = '') {
    return number()
      .label(field)
      .required()
      .typeError(({ path, label }) => {
        return t('must_be_positive_number', { fieldLabel: label || path });
      })
      .positive(({ path, label }) => {
        return t('must_be_positive_number', { fieldLabel: label || path });
      })
      .max(999999999999, ({ path, label }) =>
        t('max', { name: label || path, max: Numeral.price(999999999999) }),
      );
  }

  public positiveNumber2(field: string = '') {
    return number()
      .label(field)
      .required()
      .typeError(({ path, label }) => {
        return t('must_be_positive_number', { fieldLabel: label || path });
      })
      .test(
        'is-positive-or-zero',
        ({ path, label }) => t('min', { name: label || path, min: 0 }),
        (value) => value >= 0,
      ) // Allow 0 as valid
      .max(999999999999, ({ path, label }) =>
        t('max', { name: label || path, max: Numeral.price(999999999999) }),
      );
  }

  public positiveNumber3({
    label = '',
    min = 0,
    max = 999999999,
  }: {
    label?: string;
    min?: number;
    max?: number;
  } = {}) {
    return number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .required(t('required', { name: label }))
      .typeError(t('type_number', { name: label }))
      .min(min, t('min', { name: label, min: formatPrice(min) }))
      .max(max, t('max', { name: label, max: formatPrice(max) }));
  }

  public option() {
    return number().required().nullable().default(null);
  }

  public select(value: number | string) {
    if (typeof value === 'number') return number().required().default(value);
    return string().required().default(value);
  }

  public date() {
    return date().required().typeError('schema.invalidDate').nullable().default(null);
  }

  public email() {
    return string()
      .trim()
      .required()
      .matches(Regexs.email, 'schema.validEmail')
      .max(255)
      .default('');
  }

  public phone() {
    return string()
      .trim()
      .required()
      .matches(Regexs.phone, 'schema.validPhone')
      .max(255)
      .default('');
  }

  public description() {
    return string().trim().max(5000).default('');
  }

  public pattern(regexp: RegExp, message?: string) {
    return this.string().matches(regexp, message);
  }

  public options() {
    return this.string().optional();
  }

  public dynamicObject<T extends Schema<any>>(rule: T) {
    return lazy((map) =>
      object(mapValues(map, () => rule) as Record<string, T>),
    ) as unknown as AnyObjectSchema;
  }

  public requireNumber(label = '') {
    return number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .required(t('required', { name: label }));
  }

  public requireString(label = '') {
    return string().required(t('required', { name: label }));
  }
}

export default new Validation();
