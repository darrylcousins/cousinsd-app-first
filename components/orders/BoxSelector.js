import React, { useState, useCallback } from 'react';
import {
  ActionList,
  Button,
  Popover,
} from '@shopify/polaris';

export default function BoxSelector({ handleBoxSelected, box, disabled, boxes }) {

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const [selectedBox, setSelectedBox] = useState(box);

  const setSelectedBoxChange = (box) => {
    setSelectedBox(box);
    togglePopoverActive();
    handleBoxSelected(box);
  }

  return (
    <Popover fluidContent={true} active={popoverActive} onClose={togglePopoverActive} activator={(
      <Button
        onClick={togglePopoverActive}
        disabled={disabled}
        disclosure={!popoverActive ? 'down' : 'up'}
        >
          { box ? box.shopify_title : 'Filter by box'}
      </Button>
    )}>
      <ActionList
        items={ [{ content: 'All', onAction: () => setSelectedBoxChange(null) }].concat(boxes.map((box) => {
          return { 
            content: box.shopify_title, 
            onAction: () => setSelectedBoxChange(box),
          }
        }))}
      />
    </Popover>
  );
}



