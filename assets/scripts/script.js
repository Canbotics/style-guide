$(document).ready(function() {
    $('form.validate').on('focus', '[required]', function(event) {
        $(this).removeClass('validated');
    }).on('blur', ':not([type=radio])[required]', function(event, naturalTrigger = true) {
        let field = $(this)[0];
        let confirm =  $('#' + $(this).attr('id') + 'confirm.validated');
        let alert = $('[data-for="' + $(this).attr('id') + '"]');
        let errors = {
            blank: $(this).attr('data-errblank'),
            match: $(this).attr('data-errmatch'),
            min: $(this).attr('data-errmin'),
            max: $(this).attr('data-errmax'),
            pattern: $(this).attr('data-errpattern'),
        };

        field.setCustomValidity('');

        if (field.type == 'tel') {
            let value = $(this).val();
            let mask = $(this).attr('data-mask').split('|');

            mask[0] = new RegExp ('^' + mask[0] + '$');
            value = value.replace(/\D/g,'').replace(mask[0],mask[1]);

            $(this).val(value);
        }

        if (errors.match) {
            let original = $('#' + $(this).attr('id').replace(/confirm$/, ''));

            if (original.val() != $(this).val()) {
                field.setCustomValidity(errors.match);
            }

            if (naturalTrigger) {
                original.trigger('blur', false);
            }
        }

        if (!field.checkValidity()) {
            let state = field.validity;

            if (state.valueMissing) {
                field.setCustomValidity(errors.blank || errors.min);
            } else if (state.tooShort) {
                field.setCustomValidity(errors.min);
            } else if (state.tooLong) {
                field.setCustomValidity(errors.max);
            } else if (state.patternMismatch) {
                field.setCustomValidity(errors.pattern);
            } else if (field.type == 'email' && state.typeMismatch) {
                field.setCustomValidity(errors.pattern);
            }
        }

        if (confirm.length && naturalTrigger) {
            confirm.trigger('blur', false);
        }

        if ($(this)[0].checkValidity()) {
            alert.text('');
        } else {
            alert.text($(this)[0].validationMessage);
        }

        $(this).addClass('validated');
    }).on('submit', function(event) {
        if (!$(this)[0].checkValidity()) {
            event.preventDefault();

            $(this).find('fieldset:invalid[data-errradio]').each(function() {
                $('[data-for="' + $(this).attr('id') + '"]').text($(this).attr('data-errradio'));
            });

            $(this).find(':not(fieldset):not([type=radio]):invalid').each(function() {
                $(this).trigger('blur',false);
            });

            $(this)[0].reportValidity();
        }
    });
});
