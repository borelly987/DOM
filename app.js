let nuevadata = [];
const carrito = {};
const send = document.getElementById("send");
const editar = document.getElementById("editar");
const productos = document.getElementById("productos");
const items = document.getElementById("items");
const fragment = document.createDocumentFragment();
const templateProductos = document.getElementById("template-productos").content;
const templateItems = document.getElementById("template-items").content;
const templateFooter = document.getElementById("template-footer").content;

document.addEventListener("DOMContentLoaded", (e) => {
  fetchData();
  document.getElementById("editar").hidden = true;
  document.getElementById("idproducto").hidden = true;
  document.getElementById("labelid").hidden = true;
});

productos.addEventListener("click", (e) => {
  agregarCarrito(e);
  eliminar(e);
  actualizar(e);
});

send.addEventListener("click", (e) => {
  crearProducto();
});

editar.addEventListener("click", (e) => {
  actualizar2();
});

items.addEventListener("click", (e) => {
  btnAgregarYEliminar(e);
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
    const data = carrito[e.target.dataset.id];
    data.cantidad++;
    carrito[e.target.dataset.id] = { ...data };
  }

  if (e.target.classList.contains("btn-danger")) {
    const data = carrito[e.target.dataset.id];
    data.cantidad--;
    if (data.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    } else {
      carrito[e.target.dataset.id] = { ...data };
    }
  }

  pintarCarrito();
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const crearProducto = () => {
  const name = document.getElementById("name").value;
  const precio = document.getElementById("precio").value;
  const image = document.getElementById("image").value;

  if (name === "") {
    document.getElementById("error-name").textContent =
      "El nombre del producto es un campo obligatorio";
    return;
  }

  if (precio === "") {
    document.getElementById("error-precio").textContent =
      "El precio del producto es un campo obligatorio";
    return;
  }

  if (image === "") {
    document.getElementById("error-image").textContent =
      "La imagen del producto es un campo obligatorio";
    return;
  }

  const data = {
    id: getRandomInt(1000, 100000),
    name: name,
    precio: precio,
    image: image,
  };
  nuevadata = [...nuevadata, data];
  productos.innerHTML = "";
  pintarProductos(nuevadata);
  document.getElementById("close").click();
  clear();
};

const eliminar = async (e) => {
  if (e.target.classList.contains("btn-danger")) {
    productos.innerHTML = "";
    nuevadata = await nuevadata.filter(
      (data) => data.id !== Number(e.target.dataset.id)
    );
    pintarProductos(nuevadata);
  }
};

const actualizar = async (e) => {
  if (e.target.classList.contains("btn-info")) {
    document.getElementById("send").hidden = true;
    document.getElementById("editar").hidden = false;
    document.getElementById("idproducto").hidden = false;
    document.getElementById("labelid").hidden = false;

    const data = nuevadata.find(
      (data) => data.id === Number(e.target.dataset.id)
    );

    if (data) {
      document.getElementById("idproducto").value = data.id;
      document.getElementById("name").value = data.name;
      document.getElementById("precio").value = data.precio;
      document.getElementById("image").value = data.image;
      idEditar = data.id;
    }
  }
};

const actualizar2 = () => {
  productos.innerHTML = "";
  const id = document.getElementById("idproducto").value;
  const name = document.getElementById("name").value;
  const precio = document.getElementById("precio").value;
  const image = document.getElementById("image").value;

  if (id === "") {
    alert("Hubo un error, no se encontro el id del producto");
    return;
  }

  if (name === "") {
    document.getElementById("error-name").textContent =
      "El nombre del producto es un campo obligatorio";
    return;
  }

  if (precio === "") {
    document.getElementById("error-precio").textContent =
      "El precio del producto es un campo obligatorio";
    return;
  }

  if (image === "") {
    document.getElementById("error-image").textContent =
      "La imagen del producto es un campo obligatorio";
    return;
  }

  const dataUpadte = {
    id: id,
    name: name,
    precio: precio,
    image: image,
  };

  nuevadata = nuevadata.map((data) =>
    data.id === Number(id) ? (data = dataUpadte) : data
  );

  pintarProductos(nuevadata);
  document.getElementById("close").click();
  clear();
};

const clear = () => {
  document.getElementById("idproducto").value = "";
  document.getElementById("name").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("image").value = "";
  document.getElementById("idproducto").hidden = true;
  document.getElementById("labelid").hidden = true;
  document.getElementById("editar").hidden = true;
  document.getElementById("send").hidden = false;
};
