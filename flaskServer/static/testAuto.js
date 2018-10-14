let input = document.getElementById("myinput");
let awesomplete = new Awesomplete(input);

BASE_URL = "http://127.0.0.1:5000/";

axios.get(BASE_URL + "getCityNames").then(({data}) => {
  awesomplete.list = data;
  document.getElementById('submitButton').disabled = false;
  document.getElementById('myinput').disabled = false;
});

