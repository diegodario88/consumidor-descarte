const btnTrigga = document.getElementById("btnTrigga");
const caixaResultado = document.getElementById("caixaResultado");
const formulario = document.getElementById("formulario");

btnTrigga.addEventListener("click", (evt) => {
  evt.preventDefault();
  const elementos = formulario.elements;
  console.log(elementos);

  //TODO: Pegar os inputs montar o payload
});

function fetchDiscarded() {
  axios.post("http://localhost:8080/api/v1/developers", payload).then((res) => {
    console.log(res);
    const p = document.createElement("p");
    p.innerText = res.statusText;
    caixaResultado.appendChild(p);
  });
}
