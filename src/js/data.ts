import { parse } from "papaparse";

declare namespace Datagouv {
  export interface Dataset {
    acronym: null;
    archived: null;
    badges: any[];
    created_at: Date;
    deleted: null;
    description: string;
    frequency: string;
    frequency_date: null;
    id: string;
    last_modified: Date;
    last_update: Date;
    license: string;
    metrics: Metrics;
    organization: Organization;
    owner: null;
    page: string;
    private: boolean;
    resources: Resource[];
    slug: string;
    spatial: null;
    tags: any[];
    temporal_coverage: null;
    title: string;
    uri: string;
  }

  interface Metrics {
    discussions: number;
    followers: number;
    issues: number;
    reuses: number;
    views: number;
  }

  interface Organization {
    acronym: null;
    class: string;
    id: string;
    logo: string;
    logo_thumbnail: string;
    name: string;
    page: string;
    slug: string;
    uri: string;
  }

  interface Resource {
    checksum: Checksum;
    created_at: Date;
    description: null;
    filesize: number;
    filetype: string;
    format: string;
    id: string;
    last_modified: Date;
    latest: string;
    metrics: ResourceMetrics;
    mime: string;
    preview_url: string;
    published: Date;
    title: string;
    type: string;
    url: string;
  }

  interface Checksum {
    type: string;
    value: string;
  }

  interface ResourceMetrics {
    views: number;
  }
}

export type Data = {
  departement: string;
  extract_date: string;
  indic_synthese: "vert" | "orange" | "rouge";
};

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
    "https://www.data.gouv.fr/fr/datasets/r/f2d0f955-f9c4-43a8-b588-a03733a38921";

  const raw = await fetch(dataset)
    .then((res) => res.text())
    .then((text) =>
      parse(text, {
        header: true,
      })
    );

  return groupBy<Data>((i) => i.extract_date, raw.data);
}
