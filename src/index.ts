window.Webflow ||= [];

//validate phone number on user input only when the input is provided
const phoneNumberInput = document.getElementById('phoneNumber');
const formInputPhone = document.querySelector('.form-input_phone');

phoneNumberInput.addEventListener('blur', () => {
  const phoneNumber = phoneNumberInput.value.trim();
  const phoneNumberPattern = /^\d{9}$/;

  if (phoneNumber === '') {
    // Empty input, remove error state (red input field border)
    formInputPhone.classList.remove('error_state');
    $('.error_phone').fadeOut();
  } else if (phoneNumberPattern.test(phoneNumber)) {
    // Valid phone number, remove error state
    formInputPhone.classList.remove('error_state');
    //console.log('Valid phone number!');
    $('.error_phone').fadeOut();
  } else {
    // Invalid phone number, add error state
    formInputPhone.classList.add('error_state');
    //console.log('Invalid phone number!');
    $('.error_phone').fadeIn();
  }
});

Webflow.push(function () {
  // unbind webflow form handling (keep this if you only want to affect specific forms)
  $(document).off('submit');

  /* Any form on the page */
  $('form').submit(function (e) {
    e.preventDefault();

    const $form = $(this); // The submitted form
    const $submit = $('[type=submit]', $form); // Submit button of form
    const buttonText = $submit.val(); // Original button text
    const buttonWaitingText = $submit.attr('data-wait'); // Waiting button text value
    const formMethod = $form.attr('method'); // Form method (where it submits to)
    const formAction = $form.attr('action'); // Form action (GET/POST)
    //const formRedirect = $form.attr('data-redirect'); // Form redirect location
    const formData = $form.serialize(); // Form data

    // Set waiting text
    if (buttonWaitingText) {
      $submit.val(buttonWaitingText);
    }

    // Handle API response
    $.ajax(formAction, {
      data: formData,
      method: formMethod,
    })
      .done((res) => {
        console.log(res.result);

        $form
          .hide() // optional hiding of form
          .siblings('.w-form-done')
          .show() // Show success
          .siblings('.w-form-fail')
          .hide(); // Hide failure

        // If form redirect setting set, then use this and prevent any other actions
        const resultUrl = res.result;
        console.log('resultUrl:', resultUrl);
        //   debugger;
        if (resultUrl) {
          window.location = resultUrl;
          return;
        }
      })

      .fail((jqXHR, textStatus, errorThrown) => {
        if (jqXHR.status !== 200 && jqXHR.responseText.includes('User already exists')) {
          $('#form-error-user-exists').show();
        } else {
          $form
            .siblings('.w-form-done')
            .hide() // Hide success
            .siblings('.w-form-fail')
            .show(); // Show failure
        }
      })

      .always(() => {
        // Reset text
        $submit.val(buttonText);
      });
  });
});
