document.addEventListener('DOMContentLoaded', function() {
    const sideNavElems = document.querySelectorAll('.sidenav');
    //const sideNavInstances = M.Sidenav.init(sideNavElems, {});

    const modalElems = document.querySelectorAll('.modal');
    const modalInstances = M.Modal.init(modalElems, {});

    const form = document.getElementById("contact-modal");

    form.addEventListener("submit", function(e){
        e.preventDefault();
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
            modalInstances[0].close();
        }).catch(err=>console.warn(err.message))

    })

});