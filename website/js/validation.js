const isFormValid = (form) => {
    const formControls = form.querySelectorAll('input, textarea');

    let valid = true;
    formControls.forEach(control=>{
        if(control.value == ''){
            control.closest('.form-group').classList.add('invalid');
            valid = valid && false;
        } else{
            control.closest('.form-group').classList.remove('invalid');
            valid = valid && true;
        }

        control.addEventListener('focus',function(){
            this.closest('.form-group').classList.remove('invalid');
        })
    });

    return valid;
}