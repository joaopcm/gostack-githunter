import styled from 'styled-components';

const CardHeader = styled.div`
  background: #7159c1;
  color: #fff;
  padding: 15px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  h1 {
    font-size: 20px;
    display: flex;
    flex-direction: row;

    svg {
      margin-right: 10px;
    }
  }
`;

export default CardHeader;
