import { DateTime } from "luxon";

const ZODIAC = [
  ["2023 January 22", "2024 February 9", "Rabbit"],
  ["2022 February 1", "2023 January 21", "Tiger"],
  ["2021 February 12", "2022 January 31", "Ox"],
  ["2020 January 25", "2021 February 11", "Rat"],
  ["2019 February 5", "2020 January 24", "Pig"],
  ["2018 February 16", "2019 February 4", "Dog"],
  ["2017 January 28", "2018 February 15", "Rooster"],
  ["2016 February 8", "2017 January 27", "Monkey"],
  ["2015 February 19", "2016 February 7", "Goat"],
  ["2014 January 31", "2015 February 18", "Horse"],
  ["2013 February 10", "2014 January 30", "Snake"],
  ["2012 January 23", "2013 February 9", "Dragon"],
  ["2011 February 3", "2012 January 22", "Rabbit"],
  ["2010 February 14", "2011 February 2", "Tiger"],
  ["2009 January 26", "2010 February 13", "Ox"],
  ["2008 February 7", "2009 January 25", "Rat"],
  ["2007 February 18", "2008 February 6", "Boar"],
  ["2006 January 29", "2007 February 17", "Dog"],
  ["2005 February 9", "2006 January 28", "Rooster"],
  ["2004 January 22", "2005 February 8", "Monkey"],
  ["2003 February 1", "2004 January 21", "Goat"],
  ["2002 February 12", "2003 January 31", "Horse"],
  ["2001 January 24", "2002 February 11", "Snake"],
  ["2000 February 5", "2001 January 23", "Dragon"],
  ["1999 February 16", "2000 February 4", "Rabbit"],
  ["1998 January 28", "1999 February 15", "Tiger"],
  ["1997 February 7", "1998 January 27", "Ox"],
  ["1996 February 19", "1997 February 6", "Rat"],
  ["1995 January 31", "1996 February 18", "Boar"],
  ["1994 February 10", "1995 January 30", "Dog"],
  ["1993 January 23", "1994 February 9", "Rooster"],
  ["1992 February 4", "1993 January 22", "Monkey"],
  ["1991 February 15", "1992 February 3", "Goat"],
  ["1990 January 27", "1991 February 14", "Horse"],
  ["1989 February 6", "1990 January 26", "Snake"],
  ["1988 February 17", "1989 February 5", "Dragon"],
  ["1987 January 29", "1988 February 16", "Rabbit"],
  ["1986 February 9", "1987 January 28", "Tiger"],
  ["1985 February 20", "1986 February 8", "Ox"],
  ["1984 February 2", "1985 February 19", "Rat"],
  ["1983 February 13", "1984 February 1", "Boar"],
  ["1982 January 25", "1983 February 12", "Dog"],
  ["1981 February 5", "1982 January 24", "Rooster"],
  ["1980 February 16", "1981 February 4", "Monkey"],
  ["1979 January 28", "1980 February 15", "Goat"],
  ["1978 February 7", "1979 January 27", "Horse"],
  ["1977 February 18", "1978 February 6", "Snake"],
  ["1976 January 31", "1977 February 17", "Dragon"],
  ["1975 February 11", "1976 January 30", "Rabbit"],
  ["1974 January 23", "1975 February 10", "Tiger"],
  ["1973 February 3", "1974 January 22", "Ox"],
  ["1972 January 16", "1973 February 2", "Rat"],
  ["1971 January 27", "1972 January 15", "Boar"],
  ["1970 February 6", "1971 January 26", "Dog"],
  ["1969 February 17", "1970 February 5", "Rooster"],
  ["1968 January 30", "1969 February 16", "Monkey"],
  ["1967 February 9", "1968 January 29", "Goat"],
  ["1966 January 21", "1967 February 8", "Horse"],
  ["1965 February 2", "1966 January 20", "Snake"],
  ["1964 February 13", "1965 February 1", "Dragon"],
  ["1963 January 25", "1964 February 12", "Rabbit"],
  ["1962 February 5", "1963 January 24", "Tiger"],
  ["1961 February 15", "1962 February 4", "Ox"],
  ["1960 January 28", "1961 February 14", "Rat"],
  ["1959 February 8", "1960 January 27", "Boar"],
  ["1958 February 18", "1959 February 7", "Dog"],
  ["1957 January 31", "1958 February 17", "Rooster"],
  ["1956 February 12", "1957 January 30", "Monkey"],
  ["1955 January 24", "1956 February 11", "Goat"],
  ["1954 February 3", "1955 January 23", "Horse"],
  ["1953 February 14", "1954 February 2", "Snake"],
  ["1952 January 27", "1953 February 13", "Dragon"],
  ["1951 February 6", "1952 January 26", "Rabbit"],
  ["1950 February 17", "1951 February 5", "Tiger"],
  ["1949 January 29", "1950 February 16", "Ox"],
  ["1948 February 10", "1949 January 28", "Rat"],
  ["1947 January 22", "1948 February 9", "Boar"],
  ["1946 February 2", "1947 January 21", "Dog"],
  ["1945 February 13", "1946 February 1", "Rooster"],
  ["1944 January 25", "1945 February 12", "Monkey"],
  ["1943 February 5", "1944 January 24", "Goat"],
  ["1942 February 15", "1943 February 4", "Horse"],
  ["1941 January 27", "1942 February 14", "Snake"],
  ["1940 February 8", "1941 January 26", "Dragon"],
  ["1939 February 19", "1940 February 7", "Rabbit"],
  ["1938 January 31", "1939 February 18", "Tiger"],
  ["1937 February 11", "1938 January 30", "Ox"],
  ["1936 January 24", "1937 February 10", "Rat"],
  ["1935 February 4", "1936 January 23", "Boar"],
  ["1934 February 14", "1935 February 3", "Dog"],
  ["1933 January 26", "1934 February 13", "Rooster"],
  ["1932 February 6", "1933 January 25", "Monkey"],
  ["1931 February 17", "1932 February 5", "Goat"],
  ["1930 January 30", "1931 February 16", "Horse"],
  ["1929 February 10", "1930 January 29", "Snake"],
  ["1928 January 23", "1929 February 9", "Dragon"],
  ["1927 February 2", "1928 January 22", "Rabbit"],
  ["1926 February 13", "1927 February 1", "Tiger"],
  ["1925 January 25", "1926 February 12", "Ox"],
  ["1924 February 5", "1925 January 24", "Rat"],
  ["1923 February 16", "1924 February 4", "Boar"],
  ["1922 January 28", "1923 February 15", "Dog"],
  ["1921 February 8", "1922 January 27", "Rooster"],
  ["1920 February 20", "1921 February 7", "Monkey"],
  ["1919 February 1", "1920 February 19", "Goat"],
  ["1918 February 11", "1919 January 31", "Horse"],
  ["1917 January 23", "1918 February 10", "Snake"],
  ["1916 February 3", "1917 January 22", "Dragon"],
  ["1915 February 14", "1916 February 2", "Rabbit"],
  ["1914 January 26", "1915 February 13", "Tiger"],
  ["1913 February 6", "1914 January 25", "Ox"],
  ["1912 February 18", "1913 February 5", "Rat"],
];

