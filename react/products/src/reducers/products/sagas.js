import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  PRODUCTS_FETCH_REQUESTED,
  PRODUCTS_FETCH_SUCCEEDED,
  PRODUCTS_FETCH_FAILED
} from "./const";
import { getFakeProducts } from "../../mocks";

function* fetchProducts({ payload = {} }) {
  try {
    const { count = 5 } = payload;
    const data = yield call(getFakeProducts, count);
    yield put({
      type: PRODUCTS_FETCH_SUCCEEDED,
      payload: { data, loading: false }
    });
  } catch (e) {
    yield put({
      type: PRODUCTS_FETCH_FAILED,
      payload: {
        error: e.message,
        loading: false
      }
    });
  }
}

function* productsSaga() {
  yield takeEvery(PRODUCTS_FETCH_REQUESTED, fetchProducts);
}

export default productsSaga;
