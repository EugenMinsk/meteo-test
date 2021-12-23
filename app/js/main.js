
const searche = document.querySelector('#search')
let container = document.querySelector('#container')
const mainForm = document.querySelector('#mainform')
const updateBtn = document.querySelector('#update')
const closeModalBtn = document.querySelector('#close-modal-window')
// const arr = []

const newElement = function (){



}

sessionStorage.clear()

const request = function (event) {
  event.preventDefault();
  
  let city = document.querySelector('#city').value
  let key = '5242e56a881e81ef9e3e59278ec7189d'

  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},london&appid=${key}`)
  .then(function(resp){
    //обрабатываем успешно выполненный запрос и преобразует его в json формат(строку преобразует в массив)
    return resp.json()})
  .then(function(data){
    console.log(data);
    let cityName = data.name;
    const arr = JSON.parse(sessionStorage.getItem('newArr')) || [];

    //проверка на наличие этого же города
    if(arr.includes(cityName)){
      document.querySelector('#modal-window').classList.add('active')
      document.querySelector('#modal-window').querySelector('p').innerHTML = 'Данный город уже добавлен вами'
    } else {

      let degrees = Math.round(data.main.temp - 273,15) +'&deg';
      let description = data.weather[0]['description'];
      let icon = data.weather[0]['icon'];
      newElement(cityName, degrees, description, icon)

      arr.push(cityName);
      console.log(arr);
      sessionStorage.setItem('newArr', JSON.stringify(arr));  
    }

    // Создание новой карточки
    function newElement(cityName, degrees, description, icon){
      let newCard = document.createElement('div')
      newCard.classList.add('meteo-card')
      newCard.innerHTML = `<span class="meteo-card__close"></span><h2>${cityName}</h2><p>${degrees}</p><p>${description}
      </p><img src="" >` 
      newCard.querySelector('img').setAttribute('src', `https://openweathermap.org/img/wn/${icon}.png`);
      container.append(newCard)
    }

  }).then (function(){
       if(!container.firstChild){
      console.log('ноль');
      updateBtn.classList.remove('active')
   }else{
    updateBtn.classList.add('active')
   }
  })
  .catch(function(error){
    //обрабатываем ошибку
    console.log(error);
  })
  .then(function(){
    //выполняется всегда

  })
}


function updateShow(){
  console.log('обновить');
}
const closeCard = function(event){
  if(event.target.classList.contains('meteo-card__close')){
    console.log(event.target.nextSibling.innerHTML);
    const arr = JSON.parse(sessionStorage.getItem('newArr'));

    // for(let i = 0; i<arr.length; i++){
    //   if(arr[i] === event.target.nextSibling.innerHTML)
    //   console.log(arr[i]);
    //   arr.splice(i,1)
    //   console.log(arr);
    //   break
    // }

    const index = arr.indexOf(el => el === event.target.nextSibling.innerHTML);
    arr.splice(index, 1)
    sessionStorage.setItem('newArr', JSON.stringify(arr))
    event.target.closest('.meteo-card').remove()  
  }
  if(!container.firstChild){
    updateBtn.classList.remove('active')
  }else{
    updateBtn.classList.add('active')
  }

}
const closeModal = function(event){
  console.log('работает');
this.parentNode.classList.remove('active')
} 

container.addEventListener('click', closeCard)
updateBtn.addEventListener('click', updateShow )
closeModalBtn.addEventListener('click', closeModal )
mainForm.addEventListener('submit', request)