$(document).ready(function() {

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });

    $("#alert_new, #alert_edit").hide();

    // New List Item
    $("#new_item_modal").on('submit', function(e){
        e.preventDefault();
        $("#new_item_modal input:submit").prop('disabled', true);
        
        oList_name = $("#id_list_name");
        oDescription = $("#id_description");
        list_name = oList_name.val().trim();
        description = oDescription.val().trim();
                
        if(!list_name.length) {
            $("#alert_new").slideDown();
            oList_name.val("");
            oList_name.parent('div').addClass('has-error');
        } else {
            oList_name.parent('div').removeClass('has-error');
            $("#alert_new").slideUp();

            new_item = {
                'list_name': list_name,
                'description': description
            };

            $.ajax({
                url: '/new_list/',
                type: 'POST',
                data: new_item,
            })
            .done(function(data) {
                if (data.status == "Success"){
                    html = '<a href="#" class="list-group-item list_item_active" data-id="' + data.pk + '" data-status="1" data-name="' + data.name + '" data-description="' + data.description + '">';
                    html += '<h4 class="list-group-item-heading">'+ data.name + '</h4>';
                    html += '<p class="list-group-item-text">' + data.description + '</p>';
                    html += '</a>';
                    $('.list-group-active').append(html);
                    $("#home > div.list-group > h1").replaceWith('');

                }
                $("#new_item_modal").modal('hide');
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                $("#new_item_modal input:submit").prop('disabled', false);
                $("#new_item_modal input:text").val("");
                $("#new_item_modal textarea").val("");
            });

        }   
    });

    // Fill Edit Active List Form
    $("body").on('click', "a.list-group-item", function(event) {
        
        $(this).addClass('editing_item');

        $("#list_name").val($(this).data('name'));
        $("#description").val($(this).data('description'));
        $("#update_id").val($(this).data('id'));
            
        if ($(this).data('id') && $(this).data('status') == 1){
            $("#mark_finished").show();
            $("#mark_active").hide();
            $("#list_name, #description").prop('disabled', false);
        } else if($(this).data('status') == 2){ // Item is finished
            $("#mark_active").show();
            $("#mark_finished, #update_item").hide();
            $("#list_name, #description").prop('disabled', true);
        }
        $("#edit_item_modal").modal('show');
    });

    // Clear form on modal close
    $("#edit_item_modal").on('hidden.bs.modal', function () {
        $(".editing_item").removeClass('editing_item');
        $("#list_name, #description, #update_id").prop('disabled', false).val(""); // Clear Form
    })

    // Hide bootstrap alerts on click
    $("body").on('click', 'div.alert', function(event) {
        $(this).slideUp();
    });

    // Update Item
    $("#update_item").click(function(event) {

        item_name = $("#list_name").val().trim();
        description = $("#description").val().trim();
        update_id = $("#update_id").val();

        if(!item_name.length) {
            $("#alert_edit").slideDown();
            $("#list_name").val("");
            $("#list_name").parent('div').addClass('has-error');
        } else {
            $(this).prop('disabled', true);
            $("#alert_edit").slideUp();
            $("#list_name").parent('div').removeClass('has-error');
            data_submit = {
                id: update_id,
                description: description,
                name: item_name
            };
            $.ajax({
                url: '/update_list/',
                type: 'POST',
                data: data_submit,
            })
            .done(function() {
                $(".editing_item").data({
                    name: $("#list_name").val(),
                    description: $("#description").val()
                });
                $(".editing_item h4").text($("#list_name").val());
                $(".editing_item p").text($("#description").val());
                $("#menu1 > div.list-group > h1").replaceWith('');
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                $(".editing_item").removeClass('editing_item');
                $("#edit_item_modal").modal('hide');
                $("#update_item").prop('disabled', false);

            });
        } 
    });

    // Mark item as Finished
    $("#mark_finished").click(function(event) {
        $(this).prop('disabled', true);
        id = $("#update_id").val();

        $.ajax({
            url: '/status_change/',
            type: 'POST',
            data: {id: id},
        })
        .done(function() {
            description = $(".editing_item").data('description');
            name = $(".editing_item").data('name');
            item_id = $("#update_id").val();
            
            html = '<a href="#" class="list-group-item" data-id="' + item_id + '" data-status="2" data-name="' + name + '" data-description="' + description + '">';
            html += '<h4 class="list-group-item-heading">'+ name + '</h4>';
            html += '<p class="list-group-item-text">' + description + '</p>';
            html += '</a>';
            $(".editing_item").replaceWith('');
            $("#menu1 > div.list-group > h1").replaceWith('');
            $("#menu1 > div.list-group").append(html);

        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            $("#edit_item_modal").modal('hide');
            $("#mark_finished").prop('disabled', false);
        });       
    });

    // Mark as Active
    $("#mark_active").click(function(event) {
        $(this).prop('disabled', true);
        id = $("#update_id").val();

        $.ajax({
            url: '/status_change/',
            type: 'POST',
            data: {id: id, active: 0},
        })
        .done(function() {
            description = $(".editing_item").data('description');
            name = $(".editing_item").data('name');
            item_id = $("#update_id").val();
            
            html = '<a href="#" class="list-group-item" data-id="' + item_id + '" data-status="2" data-name="' + name + '" data-description="' + description + '">';
            html += '<h4 class="list-group-item-heading">'+ name + '</h4>';
            html += '<p class="list-group-item-text">' + description + '</p>';
            html += '</a>';
            $(".editing_item").replaceWith('');
            $("#home > div.list-group > h1").replaceWith(''); // Remove empty message if exists
            $("#home > div.list-group").append(html);
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            $("#edit_item_modal").modal('hide');
            $("#mark_active").prop('disabled', false);

            console.log("complete");
        });
        
    });
});