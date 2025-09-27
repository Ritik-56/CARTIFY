const Email=document.getElementById("email");
const Pass = document.getElementById("password");
const Username = document.getElementById("username")
const btn= document.getElementById("input-btn");


btn.addEventListener("click",()=>{
    details={
    id:Date.now(),
    User:Username.value,
    EmailID:Email.value,
    Password:Pass.value,
}
    if (localStorage.getItem(details.User)) {
        alert('uesr regisetered before');
        return;
        
    }
 
    savetodb(details);
    Username.value=``;
    Email.value=``;
    Pass.value=``;
    
})


function savetodb(details) {
    localStorage.setItem(details.User,JSON.stringify(details));
}

