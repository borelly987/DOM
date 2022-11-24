const nuevadata = [];

const productos = document.getElementById("productos");
const fragment = document.createDocumentFragment();
const templateProductos = document.getElementById("template-productos").content;

document.addEventListener("DOMContentLoaded", (e) => {
  fetchData();
  //   document.getElementById("editar").hidden = true;
  //   document.getElementById("idproducto").hidden = true;
  //   document.getElementById("labelid").hidden = true;
});

const fetchData = async () => {
  const res = await fetch(
    "https://api.escuelajs.co/api/v1/products?offset=0&limit=10"
  );

  const informacion = await res.json();
  nuevoArray(informacion);
};

const nuevoArray = async (informacion) => {
  for (const i of informacion) {
    const nuevo = {
      id: i.id,
      name: i.title,
      precio: i.price,
      image: i.images[0],
    };

    nuevadata.push(nuevo);
  }

  pintarCarrito(nuevadata);
};

const pintarCarrito = (data) => {
  data.forEach((element) => {
    templateProductos.querySelector("h5").textContent = element.name;
    templateProductos.querySelector("p").textContent = element.precio;
    templateProductos.querySelector("img").setAttribute("src", element.image);
    templateProductos.querySelector("button").dataset.id = element.id;
    templateProductos.querySelector(".btn-danger").dataset.id = element.id;
    templateProductos.querySelector(".btn-info").dataset.id = element.id;
    const clone = templateProductos.cloneNode(true);
    fragment.appendChild(clone);
  });
  productos.appendChild(fragment);
};
