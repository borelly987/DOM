let nuevadata = [];
const carrito = {};

const productos = document.getElementById("productos");
const items = document.getElementById("items");
const fragment = document.createDocumentFragment();
const templateProductos = document.getElementById("template-productos").content;
const templateItems = document.getElementById("template-items").content;
const templateFooter = document.getElementById("template-footer").content;

document.addEventListener("DOMContentLoaded", (e) => {
  fetchData();
  //   document.getElementById("editar").hidden = true;
  //   document.getElementById("idproducto").hidden = true;
  //   document.getElementById("labelid").hidden = true;
});

productos.addEventListener("click", (e) => {
  agregarCarrito(e);
  // eliminarProducto(e);
  // ProductoAactualizar(e);
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

  pintarProductos(nuevadata);
};

const pintarProductos = (data) => {
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

const agregarCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCarriro(e.target.parentElement);
  }
};

const setCarriro = (data) => {
  addCarrito(data);
};

const addCarrito = (data) => {
  const producto = {
    id: data.querySelector("button").dataset.id,
    name: data.querySelector("h5").textContent,
    precio: data.querySelector("p").textContent,
    cantidad: 1,
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };
  pintarCarrito();
};

const pintarCarrito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((data) => {
    templateItems.querySelector("th").textContent = data.id;
    templateItems.querySelectorAll("td")[0].textContent = data.name;
    templateItems.querySelectorAll("td")[1].textContent = data.cantidad;
    templateItems.querySelector("span").textContent =
      data.precio * data.cantidad;

    templateItems.querySelector(".btn-info").dataset.id = data.id;
    templateItems.querySelector(".btn-danger").dataset.id = data.id;
    const clone = templateItems.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);
  pintarFooter();
};

const pintarFooter = () => {
  footer.innerHTML = "";

  const cantidad_productos = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );

  const valor_total = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = cantidad_productos;
  templateFooter.querySelectorAll("span")[0].textContent = valor_total;

  const button = document.querySelector("vaciar-todo");

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);
};

const btnAgregarYEliminar = (e) => {
  if (e.target.classList.contains("btn-info")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = { ...producto };
  }

  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];

    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    } else {
      carrito[e.target.dataset.id] = { ...producto };
    }
  }

  pintarCarrito();
};
