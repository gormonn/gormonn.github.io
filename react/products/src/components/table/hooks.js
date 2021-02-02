import { sorter } from "./utils";

export function useSorter(state) {
  const { sortByKey, directionKey } = state.sort;
  const { dataIndex, sortDirections = [] } = state.sortOptions[sortByKey] || {};
  const sortDirection = sortDirections[directionKey] || false;
  return [sorter(dataIndex, sortDirection), sortDirection];
}
