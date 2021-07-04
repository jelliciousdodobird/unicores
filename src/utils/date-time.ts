import { DateTime } from "luxon";

// const dateStr = "2021-01-01T16:30:00+00:00";

// // const isoParse = DateTime.fromSQL(dateStr);
// const isoParse = DateTime.fromISO(dateStr);
// const jsDateParse = new Date(dateStr);

// console.log("og", dateStr);
// console.log(isoParse);
// console.log(isoParse.toISO());

// console.log("g", DateTime.fromISO(isoParse.toISO()));
// console.log(jsDateParse, jsDateParse.getTime());

/**********************************************************
 * TYPES:
 **********************************************************/
export type TimeFormat = "24H" | "12H";

export type WeekTypeHelper = typeof WEEKDAY[keyof typeof WEEKDAY]; // uses the WEEKDAY object to generate valid values
export type WeekdayKey = keyof typeof WEEKDAY;
export type WeekdayValueKey = keyof WeekTypeHelper;
export type Weekday = WeekTypeHelper[keyof WeekTypeHelper];
export type WeekdayShorter = WeekTypeHelper["SHORTER"];
export type WeekdayShort = WeekTypeHelper["SHORT"];
export type WeekdayFull = WeekTypeHelper["FULL"];

/**********************************************************
 * DEFFAULT VALUES
 **********************************************************/
export const WEEKDAY = {
  SUNDAY: { FULL: "sunday", SHORT: "sun", SHORTER: "s", INT: 0 },
  MONDAY: { FULL: "monday", SHORT: "mon", SHORTER: "m", INT: 1 },
  TUESDAY: { FULL: "tuesday", SHORT: "tue", SHORTER: "t", INT: 2 },
  WEDNESDAY: { FULL: "wednesday", SHORT: "wed", SHORTER: "w", INT: 3 },
  THURSDAY: { FULL: "thursday", SHORT: "thu", SHORTER: "th", INT: 4 },
  FRIDAY: { FULL: "friday", SHORT: "fri", SHORTER: "f", INT: 5 },
  SATURDAY: { FULL: "saturday", SHORT: "sat", SHORTER: "sa", INT: 6 },
} as const;

export const getWeekdayVariants = (weekday: Weekday) => {
  for (const key in WEEKDAY) {
    const values = WEEKDAY[key as WeekdayKey];
    for (const valuekey in values)
      if (weekday === values[valuekey as WeekdayValueKey]) return values;
  }
};

export const getPossibleValuesForWeekday = () => {
  // let possibleValues: { [key in WeekdayValueKey]: WeekTypeHelper } | {} = {};
  let possibleValues = {};

  for (const key in WEEKDAY) {
    const values = WEEKDAY[key as WeekdayKey];
    for (const valuekey in values)
      possibleValues = {
        ...possibleValues,
        [values[valuekey as WeekdayValueKey]]: values,
      };
  }
  return possibleValues;
};
// { [key in keyof Weekday]: WeekTypeHelper } | {}
export const WEEKDAY_LOOKUP: any = getPossibleValuesForWeekday();

// const WEEKDAY_LOOKUP = {...WEEKDAY_LENGTH.map((val)=>({[val]: }))};

export const DEFAULT_DATE = { month: 1, day: 1, year: 2021 };

/**********************************************************
 * UTILITY FUNCTIONS:
 **********************************************************/

export const parseTimeString = (timeStr: string) => {
  const t = timeStr.split(":");
  const hour = Number.parseInt(t[0]);
  const minute = Number.parseInt(t[1]);
  return { hour, minute };
};

/**
 * Creates a DateTime object with a default date. Use this function on
 * all data that is not date sensitive.
 * @param timeInISOString represents an ISO 8601 string
 * @returns a DateTime object with a default Date
 */
export const sanitizeTime = (timeInISOString: string) =>
  DateTime.fromISO(timeInISOString).set({ ...DEFAULT_DATE });

/**
 * Creates a time with a default date so that it is possible to compare times without
 * worrying about the dates associated with each time. Use this when you need a DateTime
 * object and don't care about the actual date associated with it.
 * @param time is a string that represents time in 24 hours format. `Examples: 9:30, 2:30, 16:07`
 * @returns a DateTime object with a DEFAULT_DATE and the specified time
 */
export const newTime = (time: string) => {
  const { hour, minute } = parseTimeString(time);
  return DateTime.fromObject({ ...DEFAULT_DATE, hour, minute });
};

export const zero = (num: number) => (num < 10 ? "0" : "");

export const getTimeParts = (time: DateTime) => {
  const { hour: h, minute: m, second: s } = time.toObject();
  // if(!h && !m && !s) return;

  if (h !== undefined && m !== undefined && s !== undefined) {
    const h12 = h % 12 === 0 ? 12 : h % 12;

    return {
      h12: h12, // hours in 12 hour format
      h12z: `${zero(h12)}${h12}`, // hours in 24 hour format with leading zero
      h24: `${h}`, // hours in 24 hour format
      h24z: `${zero(h)}${h}`, // hours in 24 hour format with leading zero
      m: `${zero(m)}${m}`, // minutes with leading zero
      s: `${zero(s)}${s}`, // secondes with leading zero
      meridiem: h >= 12 ? "PM" : "AM", // meridiem or period of day
    };
  } else
    return {
      h12: 1, // hours in 12 hour format
      h12z: `1`, // hours in 24 hour format with leading zero
      h24: `1`, // hours in 24 hour format
      h24z: `1`, // hours in 24 hour format with leading zero
      m: `1`, // minutes with leading zero
      s: `1`, // secondes with leading zero
      meridiem: "AMPM", // meridiem or period of day
    };
};

export const formatTime = (
  time: DateTime,
  format: TimeFormat = "24H",
  hoursLeadZero: boolean = false,
  showMinutes: boolean = true
) => {
  const { h24, h24z, h12, h12z, m, meridiem } = getTimeParts(time);

  return format === "24H"
    ? `${hoursLeadZero ? h24z : h24}${showMinutes ? `:${m}` : ""}`
    : `${hoursLeadZero ? h12z : h12}${showMinutes ? `:${m}` : ""} ${meridiem}`;
};
