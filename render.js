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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toObject = (acc, current) => {
  acc[current.name] = current.value;
  return acc;
};

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

form.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  modal.classList.add("is-active");
  const inputs = Array.from(form.elements)
    .filter((input) => input.name)
    .reduce(toObject, {});

  const fakeItensQueSeraoConsumidosDoArquivo = [];

  for (let index = 1; index <= 200; index++) {
    fakeItensQueSeraoConsumidosDoArquivo.push(index);
  }

  calibragemValor.textContent = inputs["calibragem"];
  itensTotal.textContent = fakeItensQueSeraoConsumidosDoArquivo.length;

  const rounds = Math.floor(
    fakeItensQueSeraoConsumidosDoArquivo.length / inputs["calibragem"]
  );

  const valuePerRound = Math.floor(100 / rounds);

  const results = await getInChunk(
    fakeItensQueSeraoConsumidosDoArquivo,
    inputs["calibragem"],
    valuePerRound
  );

  console.log(results);

  modal.classList.remove("is-active");

  Toast.fire({
    icon: "success",
    title: "Todas as notas fiscais foram descartadas com sucesso!",
  }).then(() => {
    form.reset();
    clearCitiesSelect();
    addDefaultCityOption();
    fileName.textContent = "Nenhum arquivo selecionado.";
  });
});

const getInChunk = async function (items, chunkSize, valuePerRound) {
  const chunkResults = [];
  const results = [];
  let chunkPromises = [];

  for (let index = 0; index < items.length; index++) {
    if (index % chunkSize === 0) {
      chunkPromises = [];

      console.warn(`invocando ${chunkSize} requisições após 2000ms`);

      await sleep(2000); //Delay para não sobrecarregar o endpoint

      chunkResults.push(await Promise.all(chunkPromises));
      progress.setAttribute("value", progress.value + valuePerRound);
      chunkPromises.push(
        axios
          .get(`https://jsonplaceholder.typicode.com/todos/${items[index]}`)
          .then((res) => results.push(res.data))
      );
    } else {
      chunkPromises.push(
        axios
          .get(`https://jsonplaceholder.typicode.com/todos/${items[index]}`)
          .then((res) => results.push(res.data))
      );
    }
  }

  if (chunkPromises.length) {
    console.warn(`invocando ${chunkPromises.length} requisições após 2000ms`);
    await sleep(2000); //Delay para não sobrecarregar o endpoint
    chunkResults.push(await Promise.all(chunkPromises));
  }

  return results;
};

function fetchDiscarded() {
  //TODO: Falta fazer uma função que monta o payload.
  //Após o envio do post deve remover a classe is-active do modal e exibir um resumo
  //das ações que foram feitas.

  axios.post("http://localhost:8080/api/v1/developers", payload).then((res) => {
    console.log(res);
    const p = document.createElement("p");
    p.innerText = res.statusText;
    caixaResultado.appendChild(p);
  });
}

fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    fileName.textContent = fileInput.files[0].name;
  }
};

function clearCitiesSelect() {
  document
    .querySelectorAll("#cidade option")
    .forEach((option) => option.remove());
}

function addDefaultCityOption() {
  const option = document.createElement("option");
  option.textContent = "Por favor, selecione um Estado";
  cidades.appendChild(option);
}

estados.addEventListener("change", (evt) => {
  const UF = evt.target.selectedOptions[0].value;

  if (UF === "Selecione um Estado") {
    clearCitiesSelect();
    addDefaultCityOption();
    return;
  }

  populateCitiesSelect(UF);
});

function populateStateSelect() {
  axios
    .get(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    )
    .then(({ data }) =>
      data.map((state) => {
        const option = document.createElement("option");
        option.setAttribute("value", state.sigla);
        option.textContent = state.nome;
        estados.appendChild(option);
      })
    );
}

function populateCitiesSelect(UF) {
  document.querySelector(".cidade-holder").classList.add("is-loading");
  axios
    .get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`
    )
    .then(({ data }) => {
      clearCitiesSelect();
      data.map((city) => {
        const option = document.createElement("option");
        option.setAttribute("value", city.nome);
        option.textContent = city.nome;
        cidades.appendChild(option);
        document.querySelector(".cidade-holder").classList.remove("is-loading");
      });
    });
}

IMask(cpf, {
  mask: "000.000.000-00",
});

document.addEventListener("DOMContentLoaded", (event) => {
  populateStateSelect();
});
