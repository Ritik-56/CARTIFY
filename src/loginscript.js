const btn =document.getElementById("input-btn");
const Email = document.getElementById("Email");
const Password = document.getElementById("Password");

btn.addEventListener("click",()=>{
    let found = false;
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let user = JSON.parse(localStorage.getItem(key));

        if (user.EmailID == Email.value) {
            found = true;
            if (user.Password === Password.value) {
                Email.value=``;
                Password.value=``;
                console.log("succefull");
                return;
            }
            else{
                alert("Wrong Passwor!!!!");
                Password.value=``;
                return;
            }
        }
    }
    if(!found){
        alert("User not registerd before");
    }
        
    
})