const dateToISOString = (date, correctDay) => {
  const tempDate = date;
  if (correctDay) tempDate.setDate(date.getDate() + 1); // correct for unfound day descrepency
  //return tempDate.toISOString().slice(0, 10); // try this out later
  return tempDate.toISOString().slice(0, 10) + ' 00:00:00';
}

const nameSort = (a, b) => {
  const prodA = a.name.toUpperCase();
  const prodB = b.name.toUpperCase();
  if (prodA > prodB) return 1;
  if (prodA < prodB) return -1;
  return 0;
}

const getFieldsFromInfo = (info) => {
  const selections = info.fieldNodes[0] && info.fieldNodes[0].selectionSet && info.fieldNodes[0].selectionSet.selections;
  if (selections) {
    // create array of fields asked for by graphql
    const fields = selections.map((item) => {
      if (item.kind == 'Field' && !item.selectionSet) return item.name.value;
    }).filter(item => item !== '__typename')
      .filter(item => typeof(item) !== 'undefined');
    return fields;
  }
  return ['id'];
};

module.exports = {
  dateToISOString,
  nameSort,
  getFieldsFromInfo,
}
