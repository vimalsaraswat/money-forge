import { aiQueries } from "./ai";
import { financeQueries } from "./finance";
import { userQueries } from "./user";

export const DB = {
  ...aiQueries,
  ...userQueries,
  ...financeQueries,
};
