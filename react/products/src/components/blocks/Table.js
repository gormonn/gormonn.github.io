import styled from "styled-components";

export const Body = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
`;

export const Row = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  ${({ gray }) => (gray ? `& > ${Cell} { background: lightgray; }` : "")}
`;

export const Cell = styled.div`
  box-sizing: border-box;
  border: solid 3px gray;
  overflow: hidden;
  flex-grow: 1;
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: ${({ size }) => (size ? size : 33)}%;
  padding: 10px;
`;

export const Text = styled.div`
  text-align: left;
  padding: 4px;
  font-size: 12pt;
`;
export const Name = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80%;
`;

export const Count = styled.div`
  background: blueviolet;
  border-radius: 10px;
  padding: 4px;
  color: white;
  font-size: 12pt;
`;
