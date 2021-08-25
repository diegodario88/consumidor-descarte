const btnTrigga = document.getElementById("btnTrigga");
const caixaResultado = document.getElementById("caixaResultado");
const formulario = document.getElementById("formulario");

const payload = {
  name: "Philip Moss Mccray",
  gender: "Soluta doloremque do",
  age: 36,
  hobby: "Blanditiis excepturi",
  email: "12ssf3bicygecefo@mailinator.com",
  bio: "Repellendus Molesti",
  birthday: "1984-12-06",
  avatar: "",
  proficiency: [
    {
      skill: "JavaScript",
      rate: 50,
    },
    {
      skill: "NodeJs",
      rate: 60,
    },
    {
      skill: "CSS",
      rate: 60,
    },
  ],
};

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
