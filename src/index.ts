// Wersja 16.05 EOD: działa channel redirect, email oraz SMS z walidacją telefonu (formatowanie do poprawienia). Nie działa dobrze walidacja wymaganych pól, tzn. pokazują się walidacje, ale formularz wysyła się bez wypełnienia pól,
// wystarczy jak zaznaczy się radio buttony (czyli one generują błąd).

window.Webflow ||= [];

window.Webflow.push(() => {
  console.log('Init script');
  let formErrors = false;
  const $input_phone = $('[name=Phone');
  const $radios_channel = $('input[type=radio][name=invitationChannel]');
  const $radios_address = $('input[type=radio][name=Address]');
  const $input_street = $('[name=AddressStreet');
  const $input_building = $('[name=AddressBuildingNumber');
  const $input_zipcode = $('[name=AddressPostCode');
  const $input_city = $('[name=AddressCity');

  // Hide error texts and error state (red borders)
  $('[form-element="error-text"]').hide();
  $('[form-element="required"]').removeClass('error-state');

  // Add proper classes when field is empty
  const fieldError = function (field) {
    field.siblings('[form-element="error-text"]').show(); // Show error message
    console.log('There are some errors');
    field.addClass('error-state'); // Add error state to this field
    formErrors = true;
  };

  // When one of 'invitationChannel' radios is selected add required attribute to either PESEL or Dowód osobisty fields
  $radios_channel.on('change', (e) => {
    const { value } = e.currentTarget;
    $('[form-element="error-text-radio-channel"]').hide();
    $input_phone.attr('form-element', value === 'SMS' ? 'required' : null);
  });

  // When one of 'Address' radios is selected add required attribute to either PESEL or Dowód osobisty fields
  $radios_address.on('change', (e) => {
    const { value } = e.currentTarget;
    $('[form-element="error-text-radio-address"]').hide();
    $input_street.attr('form-element', value === 'TAK' ? 'required' : null);
    $input_building.attr('form-element', value === 'TAK' ? 'required' : null);
    $input_zipcode.attr('form-element', value === 'TAK' ? 'required' : null);
    $input_city.attr('form-element', value === 'TAK' ? 'required' : null);
  });

  //validate phone number on user input only when the input is provided
  const formInputPhone = document.querySelector('[form-element=phone]');

  formInputPhone.addEventListener('blur', () => {
    const phoneNumber = formInputPhone.value.trim();
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

  // Click on the Submit button
  $('[form-element="submit"]').click(function () {
    console.log('Clicked');
    // Check each required field
    $('[form-element="required"]').each(function () {
      if ($(this).val().length === 0) {
        // If this field is empty
        fieldError($(this));
      } else if (
        $(this).attr('type') === 'email' && // Validation for email fields
        ($(this).val().indexOf('@') === -1 || $(this).val().indexOf('.') === -1)
      ) {
        fieldError($(this));
      }
    });

    // Check if at least 1 radio button is selected
    if (!$radios_channel.is(':checked')) {
      // e.preventDefault(); // Prevent form submission
      $('[form-element="error-text-radio-channel"]').show();
      console.log('Channel: Zaznacz 1 z radio buttonów');
      formErrors = true;
    } else {
      $('[form-element="error-text-radio-channel"]').hide();
      formErrors = false;
    }

    if (!$radios_address.is(':checked')) {
      $('[form-element="error-text-radio-address"]').show();
      console.log('Address: Zaznacz 1 z radio buttonów');
      // return false;
      formErrors = true;
      // return false;
    } else {
      $('[form-element="error-text-radio-address"]').hide();
      formErrors = false;
    }
    // Submit parent form if there are no errors

    if (!formErrors) {
      console.log(formErrors);
      // debugger;
      $(this)
        .parents('form')
        .submit(function (e) {
          e.preventDefault();

          const $form = $(this); // The submitted form
          const $submit = $('[type=submit]', $form); // Submit button of form
          const buttonText = $submit.val(); // Original button text
          const buttonWaitingText = $submit.attr('data-wait'); // Waiting button text value
          const formMethod = $form.attr('method'); // Form method (where it submits to)
          const formAction = $form.attr('action'); // Form action (GET/POST)
          const formData = $form.serialize(); // Form data

          // Set waiting text
          if (buttonWaitingText) {
            $submit.val(buttonWaitingText);
          }

          $.ajax(formAction, {
            data: formData,
            method: formMethod,
          })
            .done((res) => {
              // If form redirect setting set, then use this and prevent any other actions
              const resultUrl = res.result;
              console.log('Response:', res);
              if (resultUrl) {
                window.location = resultUrl;
                return;
              }

              $form
                .hide() // optional hiding of form
                .siblings('.w-form-done')
                .show() // Show success
                .siblings('.w-form-fail')
                .hide(); // Hide failure
            })

            .fail((res) => {
              $form
                .siblings('.w-form-done')
                .hide() // Hide success
                .siblings('.w-form-fail')
                .show(); // show failure
            })
            .always(() => {
              // Reset text
              $submit.val(buttonText);
            });
        });
    } else {
      return false;
    }
  });

  // Remove errors from field
  $('[form-element="required"]').on('keypress blur', function () {
    $(this).removeClass('error-state');
    $(this).siblings('[form-element="error-text"]').hide();
    formErrors = false;
  });
});
