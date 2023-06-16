const myForm = document.querySelector('#my-form');
const emailInput = document.querySelector('#email');

myForm.addEventListener('submit', onSubmit);
   
function onSubmit(e){
  e.preventDefault();       
  const email=emailInput.value;
  const inputData={
    email
  }
  axios.post("http://localhost:3000/passward/forgotpassward",inputData)
    .then((response)=>{
        console.log(response);
      if(response.status==200){
        window.location.href = "./login.html";
      }
    })
    .catch((err)=>{
    //   document.body.innerHTML+=`<div style="color:red;">${err.response.data.message}<div>`;
      console.log(err);
    })
    emailInput.value='';
} 