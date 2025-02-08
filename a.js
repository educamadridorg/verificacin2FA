<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página de Inicio de Sesión y Respuestas</title>
    <link rel="stylesheet" href="scratch.css"> <!-- Asegúrate de que el CSS esté correctamente enlazado -->
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js"></script>
</head>
<body>

<!-- Formulario de Registro (si es necesario) -->
<!-- <div id="registerForm">
    <h2>Registrarse</h2>
    <form id="register">
        <input type="email" id="registerEmail" placeholder="Correo electrónico" required>
        <input type="password" id="registerPassword" placeholder="Contraseña" required>
        <button type="submit">Registrar</button>
    </form>
</div> -->

<!-- Formulario de Inicio de Sesión -->
<div id="loginForm">
    <h2>Iniciar sesión</h2>
    <form id="login">
        <input type="email" id="username" placeholder="Correo electrónico" required>
        <input type="password" id="password" placeholder="Contraseña" required>
        <button type="submit">Acceder</button>
    </form>
</div>

<!-- Formulario de Respuestas -->
<div id="responsesForm" style="display:none;">
    <h2>Formulario de Respuestas</h2>
    <form id="responseForm">
        <textarea id="userResponse" placeholder="Escribe tu respuesta aquí" required></textarea>
        <button type="submit">Enviar Respuesta</button>
    </form>

    <h3>Tus Respuestas</h3>
    <div id="responseContainer"></div>
    <button id="logout">Cerrar Sesión</button>
</div>

<script>
    // Configuración de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAw6_-fB9f3xi6feMwKnY6gejoOqXkvtCE",
        authDomain: "web-inicio-sesion-c8e9f.firebaseapp.com",
        databaseURL: "https://web-inicio-sesion-c8e9f-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "web-inicio-sesion-c8e9f",
        storageBucket: "web-inicio-sesion-c8e9f.firebasestorage.app",
        messagingSenderId: "422022760273",
        appId: "1:422022760273:web:7d356af281e92508b8b570",
        measurementId: "G-R4GHBN5WQT"
    };

    // Inicializar Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();

    // Manejo de inicio de sesión
    document.getElementById('login').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Autenticación con Firebase
        auth.signInWithEmailAndPassword(username, password)
            .then(() => {
                // Ocultar formulario de inicio de sesión
                document.getElementById('loginForm').style.display = 'none';
                // Mostrar formulario de respuestas
                document.getElementById('responsesForm').style.display = 'block';
                cargarRespuestas(); // Cargar respuestas guardadas
            })
            .catch(error => {
                alert("Error de autenticación: " + error.message);
            });
    });

    // Función para cargar las respuestas desde Firebase
    function cargarRespuestas() {
        db.ref('respuestas').on('value', (snapshot) => {
            const responseContainer = document.getElementById('responseContainer');
            responseContainer.innerHTML = ''; // Limpiar respuestas previas

            snapshot.forEach(childSnapshot => {
                const respuesta = childSnapshot.val().texto;
                const div = document.createElement('div');
                div.classList.add('response');
                div.textContent = respuesta;
                responseContainer.appendChild(div);
            });
        });
    }

    // Enviar respuestas a Firebase
    document.getElementById('responseForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const userResponse = document.getElementById('userResponse').value;

        if (userResponse.trim()) {
            // Guardar respuesta en Firebase
            db.ref('respuestas').push({
                texto: userResponse,
                timestamp: Date.now()
            });

            // Limpiar el campo de texto
            document.getElementById('userResponse').value = '';
            cargarRespuestas(); // Actualizar la lista de respuestas
        }
    });

    // Cerrar sesión
    document.getElementById('logout').addEventListener('click', function() {
        auth.signOut().then(() => {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('responsesForm').style.display = 'none';
        });
    });

    // Comprobar si el usuario ya está autenticado al cargar la página
    auth.onAuthStateChanged(user => {
        if (user) {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('responsesForm').style.display = 'block';
            cargarRespuestas(); // Cargar respuestas si el usuario está autenticado
        }
    });
</script>
</body>
</html>
