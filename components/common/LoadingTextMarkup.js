import {
  Card,
  TextContainer,
  SkeletonBodyText,
} from '@shopify/polaris';

export const LoadingTextMarkup = () => (
  <Card sectioned>
    <TextContainer>
      <SkeletonBodyText lines={4} />
    </TextContainer>
  </Card>
);
