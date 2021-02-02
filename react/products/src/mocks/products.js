/*
Использую генератор моков,
это позволяет безболезненно изменять модель данных.
Например, пока не проработана модель данных "доставки".
*/
import mocker from "mocker-data-generator";

const product = {
  id: {
    faker: "random.uuid"
  },
  name: {
    faker: "commerce.productName",
    length: 15
  },
  email: {
    faker: "internet.email"
  },
  count: {
    faker: "random.number"
  },
  price: {
    faker: "finance.amount(100, 1000000, 2)"
  },
  currency: {
    static: "USD"
  }
  // delivery: {
  //   function: function () {
  //     const a1 = this.faker.commerce.productName();
  //     // const a2 = this.faker.random.price;
  //     return this.faker.random.arrayElement([a1, "a2"]);
  //   }
  // }
};

export async function getFakeProducts(count = 5) {
  return mocker()
    .schema("products", product, count)
    .build()
    .then(
      (data) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(data.products), 1000);
        });
        // return data.products;
      },
      (err) => console.error(err)
    );
}
