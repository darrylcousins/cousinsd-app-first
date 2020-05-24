import React, { useState } from 'react';
import {
  Frame,
  Layout,
  Page,
} from '@shopify/polaris';
import ProductList from '../components/products/ProductList';

export default function Products() {

  // add form
  const [showCreateForm, setShowCreateForm] = useState(false);
  // edit form
  const [showEditForm, setShowEditForm] = useState(false);

  const ProductAdd = () => (
    <Layout.Section>
      Show add form here
    </Layout.Section>
  );

  const createForm = showCreateForm && (
      <ProductAdd />
  );

  const ProductEdit = () => (
    <Layout.Section>
      Show edit form here
    </Layout.Section>
  );

  const editForm = showEditForm && (
      <ProductEdit />
  );

  return (
    <Frame>
      <Page
        title="Produce"
        primaryAction={{
          content: 'Add Product',
          onAction: () => setShowCreateForm(true),
        }}
      >
        <Layout>
          {createForm}
          {editForm}
          <ProductList />
        </Layout>
      </Page>
    </Frame>
  );
}

