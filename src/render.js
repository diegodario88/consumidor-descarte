import {
  toObject,
  Toast,
  toastMessages,
  clearCitiesSelect,
} from "./helpers.js";
import {
  populateStateSelect,
  populateCitiesSelect,
  fetchWithInterval,
} from "./http.js";

const form = document.querySelector("#form");
const fileInput = document.querySelector("#fileInput");
const cpf = document.querySelector("#cpf");
const estados = document.querySelector("#estado");
const cidades = document.querySelector("#cidade");
const modal = document.querySelector("#modal");
const calibragemValor = document.querySelector("#calibragem-valor");
const itensTotal = document.querySelector("#itens-total");
const progress = document.querySelector("#progress");
const fileName = document.querySelector("#fileName");

form.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  modal.classList.add("is-active");

  const inputs = Array.from(form.elements)
    .filter((input) => input.name)
    .reduce(toObject, {});

  const fakeItensQueSeraoConsumidosDoArquivo = [];

  for (let index = 1; index <= 107; index++) {
    fakeItensQueSeraoConsumidosDoArquivo.push(index);
  }

  calibragemValor.textContent = inputs["calibragem"];
  itensTotal.textContent = fakeItensQueSeraoConsumidosDoArquivo.length;

  const results = await fetchWithInterval({
    listOfItems: fakeItensQueSeraoConsumidosDoArquivo,
    packageSize: Number(inputs["calibragem"]),
    progress: progress,
  });

  console.log(results);

  modal.classList.remove("is-active");

  Toast.fire(toastMessages("success")).then(() => clearInputs());
});

const clearInputs = () => {
  form.reset();
  clearCitiesSelect();
  addDefaultCityOption();
  fileName.textContent = "Nenhum arquivo selecionado.";
};

fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    fileName.textContent = fileInput.files[0].name;
  }
};

function addDefaultCityOption() {
  const option = document.createElement("option");
  option.textContent = "Por favor, selecione um Estado";
  cidades.appendChild(option);
}

estados.addEventListener("change", ({ target }) => {
  const UF = target.value;

  if (UF === "Selecione um Estado") {
    clearCitiesSelect();
    addDefaultCityOption();
    return;
  }

  populateCitiesSelect(UF, cidades);
});

IMask(cpf, {
  mask: "000.000.000-00",
});

document.addEventListener("DOMContentLoaded", () =>
  populateStateSelect(estados)
);
