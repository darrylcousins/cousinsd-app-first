const dateToISOString = (date, correctDay) => {
  const tempDate = date;
  if (correctDay) tempDate.setDate(date.getDate() + 1); // correct for unfound day descrepency
  //return tempDate.toISOString().slice(0, 10); // try this out later
  return tempDate.toISOString().slice(0, 10) + ' 00:00:00';
}

const nameSort = (a, b) => {
  const prodA = a.name.toUpperCase();
  const prodB = b.name.toUpperCase();

  let comparison = 0;
  if (prodA > prodB) {
    comparison = 1;
  } else if (prodA < prodB) {
    comparison = -1;
  }
  return comparison;
}


module.exports = {
  dateToISOString,
  nameSort,
}
