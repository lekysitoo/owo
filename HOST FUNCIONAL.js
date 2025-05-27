    // Configuración inicial
    const geo = { code: "ar", lat: -34.6374, lon: -58.4058 };

    const room = HBInit({
    roomName: "LHH VS ??? BIG - FUT X3",
    maxPlayers: 22,
    noPlayer: true,
    public: true,
        geo: geo,
        password: null,
    });

    // Variables globales
    let initializationComplete = false;

    // Estructura base para los uniformes
    const uniformes = {
        teams: [],
        customTeams: []
    };

    // Estado global del juego
    const state = {
        // Administración
        adminPassword: "lisensiado",
        permanentAdmins: new Map(),
        adminList: [],
        banList: new Map(),
            gameStats: {
            active: false,
            scores: null,
            players: new Map(),
        },
        
        currentTrivia: {
            active: false,
            correct_answer: null,
            answers: [],
            answered: false,
            timeout: null,
            playerAnswers: new Map()
        },

        // Jugadores
        playerNames: new Map(),
        mutedPlayers: new Map(),  // Corregido de mutedplayers a mutedPlayers
        mutedList: [],
        spies: new Set(),
        afkPlayers: new Set(),
        
        // Uniformes
        customUniformState: {
            isAdding: false,
            admin: null,
            step: 0,
            shortName: null,
            uniform: null
        },
        
        // Efectos visuales
        discoMode: false,
        discoInterval: null,
        ballColor: null,
        teamColors: {
            1: null,
            2: null
        },
        
        // Otros estados
        waitingHoroscope: new Set(),
        substitution: {
            active: false,
            admin: null,
            step: 0,
            teamPlayers: null,
            spectators: null,
            selectedPlayer: null,
            playerPosition: null
        },
        
        // Carrera
        currentRace: {
            isActive: false,
            participants: new Map(),
            positions: new Map(),
            animalEmojis: ["🐎", "🦊", "🐅", "🦘", "🦬", "🦏", "🦒", "🐪", "🦙", "🦘", "🐘", "🦛"],
            trackLength: 20
        }
    };

// Animales disponibles para la carrera
const RACE_ANIMALS = [
    { emoji: "🐎", name: "Caballo" },
    { emoji: "🐪", name: "Camello" },
    { emoji: "🦘", name: "Canguro" },
    { emoji: "🦊", name: "Zorro" },
    { emoji: "🐅", name: "Tigre" },
    { emoji: "🦌", name: "Ciervo" },
    { emoji: "🐇", name: "Conejo" },
    { emoji: "🦒", name: "Jirafa" },
    { emoji: "🦍", name: "Gorila" },
    { emoji: "🐆", name: "Leopardo" },
    { emoji: "🦛", name: "Hipopótamo" },
    { emoji: "🦏", name: "Rinoceronte" }
];

    const RACE_COUNTDOWN = 10;


    const TRIVIA_CATEGORIES = {
        "deportes": 21,
        "geografia": 22,
        "historia": 23,
        "politica": 24,
        "arte": 25,
        "celebridades": 26,
        "animales": 27,
        "vehiculos": 28,
        "entretenimiento": 12,
        "musica": 12,
        "cine": 11,
        "videojuegos": 15,
        "ciencia": 17,
        "computadoras": 18,
        "matematicas": 19,
        "mitologia": 20,
        "deportivos": 21,
        "television": 14
    };
    
    const chistes = [
        { setup: "¿Qué le dice un jaguar a otro jaguar?", delivery: "Jaguar you" },
        { setup: "¿Por qué los pájaros no usan Facebook?", delivery: "Porque ya tienen Twitter" },
        { setup: "¿Qué le dice una iguana a su hermana gemela?", delivery: "Somos iguanitas" },
        { setup: "¿Qué hace una abeja en el gimnasio?", delivery: "Zumba" },
        { setup: "¿Por qué el libro de matemáticas está triste?", delivery: "Porque tiene muchos problemas" },
        { setup: "¿Qué le dice un espagueti a otro?", delivery: "¡Mi cuerpo pide salsa!" },
        { setup: "¿Qué hace un vampiro en un tractor?", delivery: "Sembrar el pánico" },
        { setup: "¿Qué le dice un pollito a otro pollito?", delivery: "Necesitamos pollo apoyo" },
        { setup: "¿Qué hace un pato en una discoteca?", delivery: "El pato-cinador" },
        { setup: "¿Por qué el mar es azul?", delivery: "Porque los peces hacen blu blu blu" },
        { setup: "¿Qué hace una abeja en la peluquería?", delivery: "Una melena" },
        { setup: "¿Qué le dice un número a otro número?", delivery: "¿Nos sumamos?" },
        { setup: "¿Qué le dice una pared a otra pared?", delivery: "Nos vemos en la esquina" },
        { setup: "¿Qué le dice el 1 al 10?", delivery: "Para ser como yo, debes ser sincero" },
        { setup: "¿Qué le dice el 2 al 0?", delivery: "Veinte conmigo" },
        { setup: "¿Qué le dice una taza a otra?", delivery: "¡Qué tacita estás!" },
        { setup: "¿Cuál es el animal más antiguo?", delivery: "La cebra, porque está en blanco y negro" },
        { setup: "¿Qué hace un perro con un taladro?", delivery: "Taladrando" },
        { setup: "¿Por qué los elefantes no usan computadora?", delivery: "Porque le tienen miedo al mouse" },
        { setup: "¿Qué hace una vaca en una computadora?", delivery: "Vacebook" },
            { setup: "¿Qué le dice un árbol a otro árbol?", delivery: "¡Qué pasa tronco!" },
        { setup: "¿Cuál es el colmo de un electricista?", delivery: "Que su hijo se llame Chispa" },
        { setup: "¿Por qué los esqueletos no pelean?", delivery: "Porque no tienen agallas" },
        { setup: "¿Qué hace un pez?", delivery: "Nada" },
        { setup: "¿Por qué el profe de música tiene una escalera?", delivery: "Para subir el volumen" },
        { setup: "¿Qué le dice una calculadora a otra?", delivery: "Podemos contar juntas" },
        { setup: "¿Por qué el café estaba nervioso?", delivery: "Porque estaba pendiente" },
        { setup: "¿Qué le dice un semáforo a otro?", delivery: "No me mires que me estoy cambiando" },
        { setup: "¿Qué hace un camaleón en una licuadora?", delivery: "Cambios de color" },
        { setup: "¿Por qué los programadores usan lentes?", delivery: "Porque no pueden ver Sharp" },
        { setup: "¿Qué le dice un bit a otro bit?", delivery: "Nos vemos en el cyber" },
        { setup: "¿Por qué el libro de ciencias está feliz?", delivery: "Porque tiene química con el de matemáticas" },
        { setup: "¿Qué hace un abogado en una planta?", delivery: "Legal-izar" },
        { setup: "¿Qué le dice una impresora a otra?", delivery: "¿Esa hoja es tuya o es impresión mía?" },
        { setup: "¿Por qué el teléfono usa lentes?", delivery: "Porque perdió sus contactos" },
        { setup: "¿Qué le dice un diente a otro diente?", delivery: "En las caries y en la salud" },
        { setup: "¿Por qué el astronauta no puede concentrarse?", delivery: "Porque está en las nubes" },
        { setup: "¿Qué hace un reloj en la biblioteca?", delivery: "Marcando el tiempo" },
        { setup: "¿Por qué el libro de historia está triste?", delivery: "Porque tiene muchas fechas pasadas" },
        { setup: "¿Qué le dice un globo a otro globo?", delivery: "Nos inflamos de amor" },
        { setup: "¿Por qué el papel le tiene miedo al lápiz?", delivery: "Porque puede hacerle borrador" },
        { setup: "¿Qué hace una abeja en el cine?", delivery: "Mirando la película Bee Movie" },
        { setup: "¿Por qué el músico no puede entrar a su casa?", delivery: "Porque perdió las llaves del Sol" },
        { setup: "¿Qué le dice un zapato a otro?", delivery: "¡Qué vida más arrastrada llevamos!" },
        { setup: "¿Por qué el jardinero no juega a las cartas?", delivery: "Porque siempre le toca podar" },
        { setup: "¿Qué hace un vampiro programando?", delivery: "Buscando un bug en la Matrix" },
        { setup: "¿Por qué el matemático está triste?", delivery: "Porque tiene problemas sin resolver" },
        { setup: "¿Qué le dice un átomo a otro átomo?", delivery: "Creo que perdí un electrón" },
        { setup: "¿Por qué el chef está enojado?", delivery: "Porque se le acabó la paciencia" },
        { setup: "¿Qué hace un pirata en el desierto?", delivery: "Buscando el tesoro en el Mar-rueco" },
        { setup: "¿Por qué el fotógrafo está soltero?", delivery: "Porque no ha encontrado su media foto" },
        { setup: "¿Qué le dice un pingüino a una pingüina?", delivery: "Como témpano te ves" },
        { setup: "¿Por qué el dentista no juega al fútbol?", delivery: "Porque siempre hace muelas" },
        { setup: "¿Qué hace un pez en el espacio?", delivery: "Buscando el Mar-te" },
        { setup: "¿Por qué el libro de geografía está solo?", delivery: "Porque todos los países lo dejaron" },
    ];

    const BALL_COLORS = {
        "roja": 0xFF0000,
        "azul": 0x0000FF,
        "verde": 0x00FF00,
        "amarilla": 0xFFFF00,
        "naranja": 0xFFA500,
        "rosa": 0xFF69B4,
        "blanca": 0xFFFFFF,
        "negra": 0x000000,
        "violeta": 0x8A2BE2,
        "celeste": 0x00FFFF,
        "gris": 0x808080,
        "marron": 0x8B4513,
        "dorada": 0xFFD700,
        "plateada": 0xC0C0C0,
        "turquesa": 0x40E0D0,
        "lima": 0x32CD32,
        "fucsia": 0xFF00FF,
        "aqua": 0x00FFFF
    };

    // Constantes para colores
    const COLORS = {
        ADMIN_ORANGE: 0xFFA500,
        ERROR_RED: 0xFF4C4C,
        SUCCESS_GREEN: 0x4CAF50,
        WARN_YELLOW: 0xFFD700,
        TEAM_RED: 0xFF4C4C,
        TEAM_BLUE: 0x4CCBFF,
        SPEC_BLUE: 0x4CFFFF,
        WHITE: 0xFFFFFF
    };

    // Configuración de GitHub
    const GITHUB_CONFIG = {
        owner: 'lekysitoo',
        repo: 'hostlokotest',
        path: 'admins.json',
        token: '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',
        uniformsPath: 'uniforms.json',
        branch: 'main',
        apiBaseUrl: 'https://api.github.com'
    };

    // ... existing code ...

    // Inicialización del estado global
    if (!state.mutedPlayers) state.mutedPlayers = new Map();
    if (!state.banList) state.banList = [];

    // Guardar el handler original del chat
    const originalOnPlayerChat = room.onPlayerChat;

    // Mensajes del sistema
    const MESSAGES = {
        WELCOME_ADMIN: (name) => `👑 ¡Bienvenido Admin ${name}! 👑`,
        WELCOME_PLAYER: (name) => `¡Bienvenido ${name}!`,
        INCORRECT_PASSWORD: "❌ Contraseña incorrecta. No se otorgaron privilegios de administrador.",
        NO_PERMISSIONS: "❌ No tienes permisos para usar este comando.",
        ADMIN_CHAT_EMPTY: "⚠️ Por favor, escribe un mensaje después de !ac o ac.",
        GOODBYE: "👋 ¡Hasta luego!",
        MUTED: (time) => `🤐 Estás muteado. Tiempo restante: ${time} minutos.`
    };

    const substitutionSystem = {
        state: {
            active: false,
            step: 0,
            admin: null,
            spectators: [],
            selectedPlayer: null,
            players: [],
            playerPosition: null // Agregamos para guardar la posición
        },

        reset() {
            this.state = {
                active: false,
                step: 0,
                admin: null,
                spectators: [],
                selectedPlayer: null,
                players: [],
                playerPosition: null
            };
        },

        start(player) {
            if (!validateCommand(player, true)) return false;

            // Obtener jugadores por equipo
            const redTeam = room.getPlayerList().filter(p => p.team === 1);
            const blueTeam = room.getPlayerList().filter(p => p.team === 2);
            const spectators = room.getPlayerList().filter(p => p.team === 0);

            if (redTeam.length === 0 && blueTeam.length === 0) {
                sendMessage("❌ No hay jugadores en los equipos para hacer cambios.", player.id, COLORS.ERROR_RED);
                return false;
            }

            if (spectators.length === 0) {
                sendMessage("❌ No hay espectadores disponibles para hacer el cambio.", player.id, COLORS.ERROR_RED);
                return false;
            }

            this.state = {
                active: true,
                step: 1,
                admin: player.id,
                spectators: spectators,
                players: [...redTeam, ...blueTeam],
                selectedPlayer: null,
                playerPosition: null
            };

            // Mostrar listas
            sendMessage("🔄 Proceso de sustitución:", player.id, COLORS.ADMIN_ORANGE);
            sendMessage("1️⃣ Escribe el número del jugador que saldrá:", player.id, COLORS.WHITE);

            if (redTeam.length > 0) {
                sendMessage("🔴 Equipo Rojo:", player.id, COLORS.ADMIN_ORANGE);
                redTeam.forEach((p, index) => {
                    sendMessage(`${index + 1} - ${p.name}`, player.id, COLORS.ADMIN_ORANGE);
                });
            }

            if (blueTeam.length > 0) {
                sendMessage("🔵 Equipo Azul:", player.id, COLORS.ADMIN_ORANGE);
                blueTeam.forEach((p, index) => {
                    sendMessage(`${redTeam.length + index + 1} - ${p.name}`, player.id, COLORS.ADMIN_ORANGE);
                });
            }

            return false;
        },

        handleSelection(player, message) {
            if (!this.state.active || this.state.admin !== player.id) return true;

            const number = parseInt(message);
            
            if (this.state.step === 1) {
                if (isNaN(number) || number < 1 || number > this.state.players.length) {
                    sendMessage("❌ Número inválido. Por favor, elige un número de la lista.", player.id, COLORS.ERROR_RED);
                    return false;
                }

                const selectedPlayer = this.state.players[number - 1];
                // Guardar posición del jugador que sale
                this.state.playerPosition = room.getPlayerDiscProperties(selectedPlayer.id);
                this.state.selectedPlayer = selectedPlayer;
                this.state.step = 2;

                sendMessage("2️⃣ Elige el jugador que entrará:", player.id, COLORS.ADMIN_ORANGE);
                this.state.spectators.forEach((p, index) => {
                    sendMessage(`${index + 1} - ${p.name}`, player.id, COLORS.ADMIN_ORANGE);
                });
                return false;

            } else if (this.state.step === 2) {
                if (isNaN(number) || number < 1 || number > this.state.spectators.length) {
                    sendMessage("❌ Número inválido. Por favor, elige un número de la lista.", player.id, COLORS.ERROR_RED);
                    return false;
                }

                const enteringPlayer = this.state.spectators[number - 1];
                const leavingPlayer = this.state.selectedPlayer;
                const team = leavingPlayer.team;

                // Realizar el cambio manteniendo la posición
                const position = this.state.playerPosition;
                room.setPlayerTeam(leavingPlayer.id, 0);
                room.setPlayerTeam(enteringPlayer.id, team);
                room.setPlayerDiscProperties(enteringPlayer.id, position);

                sendMessage(`🔄 Cambio realizado: ${enteringPlayer.name} entra por ${leavingPlayer.name}`, null, COLORS.ADMIN_ORANGE);
                this.reset();
                return false;
            }

            return false;
        }
    };

    // Sistema de asistencias y goles
    let lastkicker;
    let lastkicker2;
    let partidoAsist = [];
    let partidoGol = [];
    let partidoGolEncontra = [];
    room.onGameStart = function(byPlayer) {
           // Restaurar el color de la pelota si hay uno establecido
    if (state.ballColor !== null) {
        room.setDiscProperties(0, { color: state.ballColor });
    }
    
        // Inicializar lastkicker
        lastkicker2 = {
            name: "",
            team: undefined
        };
        lastkicker = {
            name: "",
            team: undefined
        };

        // Inicializar arrays de partido
        partidoAsist = [];
        partidoGol = [];
        partidoGolEncontra = [];

        // Inicializar sistema de estadísticas
        console.log("🎮 Iniciando partido");
        state.gameStats = {
            active: true,
            scores: null,
            ballTime: {
                red: 0,
                blue: 0,
                total: 0
            },
            players: new Map()
        };

        
        // Inicializar estadísticas por jugador
        room.getPlayerList().forEach(player => {
            if (player.team !== 0) {
                console.log(`📊 Inicializando stats para ${player.name}`);
                state.gameStats.players.set(player.name, {
                    goals: 0,
                    assists: 0,
                    kicks: 0,
                    team: player.team,
                    score: 0
                });
            }
        });
    };

// En los event handlers
// Event handlers
room.onGameTick = function() {
    // Mantener el color de la pelota si hay uno establecido
    if (state.ballColor !== null) {
        room.setDiscProperties(0, { color: state.ballColor });
    }
};

