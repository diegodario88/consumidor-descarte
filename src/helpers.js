export const toObject = (acc, current) => {
  acc[current?.name] = current?.value;
  return acc;
};

export const Toast = Swal.mixin({
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

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const toastMessages = (type) => {
  const dictionary = {
    success: {
      icon: "success",
      title: "Todas as notas fiscais foram descartadas com sucesso!",
    },
    error: {
      icon: "error",
      title: "Ocorreu um erro inesperado!",
    },
    warning: {
      icon: "warning",
      title: "Alerta comportamento indevido!",
    },
  };

  return dictionary[type];
};

export const clearCitiesSelect = () =>
  document
    .querySelectorAll("#cidade option")
    .forEach((option) => option.remove());
