const dateToISOString = (date) => {
  date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
  return date.toISOString().slice(0, 10); // try this out later
}

const nameSort = (a, b, key='title') => {
  const prodA = a[key].toUpperCase();
  const prodB = b[key].toUpperCase();
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

const findErrorMessage = (error) => {
  if (!error) return error;
  if ('graphQLErrors' in error) {
    error = error.graphQLErrors[0];
    if (error && 'extensions' in error) {
      error = error.extensions;
      if ('exception' in error) {
        error = error.exception;
        if ('errors' in error) {
          error = error.errors[0];
          return error.message;
        }
      }
    }
  }
  return error.message;
};

const toPromise = (observable) => {
  let completed = false;
  return new Promise((resolve, reject) => {
    observable.subscribe({
      next: data => {
        if (completed) {
          invariant.warn(
          `Promise Wrapper does not support multiple results from Observable`,
          );
        } else {
          completed = true;
          resolve(data);
        }
      },
      error: reject,
    });
  });
}

module.exports = {
  dateToISOString,
  nameSort,
  getFieldsFromInfo,
  findErrorMessage,
  toPromise,
  makePromise: toPromise,
};
