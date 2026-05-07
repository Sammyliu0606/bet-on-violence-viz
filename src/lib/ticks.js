/** @param {(date: Date) => number} xScale */
export function generateMonthTicks(xScale) {
  const months = [];
  const start = new Date(2025, 0, 1);
  const end = new Date(2025, 11, 1);

  let current = new Date(start);
  while (current <= end) {
    months.push({
      x: xScale(current),
      label: current.toLocaleString('default', { month: 'short' })
    });
    current.setMonth(current.getMonth() + 1);
  }
  return months;
}
