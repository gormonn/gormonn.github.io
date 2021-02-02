export const initialState = {
  sort: {
    sortByKey: false,
    directionKey: 0
  },
  sortOptions: {},
  sortTitle: {
    // здесь можно положить className
    asc: "\\/",
    desc: "/\\",
    default: "||"
  },
  filter: false
};

export function reducer(state, action) {
  switch (action.type) {
    case "sortInit": {
      const { key, dataIndex, sortDirections } = action.payload;
      return {
        ...state,
        sortOptions: {
          ...state.sortOptions,
          [key]: {
            dataIndex,
            sortDirections
          }
        }
      };
    }
    case "sortToggle": {
      const { sortByKey } = action.payload;
      const { sortByKey: oldSortByKey } = state.sort;

      const isSameSort = oldSortByKey === sortByKey;
      const { directionKey } = isSameSort ? state.sort : { directionKey: 0 };

      const { sortDirections } = state.sortOptions[sortByKey];
      const isNewCicle = directionKey === sortDirections.length - 1;

      const nextDirectionKey = isNewCicle ? 0 : directionKey + 1;
      return {
        ...state,
        sort: {
          sortByKey,
          directionKey: nextDirectionKey
        }
      };
    }
    default:
      return state;
  }
}
