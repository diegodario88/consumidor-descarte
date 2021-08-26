const form = document.querySelector("#form");
const fileInput = document.querySelector("#fileInput");
const cpf = document.querySelector("#cpf");
const modal = document.querySelector("#modal");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  modal.classList.add("is-active");

  console.log(form.elements);
});

const getInChunk = async function (items, chunkSize) {
  const chunkResults = [];
  const results = [];
  let chunkPromises = [];

  for (let index = 0; index < items.length; index++) {
    if (index % chunkSize === 0) {
      chunkPromises = [];

      console.warn(`invocando ${chunkSize} requisições após 2000ms`);

      await sleep(2000); //Delay para não sobrecarregar o endpoint

      chunkResults.push(await Promise.all(chunkPromises));

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
    const fileName = document.querySelector("#fileName");
    fileName.textContent = fileInput.files[0].name;
  }
};

IMask(cpf, {
  mask: "000.000.000-00",
});

async function main() {
  const strings = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22,
  ];
  const results = await getInChunk(strings, 5);
  console.log(results);
}

main();
