document.addEventListener('DOMContentLoaded', function() {
    const sideNavElems = document.querySelectorAll('.sidenav');
    //const sideNavInstances = M.Sidenav.init(sideNavElems, {});

    const modalElems = document.querySelectorAll('.modal');
    const modalInstances = M.Modal.init(modalElems, {});

    const form = document.getElementById("contact-modal");
    const send = document.getElementById("send")
    form.addEventListener("submit", function(e){
        e.preventDefault();
        disableForm();
        const data = new FormData(form);

        fetch('/email', {
            headers: {"Content-Type":"application/json"},
            method: "POST",
            body: JSON.stringify({
                firstname: data.get('firstname').trim(),
                lastname: data.get('lastname').trim(),
                email: data.get('email').trim(),
                message: data.get('message').trim()
            })
        }).then(res=>{
            if(res.ok){
                M.toast({html: 'Email successfully sent !'})
                modalInstances[0].close();
            } else {
                M.toast({html: 'Uh oh! Email failed to send!'})
            }
            enableForm()
        }).catch(err=>{
            M.toast({html: 'Uh oh! Email failed to send!'})
            enableForm()
            console.warn(err.message)
        })

    })

    function disableForm(){
        send.disabled = true;
        for(let i = 0; i < form.elements.length; i++){
            form.elements[i].readOnly = true;
        }
    }

    function enableForm(){
        send.disabled = false;
        for(let i = 0; i < form.elements.length; i++){
            form.elements[i].readOnly = false;
        }    
    }

});