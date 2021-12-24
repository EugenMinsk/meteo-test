
const searche = document.querySelector('#search')
let container = document.querySelector('#container')
const mainForm = document.querySelector('#mainform')
const updateBtn = document.querySelector('#update')
const closeModalBtn = document.querySelector('#close-modal-window')
const arrtimeoutID = []

 sessionStorage.clear()

const request = function (event) {
  event.preventDefault();
  
  let city = document.querySelector('#city').value
  let key = '4c5044519b3b54a220c234bfd2b5d6b4'

  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
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
      newCard.innerHTML = `<span class="meteo-card__close"></span><h2>${cityName}</h2><p class="degrees">${degrees}</p><p class="description">${description}
      </p><img src="" >` 
      newCard.querySelector('img').setAttribute('src', `https://openweathermap.org/img/wn/${icon}.png`);
      container.append(newCard)

      const timeoutID =  setTimeout(function update(){
                          console.log('рекурсивный сетТаймаут запущен');
                          arrtimeoutID.push(timeoutID)
                          console.log(arrtimeoutID);
                          updateShow()
                          setTimeout(update,10000);
                          },10000);
      console.log(timeoutID);
      
/*       setTimeout(function update(){
        console.log('рекурсивный сетТаймаут запущен');
        updateShow()
        setTimeout(update,1000);
      },1000) */

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
  let key = '4c5044519b3b54a220c234bfd2b5d6b4'
  const arr = JSON.parse(sessionStorage.getItem('newArr'));
  console.log(arr);
  for (const item in arr) {
    console.log(arr[item]);
    let city = arr[item]
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},london&appid=${key}`)
    .then(function(resp){
      //обрабатываем успешно выполненный запрос и преобразует его в json формат(строку преобразует в массив)
      return resp.json()})
    .then(function(data){
      console.log(data);
      for(let i = 0; i<container.children.length; i++){
        if(i == item){
          let degrees = Math.round(data.main.temp - 273,15) +'&deg';
          let description = data.weather[0]['description'];
          let icon = data.weather[0]['icon'];         
          console.log(container.children[i]);
          container.children[i].querySelector('.degrees').innerHTML = degrees;
          container.children[i].querySelector('.description').innerHTML = description;
          container.children[i].querySelector('img').setAttribute('src',`https://openweathermap.org/img/wn/${icon}.png`)
        }
      }        
   
    }).then (function(){

    })
    .catch(function(error){
      //обрабатываем ошибку
      console.log(error);
      console.log('error');
    })
    .then(function(){
      //выполняется всегда
  
    })
  }
  // if(){

  // }
  // fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},london&appid=${key}`)
}
const closeCard = function(event){
  if(event.target.classList.contains('meteo-card__close')){
    console.log(event.target.nextSibling.innerHTML);
    const arr = JSON.parse(sessionStorage.getItem('newArr'));

    for(let i = 0; i<arr.length; i++){
      if(arr[i] === event.target.nextSibling.innerHTML) {
        console.log(arr[i]);
        arr.splice(i,1)
        console.log(arr);
        sessionStorage.setItem('newArr', JSON.stringify(arr))
        event.target.closest('.meteo-card').remove()
      }
    }

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