const form = document.querySelector("#form");
const fileInput = document.querySelector("#fileInput");
const cpf = document.querySelector("#cpf");
const modal = document.querySelector("#modal");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  modal.classList.add("is-active");

  console.log(form.elements);
});

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
