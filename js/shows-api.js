const d = document;

const $shows = d.getElementById("shows"),
  $template = d.getElementById("show-template").content,
  $fragment = d.createDocumentFragment();

d.addEventListener("keypress", async (e) => {
  if (e.target.matches("#search")) {
    if (e.key === "Enter") {
      try {
        $shows.innerHTML = `<img class="loader" src="../assets/puff.svg" alt="Cargando...">`;

        let query = e.target.value.toLowerCase();
        let url = `https://api.tvmaze.com/search/shows?q=${query}`,
          res = await fetch(url),
          json = await res.json();

        console.log(url, res, json);

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        if (json.length === 0) {
          $shows.innerHTML = `<h3 class="no-search"> No existen resultados de shows para la búsqueda: ${query} </h3>`;
        } else {
          json.forEach((el) => {
            //Title
            $template.querySelector("h2").textContent = el.show.name;

            //Description
            $template.querySelector("div").innerHTML = el.show.summary
              ? el.show.summary
              : "Description is not available";

            //Image
            $template.querySelector("img").src = el.show.image
              ? el.show.image.medium
              : "http://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
            //link
            $template.querySelector("a").href = el.show.url ? el.show.url : "#";
            $template.querySelector("a").target = el.show.url ? "_blank" : "_self";
            $template.querySelector("a").textContent = el.show.url ? "Ver más" : "";

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
          });

          $shows.innerHTML = ``;
          $shows.appendChild($fragment);
        }
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $shows.innerHTML = `<p> Error ${err.status}: ${message}</p>`;
      }
    }
  }
});
