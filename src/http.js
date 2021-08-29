import { sleep, clearCitiesSelect } from "./helpers.js";

const IBGE_UF_URL =
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

/**
 * @description
 * Recebe um input select e alimenta com os dados do IBGE.
 * @param {Element} stateSelect
 */
export function populateStateSelect(stateSelect) {
  axios.get(`${IBGE_UF_URL}?orderBy=nome`).then(({ data }) =>
    data.map((state) => {
      const option = document.createElement("option");
      option.setAttribute("value", state.sigla);
      option.textContent = state.nome;
      stateSelect.appendChild(option);
    })
  );
}

/**
 * @description
 * Recebe uma unidade federativa e um input select; alimenta o select de cidades com dados do IBGE.
 * @param {string} UF
 * @param {Element} citySelect
 */
export function populateCitiesSelect(UF, citySelect) {
  document.querySelector(".cidade-holder").classList.add("is-loading");
  axios.get(`${IBGE_UF_URL}/${UF}/municipios`).then(({ data }) => {
    clearCitiesSelect();
    data.map((city) => {
      const option = document.createElement("option");
      option.setAttribute("value", city.nome);
      option.textContent = city.nome;
      citySelect.appendChild(option);
      document.querySelector(".cidade-holder").classList.remove("is-loading");
    });
  });
}

/**
 * @description
 * Faz requisições em um intervalo de tempo.
 * @param {Object} options - Opções de configuração.
 * @param {Array} options.listOfItems - Lista de itens a serem percorridos.
 * @param {Number} options.packageSize - Tamanho do pacote de envio.
 * @param {Element} options.progress - Elemento HTML para receber atualização do progresso de envio.
 * @param {Number} options.delay - Número em milissegundos antes de enviar pacotes.
 */
export async function fetchWithInterval({
  listOfItems = [],
  packageSize = 10,
  progress,
  delay = 2000,
}) {
  const rounds = Math.floor(listOfItems.length / packageSize);
  const valuePerRound = Math.floor(100 / rounds);
  const resolveBundle = [];
  const promisesBundle = [];
  const results = [];

  const request = (item) =>
    axios
      .get(`${API_URL}/${item}`)
      .then((res) => results.push(res.data))
      .catch((error) => console.log(error.toJSON())); //TODO: Lidar com erros

  const updateProgress = () =>
    progress.setAttribute("value", Number(progress.value) + valuePerRound);

  for (let index = 1; index <= listOfItems.length; index++) {
    const item = listOfItems[index - 1];
    const shouldNotSendPackage = !(index % packageSize === 0);

    if (shouldNotSendPackage) {
      promisesBundle.push(request(item));
      continue;
    }

    console.warn(`Enviando ${packageSize} requisições após ${delay}ms`);
    await sleep(delay);
    promisesBundle.push(request(item));
    resolveBundle.push(await Promise.allSettled(promisesBundle));

    updateProgress();
    promisesBundle.length = 0;
  }

  const leftOver = promisesBundle.length;

  if (leftOver) {
    console.warn(`Enviando resto de ${leftOver} requisições após ${delay}ms`);
    await sleep(delay);
    resolveBundle.push(await Promise.allSettled(promisesBundle));
  }

  return results;
}
