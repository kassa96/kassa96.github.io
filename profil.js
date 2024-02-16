import { renderConnexion, renderProfil } from "./render.js";
google.charts.load('current', {'packages':['corechart', 'bar']});
const graphqlQuery = `
query{
  infos:user{
  		campus
      email
      firstName
      lastName
      auditRatio
      login
      campus
}
   skills: user{
    transactions(where:{type:{_like:"skill_%"}}, distinct_on:[type],order_by:[{type:desc},{amount:desc}]){
      amount
      type
    }
  }
  xp: user{
    transactions_aggregate(where:{
      type:{_eq: "xp"}, event:{object:{type:{_eq:"module"}}}}){
    aggregate{
      sum{
        amount
      }
    }
  }
  }
    count_fail_audit: user{
      audits_aggregate(where:{grade:{_is_null:false}, _and:{grade:{_lt:1}}}){
        aggregate{
          count
        }
      }
    }
    count_pass_audit: user{
      audits_aggregate(where:{grade:{_is_null:false}, _and:{grade:{_gte:1}}}){
        aggregate{
          count
        }
      }
    }
    xp_projects: user{
      transactions(where:{type:{_eq:"xp"},_and:
        [
          {path:{_like:"/dakar/div-01%"}},
          {path:{_nlike:"/dakar/div-01/piscine-js%"}},
          {path:{_nlike:"/dakar/div-01/piscine-js-2%"}},
          {path:{_nlike:"/dakar/div-01/checkpoint%"}}
        ]
      }){
        amount
        path
      }
    }
}
`;
const token = localStorage.getItem('token');
  if (token) {
    loadProfil(token)
   // console.log(token)
  } else {
    document.getElementById("app").innerHTML = renderConnexion()
    document.getElementById("submit-btn").addEventListener("click", authentificationSubmit)

  }
function authentificationSubmit(event){
  event.preventDefault()
  let username = document.getElementById("username").value
  let password = document.getElementById("password").value
  let message = document.getElementById("erreur-connexion")
  if (username === undefined || username === ""){
    message.innerText = "please give your username."
    message.style.display="block"
    return
  }else if (password === undefined || password === ""){
    message.innerText = "please give your password."
    message.style.display="block"
    return
  }
username = encodeURI(username)
password = encodeURI(password)
  authenticate(username, password)
  .then(token => {
    if (token) {
      loadProfil(token)
    }else {
      message.innerText = "this user does not exist or credential does not correct."
      message.style.display="block"
    }
  });
}
function loadProfil(token){
    getUserProfil(graphqlQuery, token)
    .then(data => {
    if (data) {
      if (data.data === undefined){
        document.getElementById("app").innerHTML = renderConnexion()
        document.getElementById("submit-btn").addEventListener("click", authentificationSubmit)
        return  
      }
      if (data.data.infos === undefined ||
        data.data.infos[0].auditRatio === undefined ||
         data.data.infos[0].auditRatio=== null ||
         data.data.infos[0].auditRatio ===0.0){
          document.getElementById("app").innerHTML = renderConnexion()
          document.getElementById("submit-btn").addEventListener("click", authentificationSubmit)
          let message = document.getElementById("erreur-connexion")
          message.innerText = "this user has no activity."
          message.style.display="block"
          return
         }
      document.getElementById("app").innerHTML = renderProfil()
      document.getElementById("logout").addEventListener("click", logout)

      console.log('Réponse GraphQL:', data);
      localStorage.setItem('token', token);
      let skills = getBestSkills(data)
      let xp = totalXP(data)
      let ratio = data.data.infos[0].auditRatio
      renderInfos(data)
      renderBestSkills(skills)
      renderXPAndRation(xp, ratio)
      setTimeout(function(){
        google.charts.setOnLoadCallback(drawChart(data));
        google.charts.setOnLoadCallback(drawBar(data));
      }, 2000)
     

    } else {
      document.getElementById("app").innerHTML = renderConnexion()
      document.getElementById("submit-btn").addEventListener("click", authentificationSubmit)
      let message = document.getElementById("erreur-connexion")
      message.innerText = "the token is expired or not correct."
      message.style.display="block"
    }
});
}


