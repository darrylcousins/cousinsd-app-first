import {
  Card,
  TextContainer,
  SkeletonBodyText,
} from '@shopify/polaris';

const LoadingTextMarkup = () => (
  <Card sectioned>
    <TextContainer>
      <SkeletonBodyText lines={4} />
    </TextContainer>
  </Card>
);

export default LoadingTextMarkup;
