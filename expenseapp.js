
const myForm = document.querySelector('#my-form');
const expenseInput = document.querySelector('#expense');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const listOfExpense = document.querySelector('#listofexpense');
   
document.getElementById("submitform").onclick= function(e){
  e.preventDefault();       
  const exp=expenseInput.value;
  const desc=descriptionInput.value;
  const cat=categoryInput.value;
  const inputData={
    exp,
    cat,
    desc
  };
  const token = localStorage.getItem('token');
  axios.post("http://localhost:3000/expense/add-expense",inputData,{headers:{"Authorization":token}})
    .then((response)=>{
      console.log(response);
      showuser(response.data.newExpense);
    })
    .catch((err)=>{
      console.log(err);
    })
    expenseInput.value = '';
    descriptionInput.value='';
    categoryInput.value = '';  
}


function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
   return JSON.parse(jsonPayload);
}

function showPremiumFeature(){
  document.getElementById("razorpayBuy").style.visibility="hidden";
  document.getElementById("message").innerHTML="Premium User";
}

function download(){
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
  .then((response) => {
    console.log(response.data.urls)
      showUrls(response.data.urls);
      if(response.status === 200){
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileUrl;
          a.download = 'myexpense.csv';
          a.click();
      } else {
          throw new Error(response.data.message)
      }

  })
  .catch((err) => {
    console.log(err)
    document.body.innerHTML+=`<div style="color:red;">${err.response.data.err.message}<div>`;
  });
}

function showUrls(urls){
  let urlElement = document.getElementById('dataurls');
  urlElement.innerHTML+="<h3>URLS</h3>";
  urls.forEach(url=>{
    urlElement.innerHTML+=`<li class="list-group-item">URL= ${url.url} </li>`;
  })
}
function showleaderBoard(){
  const leaderBoard = document.createElement("input");
  leaderBoard.className="btn btn-sm btn-outline-dark float-end";
  leaderBoard.type="button";
  leaderBoard.value="Show LeaderBoard";
  document.getElementById('message').appendChild(leaderBoard)
  leaderBoard.onclick= async function(e){
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/show-leaderboard',{headers:{"Authorization":token}})
    console.log(userLeaderBoardArray);
    let leaderBoardElement = document.getElementById('leaderboardlist');
    leaderBoardElement.innerHTML+="<h3>Leader Board</h3>";
    userLeaderBoardArray.data.forEach((userDetails)=>{
      leaderBoardElement.innerHTML+=`<li class="list-group-item">Name= ${userDetails.name} total Expense= ${userDetails.totalexpense}</li>`;
    })
  }
  
}

  window.addEventListener("DOMContentLoaded",()=>{
    const page = 1;
  const token = localStorage.getItem('token');
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  if(decodeToken.ispremiumuser==true)
  {
    showPremiumFeature();
    showleaderBoard();
    // showUrls()
  }else{
    document.getElementById("downloadexpense").style.visibility="hidden";
  }
  axios.get(`http://localhost:3000/expense/get-expense/page=${page}`,{headers:{"Authorization":token}})
    .then((response)=>{
      showuser(response.data.allExpense);
      showPagination(response.data);
    })
      .catch((err)=>{console.error(err)});
});

function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage,
}){
  pagination.innerHTML = "";
  if(hasPreviousPage){
    const btn2 = document.createElement('button');
    btn2.innerHTML = previousPage;
    btn2.addEventListener('click',()=>getExpense(previousPage));
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement('button');
    btn1.innerHTML = currentPage;
    btn1.addEventListener('click',()=>getExpense(currentPage));
    pagination.appendChild(btn1);

  if(hasNextPage){
    const btn3 = document.createElement('button');
    btn3.innerHTML = nextPage;
    btn3.addEventListener('click',()=>getExpense(nextPage));
    pagination.appendChild(btn3);
  }
}

function getExpense(page){
  console.log(page);
  axios.get(`http://localhost:3000/expense/get-expense/page=${page}`)
  .then((response)=>{
    console.log("page2",response);
    showuser(response.data.allExpense);
    showPagination(response.data);
  })
  .catch((err)=>{console.log(err)})
}



function showuser(object){

  const parentitem=document.getElementById("listofexpense");

  object.forEach(obj=>{
     console.log(obj);
     const deleteitem =document.createElement("input");
    deleteitem.className="btn btn-danger btn-sm btn-outline-dark float-end";
    deleteitem.type="button";
    deleteitem.value="Delete Expense";
     const childitem=document.createElement("li");
    childitem.className="list-group-item"
    childitem.textContent=obj.amount+" - "+obj.category+" - "+obj.description;
    childitem.appendChild(deleteitem);
    parentitem.appendChild(childitem);
    deleteitem.onclick=()=>{
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/delete-expense/${obj.id}`,{headers:{"Authorization":token}})
    .then((response)=>{
        console.log(response);
    })
    .catch((err)=>{
        console.log(err)
    });
      parentitem.removeChild(childitem);
  }
  })
  
}

document.getElementById("razorpayBuy").onclick= async function(e){
  e.preventDefault();
  const token = localStorage.getItem('token');
  await axios.get("http://localhost:3000/purchase/buypremiummembership",{headers:{"Authorization":token}})
  .then((response)=>{
    console.log("res",response);
      var options={
      "key":response.data.key_id,
      "order_id":response.data.order.id,
      "handler":async function(response){
        const res=await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
          order_id:options.order_id,
          payment_id:response.razorpay_payment_id,
        },{headers:{"Authorization":token}})
        alert("you are now a Premium User")
        showPremiumFeature();
        localStorage.setItem("token",res.data.token);
        showleaderBoard();
      }
    }
    const rzpl = new Razorpay(options);
    rzpl.open();
    e.preventDefault();
    rzpl.on('payment.failed', function(response){
      console.log(response);
      alert("Something Went Wrong With payment Please Try Again");
    })
  })
  .catch(err=>{console.log(err)});
}

document.getElementById("logout").onclick= async function(e){
  e.preventDefault();
  window.location.href = "./login.html";
}
