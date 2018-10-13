let input = document.getElementById("myinput");
let awesomplete = new Awesomplete(input);

/* ...more code... */
BASE_URL = "http://127.0.0.1:5000/";

axios.get(BASE_URL + "getCityNames").then(({data}) => {
  awesomplete.list = data;
});