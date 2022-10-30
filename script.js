const d = document,
$shows = d.querySelector(".grid-container"),
$template = d.getElementById("template").content,
$fragment = d.createDocumentFragment();

d.addEventListener("keyup", async e => {
    if (e.target.matches('input[type="search"]')) {
        if (e.key.toLocaleLowerCase() === "enter" || e.keyCode === 13) {
            try {
                let query = e.target.value.toLocaleLowerCase(),
                api = `http://api.tvmaze.com/search/shows?q=${query}`,
                res  = await fetch(api),
                json = await res.json();
                console.log(json)
                if (!res.ok) throw {status: res.status, statusText: res.statusText}
                $shows.innerHTML = "";
                if(json.length === 0) $shows.innerHTML = "<h2>Sin resultados</h2>"
                else {
                    json.forEach(e => {
                        $template.querySelector(".card").href = e.show.url || "#";
                        $template.querySelector(".card").target = e.show.url ? "_blank" : "_self";
                        $template.querySelector(".card-title").textContent = e.show.name || "Sin titulo";
                        $template.querySelector(".card-img").src = e.show.image?.medium || "http://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
                        $template.querySelector(".card-img").alt = e.show.name || "Sin titulo";
                        $template.querySelector(".card-text").innerHTML = e.show.summary || "<p>Sin descripción</p>"
                        $fragment.appendChild($template.cloneNode(true));
                    })
                    $shows.appendChild($fragment);
                }
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $shows.innerHTML =  `<h2>Error ${err.status}: ${message}</h2>`
            }
        }
    }
})