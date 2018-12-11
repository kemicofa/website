window.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById("form");
    const send = document.getElementById("send");

    send.addEventListener("click", function(e){
        const data = new FormData(form);
        data.get("firstname");

        fetch('/email', {
            headers: {"Content-Type":"application/json"},
            method: "POST",
            body: JSON.stringify({
                firstname: data.get('firstname'),
                lastname: data.get('lastname'),
                email: data.get('email'),
                message: data.get('message')
            })
        }).then(res=>{
            console.log(res)
        }).catch(err=>console.warn(err.message))

    })

})