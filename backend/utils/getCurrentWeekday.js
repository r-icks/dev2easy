const getCurrentWeekday = () => {
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = new Date();
  return weekdays[today.getDay()];
};

export default getCurrentWeekday;
