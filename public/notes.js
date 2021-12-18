var notesTemplate = Handlebars.compile(
  `
        {{#each notes}}
        <div class="note">
            <span class="input"><textarea data-horse="pony" id={{this.id}} data-id="{{ this.id }}"> {{ this.content }}</textarea></span>
            <button class="remove btn btn-xs" id={{this.id}} data-id="{{ this.id }}"><i class = "fa fa-trash" aria-hidden="true"></i></button>
            </div>
            {{/each}}
        `
);

const reloadNotes = (notes) => {
  $("#notes").html(notesTemplate({notes: notes}))
};

const beginSaving = (target) => {
  $(target).prop("disabled", true);
  $(".saving").show();
};

const endSaving = (target) => {
  $(target).prop("disabled", true);
  $(".saving").hide();
};

$(() => {
    axios
      .get("/api/notes/")
      .then((res) => {
        reloadNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  $("#add").submit((event) => {
    event.preventDefault();
    var val = $("textarea[name=note]").val();
    if (val === "") {
      return;
    }
    $("textarea[name=note]").val("");
    axios
      .post("/api/notes/", {
        note: val,
      })
      .then((res) => {
        reloadNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  });

  $("#notes").on("blur", "textarea", (event) => {
    beginSaving(event.currentTarget);
    axios
    .put("/api/notes/" + $(event.currentTarget).data("id"), {
      note: $(event.currentTarget).val(),
    })
    .then((res) => {
      endSaving(event.currentTarget);
      reloadNotes(res.data);
    })
    .catch((e) => {
      endSaving(event.currentTarget);
      alert(e);
    });
  });
  
  $("#notes").on("click", ".remove", (event) => {
    event.preventDefault()
    beginSaving(event.currentTarget);
    axios
    .delete("/api/notes/" + $(event.currentTarget).data("id"))
    .then((res) => {
      endSaving(event.currentTarget);
      reloadNotes(res.data);
      })
      .catch((e) => {
        endSaving(e.currentTarget);
        alert(e);
      });
  });
});