const formatMonthToNumber = (month: string) => {
  if (month == "January") {
    return "01";
  } else if (month == "February") {
    return "02";
  } else if (month == "March") {
    return "03";
  } else if (month == "April") {
    return "04";
  } else if (month == "May") {
    return "05";
  } else if (month == "June") {
    return "06";
  } else if (month == "July") {
    return "07";
  } else if (month == "August") {
    return "08";
  } else if (month == "September") {
    return "09";
  } else if (month == "October") {
    return "10";
  } else if (month == "November") {
    return "11";
  } else if (month == "December") {
    return "12";
  }
};

export const zodiacHelper = (dateOfBirth: string) => {
  for (const row of ZODIAC) {
    const tempStart = row[0].split(" ");
    const tempEnd = row[1].split(" ");

    const yearStart = tempStart[0];
    const monthStart = tempStart[1];
    const dayStart = Number(tempStart[2]) < 10 ? "0" + tempStart[2] : tempStart[2];

    const yearEnd = tempEnd[0];
    const monthEnd = tempEnd[1];
    const dayEnd = Number(tempEnd[2]) < 10 ? "0" + tempEnd[2] : tempEnd[2];

    const start = yearStart + "-" + formatMonthToNumber(monthStart) + "-" + dayStart;
    const end = yearEnd + "-" + formatMonthToNumber(monthEnd) + "-" + dayEnd;

    const startDate = DateTime.fromISO(start).toFormat("yyyy-LL-dd");
    const endDate = DateTime.fromISO(end).toFormat("yyyy-LL-dd");

    if (dateOfBirth >= startDate && dateOfBirth <= endDate) {
      return row[2];
    }
  }
};
