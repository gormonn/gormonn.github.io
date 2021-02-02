import React from "react";
import { Text } from "./Table";

/**
 * гипотетически, это сломается,
 * если в таблицу примешать данные в другой валюте.
 *
 * однако, в данном случае, дана таблица только с конкретной валютой
 */
const NumberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});
export function Price({ price }) {
  return <Text>{NumberFormat.format(price)}</Text>;
}
