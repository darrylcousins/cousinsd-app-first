import React, {useState, useCallback} from 'react';
import {
  Banner,
  Loading,
  Spinner,
} from '@shopify/polaris';
import { Mutation } from '@apollo/react-components';

const inputStyle = {
  height: 0,
  width: 0,
  visibility: 'hidden',
}

const labelStyle = {
  marginTop: '-1em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  width: '40px',
  height: '20px',
  borderRadius: '40px',
  position: 'relative',
  transition: 'background-color .2s',
}

const labelBackground = {
  background: 'silver',
}

const labelCheckedBackground = {
  background: 'blue',
}

const uncheckedStyle = {
  content: '',
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '16px',
  height: '16px',
  borderRadius: '16px',
  transition: '0.2s',
  background: '#fff',
  boxShadow: '0 0 2px 0 rgba(10, 10, 10, 0.29)',
}

const checkedStyle = {
  left: 'calc(100% - 2px)',
  transform: 'translateX(-100%)',
}

export const Switch = (props) => {

  const {id, fieldName, selected, context, mutation, update, onChange} = props;

  const [checked, setChecked] = useState(selected);
  const toggleChecked = useCallback(
    () => new Promise(resolve => resolve(setChecked(!checked))),
    [checked]
  );

  const buttonStyle = checked ? Object.assign({}, uncheckedStyle, checkedStyle) : uncheckedStyle;
  const labelCompleteStyle = checked
    ? Object.assign({}, labelStyle, labelCheckedBackground)
    : Object.assign({}, labelStyle, labelBackground);

  return (
    <Mutation
      context={context}
      mutation={mutation}
      update={update}
    >
      {(handleSwitch, { loading, error, data }) => {
        if (loading) { 
          return (
            <React.Fragment>
              <Loading />
              <Spinner size='small' />
            </React.Fragment>
          );
        }

        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleOnChange = () => {
          onChange(!checked, id); // note it isn't changed yet
          const input = { id: parseInt(id) };
          input[fieldName] = !checked;
          toggleChecked()
            .then(
              () => setTimeout(() => handleSwitch({ variables: { input } }), 200)
            );
        };

        return (
          <React.Fragment>
            <input
              style={inputStyle}
              id={id}
              type="checkbox"
              onChange={(e) => handleOnChange(e)}
            />
            <label
              style={labelCompleteStyle}
              htmlFor={id}
            >
              <span style={buttonStyle} />
            </label>
          </React.Fragment>
        );
      }}
    </Mutation>
  );
};
