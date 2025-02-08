<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página de Inicio de Sesión y Respuestas</title>
    <link rel="stylesheet" href="scratch.css">
    
    <!-- Firebase SDK -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
        import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
        import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";

        // Configuración de Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyAw6_-fB9f3xi6feMwKnY6gejoOqXkvtCE",
            authDomain: "web-inicio-sesion-c8e9f.firebaseapp.com",
            databaseURL: "https://web-inicio-sesion-c8e9f-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "web-inicio-sesion-c8e9f",
            storageBucket: "web-inicio-sesion-c8e9f.appspot.com",
            messagingSenderId: "422022760273",
            appId: "1:422022760273:web:20d8e37e976876f1b8b570",
            measurementId: "G-DXZ08ZYVHY"
        };

        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getDatabase(app);

        // Manejo de inicio de sesión
        document.getElementById('login').addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            signInWithEmailAndPassword(auth, username, password)
                .then(() => {
                    document.getElementById('loginForm').style.display = 'none';
                    document.getElementById('responsesForm').style.display = 'block';
                    cargarRespuestas();
                })
                .catch(error => {
                    alert("Error de autenticación: " + error.message);
                });
        });

        // Función para cargar las respuestas desde Firebase
        function cargarRespuestas() {
            const responseContainer = document.getElementById('responseContainer');
            responseContainer.innerHTML = ''; // Limpiar respuestas previas

            const respuestasRef = ref(db, 'respuestas');
            onValue(respuestasRef, (snapshot) => {
                responseContainer.innerHTML = ''; // Limpiar antes de agregar nuevas respuestas
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
                const respuestasRef = ref(db, 'respuestas');
                push(respuestasRef, {
                    texto: userResponse,
                    timestamp: Date.now()
                }).then(() => {
                    console.log("Respuesta guardada correctamente en Firebase");
                    document.getElementById('userResponse').value = '';
                    cargarRespuestas(); // Actualizar respuestas
                }).catch((error) => {
                    console.error("Error al guardar respuesta en Firebase:", error);
                });
            }
        });

        // Cerrar sesión
        document.getElementById('logout').addEventListener('click', function() {
            signOut(auth).then(() => {
                document.getElementById('loginForm').style.display = 'block';
                document.getElementById('responsesForm').style.display = 'none';
            });
        });

        // Verificar estado del usuario al cargar la página
        onAuthStateChanged(auth, (user) => {
            if (user) {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('responsesForm').style.display = 'block';
                cargarRespuestas();
            }
        });
    </script>
</head>
<body>

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

</body>
</html>
