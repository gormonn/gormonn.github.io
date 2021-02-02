import {
  PRODUCTS_FETCH_REQUESTED,
  PRODUCTS_FETCH_SUCCEEDED,
  PRODUCTS_FETCH_FAILED
} from "./const";

const initialState = {
  data: [],
  loading: false,
  error: false
};

export default function reducer(state = initialState, { type, payload }) {
  // console.log(type);
  switch (type) {
    case PRODUCTS_FETCH_REQUESTED: {
      return { ...state, loading: true };
    }
    case PRODUCTS_FETCH_SUCCEEDED: {
      const { data } = payload;
      return { ...state, data, loading: false, error: false };
    }
    case PRODUCTS_FETCH_FAILED: {
      const { error } = payload;
      return { ...state, error, loading: false };
    }
    default:
      return state;
  }
}
export { default as productsSagas } from "./sagas";
// запутанные экспорты если честно