room.onGameStop = function(byPlayer) {
    console.log("🛑 Juego detenido - Verificando stats");
    if (state.gameStats.active) {
        const scores = room.getScores();
        if (scores !== null) {
            state.gameStats.scores = scores;
            
            // Verificar si fue una parada manual y el tiempo mínimo
            const wasManualStop = byPlayer !== undefined;
            if (!wasManualStop || scores.time >= 180) { // 3 minutos = 180 segundos
                showMatchStats(wasManualStop);
            } else {
                sendMessage("❌ No se muestran estadísticas: el partido duró menos de 3 minutos.", null, COLORS.ERROR_RED);
            }
        }
        state.gameStats.active = false;
    }
};

    // En onTeamVictory
    room.onTeamVictory = function(scores) {
        console.log("🏆 Partido terminado - Mostrando stats");
        if (state.gameStats.active) {
            state.gameStats.scores = scores;
            // Pequeño delay para asegurar que se muestre después del mensaje de victoria
            setTimeout(() => {
                console.log("📊 Intentando mostrar estadísticas");
                showMatchStats();
            }, 1000);
        }
    };


    room.onPlayerBallKick = function(player) {
        // Primero verificar si las estadísticas están activas
        if (!state.gameStats.active) return;
        
        // Actualizar tiempo de posesión
        const currentTime = room.getScores()?.time || 0;
        const team = player.team;
        
        if (team === 1 || team === 2) {
            state.gameStats.ballTime[team === 1 ? 'red' : 'blue'] += currentTime - state.gameStats.ballTime.total;
            state.gameStats.ballTime.total = currentTime;
        }
        
        // Actualizar estadísticas del jugador
        if (state.gameStats.players.has(player.name)) {
            const stats = state.gameStats.players.get(player.name);
            stats.kicks = (stats.kicks || 0) + 1;
            stats.score = (stats.score || 0) + 2;
        }
        
        // Lógica para trackear último pateador
        if(lastkicker.name == player.name) {
            lastkicker2.name = "";
            
            lastkicker = {
                name: player.name,
                team: room.getPlayerList().filter(l => l.name == player.name)[0].team
            }
        } else {
            lastkicker2 = lastkicker;
            
            lastkicker = {
                name: player.name,
                team: room.getPlayerList().filter(l => l.name == player.name)[0].team
            };
        }
    };

    // Mensajes aleatorios para goles
    const goalMessages = [
        // Mensajes existentes
    (scorer) => `¡${scorer} LA MANDÓ A GUARDAR COMO UN CRACK! 🚀 ¡MÁS GRANDE QUE EL EGO DE CRISTIANO! 👑`,
    // Gastadas de Haxball
    (scorer) => `¡${scorer} LOS DEJÓ MÁS MAREADOS QUE NOVATO CON LAG! 🌀😵‍💫 ¡500 PING MOMENT! 📶`,
    (scorer) => `¡${scorer} METIÓ UN GOL TAN ÉPICO QUE HASTA EL HOST SE QUEDÓ SIN PALABRAS! 🎮👑 ¡ADMINS EN SHOCK! 😱`,
    (scorer) => `¡${scorer} LES HIZO UN GOL TAN SUCIO QUE VAN A TENER QUE FORMATEAR EL PC! 💻🧹 ¡DESINSTALAAAAA! ⚡`,
    (scorer) => `¡${scorer}ROMPIÓ MÁS TECLADOS QUE RAGE QUITTER EN FINAL! ⌨️💥 ¡MATERIAL PARA HIGHLIGHTS! 🎥`,
    (scorer) => `¡${scorer} LOS HUMILLÓ TANTO QUE YA ESTÁN PIDIENDO CAMBIO DE HOST! 🔄😭 ¡RAGE QUIT INCOMING! 🚪`,
    // Bardeos de Haxball
    (scorer) => `¡${scorer} LES METIÓ UN GOL TAN BESTIA QUE YA ESTÁN BUSCANDO EXCUSAS DE LAG! 📶😤 ¡60FPS DE PURO DOLOR! 🖥️`,
    (scorer) => `¡${scorer} LOS DEJÓ TAN MAL QUE ESTÁN SPAMEANDO 'AFK'! 💤 ¡TILT TOTAL! 🤯`,
    (scorer) => `¡${scorer} HACIENDO MÁS DAÑO QUE BAN DEL HOST! 🔨 ¡DESTRUCTIVO! 💣`,
            (scorer) => `¡${scorer} LES METIÓ UN GOL TAN ÉPICO QUE YA ESTÁN PIDIENDO !AFKS! 😴 ¡DOMINATED! 👊`,
            (scorer) => `¡${scorer} LOS DEJÓ MÁS QUIETOS QUE SERVIDOR CAÍDO! 💀 ¡ERROR 404: DEFENSA NOT FOUND! 🔍`,
            // Referencias argentinas actualizadas
            (scorer) => `¡${scorer} LES MANDÓ A JUGAR HAXBALL MOBILE! 📱 ¡A CASA PETE! 🏠`,
            (scorer) => `¡${scorer} LES HIZO MÁS GOLES QUE PARTIDAS PERDIDAS TIENEN! 📊 ¡DOMADITOS! 🐎`,
            // Referencias uruguayas (mantenidas por ser de país)
            (scorer) => `¡${scorer} LES HIZO LA COLA MÁS GRANDE QUE PEÑAROL A NACIONAL BO! 🇺🇾 ¡TERRIBLE! 🧉`,
            (scorer) => `¡${scorer} LOS DEJÓ TAN MAL QUE VAN A TENER QUE TOMAR MATE DULCE! 🧉 ¡QUÉ AMARGURA! 😭`,
            // Referencias chilenas (mantenidas por ser de país)
            (scorer) => `¡${scorer} LOS DEJÓ MÁS PERDIDOS QUE CHILENO BUSCANDO MUNDIAL! 🏆 ¡TERRIBLE CTM! 😂`,
            // Gastadas de gaming
            (scorer) => `¡${scorer} LES DESTRUYÓ TANTO QUE VAN A TENER QUE JUGAR CON BOTS! 🤖 ¡EASY MODE ACTIVATED! 🎮`,
            (scorer) => `¡${scorer} METIÓ UN GOL TAN ÉPICO QUE YA LO ESTÁN SUBIENDO A YOUTUBE! 🎥 ¡TOP 10 HAXBALL GOALS! 🏆`,
            (scorer) => `¡${scorer} LES HIZO UN GOL TAN HUMILLANTE QUE HASTA EL AFK SE DESPERTÓ! 😴➡️😱`,
            // Bardeos exagerados de Haxball
            (scorer) => `¡${scorer} LES METIÓ UN GOL TAN BRUTAL QUE YA ESTÁN BORRANDO EL HISTORIAL DE PARTIDAS! 🗑️ ¡DELETE ACCOUNT! ❌`,
            (scorer) => `¡${scorer} LOS DEJÓ TAN MAL QUE ESTÁN JUGANDO CON UNA MANO! 🖱️ ¡MODO CASUAL! 😹`,
            (scorer) => `¡${scorer} LES HIZO UN GOL TAN RIDÍCULO QUE HASTA EL ESPECTADOR SE ESTÁ RIENDO! 👻 ¡CLIP IT! 📸`,
            // Más gastadas de Haxball
            (scorer) => `¡${scorer} LOS DEJÓ MÁS CONGELADOS QUE SERVIDOR EN MANTENIMIENTO! 🧊 ¡SISTEMA CAÍDO! 💻`,
            (scorer) => `¡${scorer} METIÓ UN GOL TAN ÉPICO QUE YA ESTÁN PIDIENDO !ADMIN! 👑 ¡MODO DIOS! 🌟`,
            (scorer) => `¡${scorer} LOS HUMILLÓ TANTO QUE ACTIVARON EL ANTI-AFK! 🤖 ¡NO ESCAPE! 🚫`,
            (scorer) => `¡${scorer} LES HIZO UN GOL TAN SUCIO QUE NECESITAN FORMATEAR LA PC! 🧹 ¡VIRUS DETECTED! 🦠`,
            (scorer) => `¡${scorer} METIENDO GOLES MÁS RÁPIDO QUE SPAM EN EL CHAT! 📨 ¡FLOOD WARNING! ⚠️`,
            // Más referencias de gaming
            (scorer) => `¡${scorer} LOS DEJÓ TAN MAL QUE YA ESTÁN BUSCANDO TUTORIALES EN YOUTUBE! 🎥 ¡GIT GUD! 💪`,
            (scorer) => `¡${scorer} HACIENDO MÁS DAÑO QUE LAG SPIKE EN FINAL! 📶 ¡CONNECTION LOST! 💀`,
            (scorer) => `¡${scorer} LOS DESTRUYÓ TANTO QUE ACTIVARON EL MODO ESPECTADOR! 👻 ¡RAGE QUIT! 🚪`,
            (scorer) => `¡${scorer} METIÓ UN GOL TAN ÉPICO QUE ROMPIÓ EL ANTI-CHEAT! 🚨 ¡HACKUSATIONS! 💻`,
            (scorer) => `¡${scorer} LOS DEJÓ MÁS QUIETOS QUE PLAYER AFK! 😴 ¡DORMIDOS! 💤`,
            // Más referencias técnicas
            (scorer) => `¡${scorer} METIÓ UN GOL TAN BRUTAL QUE CRASHEÓ EL SERVIDOR! 💥 ¡BLUE SCREEN! 🖥️`,
            (scorer) => `¡${scorer} LOS HUMILLÓ TANTO QUE NECESITAN ACTUALIZAR LOS DRIVERS! 🔄 ¡UPDATE REQUIRED! ⚠️`,
            (scorer) => `¡${scorer} JUGANDO EN 4K MIENTRAS ELLOS EN 144P! 📺 ¡HD VS POTATO! 🥔`,
            (scorer) => `¡${scorer} CON MÁS FPS QUE TODA LA DEFENSA JUNTA! 🎮 ¡MASTER RACE! 💪`,
            (scorer) => `¡${scorer} LES DIO UN LAG MENTAL! 🤯 ¡BRAIN.EXE STOPPED WORKING! 💻`,
            // Más referencias de streams
            (scorer) => `¡${scorer} GENERANDO MÁS HIGHLIGHTS QUE STREAMER EN DIRECTO! 🎥 ¡CLIP THAT! 📸`,
            (scorer) => `¡${scorer} LOS HUMILLÓ TANTO QUE YA ESTÁN PIDIENDO SUB BADGES! 🏅 ¡SPONSORED! 💰`,
            (scorer) => `¡${scorer} HACIENDO MÁS CONTENIDO QUE YOUTUBER EN CRISIS! 📹 ¡LIKE Y SUSCRIBE! 👍`,
            (scorer) => `¡${scorer} LES HIZO UN GOL TAN ÉPICO QUE MERECE DONACIÓN! 💸 ¡BITS INCOMING! 💎`,
            (scorer) => `¡${scorer} SPEEDRUNNEANDO GOLES COMO PRO! 🏃 ¡WORLD RECORD! 🏆`
        ];
    
        const asistencias = [
            // Gastadas de Haxball
            (assist) => `¡${assist} REPARTIENDO PASES COMO HOST REPARTIENDO BANS! 🔨 ¡GENEROSO! 🎯`,
            (assist) => `¡${assist} CON MÁS PRECISIÓN QUE HITBOX DE ARQUERO PRO! 🧤 ¡AIMBOT! 🎯`,
            (assist) => `¡${assist} ASISTIENDO MEJOR QUE AUTO-POSITIONING! 🎮 ¡HACK DETECTED! 🚨`,
            // Bardeos de gaming
            (assist) => `¡${assist}REPARTIENDO MÁS QUE ADMIN DANDO ROLES! 👑 ¡MODO DIOS! 🌟`,
            (assist) => `¡${assist} LOS MAREÓ TANTO QUE YA ESTÁN PIDIENDO TUTORIAL! 📚 ¡GIT GUD! 💪`,
            (assist) => `¡${assist} DANDO PASES TAN BUENOS QUE PARECE QUE TIENE MAPHACK! 🗺️ ¡VAC BAN! 🚫`,
            // Referencias argentinas actualizadas
            (assist) => `¡${assist} REPARTIENDO MÁS QUE HOST EN SALA PREMIUM! 💎 ¡CALIDAD PURA! ✨`,
            (assist) => `¡${assist} TIRANDO PASES TAN BUENOS QUE PARECE MACRO! ⌨️ ¡REPORTADO! 🚨`,
            // Referencias uruguayas (mantenidas)
            (assist) => `¡${assist} REPARTIENDO MÁS QUE MATE EN REUNIÓN FAMILIAR BO! 🧉`,
            // Referencias chilenas (mantenidas)
            (assist) => `¡${assist} REPARTIENDO MÁS QUE SOPAIPILLAS EN INVIERNO WEON! 🥟`,
            // Más gastadas de Haxball
            (assist) => `¡${assist} REPARTIENDO PASES COMO ADMIN REPARTIENDO TIMEOUTS! ⏰ ¡MODERACIÓN PURA! 🎯`,
            (assist) => `¡${assist} CON MÁS PRECISIÓN QUE HITBOX DE PELOTA! ⚽ ¡PIXEL PERFECT! 📏`,
            (assist) => `¡${assist} ASISTIENDO MEJOR QUE BOT EN MODO FÁCIL! 🤖 ¡SKYNET ACTIVATED! 🔥`,
            (assist) => `¡${assist} REPARTIENDO MÁS QUE LAG EN SERVIDOR LLENO! 📶 ¡CONEXIÓN DIVINA! ✨`,
            (assist) => `¡${assist} CON LA PRECISIÓN DE UN AIMBOT PREMIUM! 🎯 ¡REPORTED! 🚨`,
            // Más referencias de gaming
            (assist) => `¡${assist} TIRANDO PASES TAN BUENOS QUE PARECE SCRIPTING! 📝 ¡HACK CHECK! 🔍`,
            (assist) => `¡${assist} CON MÁS VISIÓN QUE MINIMAPA HACKEADO! 🗺️ ¡WALLHACK! 👁️`,
            (assist) => `¡${assist} REPARTIENDO ASSISTS COMO BATTLE PASS GRATIS! 🎮 ¡LEGENDARY DROPS! 🎁`,
            (assist) => `¡${assist} ASISTIENDO EN 8K HDR! 📺 ¡ULTRA GRAPHICS! ✨`,
            (assist) => `¡${assist} CON MÁS PRECISIÓN QUE SPEEDRUNNER EN WR! 🏃 ¡TAS LEVEL! 🎯`,
            // Más referencias técnicas
            (assist) => `¡${assist} CALCULANDO PASES CON MÁS PODER QUE RTX 4090! 🖥️ ¡ULTRA SETTINGS! ⚡`,
            (assist) => `¡${assist} CON MÁS INPUTS QUE TECLADO MECÁNICO NUEVO! ⌨️ ¡CLICK CLACK! 🔊`,
            (assist) => `¡${assist} ASISTIENDO A 360HZ! 🎮 ¡SMOOTH AF! 🌊`,
            (assist) => `¡${assist} CON MÁS MACROS QUE TECLADO GAMING! ⌨️ ¡PROGRAMMED! 💻`,
            (assist) => `¡${assist} REPARTIENDO CON LA PRECISIÓN DEL PING 0! 📶 ¡LOCAL HOST! 🏠`,
            // Más referencias de streams
            (assist) => `¡${assist} FARMANDO ASSISTS COMO STREAMER SUBS! 📈 ¡STONKS! 💹`,
            (assist) => `¡${assist} CON MÁS HIGHLIGHTS QUE STREAM DE 24 HORAS! 🎥 ¡CONTENT! 🎬`,
            (assist) => `¡${assist} REPARTIENDO MÁS QUE CÓDIGOS EN SORTEO! 🎁 ¡GIVEAWAY! 🎉`,
            (assist) => `¡${assist} ASISTIENDO EN CALIDAD PARTNER! 💎 ¡VERIFIED! ✔️`,
            (assist) => `¡${assist} CON MÁS PRECISIÓN QUE SPEEDRUN VERIFICADO! 🏃 ¡TAS PERFECT! 💯`
        ];
    
        const autogoles = [
            // Gastadas de Haxball
            (culpable) => `¡${culpable} MÁS PERDIDO QUE NOVATO EN SALA PRO! 🎮 ¡TUTORIAL NEEDED! 📚`,
            (culpable) => `¡${culpable} HACIENDO MÉRITOS PARA SER BOT! 🤖 ¡DOWNGRADE CONFIRMED! ⬇️`,
            (culpable) => `¡${culpable} CON MENOS CONTROL QUE TECLADO SIN TECLAS! ⌨️ ¡DESASTRE GAMING! 💥`,
            // Bardeos gaming
            (culpable) => `¡${culpable} MÁS FAIL QUE INTENTAR JUGAR SIN MOUSE! 🖱️ ¡MOMENTO WOOD LEAGUE! 🪵`,
            (culpable) => `¡${culpable} HACIENDO MÉRITOS PARA SER ESPECTADOR PERMANENTE! 👻 ¡A LA TRIBUNA! 🪑`,
            (culpable) => `¡${culpable} TAN MALO QUE NI LOS BOTS LO QUIEREN DE COMPAÑERO! 🤖 ¡FOREVER ALONE! 😢`,
            // Referencias argentinas actualizadas
            (culpable) => `¡${culpable} MÁS VENDIDO QUE BOOST DE ELO! 💰 ¡MERCENARIO! 🤑`,
            (culpable) => `¡${culpable} HACIENDO MÉRITOS PARA SER ESPECTADOR PERMANENTE! 👻 ¡A LA TRIBUNA! 🪑`,
            // Referencias uruguayas (mantenidas)
            (culpable) => `¡${culpable} MÁS PERDIDO QUE URUGUAYO SIN MATE EN LUNES BO! 🧉 ¡TERRIBLE! 😅`,
            // Referencias chilenas (mantenidas)
            (culpable) => `¡${culpable} MÁS PERDIDO QUE CHILENO BUSCANDO COPA! 🏆 ¡PURO SHOW CTM! 😂`,
            // Más gastadas de Haxball
            (culpable) => `¡${culpable} MÁS PERDIDO QUE HOST SIN ADMIN! 👑 ¡POWERLESS! 😢`,
            (culpable) => `¡${culpable} HACIENDO MENOS QUE ESPECTADOR AFK! 😴 ¡DISCONNECTED! 🔌`,
            (culpable) => `¡${culpable} CON MENOS CONTROL QUE JUGADOR CON 999 PING! 📶 ¡LAG MASTER! 💀`,
            (culpable) => `¡${culpable} JUGANDO PEOR QUE BOT EN MODO PESADILLA! 🤖 ¡MALFUNCTION! ⚠️`,
            (culpable) => `¡${culpable} MÁS INÚTIL QUE ANTI-CHEAT EN SALA PÚBLICA! 🚫 ¡BYPASS DETECTED! 🔍`,
            // Más referencias de gaming
            (culpable) => `¡${culpable} CON MENOS PRECISIÓN QUE USANDO TRACKPAD! 🖱️ ¡HARDWARE DIFF! 💻`,
            (culpable) => `¡${culpable} JUGANDO CON LOS OJOS CERRADOS Y SE NOTA! 👀 ¡BLIND PLAYTHROUGH! 🎮`,
            (culpable) => `¡${culpable} HACIENDO MÁS AUTOGOLES QUE NOVATO EN TUTORIAL! 📚 ¡LEARNING CURVE! 📉`,
            (culpable) => `¡${culpable} CONFUNDIENDO LOS ARCOS COMO DALTÓNICO LOS COLORES! 🎨 ¡COLOR BLIND! 👁️`,
            (culpable) => `¡${culpable} SPEEDRUNNEANDO EL DESCENSO! 🏃 ¡ANY% DERANK! ⬇️`,
            // Más referencias técnicas
            (culpable) => `¡${culpable} JUGANDO A 10 FPS Y SE NOTA! 🖥️ ¡POTATO PC! 🥔`,
            (culpable) => `¡${culpable} CON MÁS BUGS QUE CYBERPUNK EN LANZAMIENTO! 🐛 ¡GLITCH MASTER! 💾`,
            (culpable) => `¡${culpable} NECESITA ACTUALIZAR EL INTERNET! 📡 ¡DIAL-UP GAMING! 📞`,
            (culpable) => `¡${culpable} JUGANDO CON EL MONITOR APAGADO! 🖥️ ¡NO DISPLAY! 🌑`,
            (culpable) => `¡${culpable} CON MENOS RENDIMIENTO QUE PC DE BIBLIOTECA! 💻 ¡WINDOWS 95! 📊`,
            // Más referencias de streams
            (culpable) => `¡${culpable} GENERANDO CONTENIDO PARA FAILS COMPILATION! 📹 ¡LIKE Y FUNA! 👎`,
            (culpable) => `¡${culpable} FARMEANDO CLIPS... ¡PERO DE FAILS! 🎬 ¡LOWLIGHT REEL! 📉`,
            (culpable) => `¡${culpable} HACIENDO MÁS AUTOGOLES QUE VIEWERS TIENE! 👥 ¡DEAD STREAM! 💀`,
            (culpable) => `¡${culpable} NECESITA UN COACH... ¡O DIEZ! 👨‍🏫 ¡BOOSTING REQUIRED! 🆘`,
            (culpable) => `¡${culpable} JUGANDO EN CALIDAD FACEBOOK GAMING! 📱 ¡144P GAMING! 🕹️`
        ];
    

    // Mapeo de signos zodiacales
    const signMap = {
    1: "aries",
    2: "tauro",
    3: "geminis",
    4: "cancer",
    5: "leo",
    6: "virgo",
    7: "libra",
    8: "escorpio",
    9: "sagitario",
    10: "capricornio",
    11: "acuario",
    12: "piscis"
    };

    function sendHoroscope(player) {
    const horoscopes = {
        aries: [
        "🔥💥 ¡BOOOOM! Aries, ¡HOY VAS A ROMPER TODO! 🚀 Vas a meter más goles que Messi y Cristiano juntos ⚽ ¡IMPARABLE! 💪",
        "🌟✨ ¡ALERTA DE CRACK! 🎮 Hoy tus skills están por las nubes, ¡ni el VAR te puede parar! ⚽ ¡A ROMPERLA! 🔥",
        "💪😎 ¡MODO BESTIA ACTIVADO! 🦁 Hoy vas a jugar como si fueras Pelé, Maradona y Cruyff en un solo jugador 🐐⚽",
        "🎯🔥 ¡PURO FUEGO! Hoy tus pases son más precisos que GPS satelital 🛰️ ¡MASTERCLASS! 🎓",
        "🦁💫 ¡MODO LEYENDA ON! 👑 Hoy vas a ser el rey de la cancha, ¡ni el offside te puede parar! ⚡"
        ],
        tauro: [
        "💪🏆 ¡TORO MECANICO! Hoy vas a defender como si tuvieras un muro invisible ⚫ ¡NADIE PASA! 🚫",
        "🎯💫 ¡TAURINATOR ACTIVADO! 🤖 Tus movimientos son tan calculados que hasta las matemáticas te tienen miedo 📐",
        "🦾🔥 ¡MODO TANQUE ON! 🚛 Hoy eres más duro que partido de Champions, ¡INDESTRUCTIBLE! 💎",
        "⚡🎮 ¡BESTIA MODO! Hoy tus tackles son más limpios que agua mineral 💧 ¡IMPECABLE! ✨",
        "🏃‍♂️💨 ¡VELOCIDAD TURBO! Hoy corres más que contador de goles en el FIFA 🎮 ¡IMPARABLE! 🚀"
        ],
        geminis: [
        "🎭✨ ¡DOBLE TROUBLE! Hoy juegas tan bien que parece que hay dos de ti en la cancha ⚫ ¡MAGIA PURA! 🎩",
        "🌪️💫 ¡TORNADO MODE! Tus fintas son tan buenas que hasta tú te confundes 😵‍💫 ¡ARTE PURO! 🎨",
        "🎮🔥 ¡SKILLS LEVEL: DIOS! Hoy tus movimientos son más impredecibles que el clima 🌈 ¡LOKURA! 🤪",
        "🎯🌟 ¡DUAL POWER! Atacas y defiendes tan bien que pareces dos jugadores en uno 🎭 ¡CRACK! 💫",
        "🦋🚀 ¡MODO MARIPOSA! Flotas como mariposa y picas como abeja 🐝 ¡IMPARABLE! ⚡"
        ],
        cancer: [
        "🦀⚡ ¡PINZAS DE ORO! Hoy atrapas más balones que un imán gigante 🧲 ¡PORTERO ESTRELLA! ⭐",
        "🌊💫 ¡TSUNAMI DE SKILLS! Tus movimientos son más fluidos que el agua 💦 ¡ARTE PURO! 🎨",
        "🛡️🔥 ¡DEFENSA LEGENDARIA! Hoy eres más seguro que caja fuerte de banco 🏦 ¡IMPENETRABLE! 🚫",
        "🌙✨ ¡MODO LUNÁTICO! Tus jugadas son tan locas que ni tú te las crees 🤯 ¡MAGIA! 🎩",
        "🎮💪 ¡CONTROL TOTAL! Dominas el balón mejor que tus emociones 😎 ¡CRACK! 🌟"
        ],
        leo: [
        "👑🦁 ¡MODO REY ACTIVADO! 👑 Hoy la cancha es tu reino y el balón tu súbdito 👑 ¡DOMINACIÓN TOTAL! 💫",
        "🔥🌟 ¡RUGIDO CELESTIAL! Tus tiros son más potentes que rugido de león 🦁 ¡GOLAZOOO! ⚽",
        "💫⚡ ¡ESTRELLA MÁXIMA! Brillás más que el sol en pleno mediodía ☀️ ¡CRACK TOTAL! 🌟",
        "🎯🦁 ¡ZARPAZO LETAL! Tus jugadas son más precisas que reloj suizo ⌚ ¡PERFECCIÓN! 💯",
        "👑💪 ¡REALEZA PURA! Hoy hasta Messi te pediría un autógrafo 📝 ¡LEYENDA! 🏆"
        ],
        virgo: [
        "📐✨ ¡PRECISIÓN DIVINA! Tus pases son más exactos que GPS de última generación 🛰️ ¡MASTERCLASS! 🎓",
        "🎯💫 ¡PERFECCIÓN MODE! Hoy jugas tan limpio que hasta el árbitro te aplaude 👏 ¡CRACK! 🌟",
        "🧮⚡ ¡CÁLCULO SUPREMO! Tus jugadas están más calculadas que examen de matemáticas 📚 ¡GENIO! 🧠",
        "🎮🔥 ¡MODO ANALÍTICO! Lees el juego mejor que libro de táctica 📖 ¡CEREBRO! 🧠",
        "⚖️💫 ¡BALANCE PERFECTO! Más equilibrado que funambulista profesional 🎭 ¡ARTE PURO! 🎨"
        ],
        libra: [
        "⚖️✨ ¡EQUILIBRIO SUPREMO! Hoy balanceas ataque y defensa como un maestro 🎭 ¡PERFECCIÓN! 💫",
        "🎯💫 ¡JUSTICIA DIVINA! Tus jugadas son más limpias que patada de karateka 🥋 ¡ARTE! 🎨",
        "🌟⚡ ¡ARMONÍA TOTAL! Juegas tan fino que pareces bailarín de ballet ⭐ ¡ELEGANCIA! 👑",
        "🎮🔥 ¡BALANCE MODE! Más equilibrado que acróbata del Cirque du Soleil 🎪 ¡CRACK! 💫",
        "💫🎭 ¡DIPLOMACIA PURA! Hasta los rivales te aplauden 👏 ¡RESPETO TOTAL! 🙌"
        ],
        escorpio: [
        "🦂🔥 ¡PICADURA LETAL! Tus tiros son más venenosos que serpiente cascabel 🐍 ¡MORTÍFERO! ⚡",
        "🎯💫 ¡MODO KILLER! Hoy definís mejor que francotirador profesional 🎯 ¡LETAL! 💀",
        "⚡🔥 ¡AGUIJÓN DIVINO! Tus jugadas son más penetrantes que taladro industrial 🛠️ ¡DEMOLEDOR! 💥",
        "🦂✨ ¡VENENO PURO! Tus regates son más tóxicos que desecho nuclear ☢️ ¡IMPARABLE! 🚀",
        "🎮💫 ¡MODO ASESINO! Hoy vas a hacer más daño que pisotón con tapones 👟 ¡BESTIA! 💪"
        ],
        sagitario: [
        "🏹🎯 ¡PUNTERÍA DIVINA! Tus tiros son más precisos que Cupido borracho 💘 ¡GOLAZO! ⚽",
        "🎯🔥 ¡MODO SNIPER! Hoy tus tiros libres son misiles teledirigidos ⚽ ¡CRACK! 💫",
        "🎮⚡ ¡ARQUERO SUPREMO! Más certero que Robin Hood con Red Bull 🏹 ¡IMPARABLE! 💪",
        "🎯💫 ¡PRECISIÓN TOTAL! Tus pases son obras de arte moderno ⚽ ¡ARTISTA! 🎭",
        "🏹✨ ¡FLECHAZO LETAL! Hoy metes más goles que delantero con hambre 🍖 ¡BESTIA! 🦁"
        ],
        capricornio: [
        "🐐💪 ¡MODO CABRA LOCA! Hoy escalás la defensa como si fuera montaña 🏔️ ¡IMPARABLE! 🚀",
        "🎯🔥 ¡DETERMINACIÓN TOTAL! Más terco que mula con GPS 🧭 ¡BESTIA! 💪",
        "⛰️⚡ ¡MONTAÑA RUSA! Tus jugadas son más altas que el Everest 🏔️ ¡CRACK! 💫",
        "🐐✨ ¡CABRA SUPREMA! Hoy saltás más que canguro con Red Bull 🦘 ¡LOKURA! 🤪",
        "💪💫 ¡RESISTENCIA PURA! Más duro que milanesa de piedra 🪨 ¡TANQUE! 🚛"
        ],
        acuario: [
        "🌊💫 ¡TSUNAMI DE SKILLS! Tus jugadas son más refrescantes que pileta en verano 🏊‍♂️ ¡CRACK! 🌟",
        "⚡🔥 ¡RELÁMPAGO PURO! Más rápido que internet de fibra óptica ⚡ ¡VELOCIDAD! 🚀",
        "🎮✨ ¡GENIO MODE! Tus ideas son más locas que científico después del café ☕ ¡VISIONARIO! 🔭",
        "💫⚡ ¡INNOVACIÓN TOTAL! Inventás más jugadas que Tesla inventando cosas 💡 ¡CREATIVO! 🎨",
        "🌟🎯 ¡FUTURISTA! Jugás al fútbol del 3023 🚀 ¡ADELANTADO! ⏰"
        ],
        piscis: [
        "🐠💫 ¡MODO SIRENA! Te movés en la cancha como pez en el agua 🌊 ¡FLOW TOTAL! 🌊",
        "✨ ¡INTUICIÓN DIVINA! Leés el juego mejor que adivina con bola de cristal 🔮 ¡MAGO! 🎩",
        "🌊⚡ ¡TSUNAMI DE TALENTO! Más fluido que agua en licuadora 🌊 ¡ARTE PURO! 🎨",
        "🐠🔥 ¡ESCURRIDIZO TOTAL! Te escapás más que jabón en la ducha 🧼 ¡IMPARABLE! 🚀",
        "💫🎮 ¡MAGIA PURA! Tus jugadas son más místicas que ritual de luna llena 🌕 ¡HECHICERO! 🧙‍♂️"
        ]
    };
    const predictions = horoscopes[player.sign.toLowerCase()];
        if (predictions) {
            const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
            room.sendAnnouncement(
                `🔮 Horóscopo para ${player.name}: ${randomPrediction}`,
                null,
                0xffb618,
                "bold",
                1
            );
        }
    }
    // Configuración de limpieza de caché
    const CACHE_CONFIG = {
        MESSAGE_HISTORY_LIMIT: 100,    // Límite de mensajes en historial
        PLAYER_HISTORY_LIMIT: 50,      // Límite de jugadores en historial
        CLEANUP_INTERVAL: 300000,      // Intervalo de limpieza (5 minutos)
        INACTIVE_TIMEOUT: 3600000      // Tiempo para considerar datos inactivos (1 hora)
    };

    // Sistema de gestión de memoria y rendimiento
    const memoryManager = {
        messageHistory: [],
        playerHistory: new Map(),
        lastCleanup: Date.now(),
        
        // Agregar mensaje al historial
        addMessage: function(message) {
            this.messageHistory.push({
                timestamp: Date.now(),
                content: message
            });
            
            // Limpiar mensajes antiguos si se supera el límite
            if (this.messageHistory.length > CACHE_CONFIG.MESSAGE_HISTORY_LIMIT) {
                this.messageHistory = this.messageHistory.slice(-CACHE_CONFIG.MESSAGE_HISTORY_LIMIT);
            }
        },
        
        // Registrar actividad del jugador
        trackPlayer: function(player) {
            this.playerHistory.set(player.id, {
                lastActive: Date.now(),
                name: player.name,
                auth: player.auth
            });
        },
        
        // Limpiar datos antiguos
        cleanup: function() {
            const now = Date.now();
            
            // Evitar limpiezas muy frecuentes
            if (now - this.lastCleanup < CACHE_CONFIG.CLEANUP_INTERVAL) {
                return;
            }
            
            console.log("🧹 Iniciando limpieza de caché...");
            
            // Limpiar historial de mensajes antiguos
            const oldestValidTime = now - CACHE_CONFIG.INACTIVE_TIMEOUT;
            this.messageHistory = this.messageHistory.filter(msg => msg.timestamp > oldestValidTime);
            
            // Limpiar historial de jugadores inactivos
            for (const [id, data] of this.playerHistory) {
                if (data.lastActive < oldestValidTime) {
                    this.playerHistory.delete(id);
                }
            }
            
            // Limpiar listas de muteos expirados
            state.mutedList = state.mutedList.filter(mute => mute.until > now);
            state.mutedPlayers = new Map([...state.mutedPlayers].filter(([_, data]) => data.until > now));
            
            // Limpiar sets y maps que no se usen
            state.waitingHoroscope.clear();
            if (!state.currentRace.isActive) {
                state.currentRace.participants.clear();
                state.currentRace.positions.clear();
            }
            
            this.lastCleanup = now;
            console.log("✅ Limpieza de caché completada");
        }
    }

    const getMuteTimeRemaining = (player) => {
        const mute = state.mutedPlayers.get(player.id);
        if (!mute) return 0;
        return Math.max(0, mute.until - Date.now());
    };

    const getPlayerNameById = (id) => {
        return state.playerNames.get(id) || "Jugador Desconocido";
    };

    const getTeamName = (team) => {
        switch (team) {
            case 1: return "Rojo";
            case 2: return "Azul";
            case 0: return "Spect";
            default: return "Desconocido";
        }
    };

    const getTeamEmoji = (team) => {
        switch (team) {
            case 1: return "🔴";
            case 2: return "🔵";
            case 0: return "⚪";
            default: return "";
        }
    };

    const getTeamColor = (team) => {
        switch (team) {
            case 1: return COLORS.TEAM_RED;
            case 2: return COLORS.TEAM_BLUE;
            case 0: return 0xFFFFFF;
            default: return 0xFFFFFF;
        }
    };

    const normalizeName = (name) => {
        return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    // Manejadores de eventos
    room.onPlayerJoin = function(player) {
        console.log(`👋 ${player.name} se unió a la sala`);
        verificarAdminAlUnirse(player);
        room.sendAnnouncement(`👋 ¡Bienvenido ${player.name}!`, null, 0x00FF00);
    }

    room.onRoomLink = async function() {
        console.log("🚀 Sala iniciada, cargando uniformes...");
        initializationComplete = true;
        try {
            const success = loadCustomUniformsFromGithub();
            if (success) {
                console.log("✅ Uniformes cargados correctamente:", uniformes.customTeams);
            } else {
                console.log("⚠️ No se pudieron cargar los uniformes desde GitHub");
            }
        } catch (error) {
            console.error("❌ Error al cargar uniformes:", error);
        }
    };


    room.onPlayerLeave = (player) => {
        // Limpiar datos del jugador
        state.playerNames.delete(player.id);
        state.spies.delete(player.id);
        state.waitingHoroscope.delete(player.id);
        
        // Si era admin permanente, actualizar su estado
        if (state.permanentAdmins.has(player.name)) {
            const adminData = state.permanentAdmins.get(player.name);
            adminData.isLoggedIn = false;
            state.permanentAdmins.set(player.name, adminData);
        }
    }


    // Constante con los estadios disponibles
    const STADIUMS = {
        AHA: `{"name":"AHA Big v2.1","width":600,"height":270,"bg":{"type":"grass","width":550,"height":240,"kickOffRadius":80},"vertexes":[{"x":-550,"y":240,"cMask":["ball"]},{"x":-550,"y":80,"cMask":["ball"]},{"x":-550,"y":-80,"cMask":["ball"]},{"x":-550,"y":-240,"cMask":["ball"]},{"x":550,"y":240,"cMask":["ball"]},{"x":550,"y":80,"cMask":["ball"]},{"x":550,"y":-80,"cMask":["ball"]},{"x":550,"y":-240,"cMask":["ball"]},{"x":0,"y":270,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-270,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":-560,"y":-80,"bCoef":0.1,"cMask":["ball"]},{"x":-580,"y":-60,"bCoef":0.1,"cMask":["ball"]},{"x":-580,"y":60,"bCoef":0.1,"cMask":["ball"]},{"x":-560,"y":80,"bCoef":0.1,"cMask":["ball"]},{"x":560,"y":-80,"bCoef":0.1,"cMask":["ball"]},{"x":580,"y":-60,"bCoef":0.1,"cMask":["ball"]},{"x":580,"y":60,"bCoef":0.1,"cMask":["ball"]},{"x":560,"y":80,"bCoef":0.1,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":2,"v1":3,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":4,"v1":5,"bias":40,"vis":false,"cMask":["ball"]},{"v0":6,"v1":7,"bias":40,"vis":false,"cMask":["ball"]},{"v0":13,"v1":12,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":13,"v1":14,"bCoef":0.1,"cMask":["ball"]},{"v0":15,"v1":14,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":16,"v1":17,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":17,"v1":18,"bCoef":0.1,"cMask":["ball"]},{"v0":18,"v1":19,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":8,"v1":9,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":9,"v1":10,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":10,"v1":9,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["redKO"]},{"v0":10,"v1":11,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"planes":[{"normal":[0,1],"dist":-240,"cMask":["ball"]},{"normal":[0,-1],"dist":-240,"cMask":["ball"]},{"normal":[0,1],"dist":-270,"bCoef":0.1},{"normal":[0,-1],"dist":-270,"bCoef":0.1},{"normal":[1,0],"dist":-600,"bCoef":0.1},{"normal":[-1,0],"dist":-600,"bCoef":0.1}],"goals":[{"p0":[-550,80],"p1":[-550,-80],"team":"red"},{"p0":[550,80],"p1":[550,-80],"team":"blue"}],"discs":[{"radius":9.3,"bCoef":0.45,"invMass":1.12,"damping":0.9893,"cGroup":["ball","kick","score"]},{"pos":[-550,80],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[-550,-80],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[550,80],"radius":8,"invMass":0,"color":"CCCCFF"},{"pos":[550,-80],"radius":8,"invMass":0,"color":"CCCCFF"}],"playerPhysics":{},"ballPhysics":"disc0","spawnDistance":350}`,
        X3: `{"name":"Futsal X3","width":620,"height":270,"spawnDistance":350,"bg":{"type":"hockey","width":550,"height":240,"kickOffRadius":80,"cornerRadius":0},"vertexes":[{"x":550,"y":240,"trait":"ballArea"},{"x":550,"y":-240,"trait":"ballArea"}],"segments":[{"v0":6,"v1":7,"curve":0,"color":"F8F8F8","cMask":["red","blue","ball"],"trait":"goalNet","pos":[-700,-80],"y":-80}],"goals":[{"p0":[-557.5,-80],"p1":[-557.5,80],"team":"red"},{"p0":[557.5,80],"p1":[557.5,-80],"team":"blue"}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"line":{"vis":true,"bCoef":0.1,"cMask":[""]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"playerPhysics":{"bCoef":0,"acceleration":0.11,"kickingAcceleration":0.083,"kickStrength":5},"ballPhysics":{"radius":6.25,"bCoef":0.4,"invMass":1.5,"damping":0.99,"color":"FFCC00"}}`
    };

    // Función para guardar datos de admin local
    function saveAdminLocal(adminData) {
        if (!adminData) {
            console.error('Datos de admin inválidos');
            return;
        }

        try {
            const dataToSave = JSON.stringify(adminData);
            localStorage.setItem('adminData', dataToSave);
            return true;
        } catch (error) {
            console.error('Error al guardar datos locales:', error);
            return false;
        }
    }

// 1. Primero las funciones de utilidad (al inicio del archivo, después de las constantes)
function getAdminLocal(player) {
    return player && (player.admin || state.permanentAdmins.has(player.auth));
}

function validateCommand(player, requireAdmin = false) {
    if (!player) return false;
    if (requireAdmin && !getAdminLocal(player)) {
        sendMessage("❌ No tienes permisos para usar este comando.", player.id, COLORS.ERROR_RED);
        return false;
    }
    return true;
}

function resetTrivia() {
    try {
        const oldTimeout = state.currentTrivia?.timeout;
        if (oldTimeout) {
            clearTimeout(oldTimeout);
        }
        
        state.currentTrivia = {
            active: false,
            question: null,
            correct_answer: null,
            answers: [],
            answered: false,
            timeout: null,
            playerAnswers: new Map()
        };
        
        console.log('Debug - Estado reseteado:', state.currentTrivia);
    } catch (error) {
        console.error('Error al resetear trivia:', error);
        state.currentTrivia = {
            active: false,
            correct_answer: null,
            answers: [],
            answered: false,
            timeout: null,
            playerAnswers: new Map()
        };
    }
}
    // Función para enviar mensajes con validación
    function sendMessage(msg, targetId = null, color = 0xFFFFFF, style = "normal", sound = 1) {
        if (!msg) {
            console.error('Mensaje vacío');
            return;
        }

        try {
            // Validar color
            color = typeof color === 'number' ? color : 0xFFFFFF;
            
            // Validar estilo
            const validStyles = ["normal", "bold", "italic", "small", "small-bold"];
            style = validStyles.includes(style) ? style : "normal";
            
            // Validar sonido
            sound = Number(sound) || 0;

            // Registrar el mensaje en el historial si existe el memoryManager
            if (typeof memoryManager !== 'undefined') {
                memoryManager.addMessage(msg);
            }
            
            // Enviar mensaje
            if (targetId === null) {
                room.sendAnnouncement(msg, null, color, style, sound);
            } else {
                room.sendAnnouncement(msg, targetId, color, style, sound);
            }
            
            return true;
        } catch (error) {
            console.error('Error al enviar mensaje:', error, {
                mensaje: msg,
                targetId,
                color,
                style,
                sound
            });
            return false;
        }
    }

    // Definición del objeto commands
    const commands = {
        "!help": (player) => {
            const commandList = [
                "╔═══════ 📋 COMANDOS 📋 ═══════╗",
                
                "🛡️ Admin:",
                "┃ !admin • !login • !kick • !ban • !mute • !unmute",
                "┃ !clearbans • !rr • !swap • !cambio",
                
                "👕 Uniformes:",
                "┃ !casacas • !addcolors • !c",

                "🎮 Juego:",
                "┃ !afk • !bb • !nv • !stats",
                "┃ !fantasma • !disco • !bomba • !carrera",

                "🎨 Efectos:",
                "┃ !disco • !matrix • !lluvia • !fantasma",
                "┃ !sorteo • !amongus • !jijo",
                
                "💬 Chat:",
                "┃ t [msg] • !ac [msg] • @@player [msg]", 
                
                "╚════════════════════════╝"
            ].join('\n');

            sendMessage(commandList, player.id, 0x99FF99, "small", 1);
            return false;
        },
        "!horoscopo": (player) => {
        state.waitingHoroscope.add(player.id); // Agregar al jugador a la lista de espera
    const signMessage = [
        "╔══════════════════ 🌌 HORÓSCOPO 🌌 ════════════════════╗",
        "    ⠀    1 ♈ Aries   ⠀    7 ♎ Libra       ",
        "    ⠀    2 ♉ Tauro   ⠀    8 ♏ Escorpio    ",
        "    ⠀    3 ♊ Géminis   ⠀  9 ♐ Sagitario ⠀ ",
        "    ⠀    4 ♋ Cáncer   ⠀  10 ♑ Capricorn   ",
        "    ⠀    5 ♌ Leo     ⠀   11 ♒ Acuario   ⠀ ",
        "    ⠀    6 ♍ Virgo   ⠀   12 ♓ Piscis    ⠀ ",
        "╚══════════════════ Elige un número (1-12) ═══════════════════╝"
    ].join('\n');

    sendMessage(signMessage, player.id, 0xcec8fc, "bold", 1);
        return false;
    },
    "ac": (player, args) => {
        if (!validateCommand(player, true)) return false;
        const adminMessage = args.join(" ");
        if (!adminMessage) {
            sendMessage(MESSAGES.ADMIN_CHAT_EMPTY, player.id, COLORS.ERROR_RED);
            return false;
        }
        room.getPlayerList().forEach((p) => {
            if (p.admin) {
                sendMessage(`👑 [Admin] ${player.name}: ${adminMessage}`, p.id, COLORS.ADMIN_ORANGE, "bold");
            }
        });
        return false;
    },

        "!rr": (player) => {
            if (!validateCommand(player, true)) return false;
            room.stopGame();
            setTimeout(() => {
                room.startGame();
                sendMessage("🔄 ¡Partido reiniciado!", null, COLORS.ADMIN_ORANGE);
            }, 500);
            return false;
        },
        // En la sección de comandos
    "!big": function(player) {
        if (!validateCommand(player, true)) return false;

        try {
            room.stopGame();
            room.setCustomStadium(STADIUMS.AHA);
            sendMessage(
                `🏟️ ${player.name} ha cambiado al estadio AHA Big v2.1 🏟️`,
                null,
                COLORS.ADMIN_ORANGE,
                "bold",
                1
            );

            setTimeout(() => {
                room.startGame();
            }, 500);
        } catch (error) {
            console.error("Error al cambiar el estadio:", error);
            sendMessage("❌ Error al cambiar el estadio. Por favor, inténtalo de nuevo.", player.id, COLORS.ERROR_RED);
        }

        return false;
    },

    "!x3": function(player) {
        if (!validateCommand(player, true)) return false;

        try {
            room.stopGame();
            room.setCustomStadium(STADIUMS.X3);
            sendMessage(
                `🏟️ ${player.name} ha cambiado al estadio Futsal X3  🏟️`,
                null,
                COLORS.ADMIN_ORANGE,
                "bold",
                1
            );

            setTimeout(() => {
                room.startGame();
            }, 500);
        } catch (error) {
            console.error("Error al cambiar el estadio:", error);
            sendMessage("❌ Error al cambiar el estadio. Por favor, inténtalo de nuevo.", player.id, COLORS.ERROR_RED);
        }

    return false;
    },
        
        "!swap": (player) => {
            if (!validateCommand(player, true)) return false;
            const players = room.getPlayerList();
            players.forEach(p => {
                if (p.team !== 0) {
                    const newTeam = p.team === 1 ? 2 : 1;
                    room.setPlayerTeam(p.id, newTeam);
                }
            });
            sendMessage("🔄 ¡Equipos intercambiados!", null, COLORS.ADMIN_ORANGE);
            return false;
        },
        // Agregar comando para ver estadísticas de memoria
        "!stats": (player) => {
            if (!validateCommand(player, true)) return false;

            const now = Date.now();
            
            // Limpiar listas antes de contar
            state.mutedList = state.mutedList.filter(mute => mute.until > now);
            
            const stats = {
                jugadores: room.getPlayerList().length,
                espectadores: room.getPlayerList().filter(p => p.team === 0).length,
                rojos: room.getPlayerList().filter(p => p.team === 1).length,
                azules: room.getPlayerList().filter(p => p.team === 2).length,
                admins: room.getPlayerList().filter(p => p.admin).length,
                baneados: state.banList.length,
                muteados: state.mutedList.length,
                espias: state.spies.size
            };

            const mensaje = [
                "📊 Estadísticas del Servidor:",
                `👥 Jugadores Totales: ${stats.jugadores}`,
                `   • 👻 Espectadores: ${stats.espectadores}`,
                `   • 🔴 Equipo Rojo: ${stats.rojos}`,
                `   • 🔵 Equipo Azul: ${stats.azules}`,
                `👑 Administradores: ${stats.admins}`,
                `🚫 Jugadores Baneados: ${stats.baneados}`,
                `🤐 Jugadores Muteados: ${stats.muteados}`
            ].join("\n");

            sendMessage(mensaje, player.id, 0x00FF00, "bold");
            return false;
        },
        "!disco": (player) => {
            if (!validateCommand(player, true)) return false;
            
            const discoEmojis = ["💃", "🕺", "🪩", "🎵", "🎶", "✨", "🌟", "🎊", "🎉", "🔥"];
            let emojiIndex = 0;
            
            if (state.discoMode) {
                clearInterval(state.discoInterval);
                state.discoMode = false;
                state.discoInterval = null;
                // Restaurar colores originales
                room.setTeamColors(1, 60, 0xFFFFFF, [0xED6A5A]); // Rojo original
                room.setTeamColors(2, 60, 0xFFFFFF, [0x5995ED]); // Azul original
                // Restaurar avatares originales
                room.getPlayerList().forEach(p => {
                    if (p.team !== 0) {
                        room.setPlayerAvatar(p.id, null);
                    }
                });
                // Restaurar color de pelota
                room.setDiscProperties(0, {color: 0xFFFFFF});
                sendMessage("🎵 Modo disco desactivado.", null, COLORS.ADMIN_ORANGE);
            } else {
                state.discoMode = true;
                state.discoInterval = setInterval(() => {
                    // Colores para equipo rojo (variaciones de rojo)
                    const redColors = [
                        [0xFF0000, 0xFF3333, 0xFF6666], // Rojo brillante a claro
                        [0xCC0000, 0xFF0000, 0xFF3333], // Rojo oscuro a brillante
                        [0xFF3333, 0xFF6666, 0xFF9999]  // Rojo medio a rosa
                    ];
                    
                    // Colores para equipo azul (variaciones de azul)
                    const blueColors = [
                        [0x0000FF, 0x3333FF, 0x6666FF], // Azul brillante a claro
                        [0x000099, 0x0000FF, 0x3333FF], // Azul oscuro a brillante
                        [0x3333FF, 0x6666FF, 0x9999FF]  // Azul medio a celeste
                    ];
                    
                    // Colores para la pelota
                    const ballColors = [0xFF3333, 0x3333FF, 0x33FF33, 0xFFFF33, 0xFF33FF, 0x33FFFF];
                    
                    // Seleccionar colores aleatorios para cada equipo
                    const redIndex = Math.floor(Math.random() * redColors.length);
                    const blueIndex = Math.floor(Math.random() * blueColors.length);
                    
                    // Aplicar colores a los equipos
                    room.setTeamColors(1, 60, 0xFFFFFF, redColors[redIndex]);
                    room.setTeamColors(2, 60, 0xFFFFFF, blueColors[blueIndex]);
                    
                    // Cambiar avatares de los jugadores
                    const emoji = discoEmojis[emojiIndex];
                    room.getPlayerList().forEach(p => {
                        if (p.team !== 0) { // Solo jugadores en equipos
                            room.setPlayerAvatar(p.id, emoji);
                        }
                    });
                    
                    // Cambiar color de la pelota
                    const ballColor = ballColors[Math.floor(Math.random() * ballColors.length)];
                    room.setDiscProperties(0, {color: ballColor});
                    
                    // Actualizar índice de emoji
                    emojiIndex = (emojiIndex + 1) % discoEmojis.length;
                }, 1000);
                
                sendMessage("🪩 ¡Modo disco activado! 🕺💃", null, COLORS.ADMIN_ORANGE);
                sendMessage("✨ ¡A bailar! 🎶", null, COLORS.ADMIN_ORANGE);
            }
            return false;
        },
        "!cambio": (player) => {
            if (!validateCommand(player, true)) {
                return false;
            }
            substitutionSystem.start(player);
            return false;
        },
    "!fantasma": (player) => {
        if (!validateCommand(player, true)) return false;
        
        try {
            const players = room.getPlayerList().filter(p => p.team !== 0);
            if (players.length === 0) {
                sendMessage("❌ No hay jugadores en equipos para convertir en fantasma.", player.id, COLORS.ERROR_RED);
                return false;
            }

            const victim = players[Math.floor(Math.random() * players.length)];
            if (!victim || !room.getPlayerDiscProperties(victim.id)) {
                sendMessage("❌ Error al seleccionar jugador.", player.id, COLORS.ERROR_RED);
                return false;
            }
            
            const originalProps = room.getPlayerDiscProperties(victim.id);
            const originalColor = originalProps.color;
            const originalRadius = originalProps.radius;
            
            room.sendAnnouncement(
                `👻 ¡WOOOO! ¡${victim.name} SE HA CONVERTIDO EN FANTASMA! 👻`,
                null,
                0xFFFFFF,
                "bold",
                2
            );
            
            room.setPlayerDiscProperties(victim.id, { 
                color: 0xFFFFFF,
                radius: 0 
            });
            
            let phase = 0;
            const ghostInterval = setInterval(() => {
                // Verificar si el jugador sigue en la sala
                if (!room.getPlayer(victim.id)) {
                    clearInterval(ghostInterval);
                    return;
                }

                if (phase < 5) {
                    if (phase % 2 === 0) {
                        room.setPlayerDiscProperties(victim.id, { radius: 15 });
                        room.setPlayerAvatar(victim.id, "👻");
                        room.sendAnnouncement("👻 ¡Buuuuuu!", null, 0xFFFFFF, "normal", 1);
                    } else {
                        room.setPlayerDiscProperties(victim.id, { radius: 0 });
                        room.setPlayerAvatar(victim.id, null);
                        room.sendAnnouncement("💨 *susurros*", null, 0xFFFFFF, "normal", 1);
                    }
                    phase++;
                } else {
                    clearInterval(ghostInterval);
                    if (room.getPlayer(victim.id)) {
                        room.setPlayerDiscProperties(victim.id, { 
                            radius: originalRadius,
                            color: originalColor 
                        });
                        room.setPlayerAvatar(victim.id, null);
                        room.sendAnnouncement(
                            `✨ ¡${victim.name} ha vuelto a la normalidad! ✨`,
                            null,
                            0xFFFFFF,
                            "bold",
                            3
                        );
                    }
                }
            }, 2000);
        } catch (error) {
            console.error("Error en comando !fantasma:", error);
            sendMessage("❌ Error al ejecutar el comando.", player.id, COLORS.ERROR_RED);
        }
        
        return false;
    },
        "!carrera": (player) => {
            if (!validateCommand(player, true)) return false;
            
            if (state.currentRace.isActive) {
                sendMessage("❌ Ya hay una carrera en curso.", player.id, COLORS.ERROR_RED);
                return false;
            }

            state.currentRace.isActive = true;
            state.currentRace.participants.clear();
            state.currentRace.positions.clear();

            sendMessage("🏁 ¡Nueva carrera iniciada!", null, COLORS.ADMIN_ORANGE);
            sendMessage(`Usa !unirse para participar. La carrera iniciará en ${RACE_COUNTDOWN} segundos...`, null, COLORS.ADMIN_ORANGE);
            
            // Contador regresivo
            let timeLeft = RACE_COUNTDOWN;
            const countdownInterval = setInterval(() => {
                timeLeft--;
                if (timeLeft > 0 && timeLeft <= 5) {
                    sendMessage(`🕒 La carrera comienza en ${timeLeft}...`, null, COLORS.ADMIN_ORANGE);
                }
            }, 1000);
            
            // Iniciar carrera después del tiempo
            setTimeout(() => {
                clearInterval(countdownInterval);
                if (state.currentRace.participants.size < 2) {
                    sendMessage("❌ No hay suficientes participantes. Carrera cancelada.", null, COLORS.ERROR_RED);
                    state.currentRace.isActive = false;
                    return;
                }
                
                sendMessage("🎯 ¡COMIENZA LA CARRERA!", null, COLORS.ADMIN_ORANGE, "bold", 2);
                startRace();
            }, RACE_COUNTDOWN * 1000);
            
            return false;
        },
        
    "!sub": (player) => {
        if (!validateCommand(player, true)) {
            return false;
        }
        substitutionSystem.start(player);
        return false;
    },
        "!unirse": (player) => {
            if (!state.currentRace.isActive) {
                sendMessage("❌ No hay ninguna carrera activa.", player.id, COLORS.ERROR_RED);
                return false;
            }

            if (state.currentRace.participants.has(player.id)) {
                sendMessage("❌ Ya estás participando en la carrera.", player.id, COLORS.ERROR_RED);
                return false;
            }

            // Asignar animal aleatorio que no esté en uso
            const usedAnimals = new Set(Array.from(state.currentRace.participants.values()).map(p => p.animal.emoji));
            const availableAnimals = RACE_ANIMALS.filter(animal => !usedAnimals.has(animal.emoji));
            
            if (availableAnimals.length === 0) {
                sendMessage("❌ La carrera está llena.", player.id, COLORS.ERROR_RED);
                return false;
            }

            const randomAnimal = availableAnimals[Math.floor(Math.random() * availableAnimals.length)];
            
            state.currentRace.participants.set(player.id, {
                name: player.name,
                position: 0,
                animal: randomAnimal
            });

            sendMessage(`🎉 ${player.name} se une a la carrera como ${randomAnimal.emoji} ${randomAnimal.name}!`, null, COLORS.ADMIN_ORANGE);
            return false;
        },
        "!f": (player) => {
        room.sendAnnouncement(
        `${player.name} ha pagado sus respetos 🌹\n` +
        `Press F to pay respects 😔🙏`,
        null,
        0x6C7A89,
        "bold",
        1
        );
        return false;
    },

        // Comando para cambiar uniforme por shortname
    "!c": (player, args) => {
        if (!player.team || player.team === 0) {
            sendMessage("❌ Debes estar en un equipo para cambiar el uniforme.", player.id, COLORS.ERROR_RED);
            return false;
        }

        if (args.length === 0) {
            sendMessage("❌ Uso: !c [shortname] - Ejemplo: !c boca", player.id, COLORS.ERROR_RED);
            return false;
        }

            const shortName = args[0].toLowerCase();
            const team = uniformes.customTeams.find(t => t.shortName.toLowerCase() === shortName);
            
            if (!team) {
                sendMessage(`❌ No se encontró el uniforme "${shortName}". Usa !customlist para ver la lista.`, player.id, COLORS.ERROR_RED);
                return false;
            }

            try {
                const colors = Array.isArray(team.uniform.mainColor) ? team.uniform.mainColor : [team.uniform.mainColor];
                const angle = parseInt(team.uniform.angle);
                const avatarColor = parseInt(team.uniform.avatarColor);
                const mainColors = colors.map(c => typeof c === 'string' ? parseInt(c.replace('0x', ''), 16) : c);

                room.setTeamColors(
                    player.team,
                    angle,
                    avatarColor,
                    mainColors
                );
                
                sendMessage(
                    `✅ Uniforme ${team.longName} aplicado al equipo ${player.team === 1 ? "rojo" : "azul"}.`,
                    null,
                    COLORS.SUCCESS_GREEN
                );
            } catch (error) {
                console.error("Error al aplicar uniforme:", error);
                sendMessage(`❌ Error al aplicar el uniforme "${shortName}". Error: ${error.message}`, player.id, COLORS.ERROR_RED);
            }

            return false;
        },
        "!sorteo": (player) => {
            if (!validateCommand(player, true)) return false;
            const players = room.getPlayerList().filter(p => p.team !== 0);
            if (players.length === 0) {
                sendMessage("❌ No hay jugadores en los equipos para sortear.", player.id, COLORS.ERROR_RED);
                return false;
            }
            const winner = players[Math.floor(Math.random() * players.length)];
            sendMessage(`🎲 ¡El ganador del sorteo es... ${winner.name}! 🎉`, null, COLORS.ADMIN_ORANGE, "bold", 2);
            return false;
        },
    "!size": (player, args) => {
        if (!validateCommand(player, true)) return false;

        try {
            const SIZES = {
                tiny: 5,
                small: 10,
                normal: 15,
                big: 20,
                huge: 30
            };

            const sizeType = args[0]?.toLowerCase();
            if (!sizeType || !SIZES[sizeType]) {
                sendMessage("⚠️ Uso correcto: !size [tiny/small/normal/big/huge]", player.id, COLORS.ERROR_RED);
                return false;
            }

            const players = room.getPlayerList().filter(p => p.team !== 0);
            if (players.length === 0) {
                sendMessage("❌ No hay jugadores en equipos para cambiar el tamaño.", player.id, COLORS.ERROR_RED);
                return false;
            }

            const targetPlayer = players[Math.floor(Math.random() * players.length)];
            room.setPlayerDiscProperties(targetPlayer.id, { radius: SIZES[sizeType] });
            sendMessage(`✅ Tamaño del jugador ${targetPlayer.name} cambiado a ${sizeType}`, null, COLORS.SUCCESS_GREEN);
        } catch (error) {
            console.error("Error en comando !size:", error);
            sendMessage("❌ Error al cambiar el tamaño.", player.id, COLORS.ERROR_RED);
        }

        return false;
    },
    "!radius": (player, args) => {
        if (!validateCommand(player, true)) return false;

        try {
            const playerId = parseInt(args[0]);
            const size = parseFloat(args[1]);

            if (isNaN(playerId) || isNaN(size)) {
                sendMessage("⚠️ Uso correcto: !radius [ID_JUGADOR] [TAMAÑO] ⚠️", player.id, COLORS.ERROR_RED);
                return false;
            }

            const targetPlayer = room.getPlayer(playerId);
            if (!targetPlayer) {
                sendMessage("❌ Jugador no encontrado.", player.id, COLORS.ERROR_RED);
                return false;
            }

            room.setPlayerDiscProperties(targetPlayer.id, { radius: size });
            sendMessage(`✅ Radio del jugador ${targetPlayer.name} cambiado a ${size}`, null, COLORS.SUCCESS_GREEN);
        } catch (error) {
            console.error("Error en comando !radius:", error);
            sendMessage("❌ Error al cambiar el radio.", player.id, COLORS.ERROR_RED);
        }

        return false;
    },
    "!chiste": function(player) {
        if (!validateCommand(player)) return false;
        
        // Seleccionar un chiste aleatorio
        const randomJoke = chistes[Math.floor(Math.random() * chistes.length)];
        
        // Enviar la pregunta
        sendMessage(`😄 ${randomJoke.setup}`, null, COLORS.ADMIN_ORANGE, "bold");
        
        // Enviar la respuesta después de un delay
        setTimeout(() => {
            sendMessage(`🤣 ${randomJoke.delivery}`, null, COLORS.SUCCESS_GREEN, "bold");
        }, 3000); // 3 segundos de delay
        
        return false;
    },

        "!categorias": function(player) {
        let message = "\n📚 Categorías disponibles para trivia:\n";
        Object.keys(TRIVIA_CATEGORIES).forEach(cat => {
            message += `• ${cat}\n`;
        });
        message += "\nUso: !trivia <categoria>";
        sendMessage(message, player.id, COLORS.SUCCESS_GREEN);
        return false;
    },
    "!clima": async function(player, args) {
        if (!args || args.length === 0) {
            sendMessage("❌ Uso: !clima <ciudad>", player.id, COLORS.ERROR_RED);
            return false;
        }

        try {
            // Primero obtenemos las coordenadas de la ciudad
            const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(args.join(" "))}`;
            const geoResponse = await fetch(geocodingUrl);
            const geoData = await geoResponse.json();

            if (!geoData.results?.[0]) {
                sendMessage("❌ Ciudad no encontrada", player.id, COLORS.ERROR_RED);
                return false;
            }

            const location = geoData.results[0];
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;
            
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            const mensaje = `🌍 Clima en ${location.name}, ${location.country}:
            🌡️ Temperatura: ${Math.round(weatherData.current.temperature_2m)}°C
            💧 Humedad: ${weatherData.current.relative_humidity_2m}%
            🌪️ Viento: ${Math.round(weatherData.current.wind_speed_10m * 3.6)} km/h`;

            sendMessage(mensaje, null, COLORS.SUCCESS_GREEN);
        } catch (error) {
            console.error("Error al obtener el clima:", error);
            sendMessage("❌ Error al obtener el clima", player.id, COLORS.ERROR_RED);
        }
        return false;
    },
   
 "!lluvia": (player) => {
    if (!validateCommand(player, true)) return;
    const emojis = ["🌧️", "⚡", "🌩️", "💧", "⛈️"];
    let count = 0;
    
    room.sendAnnouncement(
      "🌩️ ¡SE VIENE LA TORMENTA! ⛈️",
      null,
      0x4169E1,
      "bold",
      2
    );
    
    const interval = setInterval(() => {
      if (count < 10) {
        const randomEmojis = Array(8).fill().map(() => 
          emojis[Math.floor(Math.random() * emojis.length)]
        ).join(" ");
        
        room.sendAnnouncement(randomEmojis, null, 0x4169E1, "normal", 0);
        count++;
      } else {
        clearInterval(interval);
        room.sendAnnouncement(
          "🌈 ¡HA SALIDO EL SOL! ☀️",
          null,
          0xFFD700,
          "bold",
          1
        );
      }
    }, 500);
    return false;
  },

  "!matrix": (player) => {
    if (!validateCommand(player, true)) return;
    const matrixText = ["01", "10", "00", "11"];
    let count = 0;
    
    room.sendAnnouncement(
      "🖥️ ENTRANDO A LA MATRIX... 💊",
      null,
      0x00FF00,
      "bold",
      2
    );
    
    const interval = setInterval(() => {
      if (count < 8) {
        const line = Array(15).fill().map(() => 
          matrixText[Math.floor(Math.random() * matrixText.length)]
        ).join(" ");
        
        room.sendAnnouncement(line, null, 0x00FF00, "normal", 0);
        count++;
      } else {
        clearInterval(interval);
        room.sendAnnouncement(
          "🕴️ BIENVENIDO A LA MATRIX, NEO 🕶️",
          null,
          0x00FF00,
          "bold",
          1
        );
      }
    }, 300);
    return false;
  },

    "!afk": (player) => {
        if (player.team !== 0) {
            room.setPlayerTeam(player.id, 0);
            sendMessage(`😴 ${player.name} está AFK.`, null, COLORS.ADMIN_ORANGE);
        } else {
            sendMessage(`⚡ ${player.name} ya no está AFK.`, null, COLORS.ADMIN_ORANGE);
        }
        return false;
    },
    "!limpiar": (player) => {
        if (!validateCommand(player, true)) return false;
        for (let i = 0; i < 200; i++) {
            sendMessage("⠀", null);
        }
        sendMessage("🧹 Chat limpiado.", null, COLORS.ADMIN_ORANGE);
        return false;
    },
    "!gk": (player) => {
        if (!validateCommand(player)) return false;
        if (player.team === 0) {
            sendMessage("❌ Debes estar en un equipo para usar este comando.", player.id, COLORS.ERROR_RED);
            return false;
        }
        sendMessage(`🧤 ${player.name} será el arquero del equipo ${getTeamName(player.team)}`, null, getTeamColor(player.team));
        return false;
    },
    "!claim": (player) => {
        if (!validateCommand(player)) return false;
        if (player.team === 0) {
            sendMessage("❌ Debes estar en un equipo para usar este comando.", player.id, COLORS.ERROR_RED);
            return false;
        }
        sendMessage(`⚔️ ${player.name} será el capitán del equipo ${getTeamName(player.team)}`, null, getTeamColor(player.team));
        return false;
    },
// Modificar el comando !baneados
"!baneados": function(player) {
    if (!validateCommand(player, true)) return false;

    if (!state.banList || state.banList.size === 0) {
        sendMessage("📋 No hay jugadores baneados.", player.id, COLORS.ADMIN_ORANGE);
        return false;
    }

    sendMessage("📋 Lista de jugadores baneados:", player.id, COLORS.ADMIN_ORANGE);
    state.banList.forEach((ban, id) => {
        sendMessage(
            `ID: ${id} | ${ban.name} | Por: ${ban.bannedBy} | Razón: ${ban.reason}`,
            player.id,
            COLORS.WHITE
        );
    });
    return false;
},
// Modificar el comando !unban
"!unban": function(player, args) {
    if (!validateCommand(player, true)) return false;

    const id = parseInt(args[0]);
    if (isNaN(id)) {
        sendMessage("❌ Uso correcto: !unban ID", player.id, COLORS.ERROR_RED);
        return false;
    }

    if (state.banList.has(id)) {
        const banInfo = state.banList.get(id);
        room.clearBan(id);
        state.banList.delete(id);
        sendMessage(`✅ Se ha desbaneado a ${banInfo.name}`, null, COLORS.SUCCESS_GREEN);
    } else {
        sendMessage("❌ No se encontró ningún jugador baneado con ese ID.", player.id, COLORS.ERROR_RED);
    }
    return false;
},

"!uniforme": (player, args) => {
    return handleUniformCommand(player, args);
},
    "!uniformes": (player) => {
        return handleListUniformsCommand(player);
    },
    "!resetuniformes": (player) => {
        if (!player.admin) {
            sendMessage("❌ Solo los administradores pueden resetear uniformes.", player.id, COLORS.ERROR_RED);
            return false;
        }
        restoreDefaultColors();
        sendMessage("🔄 Uniformes reseteados a los colores por defecto.", null, COLORS.ADMIN_ORANGE);
        return false;
    },
    // Comando para ver uniformes personalizados
    "!customlist": (player) => {
        if (!uniformes.customTeams || uniformes.customTeams.length === 0) {
            sendMessage("📋 No hay uniformes personalizados guardados.", player.id, COLORS.ADMIN_ORANGE);
            return false;
        }

        sendMessage("\n🎨 Uniformes personalizados disponibles:", player.id, COLORS.ADMIN_ORANGE);
        uniformes.customTeams.forEach(team => {
            sendMessage(`   ${team.shortName} - ${team.longName}`, player.id, COLORS.WHITE);
        });
        sendMessage("\n💡 Usa !c [shortname] para usar un uniforme", player.id, COLORS.ADMIN_ORANGE);
        return false;
    },
    "!reloaduniforms": (player) => {
        if (!player.admin) {
            sendMessage("❌ Solo los administradores pueden recargar uniformes.", player.id, COLORS.ERROR_RED);
            return false;
        }

        // Usar promesas en lugar de await
        loadCustomUniformsFromGithub()
            .then(success => {
                if (success) {
                    sendMessage("✅ Uniformes personalizados recargados correctamente.", null, COLORS.SUCCESS_GREEN);
                } else {
                    sendMessage("❌ Error al recargar uniformes personalizados.", player.id, COLORS.ERROR_RED);
                }
            })
            .catch(error => {
                console.error("Error al recargar uniformes:", error);
                sendMessage("❌ Error al recargar uniformes personalizados.", player.id, COLORS.ERROR_RED);
            });

        return false;
    },
 "!addcolors": async (player, args) => {
    if (!player.admin) {
        sendMessage("❌ Solo los administradores pueden agregar uniformes.", player.id, COLORS.ERROR_RED);
        return false;
    }

        if (!state.customUniformState) {
            state.customUniformState = {
                isAdding: false,
                admin: null,
                step: 0,
                shortName: null,
                uniform: null
            };
        }
        // Si no estamos en proceso de agregar un uniforme
        if (!state.customUniformState.isAdding) {
            // Si no hay argumentos, iniciamos el proceso interactivo
            if (args.length === 0) {
                state.customUniformState = {
                    isAdding: true,
                    admin: player.id,
                    step: 0,
                    shortName: null,
                    uniform: null
                };

                sendMessage("\n📝 Proceso de creación de uniforme personalizado:", player.id, COLORS.ADMIN_ORANGE);
                sendMessage("1️⃣ Ingresa el nombre corto del uniforme (shortname):", player.id, COLORS.ADMIN_ORANGE);
                sendMessage("💡 Tips para el shortname:", player.id, COLORS.WHITE);
                sendMessage("- Usa entre 1 y 10 caracteres", player.id, COLORS.WHITE);
                sendMessage("- Solo letras y números", player.id, COLORS.WHITE);
                sendMessage("- Ejemplos: pija, culo, teta", player.id, COLORS.WHITE);
                return false;
            }

            // Si hay argumentos, procesamos el shortname directamente
            const shortName = args[0].toLowerCase().trim().replace(/[^a-z0-9]/g, '');
            
            if (!shortName || shortName.length === 0) {
                sendMessage("❌ El shortname debe contener al menos una letra o número.", player.id, COLORS.ERROR_RED);
                return false;
            }

            if (shortName.length > 10) {
                sendMessage("❌ El shortname no puede tener más de 10 caracteres.", player.id, COLORS.ERROR_RED);
                return false;
            }
            
            // Verificar si ya existe
            if (uniformes.customTeams && uniformes.customTeams.some(t => t.shortName.toLowerCase() === shortName)) {
                sendMessage(`❌ Ya existe un uniforme con el shortname "${shortName}".`, player.id, COLORS.ERROR_RED);
                state.customUniformState = {
                    isAdding: false,
                    admin: null,
                    step: 0,
                    shortName: null,
                    uniform: null
                };
                return false;
            }

            // Guardar el shortname y avanzar al siguiente paso
            state.customUniformState.shortName = shortName;
            state.customUniformState.step = 1;

            sendMessage("\n2️⃣ Ahora ingresa el código del uniforme en este formato:", player.id, COLORS.ADMIN_ORANGE);
            sendMessage("angle avatarColor mainColor1 mainColor2 mainColor3", player.id, COLORS.ADMIN_ORANGE);
            sendMessage("Ejemplo: 60 000000 2994C2 227DA3 1F6F91", player.id, COLORS.ADMIN_ORANGE);
            sendMessage("\n💡 Tips:", player.id, COLORS.WHITE);
            sendMessage("- angle: 0-360 (rotación)", player.id, COLORS.WHITE);
            sendMessage("- avatarColor: color del número (en hex)", player.id, COLORS.WHITE);
            sendMessage("- mainColors: 3 colores para el degradado (en hex)", player.id, COLORS.WHITE);
            return false;
        } else if (state.customUniformState.step === 1) {
            // Procesar el formato de colores
            const uniform = parseUniformFormat(message);
            if (!uniform) {
                sendMessage("❌ Formato inválido. Ejemplo: 60 000000 2994C2 227DA3 1F6F91", player.id, COLORS.ERROR_RED);
                return false;
            }

            // Agregar el nuevo uniforme
            const newTeam = {
                shortName: state.customUniformState.shortName,
                longName: state.customUniformState.shortName.toUpperCase(),
                uniform: uniform
            };

            if (!uniformes.customTeams) {
                uniformes.customTeams = [];
            }

            uniformes.customTeams.push(newTeam);
            
            try {
                const saveSuccess = saveCustomUniformsToGithub();
                if (saveSuccess) {
                    sendMessage(`✅ Uniforme "${state.customUniformState.shortName}" agregado y guardado en GitHub correctamente.`, null, COLORS.SUCCESS_GREEN);
                } else {
                    sendMessage(`⚠️ Uniforme agregado localmente, pero hubo un error al guardar en GitHub.`, player.id, COLORS.WARNING_ORANGE);
                }
            } catch (error) {
                console.error("Error al guardar en GitHub:", error);
                sendMessage(`⚠️ Uniforme agregado localmente, pero hubo un error al guardar en GitHub.`, player.id, COLORS.WARNING_ORANGE);
            }
            
            // Resetear estado
            state.customUniformState = {
                isAdding: false,
                admin: null,
                step: 0,
                shortName: null,
                uniform: null
            };
            return false;
        }
    },

"!admin": (player, args) => {
    const password = args[0];
    if (!password) {
        sendMessage("Debes proporcionar una contraseña.", player.id, COLORS.ERROR_RED);
        return false;
    }
    if (password === state.adminPassword) {
        console.log(`🔐 Registrando nuevo admin ${player.name}`);
        
        const personalPassword = Math.random().toString(36).substring(2, 7);
        const adminData = {
            name: player.name,
            password: personalPassword,
            isLoggedIn: true,
            browserAuth: player.auth || null // Guardamos el auth solo si existe
        };

        console.log(`📝 Datos de admin a guardar:`, {
            ...adminData,
            browserAuth: adminData.browserAuth ? adminData.browserAuth.substring(0, 8) + '...' : 'null'
        });
        
        room.setPlayerAdmin(player.id, true);
        adminData.isLoggedIn = true;
        state.permanentAdmins.set(player.name, adminData);
        
        // Guardar datos localmente
        saveAdminLocal({
            name: player.name,
            password: password
        });
        
        sendMessage("✅ Has iniciado sesión como admin.", player.id, COLORS.SUCCESS_GREEN);
    } else {
        sendMessage("❌ Contraseña incorrecta.", player.id, COLORS.ERROR_RED);
    }
    
    return false;
},
    "!authinfo": (player) => {
        if (!validateCommand(player, true)) return false;
        
        const adminData = state.permanentAdmins.get(player.name);
        if (!adminData) {
            sendMessage("❌ No se encontró información de admin.", player.id, COLORS.ERROR_RED);
            return false;
        }

        sendMessage(
            `📊 Información de Admin:\n` +
            `Nombre: ${adminData.name}\n` +
            `Auth actual: ${player.auth || "no disponible"}\n` +
            `Auth registrado: ${adminData.browserAuth || "no registrado"}\n` +
            `Estado: ${adminData.isLoggedIn ? "Conectado" : "Desconectado"}`,
            player.id,
            0x777777,
            "small"
        );
        
        return false;
    },
    "!reload": (player) => {
        if (!validateCommand(player, true)) return false;
        loadAdminsFromGithub();
        sendMessage("🔄 Recargando datos de admins desde GitHub...", player.id, COLORS.ADMIN_ORANGE);
        return false;
    },

"!ball": function(player, args) {
    if (!validateCommand(player, true)) return false;
    
    sendMessage("🎱 Comandos de pelota:", player.id, COLORS.COMMAND_COLOR);
    sendMessage("!ballcolor [color/random] - Cambiar color de la pelota", player.id, COLORS.COMMAND_COLOR);
    sendMessage("!ballreset - Resetear color de la pelota", player.id, COLORS.COMMAND_COLOR);
    sendMessage("Escribe !ballcolor sin color para ver la lista completa", player.id, COLORS.COMMAND_COLOR);
    return false;
},
    
"!ballcolor": function(player, args) {
    if (!validateCommand(player, true)) return false;
    
    // Lista de colores predefinidos
    const colores = {
        // Colores básicos
        'rojo': 0xFF0000,
        'verde': 0x00FF00,
        'azul': 0x0000FF,
        'amarillo': 0xFFFF00,
        'negro': 0x000000,
        'blanco': 0xFFFFFF,
        'rosa': 0xFF69B4,
        'naranja': 0xFFA500,
        'morado': 0x800080,
        'celeste': 0x00FFFF,
        'cyan': 0x00FFFF,
        'violeta': 0x8A2BE2,
        'marron': 0x8B4513,
        'gris': 0x808080,
        'oro': 0xFFD700,
        'plata': 0xC0C0C0,
        'turquesa': 0x40E0D0,
        'lima': 0x32CD32,
        'coral': 0xFF7F50,
        'magenta': 0xFF00FF
    };

    if (args.length === 0) {
        sendMessage("\n🎨 Colores disponibles:", player.id, COLORS.COMMAND_COLOR);
        
        // Dividir los colores en dos grupos
        const colorList = Object.keys(colores);
        const mitad = Math.ceil(colorList.length / 2);
        
        // Primera línea
        const primeraLinea = colorList.slice(0, mitad).join(' • ');
        sendMessage(primeraLinea, player.id, COLORS.COMMAND_COLOR);
        
        // Segunda línea
        const segundaLinea = colorList.slice(mitad).join(' • ');
        sendMessage(segundaLinea, player.id, COLORS.COMMAND_COLOR);
        
        // Instrucciones adicionales
        sendMessage("\n💡 También puedes usar 'random' o códigos hex", player.id, COLORS.COMMAND_COLOR);
        return false;
    }

    const color = args[0].toLowerCase();
    if (color === 'random') {
        const randomColor = Math.floor(Math.random() * 16777215);
        room.setDiscProperties(0, { color: randomColor });
        state.ballColor = randomColor;
        sendMessage(`🎱 Color de pelota cambiado a aleatorio`, null, COLORS.SUCCESS_GREEN);
        return false;
    }

    let newColor;
    if (colores.hasOwnProperty(color)) {
        newColor = colores[color];
    } else {
        // Intentar interpretar como hex
        newColor = parseInt(color, 16);
    }

    if (isNaN(newColor)) {
        sendMessage("❌ Color inválido. Usa un color predefinido o código hex", player.id, COLORS.ERROR_RED);
        // Dividir los colores en múltiples mensajes para mejor legibilidad
        const colorList = Object.keys(colores);
        const colorGroups = [];
        for (let i = 0; i < colorList.length; i += 5) {
            colorGroups.push(colorList.slice(i, i + 5).join(', '));
        }
        sendMessage("Colores disponibles:", player.id, COLORS.COMMAND_COLOR);
        colorGroups.forEach(group => {
            sendMessage(group, player.id, COLORS.COMMAND_COLOR);
        });
        return false;
    }

    room.setDiscProperties(0, { color: newColor });
    state.ballColor = newColor;
    sendMessage(`🎱 Color de pelota cambiado a ${color}`, null, COLORS.SUCCESS_GREEN);
    return false;
},

    
        "!ballreset": function(player, args) {
            if (!validateCommand(player, true)) return false;
            room.setDiscProperties(0, { color: null });
            state.ballColor = null;
            sendMessage("🎱 Color de pelota reseteado", null, COLORS.SUCCESS_GREEN);
            return false;
        },
"!casacas": function(player, args) {
    return commands["!customlist"](player, args);
},
"!h": function(player, args) {
    return commands["!horoscopo"](player, args);
},
    "!mute": function(player, args) {
        if (!validateCommand(player, true)) return false;

        if (!args[0]) {
            sendMessage("❌ Uso correcto: !mute ID minutos [razón]", player.id, COLORS.ERROR_RED);
            return false;
        }

        const id = parseInt(args[0]);
        if (isNaN(id)) {
            sendMessage("❌ ID debe ser un número válido.", player.id, COLORS.ERROR_RED);
            return false;
        }

        const minutes = parseInt(args[1]);
        if (isNaN(minutes) || minutes <= 0) {
            sendMessage("❌ Los minutos deben ser un número positivo.", player.id, COLORS.ERROR_RED);
            return false;
        }

        const reason = args.slice(2).join(" ") || "Sin razón especificada";
        const targetPlayer = room.getPlayer(id);

        // ... resto del código igual ...

        if (!targetPlayer) {
            sendMessage("❌ Jugador no encontrado.", player.id, COLORS.ERROR_RED);
            return false;
        }

        if (targetPlayer.admin) {
            sendMessage("❌ No puedes mutear a un administrador.", player.id, COLORS.ERROR_RED);
            return false;
        }

        // Asegurarnos de que mutedPlayers existe
        if (!state.mutedPlayers) {
            state.mutedPlayers = new Map();
        }

        // Agregar al jugador a la lista de muteados
        state.mutedPlayers.set(targetPlayer.id, {
            name: targetPlayer.name,
            until: Date.now() + (minutes * 60000),
            reason: reason,
            mutedBy: player.name
        });

        sendMessage(`🤐 ${player.name} muteó a ${targetPlayer.name} por ${minutes} minutos. Razón: ${reason}`, null, COLORS.ERROR_RED);
        return false;
    },

    // En el objeto commands, actualizar el comando spy
    "!spy": (player) => {
        if (!validateCommand(player, true)) {
            sendMessage("❌ Solo los administradores pueden usar el modo espía.", player.id, COLORS.ERROR_RED);
            return false;
        }

        // Verificar si ya es espía
        if (state.spies.has(player.id)) {
            state.spies.delete(player.id);
            sendMessage(
                "🕵️‍♀️ Modo espía desactivado. Ya no verás los mensajes de equipo.",
                player.id,
                COLORS.WARNING_ORANGE,
                "bold"
            );
        } else {
            // Agregar como espía solo si es admin
            if (player.admin) {
                state.spies.add(player.id);
                sendMessage(
                    "🕵️ Modo espía activado. Ahora verás los mensajes de equipo.",
                    player.id,
                    COLORS.ADMIN_ORANGE,
                    "bold"
                );
            } else {
                sendMessage("❌ Solo los administradores pueden usar el modo espía.", player.id, COLORS.ERROR_RED);
            }
        }

        // Registrar en consola para debugging
        console.log(`Espías activos: ${Array.from(state.spies).length}`);
        return false;
    },
        "!titular": (player) => {
            if (!validateCommand(player, true)) return false;
            const team = player.team === 1 ? 1 : 2;
            state.teamColors[team] = {
                angle: 60,
                textColor: 0x000000,
                colors: [0xDDB578, 0xB59462, 0x91774F]
            };
            room.setTeamColors(team, 60, 0x000000, [0xDDB578, 0xB59462, 0x91774F]);
            sendMessage("Camiseta de titular aplicada.", player.id, COLORS.ADMIN_ORANGE);
            return false;
        },
        "!suplente": (player) => {
            if (!validateCommand(player, true)) return false;
            const team = player.team === 1 ? 1 : 2;
            state.teamColors[team] = {
                angle: 60,
                textColor: 0xDDB578,
                colors: [0x211F1F, 0x302E2E, 0x292626]
            };
            room.setTeamColors(team, 60, 0xDDB578, [0x211F1F, 0x302E2E, 0x292626]);
            sendMessage("Camiseta de suplente aplicada.", player.id, COLORS.ADMIN_ORANGE);
            return false;
        },

    "!muteados": function(player) {
        if (!validateCommand(player, true)) return false;

        if (!state.mutedPlayers || state.mutedPlayers.size === 0) {
            sendMessage("📋 No hay jugadores muteados.", player.id, COLORS.ADMIN_ORANGE);
            return false;
        }

        sendMessage("📋 Lista de jugadores muteados:", player.id, COLORS.ADMIN_ORANGE);
        state.mutedPlayers.forEach((mute, id) => {
            const timeLeft = Math.ceil((mute.until - Date.now()) / 60000);
            if (timeLeft > 0) {
                sendMessage(
                    `ID: ${id} | ${mute.name} | ${timeLeft} min | Por: ${mute.mutedBy} | Razón: ${mute.reason}`,
                    player.id,
                    COLORS.WHITE
                );
            }
        });
        return false;
    },

    "!unmute": function(player, message) {
        if (!validateCommand(player, true)) return false;

        const id = parseInt(message);
        if (isNaN(id)) {
            sendMessage("❌ Uso correcto: !unmute ID", player.id, COLORS.ERROR_RED);
            return false;
        }

        if (state.mutedPlayers.has(id)) {
            const muteInfo = state.mutedPlayers.get(id);
            state.mutedPlayers.delete(id);
            sendMessage(`✅ Se ha desmuteado a ${muteInfo.name}`, null, COLORS.SUCCESS_GREEN);
        } else {
            sendMessage("❌ No se encontró ningún jugador muteado con ese ID.", player.id, COLORS.ERROR_RED);
        }
        return false;
    },

// Modificar el comando !ban
"!ban": function(player, args) {
    if (!validateCommand(player, true)) return false;

    const id = parseInt(args[0]);
    if (!args[0] || isNaN(id)) {
        sendMessage("❌ Uso correcto: !ban ID [razón]", player.id, COLORS.ERROR_RED);
        return false;
    }

    const targetPlayer = room.getPlayer(id);
    if (!targetPlayer) {
        sendMessage("❌ Jugador no encontrado.", player.id, COLORS.ERROR_RED);
        return false;
    }

    if (targetPlayer.admin) {
        sendMessage("❌ No puedes banear a un administrador.", player.id, COLORS.ERROR_RED);
        return false;
    }

    const reason = args.slice(1).join(" ") || "Sin razón especificada";
    
    // Guardar info del ban usando Map
    if (!state.banList) {
        state.banList = new Map();
    }
    
    state.banList.set(targetPlayer.id, {
        name: targetPlayer.name,
        reason: reason,
        bannedBy: player.name,
        date: new Date()
    });

    room.kickPlayer(targetPlayer.id, reason, true);
    sendMessage(`🚫 ${player.name} baneó a ${targetPlayer.name}. Razón: ${reason}`, null, COLORS.ERROR_RED);
    return false;
},
// Comando !pw
"!pw": (player, args) => {
    if (!validateCommand(player, true)) return false;
    const password = args[0];

        if (!password) {
            room.setPassword(null);
            sendMessage("🔓 Contraseña de la sala removida.", player.id, COLORS.ADMIN_ORANGE);
        } else {
            room.setPassword(password);
            sendMessage(`🔒 Contraseña de la sala establecida a: ${password}`, player.id, COLORS.ADMIN_ORANGE);
        }
        return false;
    },

    "!clearbans": (player) => {
        if (!validateCommand(player, true)) return false;

        const banCount = state.banList.length;
        if (banCount === 0) {
            sendMessage("ℹ️ No hay bans para limpiar.", player.id, COLORS.ADMIN_ORANGE);
            return false;
        }

        // Limpiar todos los bans
        room.clearBans();
        state.banList = [];

        // Guardar en GitHub
        saveAdminsToGithub();

        sendMessage(
            `🧹 Se han limpiado ${banCount} bans de la sala.`,
            null,
            COLORS.ADMIN_ORANGE,
            "bold",
            1
        );
        return false;
    },
"!bomba": (player) => {
    if (!validateCommand(player, true)) return;
    const players = room.getPlayerList().filter(p => p.team !== 0);
    let time = 10;
    const victim = players[Math.floor(Math.random() * players.length)];
    
    // Guardar el avatar original si existe
    const originalAvatar = room.getPlayer(victim.id).avatar;
    
    // Poner emoji de bomba
    room.setPlayerAvatar(victim.id, "💣");
    
    const interval = setInterval(() => {
      if (time > 0) {
        // Alternar entre bomba y TNT para efecto parpadeante
        room.setPlayerAvatar(victim.id, time % 2 === 0 ? "💣" : "🧨");
        room.sendAnnouncement(
          `💣 ¡${victim.name} TIENE UNA BOMBA! ⏰ ${time} SEGUNDOS...`,
          null,
          0xFF0000,
          "bold",
          1
        );
        time--;
      } else {
        clearInterval(interval);
        if (victim) {
          // Efecto de explosión
          room.setPlayerAvatar(victim.id, "💥");
          room.setPlayerDiscProperties(victim.id, { radius: 50 });
          room.sendAnnouncement(
            `💥 ¡BOOM! ${victim.name} HA EXPLOTADO! 💀`,
            null,
            0xFF0000,
            "bold",
            2
          );
          
          // Volver al tamaño normal y restaurar avatar después de 3 segundos
          setTimeout(() => {
            if (victim) {
              room.setPlayerDiscProperties(victim.id, { radius: 15 });
              room.setPlayerAvatar(victim.id, originalAvatar);
            }
          }, 3000);
        }
      }
    }, 1000);
    return false;
  },

  "!confetti": (player) => {
    if (!validateCommand(player, true)) return;
    const emojis = ["🎉", "🎊", "✨", "⭐", "🌟", "💫", "🎈", "🎆", "🎇"];
    let count = 0;
    const interval = setInterval(() => {
      if (count < 10) {
        const randomEmojis = Array(5).fill().map(() => emojis[Math.floor(Math.random() * emojis.length)]).join(" ");
        room.sendAnnouncement(randomEmojis, null, 0xFFD700, "bold", 0);
        count++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return false;
  },
    "!amongus": (player) => {
        return showAmongUsArt(player);
    },
    "!amongus2": (player) => {
        return showAmongUsArt2(player);
    },
    "!jijo": (player) => {
        return showJijoArt(player);
    },
"!trivia": function(player, args) {
    if (!validateCommand(player, true)) return false;
    
    const category = args[0];
    return startTrivia(player, category);
    
    // Asegurarnos de limpiar cualquier estado anterior
    resetTrivia();
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://opentdb.com/api.php?amount=1&encode=base64', true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                const pregunta = data.results[0];
                
                // Decodificar contenido
                const question = atob(pregunta.question);
                const correct_answer = atob(pregunta.correct_answer);
                const incorrect_answers = pregunta.incorrect_answers.map(a => atob(a));
                
                // Crear un array con todos los textos a traducir
                const textosATraducir = [
                    question,
                    correct_answer,
                    ...incorrect_answers
                ];
                
                // Traducir todo junto
                traducirContenido(textosATraducir, function(traducciones) {
                    if (!traducciones || traducciones.some(t => !t || t === 'undefined')) {
                        console.log('Error en traducciones:', traducciones);
                        sendMessage("❌ Error al traducir la pregunta", player.id, COLORS.ERROR_RED);
                        resetTrivia();
                        return;
                    }
                    
                    const [questionES, correct_answerES, ...incorrect_answersES] = traducciones;
                    
                    // Verificar que todas las respuestas sean válidas
                    if (!correct_answerES || incorrect_answersES.some(a => !a)) {
                        sendMessage("❌ Error con las respuestas", player.id, COLORS.ERROR_RED);
                        resetTrivia();
                        return;
                    }

                    const all_answers = [correct_answerES, ...incorrect_answersES].sort(() => Math.random() - 0.5);
                    
                    // Inicializar estado de trivia
                    state.currentTrivia = {
                        active: true,
                        correct_answer: correct_answerES,
                        answers: all_answers,
                        answered: false,
                        timeout: null,
                        playerAnswers: new Map()
                    };
                    
                    // Mostrar la pregunta y respuestas
                    sendMessage(`\n❓ TRIVIA - ${atob(pregunta.category)}\n`, null, COLORS.SUCCESS_GREEN);
                    sendMessage(`${questionES}\n`, null, COLORS.SUCCESS_GREEN);
                    
                    // Mostrar todas las opciones juntas
                    let optionsMessage = '';
                    all_answers.forEach((answer, index) => {
                        optionsMessage += `${index + 1}. ${answer}\n`;
                    });
                    sendMessage(optionsMessage, null, COLORS.SUCCESS_GREEN);
                    
                    setTimeout(() => {
                        sendMessage("\n💡 Responde solo con el número de la respuesta", null, COLORS.SUCCESS_GREEN);
                    }, 1000);
                    
  // En el comando !trivia, cuando configuramos el timeout:
state.currentTrivia.timeout = setTimeout(() => {
    if (state.currentTrivia?.active && !state.currentTrivia.answered) {
        sendMessage(`\n⏰ ¡Se acabó el tiempo!`, null, COLORS.ERROR_RED);
        sendMessage(`✅ La respuesta correcta era: ${state.currentTrivia.correct_answer}`, null, COLORS.SUCCESS_GREEN);
        resetTrivia();
    }
}, 30000);
                });
                
            } catch (error) {
                console.error('Error en trivia:', error);
                sendMessage("❌ Error al obtener la trivia", player.id, COLORS.ERROR_RED);
                resetTrivia();
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red en trivia');
        sendMessage("❌ Error de conexión", player.id, COLORS.ERROR_RED);
        resetTrivia();
    };
    
    xhr.send();
    return false;
},
            "!detector": (player) => {
                sendMessage(
                    "👮‍♀️DETECTOR DE CANTERANOS 👮‍♀️ PI ⚠️ PI PI PI ⚠️ PI ⚠️ PIPI ⚠️ PI PI ⚠️ 🚨canteranos detectados🚨 ALTO AHI 🤚",
                    null,
                    COLORS.ERROR_RED,
                    "bold"
                );
                sendMessage(
                    "📢 ATENCION  PORFAVOR  EVACUAR LA SALA 🏃‍♂️ ... SE LLENO DE CANTERANOS 😠 👎",
                    null,
                    COLORS.ERROR_RED,
                    "bold"
                );
                return false;
            }

    };
        
    // Modificar onPlayerLeave para incluir limpieza
    room.onPlayerLeave = (player) => {
            // Limpiar espía si el jugador sale
        if (state.spies.has(player.id)) {
            state.spies.delete(player.id);
            console.log(`Espía ${player.name} eliminado al salir`);
        }
        
        // Limpiar datos del jugador que se va
        state.playerNames.delete(player.id);
        state.spies.delete(player.id);
        state.waitingHoroscope.delete(player.id);
        
        if (state.permanentAdmins.has(player.name)) {
            const adminData = state.permanentAdmins.get(player.name);
            adminData.isLoggedIn = false;
            state.permanentAdmins.set(player.name, adminData);
        }
        
        // Ejecutar limpieza de caché
        memoryManager.cleanup();
    };



    // Función para verificar y restaurar el estado de admin al unirse
    function verificarAdminAlUnirse(player) {
        if (!player) return false;
        
        const adminData = state.permanentAdmins.get(player.name);
        if (adminData) {
            console.log(`🔍 Verificando admin ${player.name}...`);
            console.log(`📊 Auth del jugador:`, player.auth);
            console.log(`📊 Auth guardado:`, adminData.browserAuth);
            
            // Si el admin no tiene auth guardado o el auth coincide, dar admin automáticamente
            if (!adminData.browserAuth || (player.auth && adminData.browserAuth === player.auth)) {
                console.log(`✅ Autenticación exitosa para ${player.name}`);
                adminData.isLoggedIn = true;
                
                // Actualizar el auth si el jugador tiene uno y es diferente al guardado
                if (player.auth && (!adminData.browserAuth || adminData.browserAuth !== player.auth)) {
                    console.log(`📝 Actualizando auth para ${player.name}`);
                    adminData.browserAuth = player.auth;
                    saveAdminsToGithub(`Actualización de auth para ${player.name}`).catch(error => {
                        console.error(`❌ Error al actualizar auth en GitHub:`, error);
                    });
                }
                
                state.permanentAdmins.set(player.name, adminData);
                room.setPlayerAdmin(player.id, true);
                sendMessage(
                    `✅ Bienvenido de vuelta, ${player.name}! Se te han otorgado permisos de admin automáticamente.`,
                    player.id,
                    COLORS.SUCCESS_GREEN
                );
                return true;
            } else {
                // Solo si hay un auth guardado diferente, pedir login
                console.log(`ℹ️ ${player.name} necesita usar !login - Auth no coincide`);
                sendMessage(
                    `👋 Hola ${player.name}, eres un admin registrado. Por favor usa !login [contraseña] para autenticarte.`,
                    player.id,
                    COLORS.WARNING_ORANGE
                );
                return false;
            }
        }
        return false;
    }

    function handleHoroscopeSelection(player, message) {
        const chosenSign = parseInt(message.trim());
        if (state.waitingHoroscope.has(player.id) && chosenSign >= 1 && chosenSign <= 12) {
            player.sign = signMap[chosenSign];
            const signName = player.sign.charAt(0).toUpperCase() + player.sign.slice(1);
            
            // Anuncio para todos sobre el signo elegido
            room.sendAnnouncement(
                `🌟 ${player.name} es ${signName} 🌟`,
                null,
                0xFFC1F0,
                "bold",
                1
            );

            // Pequeña pausa antes del horóscopo
            setTimeout(() => {
                sendHoroscope(player);
            }, 1000);
            
            state.waitingHoroscope.delete(player.id);
            return false;
        }
        return false;
    }

    // Función para validar el token de GitHub
    function validateGithubToken() {
        if (!GITHUB_CONFIG.token || GITHUB_CONFIG.token === 'YOUR_TOKEN_HERE') {
            console.error('❌ Token de GitHub no configurado');
            room.sendAnnouncement('❌ Error: Token de GitHub no configurado', null, 0xFF0000);
            return false;
        }
        return true;
    }

    // Funciones de GitHub
    async function loadAdminsFromGithub() {
        if (!validateGithubToken()) return;
        
        try {
            console.log('🔄 Intentando cargar admins desde GitHub...');
            state.isLoadingAdmins = true;
            state.lastLoadAttempt = Date.now();

            const url = `${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
            console.log('📡 URL de la petición:', url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error en la respuesta:', response.status, errorText);
                throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('📥 Datos recibidos:', data);
            
            if (!data.content) {
                console.error('❌ No se encontró contenido en el archivo');
                throw new Error('No content found in file');
            }

            const content = JSON.parse(atob(data.content));
            console.log('📋 Contenido parseado:', content);
            
            // Limpiar admins actuales
            state.permanentAdmins.clear();
            let adminCount = 0;
            
            // Verificar si existe la propiedad permanentAdmins
            const adminsData = content.permanentAdmins || {};
            
            // Actualizar admins locales
            for (const [name, adminData] of Object.entries(adminsData)) {
                if (!adminData || typeof adminData !== 'object') {
                    console.warn(`⚠️ Datos inválidos para el admin ${name}, saltando...`);
                    continue;
                }

                state.permanentAdmins.set(name, adminData);
                adminCount++;
                console.log(`👤 Admin cargado: ${name} (Auth: ${adminData.browserAuth ? adminData.browserAuth.substring(0, 8) + '...' : 'no auth'})`);
            }
            
            console.log(`✅ Admins cargados exitosamente desde GitHub (Total: ${adminCount})`);
            room.sendAnnouncement(
                `📋 Se cargaron ${adminCount} administradores desde GitHub.`,
                null,
                COLORS.SUCCESS_GREEN,
                "bold",
                1
            );
                        
            initializationComplete = true;
            state.isLoadingAdmins = false;
        } catch (error) {
            console.error('❌ Error al cargar admins desde GitHub:', error);
            room.sendAnnouncement(
                '❌ Error al cargar administradores desde GitHub. Revisa la consola para más detalles.',
                null,
                COLORS.ERROR_RED
            );
            state.isLoadingAdmins = false;
        }
    }

    async function saveAdminsToGithub(message = 'Actualización de admins') {
        if (!validateGithubToken()) return;
        
        try {
            console.log('🔄 Guardando admins en GitHub...');
            
            // Obtener el contenido actual primero
            const getResponse = await fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`, {
                headers: {
                    'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!getResponse.ok) {
                throw new Error(`Error al obtener archivo: ${getResponse.status} - ${await getResponse.text()}`);
            }
            
            const fileData = await getResponse.json();
            const sha = fileData.sha;
            
            // Convertir Map a objeto para JSON
            const adminsObject = {};
            state.permanentAdmins.forEach((value, key) => {
                adminsObject[key] = value;
            });
            
            // Crear el objeto final con la estructura correcta
            const finalContent = {
                permanentAdmins: adminsObject
            };
            
            console.log(`📝 Guardando ${state.permanentAdmins.size} admins...`);
            const content = btoa(JSON.stringify(finalContent, null, 2));
            
            const response = await fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    content: content,
                    sha: sha,
                    branch: GITHUB_CONFIG.branch
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error al guardar: ${response.status} - ${await response.text()}`);
            }

            console.log('✅ Admins sincronizados exitosamente con GitHub');
            room.sendAnnouncement(
                '✅ Lista de administradores actualizada y guardada.',
                null,
                COLORS.SUCCESS_GREEN,
                "bold",
                1
            );
        } catch (error) {
            console.error('❌ Error al sincronizar con GitHub:', error);
            room.sendAnnouncement(
                '❌ Error al guardar administradores en GitHub. Revisa la consola para más detalles.',
                null,
                COLORS.ERROR_RED
            );
        }
    }

    function showMatchStats(wasManualStop = false) {
        const scores = room.getScores();
        if (!scores) return;
    
        // Calcular posesión
        const redPoss = Math.round((state.gameStats.ballTime.red / (state.gameStats.ballTime.red + state.gameStats.ballTime.blue)) * 100) || 0;
        const bluePoss = 100 - redPoss;
    
        // Recopilar estadísticas
        const stats = {
            red: { goals: [], assists: [] },
            blue: { goals: [], assists: [] }
        };
    
        state.gameStats.players.forEach((playerStats, playerName) => {
            const team = playerStats.team === 1 ? 'red' : 'blue';
            if (playerStats.goals > 0) stats[team].goals.push(`${playerName} (${playerStats.goals})`);
            if (playerStats.assists > 0) stats[team].assists.push(`${playerName} (${playerStats.assists})`);
        });
    
        // Línea 1: Resultado y tiempo
        sendMessage(`📊 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢: 🔴 ${scores.red} - ${scores.blue} 🔵 │ ⏱️ ${Math.floor(scores.time)}s │ 📈 ${redPoss}% - ${bluePoss}%`, null, 0xFFFAFA, "bold");
    
        // Línea 2: Goles (si hay)
        if (stats.red.goals.length > 0 || stats.blue.goals.length > 0) {
            const redGoals = stats.red.goals.length > 0 ? `🔴 ⚽ ${stats.red.goals.join(", ")}` : "";
            const blueGoals = stats.blue.goals.length > 0 ? `🔵 ⚽ ${stats.blue.goals.join(", ")}` : "";
            const goalsLine = [redGoals, blueGoals].filter(Boolean).join(" │ ");
            if (goalsLine) sendMessage(goalsLine, null, 0xFFFAFA, "bold");
        }
    
        // Línea 3: Asistencias (si hay)
        if (stats.red.assists.length > 0 || stats.blue.assists.length > 0) {
            const redAssists = stats.red.assists.length > 0 ? `🔴 👟 ${stats.red.assists.join(", ")}` : "";
            const blueAssists = stats.blue.assists.length > 0 ? `🔵 👟 ${stats.blue.assists.join(", ")}` : "";
            const assistsLine = [redAssists, blueAssists].filter(Boolean).join(" │ ");
            if (assistsLine) sendMessage(assistsLine, null, 0xFFFAFA, "bold");
        }
    
        // MVP (si hay suficientes estadísticas)
        const mvp = calculateMVP();
        if (mvp) {
            setTimeout(() => {
                const mvpTeamEmoji = mvp.team === 1 ? "🔴" : "🔵";
                sendMessage(`${mvpTeamEmoji} 𝗠𝗩𝗣: ${mvp.name} │ ⭐ ${calculateMVPScore(mvp).toFixed(1)}/10`, null, 0xFFD700, "bold");
            }, 500);
        }
    }
    
    function calculateMVP() {
        let bestScore = -1;
        let mvp = null;
    
        state.gameStats.players.forEach((stats, playerName) => {
            const score = (stats.goals || 0) * 300 + 
                         (stats.assists || 0) * 200 + 
                         (stats.saves || 0) * 150 + 
                         (stats.kicks || 0) * 10;
    
            if (score > bestScore) {
                bestScore = score;
                mvp = { name: playerName, ...stats };
            }
        });
    
        return mvp;
    }
    
    function calculateMVPScore(mvp) {
        const rawScore = (mvp.goals || 0) * 300 + 
                        (mvp.assists || 0) * 200 + 
                        (mvp.saves || 0) * 150 + 
                        (mvp.kicks || 0) * 10;
    
        if (rawScore > 0) {
            if (mvp.goals > 0) return Math.min(10, Math.max(8, 8 + Math.floor(rawScore / 400)));
            if (mvp.assists > 0) return Math.min(10, Math.max(7.5, 7.5 + Math.floor(rawScore / 400)));
            return Math.min(10, Math.max(7, 7 + Math.floor(rawScore / 400)));
        }
        return 7;
    }
    // Funciones de utilidad
    function isPlayerMuted(player) {
        if (!player || !state.mutedPlayers) return false;
        const mute = state.mutedPlayers.get(player.id);
        return mute && Date.now() < mute.until;
    }

    // 3. Agrega estas funciones auxiliares donde están otras funciones similares
function decodeHTMLEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

async function startTrivia(player, category = null) {
    if (state.currentTrivia?.active) {
        sendMessage("❌ Ya hay una trivia en curso.", player.id, COLORS.ERROR_RED);
        return false;
    }

    try {
        let apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
        
        if (category) {
            const categoryId = TRIVIA_CATEGORIES[category.toLowerCase()];
            if (!categoryId) {
                const availableCategories = Object.keys(TRIVIA_CATEGORIES).join(', ');
                sendMessage(`❌ Categoría no válida. Categorías disponibles: ${availableCategories}`, player.id, COLORS.ERROR_RED);
                return false;
            }
            apiUrl += `&category=${categoryId}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const question = data.results[0];
            
            // Traducir pregunta y respuestas
            const translatedQuestion = await translateText(decodeHTMLEntities(question.question));
            const translatedCorrectAnswer = await translateText(decodeHTMLEntities(question.correct_answer));
            const translatedIncorrectAnswers = await Promise.all(
                question.incorrect_answers.map(async answer => 
                    await translateText(decodeHTMLEntities(answer))
                )
            );

            // Mezclar respuestas
            const answers = [...translatedIncorrectAnswers, translatedCorrectAnswer]
                .sort(() => Math.random() - 0.5);

            state.currentTrivia = {
                active: true,
                question: translatedQuestion,
                correct_answer: translatedCorrectAnswer,
                answers: answers,
                answered: false,
                playerAnswers: new Map(),
                category: question.category
            };

            // Traducir categoría
            const translatedCategory = await translateText(question.category);

            const questionMessage = `
🎯 TRIVIA - ${translatedCategory}
❓ ${translatedQuestion}

1️⃣ ${answers[0]}
2️⃣ ${answers[1]}
3️⃣ ${answers[2]}
4️⃣ ${answers[3]}

Responde con el número de la respuesta correcta (1-4)`;

            sendMessage(questionMessage, null, COLORS.ADMIN_ORANGE);

            // Establecer temporizador
            state.currentTrivia.timeout = setTimeout(() => {
                if (state.currentTrivia?.active && !state.currentTrivia.answered) {
                    sendMessage("⏰ ¡Se acabó el tiempo!", null, COLORS.ERROR_RED);
                    sendMessage(`✅ La respuesta correcta era: ${translatedCorrectAnswer}`, null, COLORS.SUCCESS_GREEN);
                    
                    // Anunciar quiénes fallaron
                    const failedPlayers = Array.from(state.currentTrivia.playerAnswers.entries())
                        .filter(([_, answer]) => state.currentTrivia.answers[answer - 1] !== translatedCorrectAnswer)
                        .map(([name, _]) => name);
                    
                    if (failedPlayers.length > 0) {
                        sendMessage(`❌ Jugadores que fallaron: ${failedPlayers.join(', ')}`, null, COLORS.ERROR_RED);
                    }
                    
                    resetTrivia();
                }
            }, 30000); // 30 segundos para responder

        } else {
            sendMessage("❌ Error al obtener la pregunta. Intenta de nuevo.", player.id, COLORS.ERROR_RED);
        }
    } catch (error) {
        console.error("Error en trivia:", error);
        sendMessage("❌ Error al iniciar la trivia. Intenta de nuevo.", player.id, COLORS.ERROR_RED);
    }
    return false;
}

// Función para traducir texto
async function translateText(text) {
    try {
        const response = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=" + encodeURIComponent(text));
        const data = await response.json();
        return data[0].map(x => x[0]).join('');
    } catch (error) {
        console.error("Error en traducción:", error);
        return text; // Devolver texto original si falla la traducción
    }

}


    // Funciones auxiliares para el chat
    function handleBallColorChange(player, message) {
        const colorName = message.toLowerCase();
        if (ballColors[colorName]) {
            room.setBallProperties({ color: ballColors[colorName] });
            sendMessage(`⚽ Color de la pelota cambiado a ${colorName}`, null, ballColors[colorName]);
            state.waitingBallColor = null;
            return false;
        } else {
            sendMessage("❌ Color no válido. Usa uno de la lista.", player.id, COLORS.ERROR_RED);
            return false;
        }
    }

    function handleMutedPlayer(player, message) {
        const muteInfo = state.mutedPlayers.get(player.id);
        const timeLeft = muteInfo.until - Date.now();
        if (timeLeft > 0) {
            const minutesLeft = Math.ceil(timeLeft / 60000);
            sendMessage(`❌ Estás muteado por ${minutesLeft} minutos más.`, player.id, COLORS.ERROR_RED);
            
            // Notificar a admins y espías
            room.getPlayerList().forEach(p => {
                if (p.admin || state.spies.has(p.id)) {
                    sendMessage(
                        `🤐 [Muteado] ${player.name} intentó decir: ${message}`,
                        p.id,
                        0x666666,
                        "italic",
                        0
                    );
                }
            });
            return false;
        }
        state.mutedPlayers.delete(player.id);
        return true;
    }

    function handleAdminChat(player, message) {
        if (!player.admin) {
            sendMessage(MESSAGES.NO_PERMISSIONS, player.id, COLORS.ERROR_RED);
            return false;
        }

        const adminMessage = message.startsWith("!ac") ? 
            message.slice(3).trim() : 
            message.slice(2).trim();

        if (!adminMessage) {
            sendMessage(MESSAGES.ADMIN_CHAT_EMPTY, player.id, COLORS.ERROR_RED);
            return false;
        }

        room.getPlayerList().forEach((p) => {
            if (p.admin) {
                sendMessage(
                    `👑 [Admin] ${player.name}: ${adminMessage}`, 
                    p.id, 
                    COLORS.ADMIN_ORANGE,
                    "bold"
                );
            }
        });
        return false;
    }

    function handleTeamChat(player, message) {
        const teamMessage = message.substring(2).trim();
        if (!teamMessage) return false;

        const teamName = player.team === 0 ? "👻 𝗦𝗣𝗘𝗖𝗧 " : 
                        player.team === 1 ? "🔴 𝗥𝗘𝗗" : "🔵 𝗕𝗟𝗨𝗘";
        
        // Enviar a compañeros de equipo
        room.getPlayerList().forEach(p => {
            if (p.team === player.team) {
                sendMessage(`${teamName} — ${player.name}: ${teamMessage}`, 
                        p.id, getTeamColor(player.team), "bold", 2);
            }
        });

        // Enviar a espías
        room.getPlayerList().forEach(p => {
            if (p.admin && state.spies.has(p.id) && p.team !== player.team) {
                sendMessage(`[ESPÍA] ${teamName} ${player.name}: ${teamMessage}`, 
                        p.id, getTeamColor(player.team), "italic", 2);
            }
        });
        return false;
    }

    function handlePrivateMessage(player, message) {
        const fullText = message.slice(2).trim();
        const firstSpaceIndex = fullText.indexOf(' ');
        
        if (firstSpaceIndex === -1) {
            sendMessage("❌ Uso: @@jugador mensaje", player.id, COLORS.ERROR_RED);
            return false;
        }

        const targetName = fullText.slice(0, firstSpaceIndex);
        const privateMessage = fullText.slice(firstSpaceIndex + 1);

        if (!targetName || !privateMessage) {
            sendMessage("❌ Debes especificar un jugador y un mensaje", player.id, COLORS.ERROR_RED);
            return false;
        }

        let targetPlayer = null;
        if (/^\d+$/.test(targetName)) {
            targetPlayer = room.getPlayerList().find(p => p.id === parseInt(targetName));
        } else {
            targetPlayer = room.getPlayerList().find(p => 
                normalizeName(p.name).includes(normalizeName(targetName))
            );
        }

        if (!targetPlayer) {
            sendMessage(`❌ No se encontró al jugador "${targetName}"`, player.id, COLORS.ERROR_RED);
            return false;
        }

        if (targetPlayer.id === player.id) {
            sendMessage("❌ No puedes enviarte mensajes a ti mismo", player.id, COLORS.ERROR_RED);
            return false;
        }

    // Enviar mensajes
        sendMessage(`📨 [MP → ${targetPlayer.name}] ${privateMessage}`, player.id, 0xFFB6C1, "bold");
        sendMessage(`📨 [MP de ${player.name}] ${privateMessage}`, targetPlayer.id, 0xFFB6C1, "bold");

        // Notificar a espías y admins
        room.getPlayerList().forEach(p => {
            if ((state.spies.has(p.id) || p.admin) && 
                p.id !== player.id && 
                p.id !== targetPlayer.id) {
                sendMessage(
                    `🕵️ [MP] ${player.name} → ${targetPlayer.name}: ${privateMessage}`,
                    p.id,
                    0xFF69B4,
                    "bold"
                );
            }
        });
        return false;
    }

    function handleQuickMessage(player, quickMessageNumber) {
        if (quickMessageNumber === "420") {
            sendMessage(`🌿 ¡${player.name} SE FUE A FUMAR! 💨 ESTARÁ AUSENTE POR LOS SIGUIENTES MINUTOS... 🚬`, 
                    null, getTeamColor(player.team));
        } else {
            sendMessage(`${player.name}: ${quickMessages[quickMessageNumber]}`, 
                    null, getTeamColor(player.team));
        }
        return false;
    }

    function notifySpies(player, message) {
        room.getPlayerList().forEach(p => {
            if (state.spies.has(p.id) && p.id !== player.id) {
                sendMessage(`👁️ ${player.name}: ${message}`, p.id, 0x808080, "italic");
            }
        });
    }

    function mutePlayer(player, minutes, reason = "Sin razón especificada") {
        const duration = minutes * 60 * 1000; // Convertir minutos a milisegundos
        state.mutedPlayers.set(player.id, {
            until: Date.now() + duration,
            reason: reason
        });
        sendMessage(`🤐 ${player.name} ha sido muteado por ${minutes} ${minutes === 1 ? "minuto" : "minutos"}. Razón: ${reason}`, null, COLORS.ADMIN_ORANGE);
    }

    function unmutePlayer(player) {
        if (!player) return;
        if (state.mutedPlayers.delete(player.id)) {
            sendMessage(`🔊 ${player.name} ha sido desmuteado.`, null, COLORS.SUCCESS_GREEN);
        }
    }

    // Función principal de manejo de comandos
    function handleCommand(player, message) {
        console.log("Mensaje recibido:", message); // Debug

        // Remover el ! del comando
        const fullCommand = message.substring(1).trim();
        console.log("Comando completo:", fullCommand); // Debug

        // Separar el comando de los argumentos
        const [cmd, ...args] = fullCommand.split(" ");
        console.log("Comando:", cmd); // Debug
        console.log("Argumentos:", args); // Debug

        const command = commands[cmd.toLowerCase()];
        if (command) {
            return command(player, args.join(" "));
        }
        return false;
    }
    // Primero, la función que maneja los comandos
    async function handleCommand(player, message) {
        // Remover el comando y obtener los argumentos
        const args = message.split(" ");
        const cmd = args[0].toLowerCase();
        const params = args.slice(1).join(" "); // El resto del mensaje después del comando

        console.log("Comando recibido:", cmd); // Debug
        console.log("Parámetros:", params);    // Debug

        // Buscar el comando en el objeto commands
        const command = commands[cmd];
        if (command) {
            return command(player, params);
        }
        return false;
    }

    // Actualizar el manejador de chat principal
    // Actualizar el manejador de chat principal
    room.onPlayerChat = function(player, message) {
        // Sistema de trivia
        if (state.currentTrivia?.active && !state.currentTrivia.answered) {
            const answer = parseInt(message);
            if (!isNaN(answer) && answer >= 1 && answer <= 4) {
                if (state.currentTrivia.playerAnswers.has(player.name)) {
                    sendMessage("❌ Ya has respondido a esta pregunta.", player.id, COLORS.ERROR_RED);
                    return false;
                }
    
                state.currentTrivia.playerAnswers.set(player.name, answer);
                const respuestaElegida = state.currentTrivia.answers[answer - 1];
                const respuestaCorrecta = state.currentTrivia.correct_answer;
                
                if (respuestaElegida === respuestaCorrecta) {
                    sendMessage(`\n🎉 ¡${player.name} acertó!`, null, COLORS.SUCCESS_GREEN);
                    sendMessage(`✅ La respuesta correcta era: ${respuestaCorrecta}`, null, COLORS.SUCCESS_GREEN);
                    
                    // Anunciar quiénes fallaron antes de terminar
                    const failedPlayers = Array.from(state.currentTrivia.playerAnswers.entries())
                        .filter(([_, ans]) => state.currentTrivia.answers[ans - 1] !== respuestaCorrecta)
                        .map(([name, _]) => name);
                    
                    if (failedPlayers.length > 0) {
                        sendMessage(`❌ Jugadores que fallaron: ${failedPlayers.join(', ')}`, null, COLORS.ERROR_RED);
                    }
                    
                    state.currentTrivia.answered = true;
                    clearTimeout(state.currentTrivia.timeout);
                    resetTrivia();
                } else {
                    sendMessage(`❌ ${player.name} falló!`, null, COLORS.ERROR_RED);                    
                    const totalPlayers = room.getPlayerList().length;
                    if (state.currentTrivia.playerAnswers.size >= totalPlayers) {
                        sendMessage(`\n⏰ ¡Nadie acertó!`, null, COLORS.ERROR_RED);
                        sendMessage(`✅ La respuesta correcta era: ${respuestaCorrecta}`, null, COLORS.SUCCESS_GREEN);
                        clearTimeout(state.currentTrivia.timeout);
                        resetTrivia();
                    }
                }
                return false;
            }
        }
    
        // Verificar mute
        if (state.mutedPlayers.has(player.id)) {
            return handleMutedPlayer(player, message);
        }
    
        // Sistemas de selección
        if (substitutionSystem.state.active) {
            return substitutionSystem.handleSelection(player, message);
        }
    
        if (state.waitingBallColor?.active && state.waitingBallColor.admin === player.id) {
            return handleBallColorChange(player, message);
        }
    
        if (state.waitingHoroscope.has(player.id)) {
            return handleHoroscopeSelection(player, message);
        }
    
        // Comandos y chats especiales
        if (message.startsWith("!")) {
            const parts = message.split(" ");
            const commandName = parts[0].toLowerCase();
            const args = parts.slice(1);
            
            const command = commands[commandName];
            if (command) {
                return command(player, args);
            }
        }
    
        if (message.startsWith("!ac") || message.toLowerCase().startsWith("ac ")) {
            return handleAdminChat(player, message);
        }
    
        if (message.startsWith("t ")) {
            return handleTeamChat(player, message);
        }
    
        if (message.startsWith("@@")) {
            return handlePrivateMessage(player, message);
        }
    
        // Mensajes rápidos
        const quickMessageNumber = message.trim();
        if (!state.waitingHoroscope.has(player.id) && 
            (quickMessageNumber === "420" || 
            (player.team !== 0 && quickMessages.hasOwnProperty(quickMessageNumber)))) {
            return handleQuickMessage(player, quickMessageNumber);
        }
    
        // Permitir mensaje normal
        return true;
    };

    const handleCambioCommand = (player) => {
        if (!validateCommand(player, true)) {
            sendMessage("❌ Solo los administradores pueden hacer cambios.", player.id, COLORS.ERROR_RED);
            return false;
        }

        // Obtener jugadores por equipo
        const redTeam = room.getPlayerList().filter(p => p.team === 1);
        const blueTeam = room.getPlayerList().filter(p => p.team === 2);
        const spectators = room.getPlayerList().filter(p => p.team === 0);

        if (redTeam.length === 0 && blueTeam.length === 0) {
            sendMessage("❌ No hay jugadores en los equipos para hacer cambios.", player.id, COLORS.ERROR_RED);
            return false;
        }

        if (spectators.length === 0) {
            sendMessage("❌ No hay jugadores en espectadores para hacer el cambio.", player.id, COLORS.ERROR_RED);
            return false;
        }

        // Mostrar instrucciones y lista de jugadores
        sendMessage("🔄 Proceso de sustitución:", player.id, COLORS.ADMIN_ORANGE);
        sendMessage("1️⃣ Escribe el número del jugador que saldrá:", player.id, COLORS.ADMIN_ORANGE);

        let playerIndex = 1;
        
        // Mostrar equipo rojo
        if (redTeam.length > 0) {
            sendMessage("🔴 Equipo Rojo:", player.id, COLORS.ADMIN_ORANGE);
            redTeam.forEach(p => {
                sendMessage(`${playerIndex} - ${p.name}`, player.id, COLORS.ADMIN_ORANGE);
                playerIndex++;
            });
        }

        // Mostrar equipo azul
        if (blueTeam.length > 0) {
            sendMessage("🔵 Equipo Azul:", player.id, COLORS.ADMIN_ORANGE);
            blueTeam.forEach(p => {
                sendMessage(`${playerIndex} - ${p.name}`, player.id, COLORS.ADMIN_ORANGE);
                playerIndex++;
            });
        }

        // Guardar estado para el siguiente paso
        state.substitution = {
            active: true,
            step: 1,
            admin: player.id,
            players: [...redTeam, ...blueTeam],
            spectators: spectators,
            selectedPlayer: null
        };

        return false;
    };

    function handleTriviaAnswer(player, answer) {
        if (!state.currentTrivia?.active) return;

        // Verificar si el jugador ya respondió
        if (state.currentTrivia.answers.has(player.name)) {
            sendMessage("❌ Ya has respondido a esta pregunta.", player.id, COLORS.ERROR_RED);
            return;
        }

        // Guardar la respuesta del jugador
        state.currentTrivia.answers.set(player.name, answer);
        sendMessage(`✅ Respuesta registrada`, player.id, COLORS.SUCCESS_GREEN);

        // Si todos respondieron o pasó el tiempo, mostrar resultados
        checkTriviaEnd();
    }

    // Función para guardar uniformes personalizados en GitHub
    async function saveCustomUniformsToGithub() {
        try {
            // Verificar si hay uniformes personalizados para guardar
            if (!uniformes.customTeams || uniformes.customTeams.length === 0) {
                console.log("No hay uniformes personalizados para guardar");
                return false;
            }

            // Preparar los datos para guardar
            const customUniformsData = {
                customTeams: uniformes.customTeams
            };

            // Convertir a JSON con formato legible
            const content = JSON.stringify(customUniformsData, null, 2);

            // Codificar en base64 como requiere la API de GitHub
            const contentEncoded = btoa(unescape(encodeURIComponent(content)));

            // Obtener el SHA del archivo actual si existe
            let sha = '';
            try {
                const response = await fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/uniforms.json`, {
                    headers: {
                        'Authorization': `token ${GITHUB_CONFIG.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (response.ok) {
                    const fileInfo = await response.json();
                    sha = fileInfo.sha;
                }
            } catch (error) {
                console.log("El archivo no existe aún, se creará uno nuevo");
            }

            // Preparar el cuerpo de la solicitud
            const requestBody = {
                message: "Actualización de uniformes personalizados",
                content: contentEncoded,
                branch: GITHUB_CONFIG.branch
            };

            // Si el archivo existe, incluir su SHA
            if (sha) {
                requestBody.sha = sha;
            }

            // Realizar la solicitud a la API de GitHub
            const updateResponse = await fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/uniforms.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!updateResponse.ok) {
                throw new Error(`Error al guardar: ${updateResponse.status}`);
            }

            console.log("✅ Uniformes personalizados guardados en GitHub");
            return true;
        } catch (error) {
            console.error("❌ Error al guardar uniformes en GitHub:", error);
            return false;
        }
    }
    // Función para procesar la selección en la sustitución
    const processCambioSelection = (player, message) => {
        if (!state.substitution || state.substitution.admin !== player.id) return false;

        const number = parseInt(message);
        
        if (state.substitution.step === 1) {
            // Selección del jugador que sale
            if (isNaN(number) || number < 1 || number > state.substitution.players.length) {
                sendMessage("❌ Número inválido. Por favor, elige un número de la lista.", player.id, COLORS.ERROR_RED);
                return false;
            }

            const selectedPlayer = state.substitution.players[number - 1];
            state.substitution.selectedPlayer = selectedPlayer;
            state.substitution.step = 2;

            // Mostrar lista de espectadores
            sendMessage("2️⃣ Elige el jugador que entrará:", player.id, COLORS.ADMIN_ORANGE);
            state.substitution.spectators.forEach((p, index) => {
                sendMessage(`${index + 1} - ${p.name}`, player.id, COLORS.ADMIN_ORANGE);
            });

        } else if (state.substitution.step === 2) {
            // Selección del jugador que entra
            if (isNaN(number) || number < 1 || number > state.substitution.spectators.length) {
                sendMessage("❌ Número inválido. Por favor, elige un número de la lista.", player.id, COLORS.ERROR_RED);
                return false;
            }

            const enteringPlayer = state.substitution.spectators[number - 1];
            const leavingPlayer = state.substitution.selectedPlayer;

            // Realizar el cambio
            const team = leavingPlayer.team;
            room.setPlayerTeam(leavingPlayer.id, 0);
            room.setPlayerTeam(enteringPlayer.id, team);

            // Anunciar el cambio
            sendMessage(`🔄 Cambio realizado: ${enteringPlayer.name} entra por ${leavingPlayer.name}`, null, COLORS.ADMIN_ORANGE);

            // Resetear estado
            state.substitution = null;
        }

        return false;
    };

    // Función para parsear el formato de uniforme
    const parseUniformFormat = (uniformStr) => {
        try {
            const parts = uniformStr.trim().split(/\s+/);
            if (parts.length < 2) {
                console.log("❌ Error: Faltan partes en el código del uniforme");
                return null;
            }

            // Validar cada parte
            const angle = parseInt(parts[0]);
            if (isNaN(angle)) {
                console.log("❌ Error: Ángulo inválido");
                return null;
            }

            const avatarColor = parseInt(parts[1], 16);
            if (isNaN(avatarColor)) {
                console.log("❌ Error: Color de avatar inválido");
                return null;
            }

            const mainColor = parts.slice(2).map(c => {
                const color = parseInt(c, 16);
                if (isNaN(color)) {
                    console.log(`❌ Error: Color inválido: ${c}`);
                    return null;
                }
                return color;
            });

            if (mainColor.includes(null)) {
                return null;
            }

            return {
                angle,
                avatarColor,
                mainColor
            };
        } catch (error) {
            console.error("❌ Error al parsear formato de uniforme:", error);
            return null;
        }
    }; // Cierre de parseUniformFormat

    // Función para cargar uniformes personalizados desde GitHub
    async function loadCustomUniformsFromGithub() {
        try {
            const response = await fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/uniforms.json`, {
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log("No hay archivo de uniformes personalizados en GitHub");
                    return;
                }
                throw new Error(`Error al cargar: ${response.status}`);
            }

            const data = await response.json();
            const content = decodeURIComponent(escape(atob(data.content)));
            const customUniformsData = JSON.parse(content);

            // Actualizar los uniformes personalizados
            if (customUniformsData.customTeams) {
                uniformes.customTeams = customUniformsData.customTeams;
                console.log("✅ Uniformes personalizados cargados desde GitHub");
            }
        } catch (error) {
            console.error("❌ Error al cargar uniformes desde GitHub:", error);
        }
    }


    // Estado para el proceso de agregar uniforme personalizado
    const customUniformState = {
        waiting: new Set(),
        current: new Map() // Almacena los datos temporales mientras se crea el uniforme
    };


    // Función para manejar la selección del jugador que entra
    const handleSubstitutionStep2 = (player, message) => {
        const index = parseInt(message) - 1;
        if (isNaN(index) || index < 0 || index >= state.substitution.spectators.length) {
            sendMessage("❌ Número de jugador inválido.", player.id, COLORS.ERROR_RED);
            return false;
        }

        const selectedSpectator = state.substitution.spectators[index];
        const playerOut = state.substitution.selectedPlayer;
        const position = state.substitution.playerPosition;

        // Hacer el cambio
        room.setPlayerTeam(selectedSpectator.id, playerOut.team);
        room.setPlayerTeam(playerOut.id, 0);

        // Esperar un tick para asegurarnos que el cambio de equipo se procesó
        setTimeout(() => {
            setPlayerPosition(selectedSpectator.id, position);
        }, 50);

        sendMessage(`🔄 ${playerOut.name} ↔️ ${selectedSpectator.name}`, null, COLORS.ADMIN_ORANGE);

        // Resetear estado
        state.substitution = null;

        return false;
    };



    // Función para traducir el contenido
    function traducirContenido(textos, callback) {
        const xhr = new XMLHttpRequest();
        // Unir todos los textos con un separador especial
        const textosJuntos = textos.join(' ||| ');
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(textosJuntos)}`;
        
        xhr.open('GET', url, true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    // Separar la traducción por el separador
                    const traduccionCompleta = data[0].map(item => item[0]).join('');
                    const traducciones = traduccionCompleta.split(' ||| ');
                    
                    // Verificar que tenemos todas las traducciones
                    if (traducciones.length !== textos.length) {
                        console.error('Error: número incorrecto de traducciones');
                        callback(null);
                        return;
                    }
                    
                    callback(traducciones);
                } catch (error) {
                    console.error('Error al traducir:', error);
                    callback(null);
                }
            } else {
                callback(null);
            }
        };
        
        xhr.onerror = function() {
            console.error('Error de red al traducir');
            callback(null);
        };
        
        xhr.send();
    }

    // Función para manejar mensajes durante la sustitución
    const handleSubstitutionMessage = (player, message) => {
        if (!state.substitution || state.substitution.admin !== player.id) return null;

        if (state.substitution.step === 1) {
            return handleSubstitutionStep1(player, message);
        } else if (state.substitution.step === 2) {
            return handleSubstitutionStep2(player, message);
        }

        return null;
    };

    // 1. Funciones de posición (mantener solo una versión)
    const getPlayerPosition = (playerId) => {
        const playerDisc = room.getPlayerDiscProperties(playerId);
        return playerDisc ? { x: playerDisc.x, y: playerDisc.y } : null;
    };

    const setPlayerPosition = (playerId, position) => {
        if (position) {
            room.setPlayerDiscProperties(playerId, { x: position.x, y: position.y });
        }
    };

    function startRace() {
        if (!state.currentRace.isActive || state.currentRace.participants.size === 0) {
            sendMessage("❌ No hay una carrera activa o no hay participantes", null, 0xFFD700);
            return;
        }
    
        const longestName = Array.from(state.currentRace.participants.values())
            .reduce((max, p) => Math.max(max, p.name.length), 0);
        
        const trackLength = 30;
        const trackStart = longestName + 5;
        const trackSymbols = ["🌟", "⭐", "✨", "💫"];
        
        state.currentRace.raceInterval = setInterval(() => {
            let someoneFinished = false;
            let raceStatus = "\n🏁 GRAN PREMIO DE HAXBALL 🏁\n" +
                            "═".repeat(trackStart + trackLength + 5) + "\n";
            
            // Actualizar posiciones
            state.currentRace.participants.forEach((participant, id) => {
                if (participant.position < trackLength) {
                    if (Math.random() < 0.7) {
                        participant.position += Math.floor(Math.random() * 3);
                        if (participant.position >= trackLength) {
                            participant.position = trackLength;
                            participant.finishTime = Date.now();
                            someoneFinished = true;
                        }
                    }
                }
                
                // Mostrar progreso
                const trackSymbol = trackSymbols[Math.floor(Math.random() * trackSymbols.length)];
                const preTrack = "▰".repeat(participant.position);
                const postTrack = "▱".repeat(trackLength - participant.position);
                
                let line = "│" + preTrack + participant.animal.emoji + postTrack + "│";
                const progress = Math.floor((participant.position / trackLength) * 100);
                line += ` ${progress}% `;
                line += participant.name;
                
                raceStatus += line + "\n";
            });
            
            raceStatus += "═".repeat(trackStart + trackLength + 5);
            sendMessage(raceStatus, null, 0xFFFF00, "bold");
    
            // Verificar si todos terminaron o si alguien llegó a la meta
            const allFinished = Array.from(state.currentRace.participants.values())
                .every(p => p.position >= trackLength);
            
            if (allFinished || someoneFinished) {
                clearInterval(state.currentRace.raceInterval);
                announceWinners();
            }
        }, 500);
    }
    
    function announceWinners() {
        if (state.currentRace.participants.size === 0) {
            sendMessage("❌ No hubo participantes en la carrera", null, 0xFFD700);
            return;
        }
    
        // Ordenar participantes por posición y tiempo de llegada
        const sortedParticipants = Array.from(state.currentRace.participants.entries())
            .filter(([_, participant]) => participant && participant.position >= 0)
            .sort((a, b) => {
                if (a[1].position === b[1].position) {
                    return (a[1].finishTime || Infinity) - (b[1].finishTime || Infinity);
                }
                return b[1].position - a[1].position;
            });
    
        // Asignar lugares en el podio
        const podium = {
            first: sortedParticipants[0]?.[1],
            second: sortedParticipants[1]?.[1],
            third: sortedParticipants[2]?.[1]
        };
    
        const podiumArt = `
        🏆 PODIO DE LA CARRERA 🏆
        ┏━━━━━━━━━━━━━━━━━━━━┓
        ┃     ${podium.first ? `${podium.first.animal.emoji} ${podium.first.name}` : "---"}     ┃
        ┃        1º 👑       ┃
        ┣━━━━━━━━━━━━━━━━━━━━┫
        ┃     ${podium.second ? `${podium.second.animal.emoji} ${podium.second.name}` : "---"}     ┃
        ┃        2º 🥈       ┃
        ┣━━━━━━━━━━━━━━━━━━━━┫
        ┃     ${podium.third ? `${podium.third.animal.emoji} ${podium.third.name}` : "---"}     ┃
        ┃        3º 🥉       ┃
        ┗━━━━━━━━━━━━━━━━━━━━┛`;
        
        sendMessage(podiumArt, null, 0xFFD700, "bold");
        
        if (podium.first) {
            setTimeout(() => {
                sendMessage(`🎉 ¡${podium.first.name} ha ganado la carrera! 🎉`, null, 0xFFD700, "bold");
            }, 1000);
        }
        
        // Limpiar estado de la carrera
        state.currentRace.isActive = false;
        state.currentRace.participants.clear();
        state.currentRace.raceInterval = null;
    }

    // 4. Función para celebrar goles
    function celebrateGoal(team) {
        const celebrationDuration = 5000;
        const teamColor = team === 1 ? COLORS.TEAM_RED : COLORS.TEAM_BLUE;
        
        const teamColors = team === 1 ? [
            [0xFF0000, 0xFF3333, 0xFF6666],
            [0xFF4444, 0xFF6666, 0xFF8888],
            [0xFF6666, 0xFF8888, 0xFFAAAA]
        ] : [
            [0x0000FF, 0x3333FF, 0x6666FF],
            [0x4444FF, 0x6666FF, 0x8888FF],
            [0x6666FF, 0x8888FF, 0xAAAAFF]
        ];

        let flashCount = 0;
        const maxFlashes = 10;

        const flashInterval = setInterval(() => {
            if (flashCount >= maxFlashes) {
                clearInterval(flashInterval);
                room.setTeamColors(team, 60, 0xFFFFFF, [team === 1 ? COLORS.TEAM_RED : COLORS.TEAM_BLUE]);
                return;
            }
            
            const colorSet = teamColors[Math.floor(Math.random() * teamColors.length)];
            room.setTeamColors(team, 60, 0xFFFFFF, colorSet);
            flashCount++;
        }, 500);

        setTimeout(() => {
            clearInterval(flashInterval);
            room.setTeamColors(team, 60, 0xFFFFFF, [team === 1 ? COLORS.TEAM_RED : COLORS.TEAM_BLUE]);
        }, celebrationDuration);
    }


    // Mensajes rápidos usando números
    const quickMessages = {
        "10": "¡VAMOS CARAJO! 💪⚽",
        "11": "¡QUE GOLAZO! 🚀⭐",
        "12": "¡PARADÓN DEL ARQUERO! 🧤👐",
        "13": `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀
        ⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀
        ⠀⠀⠀⠀⢀⣀⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿⠀
        ⠀⢀⣴⣶⣶⣝⢷⡝⢿⣿⣿⣿⠿⠛⠉⠀⠀⣰⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇
        ⢀⣾⣿⣿⣿⣿⣧⠻⡌⠿⠋⠁⠀⠀⠀⠀⠀⠈⠻⢿⠇⢻⣿⣿⣿⣿⣿⣿
        ⣼⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⣿⣿⡟
        ⠙⢹⣿⣿⣿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⡿⠟⠁
        ⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        AGARRAMELA QUE CRECE!!! JAAAAAAAAA JAJAA 🤣`,
        "14": "¡ESO NO ES FALTA NI EN RUGBY! 🏉😤",
        "15": "¡AMARILLA PARA EL ÁRBITRO! 💛🤡",
        "16": "¡MESSI, MESSIRVE, MESSIRVIÓ! 🐐👑",
        "17": "¡SIUUUUUUUUU! 🦵💫",
        "18": "¡BAILA VINI, BAILA! 🕺💃",
        "19": "¡ANKARA MESSI, ANKARA MESSI! 🌟🔥",
        "20": "¡NO ERA CORNER NI EN CHINA! 🇨🇳😠",
        "21": "¡ROJA DIRECTA Y 3 PARTIDOS! 🟥😡",
        "22": "¡PARADÓN DEL DIBU! 🧤🇦🇷",
        "23": "¡PELÉ DEBUTÓ CON UN PIBE! 👶⚽",
        "24": "¡ESO ES ROJA HASTA EN EL FIFA! 🎮🟥",
        "25": "¡PECHO FRÍO! ❄️🥶",
        "26": "¡MUCHO TIKITAKA Y POCO RESULTADO! ⚽😴",
        "27": "¡PARA QUÉ TE TRAJE! 🤦‍♂️😤",
        "28": "¡ESTE PARTIDO LO DA VUELTA HASTA MI ABUELA! 👵💪",
        "29": "¡SACÁ DEL MEDIO! 🚀⚽",
        "30": "¡MODO MARADONA ACTIVADO! 🔟✨",
        "31": "¡TIKI TAKA TIKI TAKA! ⚽️👟",
        "32": "¡ESTE EQUIPO ES UN HOSPITAL! 🏥🤕",
        "33": "¡AFUERA LA PLAY, ADENTRO LA REALIDAD! 🎮😤",
        "34": "¡VAMOS A DEFENDER CON TODO! 🛡️💪",
        "35": "¡HOY SE SALE CAMPEÓN! 🏆✨",
        "36": "¡MODO CHAMPIONS ACTIVADO! 🌟🏆",
        "37": "¡ESTE ARBITRO ES UN MEME! 🤡😂",
        "38": "¡DEJA DE LLORAR Y JUEGA! 😭👶",
        "39": "¡PURO HUMO! 💨😤",
        "40": "¡SE VIENE EL REMONTADA! 💪🔄",
        "41": "¡PARKINGBUS ACTIVADO! 🚌😎",
        "42": "¡MODO HEXA BRASIL! 🇧🇷✨",
        "43": "¡LA TENÉS ADENTRO! 😎🔥",
        "44": "¡VAMOS AL MCDONALDS SI GANAMOS! 🍔🏆",
        "45": "¡+10 DE FAIR PLAY! 🤝👏",
        "46": "¡ESTE PARTIDO ES MÁS ABURRIDO QUE JUGAR AL AJEDREZ! ♟️😴",
        "47": "¡MODO TSUBASA ACTIVADO! 🌟⚽",
        "48": "¡AQUÍ HAY MÁS TEATRO QUE EN BROADWAY! 🎭🎬",
        "49": "¡ESTE EQUIPO DA MÁS VUELTAS QUE UN TROMPO! 🌀😵",
        "50": "¡MODO BARRILETE CÓSMICO! 🌌⚽",
        "51": "¡LA TOCÁS O TE CAMBIO! 😠👋",
        "52": "¡JUGÁ SIMPLE, NO TE HAGÁS EL NEYMAR! 🤹‍♂️😤",
        "53": "¡MODO TIKI TAKA CHAMPAGNE! 🍾✨",
        "54": "¡MÁS PERDIDO QUE JUGADOR DEL UNITED! 😅🔍",
        "55": "¡ESTE PARTIDO ESTÁ MÁS CERRADO QUE CERROJO SUIZO! 🔒🇨🇭",
        "56": "¡MODO CATENACCIO ACTIVADO! 🇮🇹🔒",
        "57": "¡ESTE ÁRBITRO TIENE EL VAR EN LOS OJOS! 👀📺",
        "58": "¡MODO JOGA BONITO! 🇧🇷✨",
        "59": "¡ESTE PARTIDO ES UN CHORIZO! 🌭😤",
        "60": "¡MODO PULGA ATÓMICA! 🐜⚡",
        "61": "¡ESTE EQUIPO ES PURO TIKI TAKA Y NADA DE GOLES! ⚽😴",
        "62": "¡MODO BICHO ACTIVADO! 🐐💫",
        "63": "¡ESTE PARTIDO ESTÁ MÁS CALIENTE QUE ASADO DE DOMINGO! 🔥🍖",
        "64": "¡MODO CRUIJFF TOTAL! 🔄🌟",
        "65": "¡LA GAMBETA ES MI PASAPORTE! 🎯💫",
        "66": "¡MODO FÚTBOL CHAMPAGNE! 🍾⚽",
        "67": "¡ESTE PARTIDO ES UN BOSTERO! 💙💛",
        "68": "¡MODO GALÁCTICO ACTIVADO! 🌟👑",
        "69": "¡ESTE PARTIDO ESTÁ MÁS TRABADO QUE WINDOWS 95! 💻😤",
        "70": "¡MODO LEYENDA ACTIVADO! 🏆✨",
        "420": "🌿 ¡${player.name} SE FUE A FUMAR! 💨 ESTARÁ AUSENTE POR LOS SIGUIENTES MINUTOS... 🚬 ¡NO LO MOLESTEN, ESTÁ EN SU MOMENTO ZEN! 🧘‍♂️ MODO SNOOP DOGG ACTIVADO 🐕 VOLVERÁ CUANDO SE ACABE LA MAGIA 🪄✨ (O CUANDO LE DE HAMBRE 🍕)",
        "71": "¡MODO GAMER ACTIVADO! 🎮 ¡RGB = +1000 DE SKILLS! 🌈 ¡GAMING CHAIR POWER! 💺",
        "72": "¡SOY MAIN ARQUERO! 🧤 ¡LITERALMENTE MEJOR QUE NEUER! 🥅 ¡PURO SKILL NO HACK! 🚫",
        "73": "¡NASHEEEEE! 🔥 ¡MODO DIABLO! 😈 ¡LITERALMENTE CRACKED! 💯 ¡SHEEEESH! 🥶",
        "74": "¡ESTE SERVER ESTÁ MÁS MUERTO QUE MI SETUP! 💀 ¡NEED PLAYERS! 🙏 ¡NO BOTS PLS! 🤖",
        "75": "¡LITERALMENTE MEJOR QUE EL DIBU! 🧤 ¡MIRÁ QUE TE COMO HERMANO! 🐊 ¡DALE QUE HOY ATAJO TODO! 🚫",
        "76": "¡MODO TRYHARD ON! 😤 ¡LITERALLY TOCANDO PASTO! 🌱 ¡NO LIFE GAMING! 🎮",
        "77": "¡LITERAL NO DEJO PASAR NI EL AIRE! 💨 ¡PURO CHILL STREAM! 😎 ¡MODO RELAX! 🧘‍♂️",
        "78": "¡SPEEDRUN DE GOLES! 🏃‍♂️ ¡ANY% GLITCHLESS! ⚡ ¡WORLD RECORD PACE! 🏆",
        "79": "¡MODO ESPORTS! 🎯 ¡LITERALMENTE MEJOR QUE ENCE! 🔥 ¡READY FOR TOURNAMENT! 🏆",
        "80": "¡LITERAL IN THE ZONE! 🎯 ¡ULTRA INSTINCT ACTIVATED! ⚡ ¡POV: MAIN CHARACTER! 🌟",
        "81": "¡MODO TILT PROOF! 😤 ¡NO RAGE TODAY! 🧘‍♂️ ¡PURA BUENA VIBRA! ✨",
        "82": "¡LITERALMENTE HACIENDO CLIP! 🎬 ¡CONTENT CREATOR MODE! 🎥 ¡LIKE Y SUSCRIBE! 👍",
        "83": "¡MODO AFK PERO NO AFK! 😴 ¡LITERALLY SLEEPING! 💤 ¡BUT STILL WINNING! 🏆",
        "84": "¡POV: ERES MI CONTENIDO! 📸 ¡LITERAL MATERIAL PARA YOUTUBE! 🎥 ¡THUMBNAIL MOMENT! 🖼️",
        "85": "¡LITERALMENTE MEJOR QUE TU MAIN! 💪 ¡GIT GUD SCRUB! 😎 ¡EZ GAME EZ LIFE! 🎮",
        "86": "¡MODO SMURF ACTIVADO! 🥸 ¡LITERALLY BOOSTING! 📈 ¡PERO SIN BOOST! 🚫",
        "87": "¡LITERAL GAMING WARLORD! 👑 ¡CRACKED AT HAXBALL! 🎮 ¡ACTUALLY INSANE! 🤪",
        "88": "¡MODO COACH! 👨‍🏫 ¡LITERALLY TEACHING! 📚 ¡CLASE MAGISTRAL! 🎓",
        "89": "¡LITERALMENTE MEJOR QUE AYER! 📈 ¡PERO PEOR QUE MAÑANA! 🔮 ¡PURO PROGRESO! 💪",
        "90": "¡MODO MANCO'NT! 🦾 ¡LITERALLY SKILLED! 🎯 ¡NO HACKS JUST TALENT! ✨",
        "91": "¡POV: ME REPORTAN POR HACKS! 🚫 ¡PERO SOY LEGIT! ✅ ¡LITERALLY CLEAN! 🧼",
        "92": "¡LITERAL FARMING WINS! 🌾 ¡COSECHA DE VICTORIAS! 🏆 ¡MODO GRANJERO! 🚜",
        "93": "¡MODO STREAMER SIN STREAM! 🎥 ¡LITERALLY FAMOUS! 🌟 ¡PERO SIN VIEWERS! 👻",
        "94": "¡POV: TUTORIAL DE CÓMO SER PRO! 📚 ¡PASO 1: SER YO! 😎 ¡PASO 2: GG EZ! 🎮",
        "95": "¡LITERALMENTE MEJOR QUE EL LAG! 📶 ¡999 PING WARRIOR! ⚔️ ¡PERO SIGO VIVO! 💪",
        "96": "¡MODO HACKER'NT!  ¡LITERALLY LEGIT! ✅ ¡PURO SKILL NO FAKE! 💯",
        "97": "¡POV: SPEEDRUN DE TOXICIDAD! 🏃‍♂️ ¡PERO CON AMOR! ❤️ ¡LITERAL WHOLESOME! 🌈",
        "98": "¡LITERAL GOD GAMING! 🎮 ¡PERO SIN PRESUMIR! 😇 ¡MODO HUMILDE! 🙏",
        "99": "¡MODO PRO PLAYER! 😎 ¡LITERALLY BUILT DIFFERENT! 💪 ¡GAMING WARLORD! 👑",
        "100": "¡LITERALLY RANKED #1! 🏆 ¡MODO LEYENDA! 👑 ¡PERO SIN FANFARRONEAR! 🤫"
    };
    
    
    room.onTeamGoal = function(team) {
        const scores = room.getScores();
        if (!scores) return;

        // Obtener información del último jugador que tocó la pelota
        const scorer = lastkicker;
        const assist = lastkicker2;

        // Actualizar estadísticas
        if (scorer && state.gameStats.players.has(scorer.name)) {
            const stats = state.gameStats.players.get(scorer.name);
            // Solo sumar gol si no es en contra
            if (scorer.team === team) {
                stats.goals = (stats.goals || 0) + 1;
            }
        }
        
        if (assist.name && assist.team === team && assist.name !== scorer.name) {
            if (state.gameStats.players.has(assist.name)) {
                const stats = state.gameStats.players.get(assist.name);
                stats.assists = (stats.assists || 0) + 1;
            }
        }

        // Si es gol en contra
        if (scorer.team !== team) {
            const ownGoalMessage = autogoles[Math.floor(Math.random() * autogoles.length)](scorer.name);
            sendMessage(ownGoalMessage, null, getTeamColor(team), "bold", 2);
            partidoGolEncontra.push(scorer.name);
        } else {
            // Si es gol normal
            if (assist.name && assist.team === team && assist.name !== scorer.name) {
                // Gol con asistencia
                const goalMessage = goalMessages[Math.floor(Math.random() * goalMessages.length)](scorer.name);
                const assistMessage = asistencias[Math.floor(Math.random() * asistencias.length)](assist.name);
                
                sendMessage(goalMessage, null, getTeamColor(team), "bold", 2);
                setTimeout(() => {
                    sendMessage(assistMessage, null, getTeamColor(team), "bold", 1);
                }, 1500);

                partidoGol.push(scorer.name);
                partidoAsist.push(assist.name);
            } else {
                // Gol sin asistencia
                const goalMessage = goalMessages[Math.floor(Math.random() * goalMessages.length)](scorer.name);
                sendMessage(goalMessage, null, getTeamColor(team), "bold", 2);
                partidoGol.push(scorer.name);
            }
        }

        // Celebrar el gol con efectos visuales
        celebrateGoal(team);
    };
    // Función para mostrar el ASCII art de Among Us
    const showAmongUsArt = (player) => {
        if (!validateCommand(player, true)) return false;

        const amongUsArt = `⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⢰⡿⠋⠁⠀⠀⠈⠉⠙⠻⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⢀⣿⠇⠀⢀⣴⣶⡾⠿⠿⠿⢿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⣀⣀⣸⡿⠀⠀⢸⣿⣇⠀⠀⠀⠀⠀⠀⠙⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⣾⡟⠛⣿⡇⠀⠀⢸⣿⣿⣷⣤⣤⣤⣤⣶⣶⣿⠇⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀
    ⢀⣿⠀⢀⣿⡇⠀⠀⠀⠻⢿⣿⣿⣿⣿⣿⠿⣿⡏⠀⠀⠀⠀⢴⣶⣶⣿⣿⣿⣆
    ⢸⣿⠀⢸⣿⡇⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⣿⡇⣀⣠⣴⣾⣮⣝⠿⠿⠿⣻⡟
    ⢸⣿⠀⠘⣿⡇⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠉⠀
    ⠸⣿⠀⠀⣿⡇⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠉⠀⠀⠀⠀
    ⠀⠻⣷⣶⣿⣇⠀⠀⠀⢠⣼⣿⣿⣿⣿⣿⣿⣿⣛⣛⣻⠉⠁⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⢸⣿⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⢸⣿⣀⣀⣀⣼⡿⢿⣿⣿⣿⣿⣿⡿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠙⠛⠛⠛⠋⠁⠀⠙⠻⠿⠟⠋⠑⠛⠋⠀

                    ඞ SUS ඞ`;

        sendMessage(amongUsArt, null, 0xFF0000, "bold", 1);
        return false;
    };

    // Función para mostrar el ASCII art de Among Us 2
    const showAmongUsArt2 = (player) => {
        if (!validateCommand(player, true)) return false;

        const amongUsArt2 = `
    ⬜⬜⬜⬜⬜⬜⬜⬜⬜️⬜️⬜️⬜️
    ⬜️⬜️⬜️⬜️⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬜️
    ⬜️⬜️⬜️⬛️🟥🟥🟥🟥⬛️⬜️⬜️⬜️
    ⬜️⬜️⬛️⬛️⬛️⬛️🟥🟥🟥⬛️⬜️⬜️
    ⬜️⬛️🟦🟦🟦🟦⬛️🟥🟥⬛️🟥⬛️
    ⬜️⬛️🟦🟦🟦🟦⬛️🟥🟥⬛️🟥⬛️
    ⬜️⬜️⬛️⬛️⬛️⬛️🟥🟥🟥⬛️🟥⬛️
    ⬜️⬜️⬛️🟥🟥🟥🟥🟥🟥⬛️🟥⬛️
    ⬜️⬜️⬛️🟥🟥🟥🟥🟥🟥⬛️🟥⬛️
    ⬜️⬜️⬛️🟥🟥🟥🟥🟥🟥⬛️⬛️⬜️
    ⬜️⬜️⬛️🟥🟥🟥🟥🟥🟥⬛️⬜️⬜️
    ⬜️⬜️⬛️🟥🟥⬛⬛️🟥🟥⬛️⬜️⬜️
    ⬜️⬜️⬛️🟥🟥⬜⬜️🟥🟥⬛️⬜️⬜️
    ⬜️⬜️⬛️🟥🟥⬜⬜️🟥🟥⬛️⬜️⬜️
    ⬜️⬜️⬜️⬛️⬛️⬜️⬜️⬛️⬛️⬜️⬜️⬜️

                    ඞ SUS ඞ`;

        sendMessage(amongUsArt2, null, 0xFF0000, "bold", 1);
        return false;
    };

    // Función para mostrar el ASCII art de Jijo
    const showJijoArt = (player) => {
        if (!validateCommand(player, true)) return false;

        const jijoArt = `
        ⬜⬜⬜⬜⬜⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜🟧🟧🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟧🟧⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜🟧🟧🟧🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟧⬜⬜⬜⬜
        ⬜⬜⬜⬜🟧🟧🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟧🟧⬜⬜⬜⬜
        ⬜⬜⬜🟧🟧🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟧🟧⬜⬜⬜
        ⬜⬜🟧🟧🟨🟨🟨⬛⬛🟨🟨🟨🟨🟨🟨⬛⬛🟨🟨🟨🟧🟧⬜⬜
        ⬜⬜🟧🟨🟨⬛⬛🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨⬛⬛🟨🟨🟧⬜⬜
        ⬜🟧🟧🟨⬛🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨⬛🟨🟧🟧⬜
        ⬜🟧🟧🟨🟨🟨⬛⬛🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨⬛⬛🟨🟨🟨🟧🟧⬜
        ⬜🟧🟧🟨🟨⬛⬛⬛⬛🟨🟨🟨🟨🟨🟨🟨🟨⬛⬛⬛⬛🟨🟨🟧🟧⬜
        ⬜🟧🟧🟨⬛⬛⬛⬛⬛⬛🟨🟨🟨🟨⬛⬛⬛⬛⬛⬛🟨🟧🟧⬜
        ⬜🟧🟧🟨⬛🟦🟦🟨🟨⬛🟨🟨🟨🟨⬛🟨🟨🟦🟦⬛🟨🟧🟧⬜
        ⬜🟧🟧🟦🟦🟦🟦🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟦🟦🟦🟦🟧🟧⬜
        ⬜🟧🟦🟦⬜🟦🟦🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟦🟦⬜🟦🟦🟧⬜
        ⬜🟦🟦⬜⬜🟦🟦⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🟦🟦⬜⬜🟦🟦⬜
        🟦🟦⬜🟦🟦🟦⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜🟦🟦🟦⬜🟦🟦
        🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦
        🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦
        🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🟨🟦🟦🟦🟦🟦
        🟦🟦🟦🟦🟧🟧🟨⬛⬛⬛⬛⬛⬛⬛⬛⬛🟨🟨🟧🟧🟦🟦🟦🟦
        ⬜⬜⬜⬜🟧🟧🟧🟨🟨🟨⬛⬛⬛⬛🟨🟨🟨🟧🟧🟧⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜🟧🟧🟧🟨⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧⬜⬜⬜⬜⬜⬜⬜⬜

    JIJO JIJO JIJO JIJO JIJO 😂😂😂😂😂🤣😂😂😂😂😂😂😂😂😂🤣🤣`;

        sendMessage(jijoArt, null, 0xFFA500, "bold", 1);
        return false;
    };


    // Inicialización (esto debe ser lo último)
    (async function init() {
        console.log('🚀 Iniciando sistema...');
        try {
            await loadAdminsFromGithub();
            console.log('✅ Admins cargados correctamente');
            
            // Inicializar estado global
            if (!state.mutedPlayers) state.mutedPlayers = new Map();
            if (!state.banList) state.banList = [];
            if (!state.spies) state.spies = new Set();
            if (!state.waitingHoroscope) state.waitingHoroscope = new Set();
            
            console.log('✅ Estado global inicializado');
        } catch (error) {
            console.log('⚠️ No se pudieron cargar los admins, usando configuración por defecto');
            if (state.permanentAdmins.size === 0) {
                state.permanentAdmins.set("tu_auth_aqui", {
                    name: "Admin",
                    auth: "tu_auth_aqui"
                });
            }
        }
        console.log('✅ Sistema iniciado correctamente');
    })()