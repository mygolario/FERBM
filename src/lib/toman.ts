export function formatToman(amount: number): string {
  if (amount === undefined || amount === null) return "۰ تومان";
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

export function toPersianNumbers(num: string | number): string {
  if (num === undefined || num === null) return "";
  return num.toLocaleString("fa-IR");
}
