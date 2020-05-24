import React, { useState } from 'react';
import {
  Frame,
  Layout,
  Page,
} from '@shopify/polaris';
import BoxList from '../components/boxes/BoxList';

export default function Boxes() {

  // add form
  const [showCreateForm, setShowCreateForm] = useState(false);
  // edit form
  const [showEditForm, setShowEditForm] = useState(false);

  const BoxAdd = () => (
    <Layout.Section>
      Show add form here
    </Layout.Section>
  );

  const createForm = showCreateForm && (
      <BoxAdd />
  );

  const BoxEdit = () => (
    <Layout.Section>
      Show edit form here
    </Layout.Section>
  );

  const editForm = showEditForm && (
      <BoxEdit />
  );

  return (
    <Frame>
      <Page
        title="Boxes"
        primaryAction={{
          content: 'Add Box',
          onAction: () => setShowCreateForm(true),
        }}
      >
        <Layout>
          {createForm}
          {editForm}
          <BoxList />
        </Layout>
      </Page>
    </Frame>
  );
}

