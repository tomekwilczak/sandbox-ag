"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log("Init script");
    let formErrors = false;
    const $input_phone = $("[name=Phone");
    const $radios_channel = $("input[type=radio][name=invitationChannel]");
    const $radios_address = $("input[type=radio][name=Address]");
    const $input_street = $("[name=AddressStreet");
    const $input_building = $("[name=AddressBuildingNumber");
    const $input_zipcode = $("[name=AddressPostCode");
    const $input_city = $("[name=AddressCity");
    $('[form-element="error-text"]').hide();
    $('[form-element="required"]').removeClass("error-state");
    const fieldError = function(field) {
      field.siblings('[form-element="error-text"]').show();
      console.log("There are some errors");
      field.addClass("error-state");
      formErrors = true;
    };
    $radios_channel.on("change", (e) => {
      const { value } = e.currentTarget;
      $('[form-element="error-text-radio-channel"]').hide();
      $input_phone.attr("form-element", value === "SMS" ? "required" : null);
    });
    $radios_address.on("change", (e) => {
      const { value } = e.currentTarget;
      $('[form-element="error-text-radio-address"]').hide();
      $input_street.attr("form-element", value === "TAK" ? "required" : null);
      $input_building.attr("form-element", value === "TAK" ? "required" : null);
      $input_zipcode.attr("form-element", value === "TAK" ? "required" : null);
      $input_city.attr("form-element", value === "TAK" ? "required" : null);
    });
    const formInputPhone = document.querySelector("[form-element=phone]");
    formInputPhone.addEventListener("blur", () => {
      const phoneNumber = formInputPhone.value.trim();
      const phoneNumberPattern = /^\d{9}$/;
      if (phoneNumber === "") {
        formInputPhone.classList.remove("error_state");
        $(".error_phone").fadeOut();
      } else if (phoneNumberPattern.test(phoneNumber)) {
        formInputPhone.classList.remove("error_state");
        $(".error_phone").fadeOut();
      } else {
        formInputPhone.classList.add("error_state");
        $(".error_phone").fadeIn();
      }
    });
    $('[form-element="submit"]').click(function() {
      console.log("Clicked");
      $('[form-element="required"]').each(function() {
        if ($(this).val().length === 0) {
          fieldError($(this));
        } else if ($(this).attr("type") === "email" && // Validation for email fields
        ($(this).val().indexOf("@") === -1 || $(this).val().indexOf(".") === -1)) {
          fieldError($(this));
        }
      });
      if (!$radios_channel.is(":checked")) {
        $('[form-element="error-text-radio-channel"]').show();
        console.log("Channel: Zaznacz 1 z radio button\xF3w");
        formErrors = true;
      } else {
        $('[form-element="error-text-radio-channel"]').hide();
        formErrors = false;
      }
      if (!$radios_address.is(":checked")) {
        $('[form-element="error-text-radio-address"]').show();
        console.log("Address: Zaznacz 1 z radio button\xF3w");
        formErrors = true;
      } else {
        $('[form-element="error-text-radio-address"]').hide();
        formErrors = false;
      }
      if (!formErrors) {
        console.log(formErrors);
        $(this).parents("form").submit(function(e) {
          e.preventDefault();
          const $form = $(this);
          const $submit = $("[type=submit]", $form);
          const buttonText = $submit.val();
          const buttonWaitingText = $submit.attr("data-wait");
          const formMethod = $form.attr("method");
          const formAction = $form.attr("action");
          const formData = $form.serialize();
          if (buttonWaitingText) {
            $submit.val(buttonWaitingText);
          }
          $.ajax(formAction, {
            data: formData,
            method: formMethod
          }).done((res) => {
            const resultUrl = res.result;
            console.log("Response:", res);
            if (resultUrl) {
              window.location = resultUrl;
              return;
            }
            $form.hide().siblings(".w-form-done").show().siblings(".w-form-fail").hide();
          }).fail((res) => {
            $form.siblings(".w-form-done").hide().siblings(".w-form-fail").show();
          }).always(() => {
            $submit.val(buttonText);
          });
        });
      } else {
        return false;
      }
    });
    $('[form-element="required"]').on("keypress blur", function() {
      $(this).removeClass("error-state");
      $(this).siblings('[form-element="error-text"]').hide();
      formErrors = false;
    });
  });
})();
//# sourceMappingURL=index.js.map
