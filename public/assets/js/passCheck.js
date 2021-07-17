document.getElementById("pass-check").addEventListener("click",function() {
    document.getElementById("pass-check").children[0].classList.toggle("hide");
    document.getElementById("pass-check").children[1].classList.toggle("hide");
    if(document.getElementById("pass").type=="password"){
        document.getElementById("pass").type="text";
    }else{
        document.getElementById("pass").type="password";
    }
})
