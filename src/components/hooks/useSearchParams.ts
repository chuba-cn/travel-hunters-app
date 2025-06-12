import {
  parseAsString,
  parseAsInteger,
  parseAsIsoDate,
  useQueryStates,
} from "nuqs";

export function useSearchParams() {
  return useQueryStates({
    ss: parseAsString.withDefault(""),
    start_date: parseAsIsoDate,
    end_date: parseAsIsoDate,
    room_count: parseAsInteger.withDefault(1),
    adult_count: parseAsInteger.withDefault(1),
    child_count: parseAsInteger.withDefault(0),
  });
}