//Pour autentifier les infos de l'utilisateur
async function authenticate(username, password) {
    const apiUrl = 'https://learn.zone01dakar.sn/api/auth/signin';
      const credentials = {
      username: username,
      password: password
    };
      const base64Credentials = btoa(`${credentials.username}:${credentials.password}`);
      const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Credentials}`       
    },
    };
  
    return fetch(apiUrl, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Échec de l\'authentification');
        }
          return response.json();
      })
      .catch(error => {
       // console.error('Erreur d\'authentification:', error.message);
        return null;
      });
  }

  //Pour recuperer les infos de l'utilisateur
  async function getUserProfil(query, token) {
  const apiUrl = 'https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql'; 
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify({query}),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
    if (!response.ok) {
      throw new Error('Échec de la requête GraphQL');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur de requête GraphQL:', error.message);
    return null; 
  }
}

function getBestSkills(data, limit=10){
let skills = data.data.skills[0].transactions
skills.sort((a, b) => b.amount - a.amount);
const result = skills.slice(0, limit);
  return result
}
function renderBestSkills(skills){
  let render = ""
skills.forEach(skill => {
  render += `<label class="type-skill">${skill.type}</label>
  <div class="progress">
    <div class="progress-bar" role="progressbar" style="width: ${skill.amount}%;" aria-valuenow="${skill.amount}" aria-valuemin="0" aria-valuemax="100">${skill.amount}%</div>
  </div>`
});
document.getElementById("skills_section").innerHTML=render
}

function totalXP(xp){
 let totalAmount  = xp.data.xp[0].transactions_aggregate.aggregate.sum.amount
  totalAmount /= 1000


  return totalAmount.toFixed(0);
}
function renderXPAndRation(xp,ratio){
  ratio = ratio.toFixed(1)
document.getElementById("xp").innerHTML = xp + " KB"
document.getElementById("ration").innerHTML = ratio
}

function renderInfos(data){
  let fullName = data.data.infos[0].firstName + " "+ data.data.infos[0].lastName
  let mail = data.data.infos[0].email
  let login =data.data.infos[0].login
  let campus = data.data.infos[0].campus
  document.getElementById("user-name").innerHTML = fullName
  document.getElementById("login").innerHTML = login
  document.getElementById("mail").innerHTML = mail
  document.getElementById("campus").innerHTML = "campus " +campus
}

function drawChart(data) {
let fail = data.data.count_fail_audit[0].audits_aggregate.aggregate.count
let pass = data.data.count_pass_audit[0].audits_aggregate.aggregate.count
  data = google.visualization.arrayToDataTable([
    ['audits', 'count'],
    ['pass',     pass],
    ['fail',      fail],
  ]);

  let chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data);
}

function drawBar(amounts) {
  amounts = amounts.data.xp_projects[0].transactions
  amounts = transformData(amounts)
  let data = google.visualization.arrayToDataTable(amounts);
  let chart = new google.charts.Bar(document.getElementById('columnchart_material'));
  let options = {
      slantedText: true, 
      slantedTextAngle: 90 
  };
  chart.draw(data, options);
}


function transformData(data) {
  const prefix = '/dakar/div-01/';
  const transformedData = [["project", "xp"]];
  data.forEach(obj => {
      const newPath = obj.path.replace(prefix, '');
      const newData = [newPath, obj.amount];
      transformedData.push(newData);
  });
  transformedData.sort((a, b) => b[1] - a[1]);
  return transformedData;
}
function logout(event){
  event.preventDefault()
  localStorage.removeItem('token');
  document.getElementById("app").innerHTML = renderConnexion()
  document.getElementById("submit-btn").addEventListener("click", authentificationSubmit)

}


