import styled from 'styled-components';

const NoteWrapper = styled.div` 
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.6rem;
  min-width: 3.6rem;
  margin: 0;
  padding: 0.7rem 1.6rem;
  background: linear-gradient(to bottom, white, #f9fafb);
  border: 0.1rem solid var(--p-border, #c4cdd5);
  box-shadow: 0 1px 0 0 rgba(22, 29, 37, 0.05);
  border-radius: 0 3px 3px 0;
  border-radius: ${props => {
    if (props.segmentedLeft) return '0 3px 3px 0';
    if (props.segmentedRight) return '3px 0 0 3px';
    return '3px';
    }};
  line-height: 1;
  color: #212b36;
  text-align: center;
  text-decoration: none;
  cursor: defualt;
`;

export default NoteWrapper;
