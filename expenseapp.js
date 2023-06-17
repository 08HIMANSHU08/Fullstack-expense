
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
  showReport();
}
function showReport(){
  const report = document.createElement("input");
  report.className="btn btn-sm btn-outline-dark float-end";
  report.type="button";
  report.value="Download Report";
  document.getElementById('message').appendChild(report);
  report.onclick=async function(e){
    e.preventDefault();
    window.location.href="./report.html";
  }
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
    leaderBoardElement.innerHTML+="<h1>Leader Board</h1>";
    userLeaderBoardArray.data.forEach((userDetails)=>{
      leaderBoardElement.innerHTML+=`<li>Name= ${userDetails.name} total Expense= ${userDetails.totalexpense}`;
    })
  }
  
}

  window.addEventListener("DOMContentLoaded",()=>{
  const token = localStorage.getItem('token');
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  if(decodeToken.ispremiumuser==true)
  {
    showPremiumFeature();
    showleaderBoard();
  }
  axios.get(`http://localhost:3000/expense/get-expense`,{headers:{"Authorization":token}})
    .then((response)=>{
     response.data.allExpense.forEach(expense=>{
        showuser(expense);
      })
      })
      .catch((err)=>{console.error(err)});
});

function showuser(obj){

  const parentitem=document.getElementById("listofexpense");
  const childitem=document.createElement("li");
  childitem.className="list-group-item"
  childitem.textContent=obj.amount+" - "+obj.category+" - "+obj.description;

  const deleteitem =document.createElement("input");
  deleteitem.className="btn btn-danger btn-sm btn-outline-dark float-end";
  deleteitem.type="button";
  deleteitem.value="Delete Expense";

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
 
  childitem.appendChild(deleteitem);
  parentitem.appendChild(childitem);
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