import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {
  Banner,
  Button,
  Loading,
  Spinner,
  TextField,
  TextStyle,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';

export function Editable(props) {

  const {id, fieldName, title, client, mutation, update, textStyle, type, ...args} = props;

  let fieldType = 'text';
  if (type) fieldType = type;

  const [value, setValue] = useState(title);
  const handleValue = useCallback((value) => setValue(value), []);

  const [editing, setEditing] = useState(false);

  return (
    <Mutation
      client={client}
      mutation={mutation}
      update={update}
    >
      {(handleTitleChange, { loading, error, data }) => {
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

        const handleKeyPress = (event) => {
          const enterKeyPressed = event.keyCode === 13;
          if (enterKeyPressed) {
            event.preventDefault();
            const input = { id };
            input[fieldName] = value;
            console.log(input);
            handleTitleChange({ variables: { input } })
              .then((value) => setEditing(false));
          }
        }

        return (
          editing ?
            <div
              onKeyDown={handleKeyPress}
            >
              <TextField
                focused
                clearButton
                value={value}
                type={fieldType}
                onChange={handleValue}
                onClearButtonClick={() => setEditing(false)}
              />
            </div>
            :
            <div
              onClick={() => setEditing(true)}
            >
              { textStyle === "button" ?
                <Button
                  primary
                  fullWidth
                >{ value }</Button>
                  :
                <TextStyle variation={textStyle}>{ value }</TextStyle>
              }
          </div>
        );
      }}
    </Mutation>
  )
}
