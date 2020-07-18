const fetch = require('isomorphic-fetch');

const getPdf = (dd) => {
  return fetch(`${HOST}/pdf`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dd),
  })
};

const getCsv = (data) => {
  return fetch(`${HOST}/csv`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
};

const dateToISOString = (date) => {
  date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
  return date.toISOString().slice(0, 10); // try this out later
}

const numberFormat = ({ amount, currencyCode }) => {
  let amt = amount * 0.01; // amount comes in at cent decimal value
  let locale = 'en-NZ';
  if (currencyCode == 'NZD') locale = 'en-NZ';
  return (
    new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode
    }).format(amt)
  )
}

// sort array of [[ key, value ] ... ] pairs
const valueSort = (a, b) => {
  if (a[1] > a[1]) return 1;
  if (a[1] < a[1]) return -1;
  return 0;
}

const keySort = (a, b) => {
  if (a[0] > a[0]) return 1;
  if (a[0] < a[0]) return -1;
  return 0;
}

const nameSort = (a, b, key='title') => {
  const prodA = a[key].toLowerCase();
  const prodB = b[key].toLowerCase();
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
  if ('errors' in error) {
    error = error.errors[0];
    if (error && 'message' in error) return error.message;
    return error;
  }
  if ('graphQLErrors' in error) {
    error = error.graphQLErrors[0];
    if (error && 'extensions' in error) {
      error = error.extensions;
      if ('exception' in error) {
        error = error.exception;
        if ('errors' in error) {
          error = error.errors[0];
          if (error && 'message' in error) return error.message;
          return error;
        }
      }
    }
  }
  if (error && 'message' in error) return error.message;
  return error;
};

const makePromise = (observable) => {
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
          console.log('completeing request');
          resolve(data);
        }
      },
      error: reject,
    });
  });
}

const makeThrottledPromise = (observable, count) => {
  let completed = false;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('resolving throttled request', count);
      observable.subscribe({
        next: data => {
          if (data.errors) console.log(data.errors[0].message);
          //console.log(data);
          resolve(data);
        },
        error: reject,
      });
    }, 2000*count);
  });
}

module.exports = {
  dateToISOString,
  nameSort,
  keySort,
  valueSort,
  getFieldsFromInfo,
  findErrorMessage,
  makePromise,
  makeThrottledPromise,
  numberFormat,
  getPdf,
  getCsv,
};
