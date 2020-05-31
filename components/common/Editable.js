import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {
  Banner,
  Button,
  Loading,
  TextField,
  TextStyle,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import { LocalClient } from '../../LocalClient';

export default function Editable(props) {

  const {id, name, mutation, update, textStyle, ...args} = props;

  const [value, setValue] = useState(name);
  const handleValue = useCallback((value) => setValue(value), []);

  const [editing, setEditing] = useState(false);

  return (
    <Mutation
      client={LocalClient}
      mutation={mutation}
      update={update}
    >
      {(handleNameChange, { loading, error, data }) => {
        if (loading) { return <Loading />; }

        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleKeyPress = (event) => {
          const enterKeyPressed = event.keyCode === 13;
          if (enterKeyPressed) {
            event.preventDefault();
            const input = { 
              id: parseInt(id),
              name: value
            };
            handleNameChange({ variables: { input } })
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
