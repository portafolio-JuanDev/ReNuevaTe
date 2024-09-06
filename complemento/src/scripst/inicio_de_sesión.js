// Función para remover la clase 'right-panel-active'
const removeRightPanelActive = () => {
    container.classList.remove('right-panel-active');
};

// Función para mostrar alertas nativas del navegador
function showAlert(message) {
    alert(message);
}

// Mostrar alerta al abrir la página
function showWelcomeAlert() {
    showAlert('Bienvenidx a la página. Asegúrate de seguir las instrucciones para el registro y el inicio de sesión.');
}

// Validación de campos vacíos
function validateEmptyFields(fields) {
    for (const field in fields) {
        if (!fields[field]) {
            showAlert(`${field} es obligatorio.`);
            return false;
        }
    }
    return true;
}

// Validación de formato de correo electrónico
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showAlert('El correo electrónico no es válido.');
        return false;
    }
    return true;
}

// Validación de número de teléfono (solo números)
function validatePhone(phone) {
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
        showAlert('El número de teléfono debe tener 10 dígitos.');
        return false;
    }
    return true;
}

// Validación de coincidencia de contraseñas
function validatePasswords(password1, password2) {
    if (password1 !== password2) {
        showAlert('Las contraseñas no coinciden.');
        return false;
    }
    return true;
}

// Validación de contraseña fuerte
function validatePasswordStrength(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
        showAlert('La contraseña debe contener al menos una letra mayúscula, un número y un carácter especial.');
        return false;
    }
    return true;
}

// Limpiar los campos del formulario
function clearFields(form) {
    form.reset();
}

// Manejar el registro de usuarios
function handleRegister(event) {
    event.preventDefault();

    const form = event.target;
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('tel').value;
    const contraseña = document.getElementById('contraseña').value;
    const contraseña2 = document.getElementById('contraseña2').value;

    const fields = { Nombre: nombre, Correo: correo, Teléfono: telefono, Contraseña: contraseña, "Repetir Contraseña": contraseña2 };

    if (!validateEmptyFields(fields)) return;
    if (!validateEmail(correo)) return;
    if (!validatePhone(telefono)) return;
    if (!validatePasswords(contraseña, contraseña2)) return;
    if (!validatePasswordStrength(contraseña)) return;

    // Objeto que interactuará con el backend
    const usuario = {
        nombre_usuario: nombre,
        correo: correo,
        telefono: telefono,
        contraseña: contraseña,
        contraseña2: contraseña2
    };

    // Llamada a la API
    const url = `http://18.188.203.54/api/v1`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
}


// Manejar el inicio de sesión de usuarios
function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const fields = { "Nombre de usuario": username, Contraseña: password };

    if (!validateEmptyFields(fields)) return;

    const storedUser = JSON.parse(localStorage.getItem(username)); // Obtener usuario por correo
    if (storedUser && storedUser.contraseña === password) {
        showAlert('Inicio de sesión exitoso.');
        clearFields(form);  // Limpiar los campos del formulario de inicio de sesión
        window.location.href = "http://127.0.0.1:5500/ReNuevaTe/complemento/src/pages/inicio.html";
    } else {
        showAlert('Nombre de usuario o contraseña inválidos.');
    }
}

// Configuración de animaciones de botones
function setupButtonAnimations() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
}

// Inicialización
function init() {
    setupButtonAnimations();
    showWelcomeAlert();

    document.getElementById('formulario').addEventListener('submit', handleRegister);
    document.getElementById('formulario2').addEventListener('submit', handleLogin);
}

// Ejecutar la función de inicialización al cargar la página
window.onload = init;
