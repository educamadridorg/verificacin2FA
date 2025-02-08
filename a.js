document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener nombre de usuario y contraseña
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validación simple (en un escenario real se verificaría con un backend)
    if (username && password) {
        // Ocultar el formulario de inicio de sesión
        document.getElementById('loginForm').style.display = 'none';
        // Mostrar el formulario de respuestas
        document.getElementById('responsesForm').style.display = 'block';
    } else {
        alert("Por favor ingresa un nombre de usuario y contraseña válidos.");
    }
});

document.getElementById('responseForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const userResponse = document.getElementById('userResponse').value;

    // Mostrar la respuesta en el contenedor (esto es solo visual en el cliente)
    const responseContainer = document.getElementById('responseContainer');
    const newResponse = document.createElement('div');
    newResponse.classList.add('response');
    newResponse.textContent = userResponse;

    responseContainer.appendChild(newResponse);
    document.getElementById('userResponse').value = ''; // Limpiar el textarea
});
