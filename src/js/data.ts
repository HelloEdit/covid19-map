export interface Dataset {
  date: string;
  codeDepartement: string;
  nomDepartement: string;
  nomRegion: string;
  indicateurSynthese: ActivityColor;
}

type ActivityColor = "vert" | "orange" | "rouge";

/**
 * Splits a list into sub-lists stored in an object, based on the result of
 * calling a String-returning function on each element, and grouping the
 * results according to values returned.
 * @param fn custom logic Function
 * @param list array to group
 * @return grouped object
 */
export function groupBy<T>(fn: (a: T) => string, list: T[]) {
  var result: Record<string, T[]> = {};
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var key = fn(item);

    if (key === "") continue;

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
}

/**
 * Load the from data.gouv.fr for COVID19 dataset
 */
export async function load_data() {
  const dataset =
    "https://www.data.gouv.fr/fr/datasets/r/01151af0-3209-4e89-94ab-9b319001c159";

  const data = await fetch(dataset).then((res) => res.json());

  return groupBy<Dataset>((i) => i.date, data);
}
