export const formatPhoneNumber = (e) => {
  let input = e.target.value;

  input = input.replace(/\D/g, "");
  if (input.startsWith("0")) {
    input = input.slice(1);
  } else if (input.startsWith("62")) {
    input = input.slice(2);
  }
  if (input.length > 3) {
    input = input.replace(/(\d{3})(\d{4})(\d+)/, "$1 $2 $3");
  }
  e.target.value = input;
};
