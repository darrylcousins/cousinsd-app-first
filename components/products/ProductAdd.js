import PropTypes from 'prop-types';
import {
  Banner,
  Button,
  Loading,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import LocalClient from '../../LocalClient';
import { BOX_ADD_PRODUCT } from './queries';

export default function ProductAdd({ boxId, selected }) {

  console.log('boxId', boxId);
  console.log('selected', selected);

  return (
    <Mutation
      client={LocalClient}
      mutation={BOX_ADD_PRODUCT}
    >
      {(productAdd, { loading, error, data }) => {
          const showError = error && (
            <Banner status="critical">{error.message}</Banner>
          );
          console.log('product add data', data);
          console.log('selected', selected);

          const displayLoading = loading && <Loading />;

          const handleProductAdd = () => {
            const input = {
              boxId: boxId,
              data: {
                name: selected.label,
                productId: selected.value,
              }
            }
            console.log('product add input', input);
            productAdd({ variables: { input } });
          }
          return (
            <Button
              primary
              fullWidth
              onClick={ handleProductAdd }
            >Save</Button>
          );
        }
      }
    </Mutation>
  )
}
