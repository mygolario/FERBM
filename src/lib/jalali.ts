import jalaali from "jalaali-js";

export function getJalaliDateString(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();

  const { jy, jm, jd } = jalaali.toJalaali(gYear, gMonth, gDay);

  const monthNames = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  // Convert numbers to Persian
  const faDay = jd.toLocaleString("fa-IR");
  const faYear = jy.toLocaleString("fa-IR").replace(/,/g, "");

  return `${faDay} ${monthNames[jm - 1]} ${faYear}`;
}
