import type { Customer, Option } from "./data.default";

const URL =
  "https://686547495b5d8d0339808f5d.mockapi.io/spitogatos/api/customer-email-lookup";

// Get Customers

export async function getCustomers(): Promise<Option[]> {
  const res = await fetch(URL);
  const data: Customer[] = await res.json();

  const customersData: Option[] = data.map((item) => {
    return {
      id: item.id,
      label: item.email,
      value: item.email,
    };
  });

  return customersData;
}
