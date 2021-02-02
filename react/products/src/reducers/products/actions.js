const {
  PRODUCTS_DATA_PENDING,
  PRODUCTS_DATA_SUCCESS,
  PRODUCTS_DATA_FAILED
} = "./const";

export async function getData(dispatch, dataGetter) {
  try {
    dispatch({ type: PRODUCTS_DATA_PENDING });
    const data = await dataGetter();
    dispatch({ type: PRODUCTS_DATA_SUCCESS, payload: { data } });
  } catch (e) {
    dispatch({ type: PRODUCTS_DATA_FAILED });
  }
}
