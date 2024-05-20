import { DateTime } from "luxon";

const HOROSCOPE = [
  {
    name: "Aries",
    symbol: "Ram",
    startDate: "21",
    startMonth: "03",
    endDate: "19",
    endMonth: "04",
  },

  {
    name: "Taurus",
    symbol: "Bull",
    startDate: "20",
    startMonth: "04",
    endDate: "20",
    endMonth: "05",
  },

  {
    name: "Gemini",
    symbol: "Twins",
    startDate: "21",
    startMonth: "05",
    endDate: "21",
    endMonth: "06",
  },

  {
    name: "Cancer",
    symbol: "Crab",
    startDate: "22",
    startMonth: "06",
    endDate: "22",
    endMonth: "07",
  },

  {
    name: "Leo",
    symbol: "Lion",
    startDate: "23",
    startMonth: "07",
    endDate: "22",
    endMonth: "08",
  },

  {
    name: "Virgo",
    symbol: "Virgin",
    startDate: "23",
    startMonth: "08",
    endDate: "22",
    endMonth: "09",
  },

  {
    name: "Libra",
    symbol: "Balance",
    startDate: "23",
    startMonth: "09",
    endDate: "23",
    endMonth: "10",
  },

  {
    name: "Scorpius",
    symbol: "Scorpion",
    startDate: "24",
    startMonth: "10",
    endDate: "21",
    endMonth: "11",
  },

  {
    name: "Sagittarius",
    symbol: "Archer",
    startDate: "22",
    startMonth: "11",
    endDate: "21",
    endMonth: "12",
  },

  {
    name: "Capricornus",
    symbol: "Goat",
    startDate: "22",
    startMonth: "12",
    endDate: "19",
    endMonth: "01",
  },

  {
    name: "Aquarius",
    symbol: "Water Bearer",
    startDate: "20",
    startMonth: "01",
    endDate: "18",
    endMonth: "02",
  },

  {
    name: "Pisces",
    symbol: "Fish",
    startDate: "19",
    startMonth: "02",
    endDate: "20",
    endMonth: "03",
  },
];

export const horoscopeHelper = (dateOfBirth: string) => {
  const year = DateTime.fromISO(dateOfBirth).toFormat("yyyy");
  let horoscope: string;

  for (const row of HOROSCOPE) {
    const start = year + "-" + row.startMonth + "-" + row.startDate;
    const end = year + "-" + row.endMonth + "-" + row.endDate;

    if (dateOfBirth >= start && dateOfBirth <= end) {
      horoscope = row.name;
    }
  }

  return horoscope;
};
