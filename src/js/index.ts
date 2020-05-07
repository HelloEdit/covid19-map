import departments from "./departments.json";
import { load_data } from "./data";

async function main() {
  // Inserts the departments in the list
  const list = document.querySelector("#searchbox__result > ul") as HTMLUListElement;

  for (let department of departments) {
    let item = document.createElement("li");
    let code = document.createElement("span");
    let symbol = document.createElement("div");
    let container = document.createElement("div");

    let name = document.createTextNode(department.name);

    code.innerText = department.id.substring(3);

    container.append(code, name);

    item.setAttribute("data-postcode", department.id);
    item.append(container, symbol);

    list.appendChild(item);
  }

  const data = await load_data();

  // Data's key are the date of publication
  const dates = Object.keys(data);

  const latest = dates.reduce((a, b) => (Date.parse(a) > Date.parse(b) ? a : b));

  {
    const info = document.querySelector("#panel__information");
    const text = document.createTextNode("Données gouvernementale du ");

    const time = document.createElement("time");
    time.dateTime = latest;
    time.innerText = new Date(latest).toLocaleDateString();

    info?.append(text, time);
  }

  /**
   * Associate with a colour a level
   * @param color department color
   */
  function determineLevel(color: string) {
    switch (color) {
      case "vert":
        return "low";

      case "orange":
        return "medium";

      case "rouge":
        return "high";

      default:
        throw new Error(`"${color}" is not a valid color.`);
    }
  }

  for (let chunk of data[latest]) {
    document
      .querySelectorAll(`[data-postcode="FR-${chunk.departement}"]`)
      .forEach((i) => i.setAttribute("data-level", determineLevel(chunk.indic_synthese)));
  }

  /**
   * Change map's display mode
   * @param mode display mode
   */
  function setMapDisplayMode(mode: string) {
    let root = document.documentElement;

    switch (mode) {
      case "color":
        {
          root.style.setProperty("--level-low", "green");
          root.style.setProperty("--level-medium", "yellow");
          root.style.setProperty("--level-high", "red");
        }
        break;

      case "grayscale":
        {
          root.style.setProperty("--level-low", "#BABABA");
          root.style.setProperty("--level-medium", "#717171");
          root.style.setProperty("--level-high", "#282828");
        }
        break;

      default:
        break;
    }
  }

  const displayMode = document.getElementById("display-state") as HTMLSelectElement;
  setMapDisplayMode(displayMode.value);

  // Display mode of the map ("grayscale", "color")
  displayMode?.addEventListener("input", ({ target }) => {
    if (!target) return;

    let value = (target as HTMLSelectElement).value;
    setMapDisplayMode(value);
  });
}

main().catch((error) => console.error(error));
