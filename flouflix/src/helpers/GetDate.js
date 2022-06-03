function getDate(date, setOnlyYear) {
  const newDate = new Date(parseInt(date) * 1000);
  setOnlyYear(newDate.getFullYear());

  return `${
    newDate.getMonth() + 1
  }/${newDate.getDate()}/${newDate.getFullYear()}`;
}

export default getDate;
