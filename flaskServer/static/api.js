BASE_URL = "http://127.0.0.1:5000/";

export function getCities() {
  axios.get(BASE_URL + 'getCities')
  .then(function (response) {
    // handle success
    return(response['data']);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
};

function getPostcodes(cityName) {
  axios.post(BASE_URL + 'getPostcodes', {cityName: cityName})
  .then(function (response) {
    // handle success
    return(response['data']);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}

function getPeople(postCode) {
  axios.post(BASE_URL + 'getPeople', {postCode: postCode})
  .then(function (response) {
    // handle success
    console.log(response['data']);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}


function getDrg(drgCode) {
  axios.post(BASE_URL + 'getDrg', {'drgCode': drgCode})
  .then(function (response) {
    // handle success
    console.log(response['data']);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}