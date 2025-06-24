/* ROOM */
const roomName = "🐐 𝐆𝐎𝐀𝐓 𝐋𝐄𝐕𝐄𝐋  🐐  🔵   BIG X3   🔵";
const botName = "Judge";
const maxPlayers = 16; // maximum number of players in the room
const roomPublic = true; // true = public room | false = players only enter via the room link (it does not appear in the room list)
// Usá = en lugar de : para asignar el valor
const geo = { code: "ar", lat: -34.6374, lon: -58.4058 };
const room = HBInit({
    roomName: roomName,
    maxPlayers: maxPlayers,
    public: roomPublic,
    playerName: botName,
    noPlayer: true,
    geo,
    proxy: "http://1.1.1.1:80"
});


     const scoreLimitClassic = 3;
    const scoreLimitBig = 3;
    const timeLimitClassic = 3;
    const timeLimitBig = 3; 
    const scoreLimitPractice = 3;
    const timeLimitPractice = 3;
    const FIREBASE_URL = "https://haxhost-uwu-default-rtdb.firebaseio.com";
    const FIREBASE_API_KEY = "AIzaSyAITBZT1r1tYRNXMxmg4w6ZWkEW-en8TX0";

    let pausaSolicitada = false;
    let pausaActiva = false; // Para controlar si ya hay una pausa activa
    let jugadorSolicitante = null; // Almacena el ID del jugador que solicita la pausa
    let confirmacionesPausa = {};
    let jugadoresConfirmandoReinicio = {}; // Almacena los jugadores que han confirmado el reinicio
    let confirmacionesReinicio = {};
    let autoStartTimeout = null;
   
    // 3. Mejorar el comando "me reinicio" para que también tenga un timeout
// Variables para el sistema de reinicio
let reinicioSolicitado = false;
let jugadorReinicio = null;
let timeoutReinicio = null;

// 2. Mejorar el sistema de pausa para que se cancele automáticamente si nadie confirma
// Variables para el sistema de pausa

let timeoutPausa = null;
   
// Añade esta línea en la parte superior del script, donde definas otras variables globales
const resetConfirmations = new Map(); // Para almacenar las confirmaciones de reinicio


   // Constantes para el sistema ELO
const ELO_DEFAULT = 1000;   // ELO inicial
const ELO_K = 32;           // Factor K (qué tan rápido cambia el ELO)
const ELO_RANKS = [
    { name: "Hierro", min: 0, max: 999, icon: "⚪" },
    { name: "Bronce", min: 1000, max: 1199, icon: "🥉" },
    { name: "Plata", min: 1200, max: 1399, icon: "🥈" },
    { name: "Oro", min: 1400, max: 1599, icon: "🪙" },
    { name: "Platino", min: 1600, max: 1799, icon: "❇️" },
    { name: "Diamante", min: 1800, max: 1999, icon: "💎" },
    { name: "Master", min: 2000, max: 2199, icon: "♦️" },
    { name: "GOAT", min: 2200, max: 9999, icon: "🐐" }
];


// Función para calcular nuevo ELO después de un partido
function calculateElo(playerElo, opposingTeamAvgElo, won, playerScore = 0) {
    // Probabilidad esperada de victoria
    const expectedWin = 1 / (1 + Math.pow(10, (opposingTeamAvgElo - playerElo) / 400));
    
    // Resultado actual (1 para victoria, 0 para derrota)
    const actualWin = won ? 1 : 0;
    
    // Factor de rendimiento individual (basado en goles/asistencias)
    const performanceFactor = 1 + (playerScore * 0.05); // Cada gol/asistencia añade 5% al cambio
    
    // Calcular cambio de ELO con factor K y rendimiento individual
    const eloChange = Math.round(ELO_K * performanceFactor * (actualWin - expectedWin));
    
    // Retornar nuevo ELO
    return playerElo + eloChange;
}

// Función para obtener el rango ELO de un jugador
function getEloRank(elo) {
    for (let i = 0; i < ELO_RANKS.length; i++) {
        if (elo >= ELO_RANKS[i].min && elo <= ELO_RANKS[i].max) {
            return ELO_RANKS[i];
        }
    }
    return ELO_RANKS[0]; // Default a Novato si hay algún problema
}

// Función mejorada para obtener el prefijo de ELO (siempre actualizado)
function getEloPrefix(player) {
    const auth = getAuth(player);
    if (!auth) return "";
    
    let playerElo = ELO_DEFAULT;
    
    // Primero intentamos obtener el ELO más reciente de Firebase
    try {
        // Usamos una solicitud síncrona para obtener el ELO más actualizado
        const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, false); // false = síncrono
        xhr.send();
        
        if (xhr.status === 200) {
            const userData = JSON.parse(xhr.responseText);
            if (userData && userData.elo) {
                playerElo = userData.elo;
                
                // Actualizamos el localStorage con el ELO más reciente
                try {
                    let localData = localStorage.getItem(auth);
                    let stats = localData ? JSON.parse(localData) : {};
                    stats.elo = playerElo;
                    localStorage.setItem(auth, JSON.stringify(stats));
                } catch (e) {
                    console.error("Error actualizando ELO en localStorage:", e);
                }
            }
        }
    } catch (e) {
        console.error("Error obteniendo ELO de Firebase:", e);
        
        // Si falla, intentamos obtener el ELO del localStorage como respaldo
        try {
            const localData = localStorage.getItem(auth);
            if (localData) {
                const userData = JSON.parse(localData);
                if (userData && userData.elo) {
                    playerElo = userData.elo;
                }
            }
        } catch (e) {
            console.error("Error obteniendo ELO local:", e);
        }
    }
    
    // Obtenemos el emoji del rango
    const eloRank = getEloRank(playerElo);
    return `${eloRank.icon} ${playerElo} | `;
}

// Actualizar el ELO cuando cambia en Firebase (más frecuente)
setInterval(() => {
    const players = room.getPlayerList();
    players.forEach(player => {
        const auth = getAuth(player);
        if (!auth) return;
        
        const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
        fetch(url)
            .then(response => response.json())
            .then(userData => {
                if (userData && userData.elo) {
                    try {
                        let localData = localStorage.getItem(auth);
                        let stats = localData ? JSON.parse(localData) : {};
                        
                        // Solo actualizar si el ELO cambió
                        if (stats.elo !== userData.elo) {
                            stats.elo = userData.elo;
                            localStorage.setItem(auth, JSON.stringify(stats));
                            console.log(`ELO actualizado para ${player.name}: ${userData.elo}`);
                        }
                    } catch (e) {
                        console.error("Error al actualizar ELO:", e);
                    }
                }
            })
            .catch(err => console.error("Error obteniendo datos:", err));
    });
}, 30 * 1000); // Cada 30 segundos en lugar de 5 minutos

// Función para actualizar ELO después de un partido
function updatePlayerElo(player, won, playerScore, opposingTeamAvgElo) {
    const auth = getAuth(player);
    if (!auth) return;
    
    // Obtener ELO actual
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(userData => {
        if (!userData) return;
        
        // Usar ELO actual o el default si no existe
        const currentElo = userData.elo || ELO_DEFAULT;
        
        // Calcular nuevo ELO
        const newElo = calculateElo(currentElo, opposingTeamAvgElo, won, playerScore);
        
        // Actualizar en Firebase
        const updatedData = {
            ...userData,
            elo: newElo
        };
        
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(updatedData)
        })
        .then(() => {
            // Informar al jugador sobre su cambio de ELO
            const eloChange = newElo - currentElo;
            const rankBefore = getEloRank(currentElo);
            const rankAfter = getEloRank(newElo);
            
            room.sendAnnouncement(`${player.name}: ELO ${currentElo} → ${newElo} (${eloChange > 0 ? '+' + eloChange : eloChange})`, player.id, 0x00FF00);
            
            // Si cambió de rango, anunciarlo
            if (rankBefore.name !== rankAfter.name) {
                room.sendAnnouncement(`¡Felicidades! Has subido de rango: ${rankBefore.icon} ${rankBefore.name} → ${rankAfter.icon} ${rankAfter.name}`, player.id, 0xFDC43A, "bold");
            }
                    
        });
    })

    
    .catch(error => console.error("Error actualizando ELO:", error));

    try {
        if (typeof updatePlayerName === 'function') {
            updatePlayerName(player);
        }
    } catch (e) {
        console.error("No se pudo actualizar el nombre después de ELO:", e);
    }

    
}

// Función para obtener el ELO promedio de un equipo
function getTeamAverageElo(teamPlayers) {
    let totalElo = 0;
    let count = 0;
    
    // Podemos hacer esta función síncrona usando localStorage para una estimación rápida
    for (let i = 0; i < teamPlayers.length; i++) {
        const auth = getAuth(teamPlayers[i]);
        if (!auth) continue;
        
        // Tratar de obtener ELO de localStorage primero (si existe)
        let playerElo = ELO_DEFAULT; // Valor default
        
        const stats = JSON.parse(localStorage.getItem(auth));
        if (stats && stats.elo) {
            playerElo = stats.elo;
        }
        
        totalElo += playerElo;
        count++;
    }
    
    return count > 0 ? Math.round(totalElo / count) : ELO_DEFAULT;
}
   
    // Función para interactuar con Firebase
    function firebaseFetch(path, options = {}) {
        const url = `${FIREBASE_URL}/${path}.json?auth=${FIREBASE_API_KEY}`;
        return fetch(url, options)
            .then(response => response.json());
    }

    function hasPermission(player, requiredRole) {
        return getRole(player) >= requiredRole;
        }


// Modificar saveUser para usar el código generado de manera consistente
function saveUser(player, password) {
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se pudo obtener tu auth. No se puede registrar.", player.id, 0xFF0000);
        return false;
    }

    // Generamos un código de recuperación fijo para este auth
    const recoveryCode = generateRecoveryCode(auth);
    
    // Obtenemos stats locales si existen
    const localStats = JSON.parse(localStorage.getItem(auth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
    
    // Preparamos estadísticas iniciales
    const initialStats = {
        games: localStats[Ss.GA] || 0,
        wins: localStats[Ss.WI] || 0,
        losses: localStats[Ss.LS] || 0,
        goals: localStats[Ss.GL] || 0,
        assists: localStats[Ss.AS] || 0,
        gk: localStats[Ss.GK] || 0,
        cs: localStats[Ss.CS] || 0
    };

    const userData = {
        name: player.name,
        auth: auth,
        password: password,
        recoveryCode: recoveryCode,
        stats: initialStats
    };

    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    
    fetch(url, {
        method: 'PUT',
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            room.sendAnnouncement("✅ ¡Registrado con éxito!", player.id, 0x00FF00);
            room.sendAnnouncement(`🔑 Tu código de recuperación es: ${recoveryCode}`, player.id, 0x00FF00, "bold");
            room.sendAnnouncement("⚠️ GUARDÁ este código para recuperar tu cuenta si cambiás de dispositivo", player.id, 0xFF7900, "bold");
            return true;
        } else {
            room.sendAnnouncement("❌ Error al registrar", player.id, 0xFF0000);
            return false;
        }
    })
    .catch(error => {
        console.error("Error al registrar:", error);
        room.sendAnnouncement("❌ Error al registrar", player.id, 0xFF0000);
        return false;
    });
}


    function loginUser(player, password) {
        const auth = getAuth(player);
        if (!auth) {
            room.sendAnnouncement("❌ No se detectó tu auth. Reconectate a la sala.", player.id, 0xFF0000);
            return false;
        }

        const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
        fetch(url)
        .then(response => response.json())
        .then(userData => {
            if (!userData) {
                room.sendAnnouncement("❌ No estás registrado. Usá !register <contraseña>", player.id, 0xFF0000);
                return;
            }

            // Si es login automático (password es null) o la contraseña coincide
            if (password === null || userData.password === password) {
                room.sendAnnouncement(`✅ ¡Bienvenido de nuevo ${player.name}!`, player.id, 0x00FF00);
                
                // Verificar si también es admin
                const adminUrl = `${FIREBASE_URL}/admins/${auth}.json?auth=${FIREBASE_API_KEY}`;
                fetch(adminUrl)
                .then(response => response.json())
                .then(adminData => {
                    if (adminData) {
                        playerRoles.set(auth, adminData.role);
                        setPlayerRole(player, adminData.role);
                    } else {
                        playerRoles.set(auth, Role.PLAYER);
                    }
                });

                return true;
            }
            room.sendAnnouncement("❌ Contraseña incorrecta!", player.id, 0xFF0000);
            return false;
        })
        .catch(error => {
            console.error("Error en login:", error);
            room.sendAnnouncement("❌ Error al iniciar sesión", player.id, 0xFF0000);
            return false;
        });
    }


    // Función auxiliar para completar el login
    function completeLogin(player, userData) {
        // Restauramos el rol guardado
        if (userData.role) {
            setPlayerRole(player, userData.role);
        }

        // Actualizamos último login
        userData.lastLogin = Date.now();
        
        // Guardamos los cambios
        fetch(`${FIREBASE_URL}/users/${player.auth}.json?auth=${FIREBASE_API_KEY}`, {
            method: 'PATCH',
            body: JSON.stringify({ lastLogin: userData.lastLogin })
        });

        
        // Si tiene rol especial, lo anunciamos
        if (userData.role && userData.role !== Role.USER) {
            let roleName = getRoleName(userData.role);
            room.sendAnnouncement(`👑 ${player.name} ha ingresado como ${roleName}!`, null, 0xffb02e, "bold");
        }
    }

var currentMap = null;

    // Probá primero esto para ver si conecta


// Funciones del sistema de camisetas (disponibles globalmente)
var camisetasEquipos = {
    // RIVER PLATE
    "riv/titular/red": {
        codigo: "/colors red 30 231F20 FFFFFF EE1B2C FFFFFF",
        nombreEquipo: "RIVER PLATE"
    },
    "riv/titular/blue": {
        codigo: "/colors blue 30 231F20 FFFFFF DA291C FFFFFF",
        nombreEquipo: "RIVER PLATE"
    },
    "riv/alternativa/red": {
        codigo: "/colors red 64 FFFFFF F0232F 312B31 281F22",
        nombreEquipo: "RIVER PLATE"
    },
    "riv/alternativa/blue": {
        codigo: "/colors blue 64 FFFFFF F0232F 312B31 281F22",
        nombreEquipo: "RIVER PLATE"
    },
    "riv/tercera/red": {
        codigo: "/colors red 180 271D1C F71E26 F0F1F5 F71E26",
        nombreEquipo: "RIVER PLATE"
    },
    "riv/tercera/blue": {
        codigo: "/colors blue 180 271D1C F71E26 F0F1F5 F71E26",
        nombreEquipo: "RIVER PLATE"
    },

    // BOCA JUNIORS
    "boc/titular/red": {
        codigo: "/colors red 90 FFFFFF 033F86 FAB900 033F86",
        nombreEquipo: "BOCA JUNIORS"
    },
    "boc/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 033F86 FAB900 033F86",
        nombreEquipo: "BOCA JUNIORS"
    },
    "boc/alternativa/red": {
        codigo: "/colors red 134 00448B C9C5D3 D4CEDA D4CEDA",
        nombreEquipo: "BOCA JUNIORS"
    },
    "boc/alternativa/blue": {
        codigo: "/colors blue 134 00448B C9C5D3 D4CEDA D4CEDA",
        nombreEquipo: "BOCA JUNIORS"
    },
    "boc/tercera/red": {
        codigo: "/colors red 118 142090 EBE12F",
        nombreEquipo: "BOCA JUNIORS"
    },
    "boc/tercera/blue": {
        codigo: "/colors blue 118 142090 EBE12F",
        nombreEquipo: "BOCA JUNIORS"
    },

    // SAN LORENZO
    "slo/titular/red": {
        codigo: "/colors red 180 FFFFFF E9282D 1D3B56 E9282D",
        nombreEquipo: "SAN LORENZO"
    },
    "slo/titular/blue": {
        codigo: "/colors blue 180 FFFFFF E9282D 1D3B56 E9282D",
        nombreEquipo: "SAN LORENZO"
    },
    "slo/alternativa/red": {
        codigo: "/colors red 90 1E2631 F2F3F7 EB212F 1B3146",
        nombreEquipo: "SAN LORENZO"
    },
    "slo/alternativa/blue": {
        codigo: "/colors blue 90 1E2631 F2F3F7 EB212F 1B3146",
        nombreEquipo: "SAN LORENZO"
    },
    "slo/tercera/red": {
        codigo: "/colors red 0 172025 BAC3C8 BAC3C8 D50013",
        nombreEquipo: "SAN LORENZO"
    },
    "slo/tercera/blue": {
        codigo: "/colors blue 0 172025 BAC3C8 BAC3C8 D50013",
        nombreEquipo: "SAN LORENZO"
    },

    // RACING CLUB
    "rac/titular/red": {
        codigo: "/colors red 180 002942 00A5E3 FFFFFF 00A5E3",
        nombreEquipo: "RACING CLUB"
    },
    "rac/titular/blue": {
        codigo: "/colors blue 180 002942 00A5E3 FFFFFF 00A5E3",
        nombreEquipo: "RACING CLUB"
    },
    "rac/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 0E273B 1DA3DD 0E273B",
        nombreEquipo: "RACING CLUB"
    },
    "rac/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 0E273B 1DA3DD 0E273B",
        nombreEquipo: "RACING CLUB"
    },
    "rac/tercera/red": {
        codigo: "/colors red 66 FFFFFF 019BDB 0F2A3D 0F2A3D",
        nombreEquipo: "RACING CLUB"
    },
    "rac/tercera/blue": {
        codigo: "/colors blue 66 FFFFFF 019BDB 0F2A3D 0F2A3D",
        nombreEquipo: "RACING CLUB"
    },

    // INDEPENDIENTE
    "ind/titular/red": {
        codigo: "/colors red 60 FFFFFF EC1C24",
        nombreEquipo: "INDEPENDIENTE"
    },
    "ind/titular/blue": {
        codigo: "/colors blue 60 FFFFFF EC1C24",
        nombreEquipo: "INDEPENDIENTE"
    },
    "ind/alternativa/red": {
        codigo: "/colors red 90 1D245C 002554 FFFFFF FFFFFF",
        nombreEquipo: "INDEPENDIENTE"
    },
    "ind/alternativa/blue": {
        codigo: "/colors blue 90 1D245C 002554 FFFFFF FFFFFF",
        nombreEquipo: "INDEPENDIENTE"
    },
    // ALDOSIVI
    "ald/titular/red": {
        codigo: "/colors red 180 F5CF00 3E984C F5CF00",
        nombreEquipo: "ALDOSIVI"
    },
    "ald/titular/blue": {
        codigo: "/colors blue 180 F5CF00 3E984C F5CF00",
        nombreEquipo: "ALDOSIVI"
    },
    "ald/alternativa/red": {
        codigo: "/colors red 90 F8F232 B7BBC6 AAAEB7",
        nombreEquipo: "ALDOSIVI"
    },
    "ald/alternativa/blue": {
        codigo: "/colors blue 90 F8F232 B7BBC6 AAAEB7",
        nombreEquipo: "ALDOSIVI"
    },
    "ald/titular/red/2020": {
        codigo: "/colors red 180 F8F232 0E9E59 F8F232",
        nombreEquipo: "ALDOSIVI"
    },
    "ald/titular/blue/2020": {
        codigo: "/colors blue 180 F8F232 0E9E59 F8F232",
        nombreEquipo: "ALDOSIVI"
    },

    // GIMNASIA (LP)
    "gim/titular/red": {
        codigo: "/colors red 90 00AFEF 12175E FFFFFF",
        nombreEquipo: "GIMNASIA (LP)"
    },
    "gim/titular/blue": {
        codigo: "/colors blue 90 00AFEF 12175E FFFFFF",
        nombreEquipo: "GIMNASIA (LP)"
    },
    "gim/alternativa/red": {
        codigo: "/colors red 90 1A264F 022C94",
        nombreEquipo: "GIMNASIA (LP)"
    },
    "gim/alternativa/blue": {
        codigo: "/colors blue 90 1A264F 022C94",
        nombreEquipo: "GIMNASIA (LP)"
    },
    "gim/tercera/red": {
        codigo: "/colors red 90 4B4D3F 221F3A 4B4D3F",
        nombreEquipo: "GIMNASIA (LP)"
    },
    "gim/tercera/blue": {
        codigo: "/colors blue 90 4B4D3F 221F3A 4B4D3F",
        nombreEquipo: "GIMNASIA (LP)"
    },
    "gim/alternativa/clasica/red": {
        codigo: "/colors red 90 202743 FFFFFF 202743",
        nombreEquipo: "GIMNASIA"
    },
    "gim/alternativa/clasica/blue": {
        codigo: "/colors blue 90 202743 FFFFFF 202743",
        nombreEquipo: "GIMNASIA"
    },

    // NEWELL'S OLD BOYS
    "nob/titular/red": {
        codigo: "/colors red 0 EE1D23 000000",
        nombreEquipo: "NEWELLS"
    },
    "nob/titular/blue": {
        codigo: "/colors blue 0 EE1D23 000000",
        nombreEquipo: "NEWELLS"
    },
    "nob/alternativa/red": {
        codigo: "/colors red 90 D30022 222222 F3F7FA",
        nombreEquipo: "NEWELLS"
    },
    "nob/alternativa/blue": {
        codigo: "/colors blue 90 D30022 222222 F3F7FA",
        nombreEquipo: "NEWELLS"
    },
    "nob/tercera/red": {
        codigo: "/colors red 90 191919 D41831 D41831",
        nombreEquipo: "NEWELLS"
    },
    "nob/tercera/blue": {
        codigo: "/colors blue 90 191919 D41831 D41831",
        nombreEquipo: "NEWELLS"
    },

    // ROSARIO CENTRAL
    "cen/titular/red": {
        codigo: "/colors red 180 FCD828 144178 FCD828",
        nombreEquipo: "ROSARIO CENTRAL"
    },
    "cen/titular/blue": {
        codigo: "/colors blue 180 FCD828 144178 FCD828",
        nombreEquipo: "ROSARIO CENTRAL"
    },
    "cen/alternativa/red": {
        codigo: "/colors red 180 EBC800 FFFFFF EBC800",
        nombreEquipo: "ROSARIO CENTRAL"
    },
    "cen/alternativa/blue": {
        codigo: "/colors blue 180 EBC800 FFFFFF EBC800",
        nombreEquipo: "ROSARIO CENTRAL"
    },
    "cen/tercera/red": {
        codigo: "/colors red 121 006B8C 0386CE 02B1DC",
        nombreEquipo: "ROSARIO CENTRAL"
    },
    "cen/tercera/blue": {
        codigo: "/colors blue 121 006B8C 0386CE 02B1DC",
        nombreEquipo: "ROSARIO CENTRAL"
    },

    // DEFENSA Y JUSTICIA
    "dyj/titular/red": {
        codigo: "/colors red 90 019B5F FDE101 FDE101",
        nombreEquipo: "DEFENSA Y JUSTICIA"
    },
    "dyj/titular/blue": {
        codigo: "/colors blue 90 019B5F FDE101 FDE101",
        nombreEquipo: "DEFENSA Y JUSTICIA"
    },
    "dyj/alternativa/red": {
        codigo: "/colors red 65 AEE264 FFFFFF AEE264",
        nombreEquipo: "DEFENSA Y JUSTICIA"
    },
    "dyj/alternativa/blue": {
        codigo: "/colors blue 65 AEE264 FFFFFF AEE264",
        nombreEquipo: "DEFENSA Y JUSTICIA"
    },
    "dyj/clasica/red": {
        codigo: "/colors red 65 007A3F FFDD00 007A3F",
        nombreEquipo: "DEFENSA Y JUSTICIA"
    },
    "dyj/clasica/blue": {
        codigo: "/colors blue 65 007A3F FFDD00 007A3F",
        nombreEquipo: "DEFENSA Y JUSTICIA"
    },

    // ATLÉTICO MADRID
    "atm/titular/red": {
        codigo: "/colors red 180 292a6d e3221d FFFFFF e3221d",
        nombreEquipo: "ATLÉTICO MADRID"
    },
    "atm/titular/blue": {
        codigo: "/colors blue 180 292a6d e3221d FFFFFF e3221d",
        nombreEquipo: "ATLÉTICO MADRID"
    },
    "atm/alternativa/red": {
        codigo: "/colors red 180 201F24 E61711",
        nombreEquipo: "ATLÉTICO MADRID"
    },
    "atm/alternativa/blue": {
        codigo: "/colors blue 180 201F24 E61711",
        nombreEquipo: "ATLÉTICO MADRID"
    },
    "atm/tercera/red": {
        codigo: "/colors red 152 AFD4EB A6CFE8",
        nombreEquipo: "ATLÉTICO MADRID"
    },
    "atm/tercera/blue": {
        codigo: "/colors blue 152 AFD4EB A6CFE8",
        nombreEquipo: "ATLÉTICO MADRID"
    },
    // SEVILLA FC
    "sev/titular/red": {
        codigo: "/colors red 90 FE0000 D1D1D1 FFFFFF FFFFFF",
        nombreEquipo: "SEVILLA FC"
    },
    "sev/titular/blue": {
        codigo: "/colors blue 90 FE0000 D1D1D1 FFFFFF FFFFFF",
        nombreEquipo: "SEVILLA FC"
    },

    // BARCELONA FC
    "bar/titular/red": {
        codigo: "/colors red 180 F5B606 011EDE C80056",
        nombreEquipo: "BARCELONA FC"
    },
    "bar/titular/blue": {
        codigo: "/colors blue 180 F5B606 011EDE C80056",
        nombreEquipo: "BARCELONA FC"
    },
    "bar/alternativa/red": {
        codigo: "/colors red 60 263A7B C7C7F9",
        nombreEquipo: "BARCELONA FC"
    },
    "bar/alternativa/blue": {
        codigo: "/colors blue 60 263A7B C7C7F9",
        nombreEquipo: "BARCELONA FC"
    },
    "bar/tercera/red": {
        codigo: "/colors red 140 2B2E3F FAEA35 E32527 FAEA35",
        nombreEquipo: "BARCELONA FC"
    },
    "bar/tercera/blue": {
        codigo: "/colors blue 140 2B2E3F FAEA35 E32527 FAEA35",
        nombreEquipo: "BARCELONA FC"
    },

    // REAL MADRID
    "rma/titular/red": {
        codigo: "/colors red 73 0f2145 ffc10a FFFFFF FFFFFF",
        nombreEquipo: "REAL MADRID"
    },
    "rma/titular/blue": {
        codigo: "/colors blue 73 0f2145 ffc10a FFFFFF FFFFFF",
        nombreEquipo: "REAL MADRID"
    },
    "rma/alternativa/red": {
        codigo: "/colors red 67 FFC94B 474E64 323D52 212B3A",
        nombreEquipo: "REAL MADRID"
    },
    "rma/alternativa/blue": {
        codigo: "/colors blue 67 FFC94B 474E64 323D52 212B3A",
        nombreEquipo: "REAL MADRID"
    },
    "rma/tercera/red": {
        codigo: "/colors red 180 002957 6EE2C8",
        nombreEquipo: "REAL MADRID"
    },
    "rma/tercera/blue": {
        codigo: "/colors blue 180 002957 6EE2C8",
        nombreEquipo: "REAL MADRID"
    },

    // INTER MILAN
    "int/titular/red": {
        codigo: "/colors red 180 FFFFFF 00239C 000000 00239C",
        nombreEquipo: "INTER MILAN"
    },
    "int/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 00239C 000000 00239C",
        nombreEquipo: "INTER MILAN"
    },
    "int/alternativa/red": {
        codigo: "/colors red 180 0157D2 FFFFFF",
        nombreEquipo: "INTER MILAN"
    },
    "int/alternativa/blue": {
        codigo: "/colors blue 180 0157D2 FFFFFF",
        nombreEquipo: "INTER MILAN"
    },
    "int/tercera/red": {
        codigo: "/colors red 180 48E4FA 0D1313",
        nombreEquipo: "INTER MILAN"
    },
    "int/tercera/blue": {
        codigo: "/colors blue 180 48E4FA 0D1313",
        nombreEquipo: "INTER MILAN"
    },

    // AC MILAN
    "acm/titular/red": {
        codigo: "/colors red 180 FFFFFF DF061B 000000 DF061B",
        nombreEquipo: "AC MILAN"
    },
    "acm/titular/blue": {
        codigo: "/colors blue 180 FFFFFF DF061B 000000 DF061B",
        nombreEquipo: "AC MILAN"
    },
    "acm/alternativa/red": {
        codigo: "/colors red 180 A61726 FAFAFA",
        nombreEquipo: "AC MILAN"
    },
    "acm/alternativa/blue": {
        codigo: "/colors blue 180 A61726 FAFAFA",
        nombreEquipo: "AC MILAN"
    },
    "acm/tercera/red": {
        codigo: "/colors red 180 F9F9F9 2A2A2A",
        nombreEquipo: "AC MILAN"
    },
    "acm/tercera/blue": {
        codigo: "/colors blue 180 F9F9F9 2A2A2A",
        nombreEquipo: "AC MILAN"
    },

    // CRUZEIRO
    "cru/titular/red": {
        codigo: "/colors red 180 E3E7F0 0146AB 044BB3 0146AB",
        nombreEquipo: "CRUZEIRO"
    },
    "cru/titular/blue": {
        codigo: "/colors blue 180 E3E7F0 0146AB 044BB3 0146AB",
        nombreEquipo: "CRUZEIRO"
    },
    "cru/alternativa/red": {
        codigo: "/colors red 60 045AB1 EEF1F6",
        nombreEquipo: "CRUZEIRO"
    },
    "cru/alternativa/blue": {
        codigo: "/colors blue 60 045AB1 EEF1F6",
        nombreEquipo: "CRUZEIRO"
    },
    // PALMEIRAS
    "pal/titular/red": {
        codigo: "/colors red 90 FFFFFF 006337 00713D 00713D",
        nombreEquipo: "PALMEIRAS"
    },
    "pal/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 006337 00713D 00713D",
        nombreEquipo: "PALMEIRAS"
    },
    "pal/alternativa/red": {
        codigo: "/colors red 60 10372A F2F1F2",
        nombreEquipo: "PALMEIRAS"
    },
    "pal/alternativa/blue": {
        codigo: "/colors blue 60 10372A F2F1F2",
        nombreEquipo: "PALMEIRAS"
    },
    "pal/tercera/red": {
        codigo: "/colors red 60 FFFFFF 5ADAC5",
        nombreEquipo: "PALMEIRAS"
    },
    "pal/tercera/blue": {
        codigo: "/colors blue 60 FFFFFF 5ADAC5",
        nombreEquipo: "PALMEIRAS"
    },

    // GREMIO
    "gre/titular/red": {
        codigo: "/colors red 180 FFFFFF 009EE2 05171D 009EE2",
        nombreEquipo: "GREMIO"
    },
    "gre/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 009EE2 05171D 009EE2",
        nombreEquipo: "GREMIO"
    },
    "gre/alternativa/red": {
        codigo: "/colors red 180 0088BE FAFAFC",
        nombreEquipo: "GREMIO"
    },
    "gre/alternativa/blue": {
        codigo: "/colors blue 180 0088BE FAFAFC",
        nombreEquipo: "GREMIO"
    },
    "gre/titular/red/2019": {
        codigo: "/colors red 180 FFFFFF 0099DB 20181E 0099DB",
        nombreEquipo: "GREMIO"
    },
    "gre/titular/blue/2019": {
        codigo: "/colors blue 180 FFFFFF 19A2FF 20181E 19A2FF",
        nombreEquipo: "GREMIO"
    },
    "gre/clasica/red": {
        codigo: "/colors red 180 EEEDE8 03A2C9 22191C 03A2C9",
        nombreEquipo: "GREMIO"
    },
    "gre/clasica/blue": {
        codigo: "/colors blue 180 EEEDE8 03A2C9 22191C 03A2C9",
        nombreEquipo: "GREMIO"
    },

    // TOTTENHAM
    "tot/titular/red": {
        codigo: "/colors red 90 1F2652 FFFFFF",
        nombreEquipo: "TOTTENHAM"
    },
    "tot/titular/blue": {
        codigo: "/colors blue 90 1F2652 FFFFFF",
        nombreEquipo: "TOTTENHAM"
    },
    "tot/alternativa/red": {
        codigo: "/colors red 90 FFFEFF 1B294B 1B294B 232956",
        nombreEquipo: "TOTTENHAM"
    },
    "tot/alternativa/blue": {
        codigo: "/colors blue 90 FFFEFF 1B294B 1B294B 232956",
        nombreEquipo: "TOTTENHAM"
    },
    "tot/tercera/red": {
        codigo: "/colors red 90 161D4F 3AC0EB 36B4E3",
        nombreEquipo: "TOTTENHAM"
    },
    "tot/tercera/blue": {
        codigo: "/colors blue 90 161D4F 3AC0EB 36B4E3",
        nombreEquipo: "TOTTENHAM"
    },
    "tot/titular/red/2018": {
        codigo: "/colors red 90 171C4F F5F4F9 F5F4F9 182341",
        nombreEquipo: "TOTTENHAM"
    },
    "tot/titular/blue/2018": {
        codigo: "/colors blue 90 171C4F F5F4F9 F5F4F9 182341",
        nombreEquipo: "TOTTENHAM"
    },
    "tot/alternativa/red/2018": {
        codigo: "/colors red 90 FFFFFF 20374C 0EAF9B",
        nombreEquipo: "TOTTENHAM"
    },
    "tot/alternativa/blue/2018": {
        codigo: "/colors blue 90 FFFFFF 20374C 0EAF9B",
        nombreEquipo: "TOTTENHAM"
    },

    // LIVERPOOL
    "liv/titular/red": {
        codigo: "/colors red 180 F0F0F2 C4021D",
        nombreEquipo: "LIVERPOOL"
    },
    "liv/titular/blue": {
        codigo: "/colors blue 180 F0F0F2 C4021D",
        nombreEquipo: "LIVERPOOL"
    },
    "liv/alternativa/red": {
        codigo: "/colors red 180 000000 EBE8D0",
        nombreEquipo: "LIVERPOOL"
    },
    "liv/alternativa/blue": {
        codigo: "/colors blue 180 000000 EBE8D0",
        nombreEquipo: "LIVERPOOL"
    },
    "liv/tercera/red": {
        codigo: "/colors red 180 FF451D FCFE1E",
        nombreEquipo: "LIVERPOOL"
    },
    "liv/tercera/blue": {
        codigo: "/colors blue 180 FF451D FCFE1E",
        nombreEquipo: "LIVERPOOL"
    },

    // ARGENTINA
    "arg/titular/red": {
        codigo: "/colors red 180 1e2930 98cef0 ffffff 98cef0",
        nombreEquipo: "ARGENTINA"
    },
    "arg/titular/blue": {
        codigo: "/colors blue 180 1e2930 98cef0 ffffff 98cef0",
        nombreEquipo: "ARGENTINA"
    },
    "arg/alternativa/red": {
        codigo: "/colors red 90 CED3D9 0B245F 214196 7E6FB8",
        nombreEquipo: "ARGENTINA"
    },
    "arg/alternativa/blue": {
        codigo: "/colors blue 90 CED3D9 0B245F 214196 7E6FB8",
        nombreEquipo: "ARGENTINA"
    },
    "arg/bandera/red": {
        codigo: "/colors red 90 F6B40E 74ACDF FFFFFF 74ACDF",
        nombreEquipo: "ARGENTINA"
    },
    "arg/bandera/blue": {
        codigo: "/colors blue 90 F6B40E 74ACDF FFFFFF 74ACDF",
        nombreEquipo: "ARGENTINA"
    },

    // BÉLGICA
    "belg/titular/red": {
        codigo: "/colors red 44 F1E73A DC0121 391517 DC0121",
        nombreEquipo: "BÉLGICA"
    },
    "belg/titular/blue": {
        codigo: "/colors blue 44 F1E73A DC0121 391517 DC0121",
        nombreEquipo: "BÉLGICA"
    },
    "belg/alternativa/red": {
        codigo: "/colors red 90 000000 F9C700 F4AC00",
        nombreEquipo: "BÉLGICA"
    },
    "belg/alternativa/blue": {
        codigo: "/colors blue 90 000000 F9C700 F4AC00",
        nombreEquipo: "BÉLGICA"
    },
    "belg/bandera/red": {
        codigo: "/colors red 180 FFFFFF 000000 FAE042 ED2939",
        nombreEquipo: "BÉLGICA"
    },
    "belg/bandera/blue": {
        codigo: "/colors blue 180 FFFFFF 000000 FAE042 ED2939",
        nombreEquipo: "BÉLGICA"
    },

    // BRASIL
    "bra/titular/red": {
        codigo: "/colors red 180 00a032 ffcd00",
        nombreEquipo: "BRASIL"
    },
    "bra/titular/blue": {
        codigo: "/colors blue 180 00a032 ffcd00",
        nombreEquipo: "BRASIL"
    },
    "bra/alternativa/red": {
        codigo: "/colors red 90 F6D91F 1C4C90 0D60B1 0E72D6",
        nombreEquipo: "BRASIL"
    },
    "bra/alternativa/blue": {
        codigo: "/colors blue 90 F6D91F 1C4C90 0D60B1 0E72D6",
        nombreEquipo: "BRASIL"
    },
    "bra/tercera/red": {
        codigo: "/colors red 180 0053B5 F8F9FE",
        nombreEquipo: "BRASIL"
    },
    "bra/tercera/blue": {
        codigo: "/colors blue 180 0053B5 F8F9FE",
        nombreEquipo: "BRASIL"
    },
    // CHILE
    "chi/titular/red": {
        codigo: "/colors red 60 FFFFFF ED3422",
        nombreEquipo: "CHILE"
    },
    "chi/titular/blue": {
        codigo: "/colors blue 60 FFFFFF ED3422",
        nombreEquipo: "CHILE"
    },

    // URUGUAY
    "uru/titular/red": {
        codigo: "/colors red 90 2E3035 80BFE1 76B9DE",
        nombreEquipo: "URUGUAY"
    },
    "uru/titular/blue": {
        codigo: "/colors blue 90 2E3035 80BFE1 76B9DE",
        nombreEquipo: "URUGUAY"
    },
    "uru/alternativa/red": {
        codigo: "/colors red 75 373639 52ABDF F2F3F7 F2F3F7",
        nombreEquipo: "URUGUAY"
    },
    "uru/alternativa/blue": {
        codigo: "/colors blue 75 373639 52ABDF F2F3F7 F2F3F7",
        nombreEquipo: "URUGUAY"
    },

    // FRANCIA
    "fra/titular/red": {
        codigo: "/colors red 90 EABC78 1B2A4A",
        nombreEquipo: "FRANCIA"
    },
    "fra/titular/blue": {
        codigo: "/colors blue 90 EABC78 1B2A4A",
        nombreEquipo: "FRANCIA"
    },
    "fra/alternativa/red": {
        codigo: "/colors red 90 0977C5 FFFFFF E2EBF2",
        nombreEquipo: "FRANCIA"
    },
    "fra/alternativa/blue": {
        codigo: "/colors blue 90 0977C5 FFFFFF E2EBF2",
        nombreEquipo: "FRANCIA"
    },
    "fra/bandera/red": {
        codigo: "/colors red 1 939BA3 002395 FFFFFF ED2939",
        nombreEquipo: "FRANCIA"
    },
    "fra/bandera/blue": {
        codigo: "/colors blue 1 939BA3 002395 FFFFFF ED2939",
        nombreEquipo: "FRANCIA"
    },

    // CROACIA
    "cro/titular/red": {
        codigo: "/colors red 90 0065C9 D6001E F2F0F3 F2F0F3",
        nombreEquipo: "CROACIA"
    },
    "cro/titular/blue": {
        codigo: "/colors blue 90 0065C9 D6001E F2F0F3 F2F0F3",
        nombreEquipo: "CROACIA"
    },
    "cro/alternativa/red": {
        codigo: "/colors red 90 F6F6F8 E50738 0151C0 0151C0",
        nombreEquipo: "CROACIA"
    },
    "cro/alternativa/blue": {
        codigo: "/colors blue 90 F6F6F8 E50738 0151C0 0151C0",
        nombreEquipo: "CROACIA"
    },
    "cro/tercera/red": {
        codigo: "/colors red 90 E43840 272E30 4F5857",
        nombreEquipo: "CROACIA"
    },
    "cro/tercera/blue": {
        codigo: "/colors blue 90 E43840 272E30 4F5857",
        nombreEquipo: "CROACIA"
    },

    // NAPOLI
    "nap/titular/red": {
        codigo: "/colors red 180 FFFFFF 01B9EB",
        nombreEquipo: "NAPOLI"
    },
    "nap/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 01B9EB",
        nombreEquipo: "NAPOLI"
    },
    "nap/alternativa/red": {
        codigo: "/colors red 299 FFFFFF 7E8641 7E8641 33392E",
        nombreEquipo: "NAPOLI"
    },
    "nap/alternativa/blue": {
        codigo: "/colors blue 299 FFFFFF 7E8641 7E8641 33392E",
        nombreEquipo: "NAPOLI"
    },

    // BAYERN DE MUNICH
    "fcb/titular/red": {
        codigo: "/colors red 90 FFFFFF DC052D ED0038 ED0038",
        nombreEquipo: "BAYERN DE MUNICH"
    },
    "fcb/titular/blue": {
        codigo: "/colors blue 90 FFFFFF DC052D ED0038 ED0038",
        nombreEquipo: "BAYERN DE MUNICH"
    },
    "fcb/alternativa/red": {
        codigo: "/colors red 180 62676A F6F8FC",
        nombreEquipo: "BAYERN DE MUNICH"
    },
    "fcb/alternativa/blue": {
        codigo: "/colors blue 180 62676A F6F8FC",
        nombreEquipo: "BAYERN DE MUNICH"
    },
    "fcb/tercera/red": {
        codigo: "/colors red 180 E76352 132243",
        nombreEquipo: "BAYERN DE MUNICH"
    },
    "fcb/tercera/blue": {
        codigo: "/colors blue 180 E76352 132243",
        nombreEquipo: "BAYERN DE MUNICH"
    },
    // BORUSSIA DORTMUND
    "bvb/titular/red": {
        codigo: "/colors red 90 1d1d1b 1d1d1b fad515 fad515",
        nombreEquipo: "BORUSSIA DORTMUND"
    },
    "bvb/titular/blue": {
        codigo: "/colors blue 90 1d1d1b 1d1d1b fad515 fad515",
        nombreEquipo: "BORUSSIA DORTMUND"
    },
    "bvb/alternativa/red": {
        codigo: "/colors red 180 CECFD1 252525",
        nombreEquipo: "BORUSSIA DORTMUND"
    },
    "bvb/alternativa/blue": {
        codigo: "/colors blue 180 CECFD1 252525",
        nombreEquipo: "BORUSSIA DORTMUND"
    },

    // JUVENTUS
    "juv/titular/red": {
        codigo: "/colors red 180 F7C902 1F1A20 FFFFFF 1F1A20",
        nombreEquipo: "JUVENTUS"
    },
    "juv/titular/blue": {
        codigo: "/colors blue 180 F7C902 1F1A20 FFFFFF 1F1A20",
        nombreEquipo: "JUVENTUS"
    },
    "juv/alternativa/red": {
        codigo: "/colors red 126 FFFFFF FAA18D 25242A 25242A",
        nombreEquipo: "JUVENTUS"
    },
    "juv/alternativa/blue": {
        codigo: "/colors blue 126 FFFFFF FAA18D 25242A 25242A",
        nombreEquipo: "JUVENTUS"
    },
    "juv/tercera/red": {
        codigo: "/colors red 130 6370F2 FFFFFF F3E757 F3E757",
        nombreEquipo: "JUVENTUS"
    },
    "juv/tercera/blue": {
        codigo: "/colors blue 130 6370F2 FFFFFF F3E757 F3E757",
        nombreEquipo: "JUVENTUS"
    },

    // ESTUDIANTES (LP)
    "est/titular/red": {
        codigo: "/colors red 180 323232 E41815 FFFFFF E41815",
        nombreEquipo: "ESTUDIANTES (LP)"
    },
    "est/titular/blue": {
        codigo: "/colors blue 180 323232 E41815 FFFFFF E41815",
        nombreEquipo: "ESTUDIANTES (LP)"
    },
    "est/alternativa/red": {
        codigo: "/colors red 0 F51A22 FFFFFF FFFFFF F51A22",
        nombreEquipo: "ESTUDIANTES (LP)"
    },
    "est/alternativa/blue": {
        codigo: "/colors blue 0 F51A22 FFFFFF FFFFFF F51A22",
        nombreEquipo: "ESTUDIANTES (LP)"
    },
    "est/tercera/red": {
        codigo: "/colors red 90 FFFFFF 242424 D9201E D9201E",
        nombreEquipo: "ESTUDIANTES (LP)"
    },
    "est/tercera/blue": {
        codigo: "/colors blue 90 FFFFFF 242424 D9201E D9201E",
        nombreEquipo: "ESTUDIANTES (LP)"
    },

    // BANFIELD
    "band/titular/red": {
        codigo: "/colors red 180 B59859 007836 FFFFFF 007836",
        nombreEquipo: "BANFIELD"
    },
    "band/titular/blue": {
        codigo: "/colors blue 180 B59859 007836 FFFFFF 007836",
        nombreEquipo: "BANFIELD"
    },
    "band/alternativa/red": {
        codigo: "/colors red 44 FFFFFF 1C1C1C 09694A 1C1C1C",
        nombreEquipo: "BANFIELD"
    },
    "band/alternativa/blue": {
        codigo: "/colors blue 44 FFFFFF 1C1C1C 09694A 1C1C1C",
        nombreEquipo: "BANFIELD"
    },
    "band/clasica/red": {
        codigo: "/colors red 180 0A0A0A 02953F FEFFFF 02953F",
        nombreEquipo: "BANFIELD"
    },
    "band/clasica/blue": {
        codigo: "/colors blue 180 0A0A0A 02953F FEFFFF 02953F",
        nombreEquipo: "BANFIELD"
    },

    // LANÚS
    "lan/titular/red": {
        codigo: "/colors red 90 FFFFFF 6A2331 74192E 74192E",
        nombreEquipo: "LANÚS"
    },
    "lan/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 6A2331 74192E 74192E",
        nombreEquipo: "LANÚS"
    },
    "lan/alternativa/red": {
        codigo: "/colors red 65 6C1921 FFFFFF",
        nombreEquipo: "LANÚS"
    },
    "lan/alternativa/blue": {
        codigo: "/colors blue 65 6C1921 FFFFFF",
        nombreEquipo: "LANÚS"
    },
    "lan/tercera/red": {
        codigo: "/colors red 133 8C2246 591733 FCCBDE FCCBDE",
        nombreEquipo: "LANÚS"
    },
    "lan/tercera/blue": {
        codigo: "/colors blue 133 8C2246 591733 FCCBDE FCCBDE",
        nombreEquipo: "LANÚS"
    },

    // MANCHESTER UNITED
    "mun/titular/red": {
        codigo: "/colors red 90 FFFFFF D90119 C7011A AB0918",
        nombreEquipo: "MANCHESTER UNITED"
    },
    "mun/titular/blue": {
        codigo: "/colors blue 90 FFFFFF D90119 C7011A AB0918",
        nombreEquipo: "MANCHESTER UNITED"
    },
    "mun/alternativa/red": {
        codigo: "/colors red 90 191816 E1D2BF",
        nombreEquipo: "MANCHESTER UNITED"
    },
    "mun/alternativa/blue": {
        codigo: "/colors blue 90 231F20 F5EAD4",
        nombreEquipo: "MANCHESTER UNITED"
    },
    "mun/tercera/red": {
        codigo: "/colors red 90 231F20 F5EAD4",
        nombreEquipo: "MANCHESTER UNITED"
    },
    "mun/tercera/blue": {
        codigo: "/colors blue 233 F24134 2B2F35 212125",
        nombreEquipo: "MANCHESTER UNITED"
    },

    // MANCHESTER CITY
    "mci/titular/red": {
        codigo: "/colors red 90 FFFFFF 95c1e6",
        nombreEquipo: "MANCHESTER CITY"
    },
    "mci/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 95c1e6",
        nombreEquipo: "MANCHESTER CITY"
    },
    "mci/alternativa/red": {
        codigo: "/colors red -40 F7C100 1D1417 B20113 1D1417",
        nombreEquipo: "MANCHESTER CITY"
    },
    "mci/alternativa/blue": {
        codigo: "/colors blue -40 F7C100 1D1417 B20113 1D1417",
        nombreEquipo: "MANCHESTER CITY"
    },
    "mci/tercera/red": {
        codigo: "/colors red 90 FFFFFF 99D5F7 293158 293158",
        nombreEquipo: "MANCHESTER CITY"
    },
    "mci/tercera/blue": {
        codigo: "/colors blue 90 FFFFFF 99D5F7 293158 293158",
        nombreEquipo: "MANCHESTER CITY"
    },
    // ARSENAL FC
    "ars/titular/red": {
        codigo: "/colors red 69 D3A255 FFFFFF D10413 D10413",
        nombreEquipo: "ARSENAL FC"
    },
    "ars/titular/blue": {
        codigo: "/colors blue 69 D3A255 FFFFFF D10413 D10413",
        nombreEquipo: "ARSENAL FC"
    },
    "ars/alternativa/red": {
        codigo: "/colors red 55 233F67 FEF2AB",
        nombreEquipo: "ARSENAL FC"
    },
    "ars/alternativa/blue": {
        codigo: "/colors blue 55 233F67 FEF2AB",
        nombreEquipo: "ARSENAL FC"
    },
    "ars/tercera/red": {
        codigo: "/colors red 90 FECC00 27354F",
        nombreEquipo: "ARSENAL FC"
    },
    "ars/tercera/blue": {
        codigo: "/colors blue 90 FECC00 27354F",
        nombreEquipo: "ARSENAL FC"
    },

    // CHELSEA
    "che/titular/red": {
        codigo: "/colors red 66 FBB700 001489",
        nombreEquipo: "CHELSEA"
    },
    "che/titular/blue": {
        codigo: "/colors blue 66 FBB700 001489",
        nombreEquipo: "CHELSEA"
    },
    "che/alternativa/red": {
        codigo: "/colors red 52 003B7D F8F8F8",
        nombreEquipo: "CHELSEA"
    },
    "che/alternativa/blue": {
        codigo: "/colors blue 52 003B7D F8F8F8",
        nombreEquipo: "CHELSEA"
    },
    "che/tercera/red": {
        codigo: "/colors red 56 F9500F 1A1A1A 161616",
        nombreEquipo: "CHELSEA"
    },
    "che/tercera/blue": {
        codigo: "/colors blue 56 F9500F 1A1A1A 161616",
        nombreEquipo: "CHELSEA"
    },
    "che/cuarta/red": {
        codigo: "/colors red 56 F4DA45 33459F",
        nombreEquipo: "CHELSEA"
    },
    "che/cuarta/blue": {
        codigo: "/colors blue 56 F4DA45 33459F",
        nombreEquipo: "CHELSEA"
    },

    // PARANAENSE
    "par/titular/red": {
        codigo: "/colors red 48 FFFFFF C6012C C6012C 100E0F",
        nombreEquipo: "PARANAENSE"
    },
    "par/titular/blue": {
        codigo: "/colors blue 48 FFFFFF C6012C C6012C 100E0F",
        nombreEquipo: "PARANAENSE"
    },
    "par/alternativa/red": {
        codigo: "/colors red 48 0E0E0E FFFFFF FFFFFF BABABA",
        nombreEquipo: "PARANAENSE"
    },
    "par/alternativa/blue": {
        codigo: "/colors blue 48 0E0E0E FFFFFF FFFFFF BABABA",
        nombreEquipo: "PARANAENSE"
    },

    // HURACÁN
    "hur/titular/red": {
        codigo: "/colors red 52 FF0000 FFFFFF",
        nombreEquipo: "HURACÁN"
    },
    "hur/titular/blue": {
        codigo: "/colors blue 52 FF0000 FFFFFF",
        nombreEquipo: "HURACÁN"
    },
    "hur/alternativa/red": {
        codigo: "/colors red 90 FFFFFF D02939 A61829 D02939",
        nombreEquipo: "HURACÁN"
    },
    "hur/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF D02939 A61829 D02939",
        nombreEquipo: "HURACÁN"
    },

    // TIGRE
    "tig/titular/red": {
        codigo: "/colors red 90 FFFFFF 304383 CB1B2D 304383",
        nombreEquipo: "TIGRE"
    },
    "tig/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 304383 CB1B2D 304383",
        nombreEquipo: "TIGRE"
    },
    "tig/alternativa/red": {
        codigo: "/colors red 90 2D3E6A FFFFFF E32527 FFFFFF",
        nombreEquipo: "TIGRE"
    },
    "tig/alternativa/blue": {
        codigo: "/colors blue 90 2D3E6A FFFFFF E32527 FFFFFF",
        nombreEquipo: "TIGRE"
    },

    // ALEMANIA
    "ale/titular/red": {
        codigo: "/colors red 0 F0CDA5 FFFFFF 281C26 FFFFFF",
        nombreEquipo: "ALEMANIA"
    },
    "ale/titular/blue": {
        codigo: "/colors blue 0 F0CDA5 FFFFFF 281C26 FFFFFF",
        nombreEquipo: "ALEMANIA"
    },
    "ale/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 222222 1B1B1B 1B1B1B",
        nombreEquipo: "ALEMANIA"
    },
    "ale/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 222222 1B1B1B 1B1B1B",
        nombreEquipo: "ALEMANIA"
    },
    "ale/bandera/red": {
        codigo: "/colors red 90 FFFFFF 000000 DD0000 FFCE00",
        nombreEquipo: "ALEMANIA"
    },
    "ale/bandera/blue": {
        codigo: "/colors blue 90 FFFFFF 000000 DD0000 FFCE00",
        nombreEquipo: "ALEMANIA"
    },

    // ESPAÑA
    "esp/titular/red": {
        codigo: "/colors red 70 FFC000 BB0C10",
        nombreEquipo: "ESPAÑA"
    },
    "esp/titular/blue": {
        codigo: "/colors blue 70 FFC000 BB0C10",
        nombreEquipo: "ESPAÑA"
    },
    "esp/alternativa/red": {
        codigo: "/colors red 270 0DA2E7 A9DCF7 BEE4F9 DCF0FB",
        nombreEquipo: "ESPAÑA"
    },
    "esp/alternativa/blue": {
        codigo: "/colors blue 270 0DA2E7 A9DCF7 BEE4F9 DCF0FB",
        nombreEquipo: "ESPAÑA"
    },
    "esp/bandera/red": {
        codigo: "/colors red 90 AD1519 C60B1E FFC400 C60B1E",
        nombreEquipo: "ESPAÑA"
    },
    "esp/bandera/blue": {
        codigo: "/colors blue 90 AD1519 C60B1E FFC400 C60B1E",
        nombreEquipo: "ESPAÑA"
    },

    // PORTUGAL
    "por/titular/red": {
        codigo: "/colors red 130 F9CD39 A92121 A92121 01553E",
        nombreEquipo: "PORTUGAL"
    },
    "por/titular/blue": {
        codigo: "/colors blue 130 F9CD39 A92121 A92121 01553E",
        nombreEquipo: "PORTUGAL"
    },
    "por/alternativa/red": {
        codigo: "/colors red 90 030303 E1FAF8 E1FAF8 F04256",
        nombreEquipo: "PORTUGAL"
    },
    "por/alternativa/blue": {
        codigo: "/colors blue 90 030303 E1FAF8 E1FAF8 F04256",
        nombreEquipo: "PORTUGAL"
    },

    // ARGENTINOS JRS.
    "aaaj/titular/red": {
        codigo: "/colors red 123 005DA4 EB2A2F FFFFFF EB2A2F",
        nombreEquipo: "ARGENTINOS JRS."
    },
    "aaaj/titular/blue": {
        codigo: "/colors blue 123 005DA4 EB2A2F FFFFFF EB2A2F",
        nombreEquipo: "ARGENTINOS JRS."
    },
    "aaaj/alternativa/red": {
        codigo: "/colors red 180 EB2A2F EB2A2F FFFFFF FFFFFF",
        nombreEquipo: "ARGENTINOS JRS."
    },
    "aaaj/alternativa/blue": {
        codigo: "/colors blue 180 EB2A2F EB2A2F FFFFFF FFFFFF",
        nombreEquipo: "ARGENTINOS JRS."
    },
    "aaaj/tercera/red": {
        codigo: "/colors red 135 585F8A 0255BD FFFFFF 0255BD",
        nombreEquipo: "ARGENTINOS JRS."
    },
    "aaaj/tercera/blue": {
        codigo: "/colors blue 135 585F8A 0255BD FFFFFF 0255BD",
        nombreEquipo: "ARGENTINOS JRS."
    },

    // ALL BOYS
    "alb/titular/red": {
        codigo: "/colors red 180 282A27 FFFFFF",
        nombreEquipo: "ALL BOYS"
    },
    "alb/titular/blue": {
        codigo: "/colors blue 180 282A27 FFFFFF",
        nombreEquipo: "ALL BOYS"
    },
    "alb/alternativa/red": {
        codigo: "/colors red 50 D6D6D6 FFFFFF 1E1A17 FFFFFF",
        nombreEquipo: "ALL BOYS"
    },
    "alb/alternativa/blue": {
        codigo: "/colors blue 50 D6D6D6 FFFFFF 1E1A17 FFFFFF",
        nombreEquipo: "ALL BOYS"
    },

    // ATLANTA
    "atl/titular/red": {
        codigo: "/colors red 180 FFFFFF EDBF00 34458A EDBF00",
        nombreEquipo: "ATLANTA"
    },
    "atl/titular/blue": {
        codigo: "/colors blue 180 FFFFFF EDBF00 34458A EDBF00",
        nombreEquipo: "ATLANTA"
    },
    "atl/alternativa/red": {
        codigo: "/colors red 60 EDD41C 03264E 09203C 09203C",
        nombreEquipo: "ATLANTA"
    },
    "atl/alternativa/blue": {
        codigo: "/colors blue 60 EDD41C 03264E 09203C 09203C",
        nombreEquipo: "ATLANTA"
    },
    "atl/escudo/red": {
        codigo: "/colors red 180 FFFFFF FBBB51 18306E FBBB51",
        nombreEquipo: "ATLANTA"
    },
    "atl/escudo/blue": {
        codigo: "/colors blue 180 FFFFFF FBBB51 18306E FBBB51",
        nombreEquipo: "ATLANTA"
    },
    // BELGRANO
    "bel/titular/red": {
        codigo: "/colors red 70 FFFFFF 1A120C 009CD0 009CD0",
        nombreEquipo: "BELGRANO"
    },
    "bel/titular/blue": {
        codigo: "/colors blue 70 FFFFFF 1A120C 009CD0 009CD0",
        nombreEquipo: "BELGRANO"
    },
    "bel/alternativa/red": {
        codigo: "/colors red 70 000000 10B0FF FFFFFF FFFFFF",
        nombreEquipo: "BELGRANO"
    },
    "bel/alternativa/blue": {
        codigo: "/colors blue 70 000000 10B0FF FFFFFF FFFFFF",
        nombreEquipo: "BELGRANO"
    },

    // CHACARITA JRS
    "cha/titular/red": {
        codigo: "/colors red 180 FFFFFF 000000 D2191E 000000",
        nombreEquipo: "CHACARITA JRS"
    },
    "cha/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 000000 D2191E 000000",
        nombreEquipo: "CHACARITA JRS"
    },
    "cha/alternativa/red": {
        codigo: "/colors red 90 9C9C9C D2191E FFFFFF 000000",
        nombreEquipo: "CHACARITA JRS"
    },
    "cha/alternativa/blue": {
        codigo: "/colors blue 90 9C9C9C D2191E FFFFFF 000000",
        nombreEquipo: "CHACARITA JRS"
    },

    // TALLERES (C)
    "tal/titular/red": {
        codigo: "/colors red 180 A7A9AB 1E315A FFFFFF 1E315A",
        nombreEquipo: "TALLERES (C)"
    },
    "tal/titular/blue": {
        codigo: "/colors blue 180 A7A9AB 1E315A FFFFFF 1E315A",
        nombreEquipo: "TALLERES (C)"
    },
    "tal/alternativa/red": {
        codigo: "/colors red 90 3A4466 FFFFFF",
        nombreEquipo: "TALLERES (C)"
    },
    "tal/alternativa/blue": {
        codigo: "/colors blue 90 3A4466 FFFFFF",
        nombreEquipo: "TALLERES (C)"
    },

    // PLATENSE
    "pla/titular/red": {
        codigo: "/colors red 90 FD6F21 FFFFFF 5A3E22 FFFFFF",
        nombreEquipo: "PLATENSE"
    },
    "pla/titular/blue": {
        codigo: "/colors blue 90 FD6F21 FFFFFF 5A3E22 FFFFFF",
        nombreEquipo: "PLATENSE"
    },
    "pla/alternativa/red": {
        codigo: "/colors red 90 FB7401 4C3E3B FFFFFF 4C3E3B",
        nombreEquipo: "PLATENSE"
    },
    "pla/alternativa/blue": {
        codigo: "/colors blue 90 FB7401 4C3E3B FFFFFF 4C3E3B",
        nombreEquipo: "PLATENSE"
    },
    "pla/tercera/red": {
        codigo: "/colors red 180 9E6F47 C9B6A5 4A2C21 C9B6A5",
        nombreEquipo: "PLATENSE"
    },
    "pla/tercera/blue": {
        codigo: "/colors blue 180 9E6F47 C9B6A5 4A2C21 C9B6A5",
        nombreEquipo: "PLATENSE"
    },

    // OLIMPO
    "olp/titular/red": {
        codigo: "/colors red 180 FFFFFF 292929 EDC63A 292929",
        nombreEquipo: "OLIMPO"
    },
    "olp/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 292929 EDC63A 292929",
        nombreEquipo: "OLIMPO"
    },

    // SAN MARTÍN (T)
    "smt/titular/red": {
        codigo: "/colors red 0 0F0F0F E11A25 FFFFFF E11A25",
        nombreEquipo: "SAN MARTÍN (T)"
    },
    "smt/titular/blue": {
        codigo: "/colors blue 0 0F0F0F E11A25 FFFFFF E11A25",
        nombreEquipo: "SAN MARTÍN (T)"
    },
    "smt/alternativa/red": {
        codigo: "/colors red 90 FFFFFF E31515 232326 232326",
        nombreEquipo: "SAN MARTÍN (T)"
    },
    "smt/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF E31515 232326 232326",
        nombreEquipo: "SAN MARTÍN (T)"
    },
    "smt/tercera/red": {
        codigo: "/colors red 0 FFFFFF FF3A43 6F3C45 6F3C45",
        nombreEquipo: "SAN MARTÍN (T)"
    },
    "smt/tercera/blue": {
        codigo: "/colors blue 0 FFFFFF FF3A43 6F3C45 6F3C45",
        nombreEquipo: "SAN MARTÍN (T)"
    },

    // ATL. TUCUMÁN
    "atu/titular/red": {
        codigo: "/colors red 180 575A5B 71AFDB FFFFFF 71AFDB",
        nombreEquipo: "ATL. TUCUMÁN"
    },
    "atu/titular/blue": {
        codigo: "/colors blue 180 575A5B 71AFDB FFFFFF 71AFDB",
        nombreEquipo: "ATL. TUCUMÁN"
    },
    "atu/alternativa/red": {
        codigo: "/colors red 180 CCD5E6 151A37",
        nombreEquipo: "ATL. TUCUMÁN"
    },
    "atu/alternativa/blue": {
        codigo: "/colors blue 180 CCD5E6 151A37",
        nombreEquipo: "ATL. TUCUMÁN"
    },

    // FERRO
    "fco/titular/red": {
        codigo: "/colors red 66 FFFFFF 046C43 219A57 2DB563",
        nombreEquipo: "FERRO"
    },
    "fco/titular/blue": {
        codigo: "/colors blue 66 FFFFFF 00895B 01935D 01935D",
        nombreEquipo: "FERRO"
    },
    "fco/alternativa/red": {
        codigo: "/colors red 90 016C3E FAFDFF C2DCD9 51BDA3",
        nombreEquipo: "FERRO"
    },
    "fco/alternativa/blue": {
        codigo: "/colors blue 90 016C3E FAFDFF C2DCD9 51BDA3",
        nombreEquipo: "FERRO"
    },

    // NACIONAL (UY)
    "nac/titular/red": {
        codigo: "/colors red 180 F9020A FAF9FF",
        nombreEquipo: "NACIONAL (UY)"
    },
    "nac/titular/blue": {
        codigo: "/colors blue 180 F9020A FAF9FF",
        nombreEquipo: "NACIONAL (UY)"
    },
    "nac/alternativa/red": {
        codigo: "/colors red 55 D0142C 003895 FFFFFF 003895",
        nombreEquipo: "NACIONAL (UY)"
    },
    "nac/alternativa/blue": {
        codigo: "/colors blue 55 D0142C 003895 FFFFFF 003895",
        nombreEquipo: "NACIONAL (UY)"
    },

    // PEÑAROL
    "pen/titular/red": {
        codigo: "/colors red 180 FFFFFF 272525 F7CF00 272525",
        nombreEquipo: "PEÑAROL"
    },
    "pen/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 272525 F7CF00 272525",
        nombreEquipo: "PEÑAROL"
    },
    "pen/alternativa/red": {
        codigo: "/colors red 90 EABA07 F5D205 211B1B 211B1B",
        nombreEquipo: "PEÑAROL"
    },
    "pen/alternativa/blue": {
        codigo: "/colors blue 90 EABA07 F5D205 211B1B 211B1B",
        nombreEquipo: "PEÑAROL"
    },
    "pen/tercera/red": {
        codigo: "/colors red 60 EAD300 8B8A8F A1A0A5 B2B1B6",
        nombreEquipo: "PEÑAROL"
    },
    "pen/tercera/blue": {
        codigo: "/colors blue 60 EAD300 8B8A8F A1A0A5 B2B1B6",
        nombreEquipo: "PEÑAROL"
    },

    // QUILMES
    "qui/titular/red": {
        codigo: "/colors red 90 032051 9BADBC FFFFFF FFFFFF",
        nombreEquipo: "QUILMES"
    },
    "qui/titular/blue": {
        codigo: "/colors blue 90 032051 9BADBC FFFFFF FFFFFF",
        nombreEquipo: "QUILMES"
    },
    "qui/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 004FC6 00215E 00215E",
        nombreEquipo: "QUILMES"
    },
    "qui/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 004FC6 00215E 00215E",
        nombreEquipo: "QUILMES"
    },
    "qui/tercera/red": {
        codigo: "/colors red 152 FFFFFF 2C2F36 15181F 2C2F36",
        nombreEquipo: "QUILMES"
    },
    "qui/tercera/blue": {
        codigo: "/colors blue 152 FFFFFF 2C2F36 15181F 2C2F36",
        nombreEquipo: "QUILMES"
    },

    // NUEVA CHICAGO
    "nch/titular/red": {
        codigo: "/colors red 360 FFFFFF 3AC991 000000 3AC991",
        nombreEquipo: "NUEVA CHICAGO"
    },
    "nch/titular/blue": {
        codigo: "/colors blue 360 FFFFFF 3AC991 000000 3AC991",
        nombreEquipo: "NUEVA CHICAGO"
    },

    // MORÓN
    "mor/titular/red": {
        codigo: "/colors red 90 242B35 FFFFFF E21C1C FFFFFF",
        nombreEquipo: "MORÓN"
    },
    "mor/titular/blue": {
        codigo: "/colors blue 90 242B35 FFFFFF E21C1C FFFFFF",
        nombreEquipo: "MORÓN"
    },

    // UNIÓN
    "uni/titular/red": {
        codigo: "/colors red 180 007FD6 DA251D FFFFFF DA251D",
        nombreEquipo: "UNIÓN"
    },
    "uni/titular/blue": {
        codigo: "/colors blue 180 007FD6 DA251D FFFFFF DA251D",
        nombreEquipo: "UNIÓN"
    },
    "uni/alternativa/red": {
        codigo: "/colors red 129 F2F3F5 ED1F29 0177CF 0295E3",
        nombreEquipo: "UNIÓN"
    },
    "uni/alternativa/blue": {
        codigo: "/colors blue 129 F2F3F5 ED1F29 0177CF 0295E3",
        nombreEquipo: "UNIÓN"
    },
    // COLÓN
    "csf/titular/red": {
        codigo: "/colors red 0 E0C069 C80000 000000",
        nombreEquipo: "COLÓN"
    },
    "csf/titular/blue": {
        codigo: "/colors blue 0 E0C069 C80000 000000",
        nombreEquipo: "COLÓN"
    },
    "csf/alternativa/red": {
        codigo: "/colors red 61 000000 7B0C1D FFFFFF FFFFFF",
        nombreEquipo: "COLÓN"
    },
    "csf/alternativa/blue": {
        codigo: "/colors blue 61 000000 7B0C1D FFFFFF FFFFFF",
        nombreEquipo: "COLÓN"
    },
    "csf/tercera/red": {
        codigo: "/colors red 60 F9C78C 18161B",
        nombreEquipo: "COLÓN"
    },
    "csf/tercera/blue": {
        codigo: "/colors blue 60 F9C78C 18161B",
        nombreEquipo: "COLÓN"
    },

    // ARSENAL DE SARANDÍ
    "arse/titular/red": {
        codigo: "/colors red 33 FFFFFF 00AEEF EE3E34 00AEEF",
        nombreEquipo: "ARSENAL DE SARANDÍ"
    },
    "arse/titular/blue": {
        codigo: "/colors blue 33 FFFFFF 00AEEF EE3E34 00AEEF",
        nombreEquipo: "ARSENAL DE SARANDÍ"
    },
    "arse/alternativa/red": {
        codigo: "/colors red 33 FFFFFF 1D1E1E F52626 1D1E1E",
        nombreEquipo: "ARSENAL DE SARANDÍ"
    },
    "arse/alternativa/blue": {
        codigo: "/colors blue 33 FFFFFF 1D1E1E F52626 1D1E1E",
        nombreEquipo: "ARSENAL DE SARANDÍ"
    },
    "arse/tercera/red": {
        codigo: "/colors red 180 E61B37 FFFFFF FFFFFF 3BA1F6",
        nombreEquipo: "ARSENAL DE SARANDÍ"
    },
    "arse/tercera/blue": {
        codigo: "/colors blue 180 E61B37 FFFFFF FFFFFF 3BA1F6",
        nombreEquipo: "ARSENAL DE SARANDÍ"
    },

    // DOCK SUD
    "doc/titular/red": {
        codigo: "/colors red 180 FFFFFF 254494 F3C706 254494",
        nombreEquipo: "DOCK SUD"
    },
    "doc/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 254494 F3C706 254494",
        nombreEquipo: "DOCK SUD"
    },

    // COLOMBIA
    "col/titular/red": {
        codigo: "/colors red 240 3C4462 FDFD02",
        nombreEquipo: "COLOMBIA"
    },
    "col/titular/blue": {
        codigo: "/colors blue 240 3C4462 FDFD02",
        nombreEquipo: "COLOMBIA"
    },
    "col/alternativa/red": {
        codigo: "/colors red 60 F1EB56 3671AF 3168A0 1E477C",
        nombreEquipo: "COLOMBIA"
    },
    "col/alternativa/blue": {
        codigo: "/colors blue 60 F1EB56 3671AF 3168A0 1E477C",
        nombreEquipo: "COLOMBIA"
    },
    "col/bandera/red": {
        codigo: "/colors red 90 FFFFFF FCD116 003893 CE1126",
        nombreEquipo: "COLOMBIA"
    },
    "col/bandera/blue": {
        codigo: "/colors blue 90 FFFFFF FCD116 003893 CE1126",
        nombreEquipo: "COLOMBIA"
    },

    // PERÚ
    "per/titular/red": {
        codigo: "/colors red 52 000000 FFFFFF DF1117 FFFFFF",
        nombreEquipo: "PERÚ"
    },
    "per/titular/blue": {
        codigo: "/colors blue 52 000000 FFFFFF DF1117 FFFFFF",
        nombreEquipo: "PERÚ"
    },
    "per/alternativa/red": {
        codigo: "/colors red 52 000000 DC1E1E FFFFFF DC1E1E",
        nombreEquipo: "PERÚ"
    },
    "per/alternativa/blue": {
        codigo: "/colors blue 52 000000 DC1E1E FFFFFF DC1E1E",
        nombreEquipo: "PERÚ"
    },

    // WEST BROM
    "wba/titular/red": {
        codigo: "/colors red 180 DE2B2E FFFFFF 1B2A41 FFFFFF",
        nombreEquipo: "WEST BROM"
    },
    "wba/titular/blue": {
        codigo: "/colors blue 180 DE2B2E FFFFFF 1B2A41 FFFFFF",
        nombreEquipo: "WEST BROM"
    },

    // ASTON VILLA
    "avl/titular/red": {
        codigo: "/colors red 130 FFFFFF C5DBF3 97012F 6A0D2A",
        nombreEquipo: "ASTON VILLA"
    },
    "avl/titular/blue": {
        codigo: "/colors blue 130 FFFFFF C5DBF3 97012F 6A0D2A",
        nombreEquipo: "ASTON VILLA"
    },

    // FULHAM FC
    "ful/titular/red": {
        codigo: "/colors red 90 1E202C F0EFF5",
        nombreEquipo: "FULHAM FC"
    },
    "ful/titular/blue": {
        codigo: "/colors blue 90 1E202C F0EFF5",
        nombreEquipo: "FULHAM FC"
    },
    "ful/alternativa/red": {
        codigo: "/colors red 180 FFFFFF C71B29 372729 C71B29",
        nombreEquipo: "FULHAM FC"
    },
    "ful/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF C71B29 372729 C71B29",
        nombreEquipo: "FULHAM FC"
    },
    "ful/clasica/red": {
        codigo: "/colors red 180 E41B15 000000 FFFFFF 000000",
        nombreEquipo: "FULHAM FC"
    },
    "ful/clasica/blue": {
        codigo: "/colors blue 180 E41B15 000000 FFFFFF 000000",
        nombreEquipo: "FULHAM FC"
    },

    // LEICESTER
    "lei/titular/red": {
        codigo: "/colors red 270 FFFFFF 364CFA 3035FF",
        nombreEquipo: "LEICESTER"
    },
    "lei/titular/blue": {
        codigo: "/colors blue 270 FFFFFF 364CFA 3035FF",
        nombreEquipo: "LEICESTER"
    },

    // DANUBIO
    "dan/titular/red": {
        codigo: "/colors red 50 DB0D24 FFFFFF 131514 FFFFFF",
        nombreEquipo: "DANUBIO"
    },
    "dan/titular/blue": {
        codigo: "/colors blue 50 DB0D24 FFFFFF 131514 FFFFFF",
        nombreEquipo: "DANUBIO"
    },

    // RAMPLA JRS
    "ram/titular/red": {
        codigo: "/colors red 180 FFFFFF FF2E3B 1D836D FF2E3B",
        nombreEquipo: "RAMPLA JRS"
    },
    "ram/titular/blue": {
        codigo: "/colors blue 180 FFFFFF FF2E3B 1D836D FF2E3B",
        nombreEquipo: "RAMPLA JRS"
    },

    // SACACHISPAS
    "sch/titular/red": {
        codigo: "/colors red 180 201766 C8B8F8 FFFFFF C8B8F8",
        nombreEquipo: "SACACHISPAS"
    },
    "sch/titular/blue": {
        codigo: "/colors blue 180 201766 C8B8F8 FFFFFF C8B8F8",
        nombreEquipo: "SACACHISPAS"
    },
    "sch/alternativa/red": {
        codigo: "/colors red 56 FFFFFF 5944A5 AF94D9",
        nombreEquipo: "SACACHISPAS"
    },
    "sch/alternativa/blue": {
        codigo: "/colors blue 56 FFFFFF 5944A5 AF94D9",
        nombreEquipo: "SACACHISPAS"
    },

    // HOLANDA
    "hol/titular/red": {
        codigo: "/colors red 66 221817 FEA304 FEB71E FFE064",
        nombreEquipo: "HOLANDA"
    },
    "hol/titular/blue": {
        codigo: "/colors blue 66 221817 FEA304 FEB71E FFE064",
        nombreEquipo: "HOLANDA"
    },
    "hol/alternativa/red": {
        codigo: "/colors red 90 FF7309 1D1D1F",
        nombreEquipo: "HOLANDA"
    },
    "hol/alternativa/blue": {
        codigo: "/colors blue 90 FF7309 1D1D1F",
        nombreEquipo: "HOLANDA"
    },
    "hol/alternativa/2019/red": {
        codigo: "/colors red 90 0D285F 4ECDE4 47BAD9 3CA1C7",
        nombreEquipo: "HOLANDA"
    },
    "hol/alternativa/2019/blue": {
        codigo: "/colors blue 90 0D285F 4ECDE4 47BAD9 3CA1C7",
        nombreEquipo: "HOLANDA"
    },
    "hol/retro/red": {
        codigo: "/colors red 90 2E2624 F87032 F7965F F2BEA6",
        nombreEquipo: "HOLANDA"
    },
    "hol/retro/blue": {
        codigo: "/colors blue 90 2E2624 F87032 F7965F F2BEA6",
        nombreEquipo: "HOLANDA"
    },
    "hol/bandera/red": {
        codigo: "/colors red 90 000000 AE1C28 FFFFFF 21468B",
        nombreEquipo: "HOLANDA"
    },
    "hol/bandera/blue": {
        codigo: "/colors blue 90 000000 AE1C28 FFFFFF 21468B",
        nombreEquipo: "HOLANDA"
    },
    "hol/titular/2014/red": {
        codigo: "/colors red 240 F9F8F6 FF6F1C",
        nombreEquipo: "HOLANDA"
    },
    "hol/titular/2014/blue": {
        codigo: "/colors blue 240 F9F8F6 FF6F1C",
        nombreEquipo: "HOLANDA"
    },
// BOLIVIA
    "bol/titular/red": {
        codigo: "/colors red 180 FFFFFF 26A057",
        nombreEquipo: "BOLIVIA"
    },
    "bol/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 26A057",
        nombreEquipo: "BOLIVIA"
    },

// ITALIA
    "ita/titular/red": {
        codigo: "/colors red 65 F1F3F2 167ED0 1268BF 0959B8",
        nombreEquipo: "ITALIA"
    },
    "ita/titular/blue": {
        codigo: "/colors blue 65 F1F3F2 167ED0 1268BF 0959B8",
        nombreEquipo: "ITALIA"
    },
    "ita/alternativa/red": {
        codigo: "/colors red 69 004FAC 213651 F4F4F2 F4F4F2",
        nombreEquipo: "ITALIA"
    },
    "ita/alternativa/blue": {
        codigo: "/colors blue 69 004FAC 213651 F4F4F2 F4F4F2",
        nombreEquipo: "ITALIA"
    },
    "ita/bandera/red": {
        codigo: "/colors red 0 0064AA 009E3F FFFFFF E40321",
        nombreEquipo: "ITALIA"
    },
    "ita/bandera/blue": {
        codigo: "/colors blue 0 0064AA 009E3F FFFFFF E40321",
        nombreEquipo: "ITALIA"
    },

// INGLATERRA
    "ing/titular/red": {
        codigo: "/colors red 180 F3010F F8F8F8",
        nombreEquipo: "INGLATERRA"
    },
    "ing/titular/blue": {
        codigo: "/colors blue 180 F3010F F8F8F8",
        nombreEquipo: "INGLATERRA"
    },
    "ing/alternativa/red": {
        codigo: "/colors red 60 F2F4F3 F4080A",
        nombreEquipo: "INGLATERRA"
    },
    "ing/alternativa/blue": {
        codigo: "/colors blue 60 F2F4F3 F4080A",
        nombreEquipo: "INGLATERRA"
    },

// PARAGUAY
    "pgy/titular/red": {
        codigo: "/colors red 180 0380DC F61527 FFFFFF F61527",
        nombreEquipo: "PARAGUAY"
    },
    "pgy/titular/blue": {
        codigo: "/colors blue 180 0380DC F61527 FFFFFF F61527",
        nombreEquipo: "PARAGUAY"
    },
    "pgy/alternativa/red": {
        codigo: "/colors red 55 FFFFFF 024EAE 024EAE 033C9A",
        nombreEquipo: "PARAGUAY"
    },
    "pgy/alternativa/blue": {
        codigo: "/colors blue 55 FFFFFF 024EAE 024EAE 033C9A",
        nombreEquipo: "PARAGUAY"
    },

// VENEZUELA
    "ven/titular/red": {
        codigo: "/colors red 180 FFFFFF 8F021D",
        nombreEquipo: "VENEZUELA"
    },
    "ven/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 8F021D",
        nombreEquipo: "VENEZUELA"
    },
    "ven/alternativa/red": {
        codigo: "/colors red 90 8F2937 F8FAF9 F8FAF9 F3F5F4",
        nombreEquipo: "VENEZUELA"
    },
    "ven/alternativa/blue": {
        codigo: "/colors blue 90 8F2937 F8FAF9 F8FAF9 F3F5F4",
        nombreEquipo: "VENEZUELA"
    },

// QATAR
    "qat/titular/red": {
        codigo: "/colors red 90 F1EFF4 9B003C 940139 940139",
        nombreEquipo: "QATAR"
    },
    "qat/titular/blue": {
        codigo: "/colors blue 90 F1EFF4 9B003C 940139 940139",
        nombreEquipo: "QATAR"
    },
    "qat/alternativa/red": {
        codigo: "/colors red 90 9B232F FFFFFF",
        nombreEquipo: "QATAR"
    },
    "qat/alternativa/blue": {
        codigo: "/colors blue 90 9B232F FFFFFF",
        nombreEquipo: "QATAR"
    },

// AJAX
    "aja/titular/red": {
        codigo: "/colors red 180 B8BCC2 FCFAFC E11025 FCFAFC",
        nombreEquipo: "AJAX"
    },
    "aja/titular/blue": {
        codigo: "/colors blue 180 B8BCC2 FCFAFC E11025 FCFAFC",
        nombreEquipo: "AJAX"
    },
    "aja/alternativa/red": {
        codigo: "/colors red 180 EE7024 255459 05707C 255459",
        nombreEquipo: "AJAX"
    },
    "aja/alternativa/blue": {
        codigo: "/colors blue 180 EE7024 255459 05707C 255459",
        nombreEquipo: "AJAX"
    },

// PSV
    "psv/titular/red": {
        codigo: "/colors red 180 030303 FFFFFF FA2747 FFFFFF",
        nombreEquipo: "PSV"
    },
    "psv/titular/blue": {
        codigo: "/colors blue 180 030303 FFFFFF FA2747 FFFFFF",
        nombreEquipo: "PSV"
    },
    // FEYENOORD
    "fey/titular/red": {
        codigo: "/colors red 180 000000 FFFFFF FA203B",
        nombreEquipo: "FEYENOORD"
    },
    "fey/titular/blue": {
        codigo: "/colors blue 180 000000 FFFFFF FA203B",
        nombreEquipo: "FEYENOORD"
    },

    // PSG
    "psg/titular/red": {
        codigo: "/colors red 180 F4F5F7 25406C 203C65 25406C",
        nombreEquipo: "PSG"
    },
    "psg/titular/blue": {
        codigo: "/colors blue 180 F4F5F7 25406C 203C65 25406C",
        nombreEquipo: "PSG"
    },
    "psg/alternativa/red": {
        codigo: "/colors red 180 3B363C F5F4F9 FFD4E5 F5F4F9",
        nombreEquipo: "PSG"
    },
    "psg/alternativa/blue": {
        codigo: "/colors blue 180 3B363C F5F4F9 FFD4E5 F5F4F9",
        nombreEquipo: "PSG"
    },
    "psg/tercera/red": {
        codigo: "/colors red 90 F5F5F7 26252B 75767E 26252B",
        nombreEquipo: "PSG"
    },
    "psg/tercera/blue": {
        codigo: "/colors blue 90 F5F5F7 26252B 75767E 26252B",
        nombreEquipo: "PSG"
    },

    // DEPORTIVO RIESTRA
    "rie/titular/red": {
        codigo: "/colors red 40 FFFFFF 1D1C21",
        nombreEquipo: "DEP. RIESTRA"
    },
    "rie/titular/blue": {
        codigo: "/colors blue 40 FFFFFF 1D1C21",
        nombreEquipo: "DEP. RIESTRA"
    },
    "rie/alternativa/red": {
        codigo: "/colors red 40 19161B FDFDFD",
        nombreEquipo: "DEP. RIESTRA"
    },
    "rie/alternativa/blue": {
        codigo: "/colors blue 40 19161B FDFDFD",
        nombreEquipo: "DEP. RIESTRA"
    },

    // CENTRAL CÓRDOBA
    "ccs/titular/red": {
        codigo: "/colors red 180 C22B34 231F20 FFFFFF 231F20",
        nombreEquipo: "CENTRAL CÓRDOBA"
    },
    "ccs/titular/blue": {
        codigo: "/colors blue 180 C22B34 231F20 FFFFFF 231F20",
        nombreEquipo: "CENTRAL CÓRDOBA"
    },
    "ccs/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 9C181C 9C181C C02122",
        nombreEquipo: "CENTRAL CÓRDOBA"
    },
    "ccs/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 9C181C 9C181C C02122",
        nombreEquipo: "CENTRAL CÓRDOBA"
    },
    "ccs/tercera/red": {
        codigo: "/colors red 50 CA0009 E7E7E7 FBFBFB",
        nombreEquipo: "CENTRAL CÓRDOBA"
    },
    "ccs/tercera/blue": {
        codigo: "/colors blue 50 CA0009 E7E7E7 FBFBFB",
        nombreEquipo: "CENTRAL CÓRDOBA"
    },

    // OGC NICE
    "ogc/titular/red": {
        codigo: "/colors red 180 FFFFFF FD2725 0C0D11 FD2725",
        nombreEquipo: "OGC NICE"
    },
    "ogc/titular/blue": {
        codigo: "/colors blue 180 FFFFFF FD2725 0C0D11 FD2725",
        nombreEquipo: "OGC NICE"
    },

    // OLYMPIQUE MARSELLA
    "om/titular/red": {
        codigo: "/colors red 72 43CEEC 29CCF1 F6F4FC F6F4FC",
        nombreEquipo: "OLYMPIQUE MARSELLA"
    },
    "om/titular/blue": {
        codigo: "/colors blue 72 43CEEC 29CCF1 F6F4FC F6F4FC",
        nombreEquipo: "OLYMPIQUE MARSELLA"
    },
    "om/alternativa/red": {
        codigo: "/colors red 61 FFFFFF 24ADEA 1473E5",
        nombreEquipo: "OLYMPIQUE MARSELLA"
    },
    "om/alternativa/blue": {
        codigo: "/colors blue 61 FFFFFF 24ADEA 1473E5",
        nombreEquipo: "OLYMPIQUE MARSELLA"
    },

    // AS ROMA
    "rom/titular/red": {
        codigo: "/colors red 0 FFB200 8F001C",
        nombreEquipo: "AS ROMA"
    },
    "rom/titular/blue": {
        codigo: "/colors blue 0 FFB200 8F001C",
        nombreEquipo: "AS ROMA"
    },
    "rom/alternativa/red": {
        codigo: "/colors red 180 6E0F19 F6F7FA",
        nombreEquipo: "AS ROMA"
    },
    "rom/alternativa/blue": {
        codigo: "/colors blue 180 6E0F19 F6F7FA",
        nombreEquipo: "AS ROMA"
    },
    "rom/tercera/red": {
        codigo: "/colors red 90 F9B105 172952 1C2446",
        nombreEquipo: "AS ROMA"
    },
    "rom/tercera/blue": {
        codigo: "/colors blue 90 F9B105 172952 1C2446",
        nombreEquipo: "AS ROMA"
    },

    // FIORENTINA
    "fio/titular/red": {
        codigo: "/colors red 180 FFFFFF 55338A",
        nombreEquipo: "FIORENTINA"
    },
    "fio/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 55338A",
        nombreEquipo: "FIORENTINA"
    },
    "fio/alternativa/red": {
        codigo: "/colors red 90 8559BD FFFFFF 422A6E FFFFFF",
        nombreEquipo: "FIORENTINA"
    },
    "fio/alternativa/blue": {
        codigo: "/colors blue 90 8559BD FFFFFF 422A6E FFFFFF",
        nombreEquipo: "FIORENTINA"
    },

    // LAZIO
    "laz/titular/red": {
        codigo: "/colors red 180 FFFFFF 81C6EE 8CCAEE 81C6EE",
        nombreEquipo: "LAZIO"
    },
    "laz/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 81C6EE 8CCAEE 81C6EE",
        nombreEquipo: "LAZIO"
    },
    "laz/alternativa/red": {
        codigo: "/colors red 90 1E2E50 FFFFFF 86BBEF FFFFFF",
        nombreEquipo: "LAZIO"
    },
    "laz/alternativa/blue": {
        codigo: "/colors blue 90 1E2E50 FFFFFF 86BBEF FFFFFF",
        nombreEquipo: "LAZIO"
    },
    "laz/tercera/red": {
        codigo: "/colors red 90 C3E9FE 0F1217",
        nombreEquipo: "LAZIO"
    },
    "laz/tercera/blue": {
        codigo: "/colors blue 90 C3E9FE 0F1217",
        nombreEquipo: "LAZIO"
    },

    // SAN MARTÍN (SJ)
    "smsj/titular/red": {
        codigo: "/colors red 180 FFFFFF 131311 4EA280 131311",
        nombreEquipo: "SAN MARTIN (SJ)"
    },
    "smsj/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 131311 4EA280 131311",
        nombreEquipo: "SAN MARTIN (SJ)"
    },
    "smsj/alternativa/red": {
        codigo: "/colors red 180 030303 FFFFFF 48C079 FFFFFF",
        nombreEquipo: "SAN MARTIN (SJ)"
    },
    "smsj/alternativa/blue": {
        codigo: "/colors blue 180 030303 FFFFFF 48C079 FFFFFF",
        nombreEquipo: "SAN MARTIN (SJ)"
    },

    // GODOY CRUZ
    "god/titular/red": {
        codigo: "/colors red 180 73B0E1 096FCC FFFFFF 096FCC",
        nombreEquipo: "GODOY CRUZ"
    },
    "god/titular/blue": {
        codigo: "/colors blue 180 73B0E1 096FCC FFFFFF 096FCC",
        nombreEquipo: "GODOY CRUZ"
    },
    "god/alternativa/red": {
        codigo: "/colors red 90 055BD2 0060C7 FFFFFF FFFFFF",
        nombreEquipo: "GODOY CRUZ"
    },
    "god/alternativa/blue": {
        codigo: "/colors blue 90 055BD2 0060C7 FFFFFF FFFFFF",
        nombreEquipo: "GODOY CRUZ"
    },
    "god/tercera/red": {
        codigo: "/colors red 90 FFFFFF 881325 5F0D1A 881325",
        nombreEquipo: "GODOY CRUZ"
    },
    "god/tercera/blue": {
        codigo: "/colors blue 90 FFFFFF 881325 5F0D1A 881325",
        nombreEquipo: "GODOY CRUZ"
    },

    // VÉLEZ
    "vel/titular/red": {
        codigo: "/colors red 180 0063A8 FFFFFF",
        nombreEquipo: "VÉLEZ"
    },
    "vel/titular/blue": {
        codigo: "/colors blue 180 0063A8 FFFFFF",
        nombreEquipo: "VÉLEZ"
    },
    "vel/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 2C3EA2 2E42B5 3248C4",
        nombreEquipo: "VÉLEZ"
    },
    "vel/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 2C3EA2 2E42B5 3248C4",
        nombreEquipo: "VÉLEZ"
    },
    "vel/tercera/red": {
        codigo: "/colors red 0 000000 097C7F FFFFFF F11931",
        nombreEquipo: "VÉLEZ"
    },
    "vel/tercera/blue": {
        codigo: "/colors blue 0 000000 097C7F FFFFFF F11931",
        nombreEquipo: "VÉLEZ"
    },

    // FLAMENGO
    "fla/titular/red": {
        codigo: "/colors red 90 FFFFFF DD0125 211F25 DD0125",
        nombreEquipo: "FLAMENGO"
    },
    "fla/titular/blue": {
        codigo: "/colors blue 90 FFFFFF DD0125 211F25 DD0125",
        nombreEquipo: "FLAMENGO"
    },
    "fla/alternativa/red": {
        codigo: "/colors red 90 DE111E EEEFF1 1B1F1F 872C32",
        nombreEquipo: "FLAMENGO"
    },
    "fla/alternativa/blue": {
        codigo: "/colors blue 90 DE111E EEEFF1 1B1F1F 872C32",
        nombreEquipo: "FLAMENGO"
    },
    "fla/tercera/red": {
        codigo: "/colors red 90 C1E23F 36363C",
        nombreEquipo: "FLAMENGO"
    },
    "fla/tercera/blue": {
        codigo: "/colors blue 90 C1E23F 36363C",
        nombreEquipo: "FLAMENGO"
    },
    // SC INTERNACIONAL
    "sci/titular/red": {
        codigo: "/colors red 90 FFFFFF FF020C",
        nombreEquipo: "SC INTERNACIONAL"
    },
    "sci/titular/blue": {
        codigo: "/colors blue 90 FFFFFF FF020C",
        nombreEquipo: "SC INTERNACIONAL"
    },
    "sci/alternativa/red": {
        codigo: "/colors red 64 66020A F9F9FA C71B20 F9F9FA",
        nombreEquipo: "SC INTERNACIONAL"
    },
    "sci/alternativa/blue": {
        codigo: "/colors blue 64 66020A F9F9FA C71B20 F9F9FA",
        nombreEquipo: "SC INTERNACIONAL"
    },

    // SANTOS FC
    "san/titular/red": {
        codigo: "/colors red 90 3B4043 F1F5F6",
        nombreEquipo: "SANTOS FC"
    },
    "san/titular/blue": {
        codigo: "/colors blue 90 3B4043 F1F5F6",
        nombreEquipo: "SANTOS FC"
    },
    "san/alternativa/red": {
        codigo: "/colors red 180 D6BD62 2C2B33 F9F8FD 2C2B33",
        nombreEquipo: "SANTOS FC"
    },
    "san/alternativa/blue": {
        codigo: "/colors blue 180 D6BD62 2C2B33 F9F8FD 2C2B33",
        nombreEquipo: "SANTOS FC"
    },
    "san/tercera/red": {
        codigo: "/colors red 225 A7ADB1 282A35 282A35 393C45",
        nombreEquipo: "SANTOS FC"
    },
    "san/tercera/blue": {
        codigo: "/colors blue 225 A7ADB1 282A35 282A35 393C45",
        nombreEquipo: "SANTOS FC"
    },

    // SAO PAULO
    "sao/titular/red": {
        codigo: "/colors red 90 3C3B3E F91E0B F5F5F5 1C1D21",
        nombreEquipo: "SAO PAULO"
    },
    "sao/titular/blue": {
        codigo: "/colors blue 90 3C3B3E F91E0B F5F5F5 1C1D21",
        nombreEquipo: "SAO PAULO"
    },
    "sao/alternativa/red": {
        codigo: "/colors red 180 F2273A 221C1E EAE8EB ED2436",
        nombreEquipo: "SAO PAULO"
    },
    "sao/alternativa/blue": {
        codigo: "/colors blue 180 F2273A 221C1E EAE8EB ED2436",
        nombreEquipo: "SAO PAULO"
    },

    // CORINTHIANS
    "cor/titular/red": {
        codigo: "/colors red 90 000000 F4F4F6",
        nombreEquipo: "CORINTHIANS"
    },
    "cor/titular/blue": {
        codigo: "/colors blue 90 000000 F4F4F6",
        nombreEquipo: "CORINTHIANS"
    },
    "cor/alternativa/red": {
        codigo: "/colors red 360 FFFFFF 1F1E20",
        nombreEquipo: "CORINTHIANS"
    },
    "cor/alternativa/blue": {
        codigo: "/colors blue 360 FFFFFF 1F1E20",
        nombreEquipo: "CORINTHIANS"
    },

    // VASCO DA GAMA
    "vas/titular/red": {
        codigo: "/colors red 29 D42A2A 19181B E6E6E4 19181B",
        nombreEquipo: "VASCO DA GAMA"
    },
    "vas/titular/blue": {
        codigo: "/colors blue 29 D42A2A 19181B E6E6E4 19181B",
        nombreEquipo: "VASCO DA GAMA"
    },
    "vas/alternativa/red": {
        codigo: "/colors red 29 D42A2A FEFEFE 1C1C1C FEFEFE",
        nombreEquipo: "VASCO DA GAMA"
    },
    "vas/alternativa/blue": {
        codigo: "/colors blue 29 D42A2A FEFEFE 1C1C1C FEFEFE",
        nombreEquipo: "VASCO DA GAMA"
    },

    // BOTAFOGO
    "bot/titular/red": {
        codigo: "/colors red 180 777B87 1C1F26 FFFFFF 1C1F26",
        nombreEquipo: "BOTAFOGO"
    },
    "bot/titular/blue": {
        codigo: "/colors blue 180 777B87 1C1F26 FFFFFF 1C1F26",
        nombreEquipo: "BOTAFOGO"
    },
    "bot/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 161719",
        nombreEquipo: "BOTAFOGO"
    },
    "bot/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 161719",
        nombreEquipo: "BOTAFOGO"
    },

    // FLUMINENSE
    "flu/titular/red": {
        codigo: "/colors red 180 FFFFFF 9E0424 1C6137 9E0424",
        nombreEquipo: "FLUMINENSE"
    },
    "flu/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 9E0424 1C6137 9E0424",
        nombreEquipo: "FLUMINENSE"
    },

    // MINEIRO
    "cam/titular/red": {
        codigo: "/colors red 180 F21828 EFF2F7 2B2529 EFF2F7",
        nombreEquipo: "MINEIRO"
    },
    "cam/titular/blue": {
        codigo: "/colors blue 180 F21828 EFF2F7 2B2529 EFF2F7",
        nombreEquipo: "MINEIRO"
    },
    "cam/alternativa/red": {
        codigo: "/colors red 180 1D1E24 FFFFFF",
        nombreEquipo: "MINEIRO"
    },
    "cam/alternativa/blue": {
        codigo: "/colors blue 180 1D1E24 FFFFFF",
        nombreEquipo: "MINEIRO"
    },

    // ATLÉTICO NACIONAL (COL)
    "atn/titular/red": {
        codigo: "/colors red 180 B2C9BB 178B36 FCFCFC 178B36",
        nombreEquipo: "ATL. NACIONAL (COL)"
    },
    "atn/titular/blue": {
        codigo: "/colors blue 180 B2C9BB 178B36 FCFCFC 178B36",
        nombreEquipo: "ATL. NACIONAL (COL)"
    },
    "atn/alternativa/red": {
        codigo: "/colors red -136 008A26 F6F6F8 E6E8EA",
        nombreEquipo: "ATL. NACIONAL (COL)"
    },
    "atn/alternativa/blue": {
        codigo: "/colors blue -136 008A26 F6F6F8 E6E8EA",
        nombreEquipo: "ATL. NACIONAL (COL)"
    },

    // MILLONARIOS
    "mil/titular/red": {
        codigo: "/colors red 180 FFFFFF 0846AD",
        nombreEquipo: "MILLONARIOS"
    },
    "mil/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 0846AD",
        nombreEquipo: "MILLONARIOS"
    },
    "mil/alternativa/red": {
        codigo: "/colors red 180 093794 F7F7F7",
        nombreEquipo: "MILLONARIOS"
    },
    "mil/alternativa/blue": {
        codigo: "/colors blue 180 093794 F7F7F7",
        nombreEquipo: "MILLONARIOS"
    },

    // AMÉRICA DE CALI
    "ame/titular/red": {
        codigo: "/colors red 60 FFFFFF E81B1D",
        nombreEquipo: "AMÉRICA DE CALI"
    },
    "ame/titular/blue": {
        codigo: "/colors blue 60 FFFFFF E81B1D",
        nombreEquipo: "AMÉRICA DE CALI"
    },
    "ame/alternativa/red": {
        codigo: "/colors red 60 C91212 F8F8F8",
        nombreEquipo: "AMÉRICA DE CALI"
    },
    "ame/alternativa/blue": {
        codigo: "/colors blue 60 C91212 F8F8F8",
        nombreEquipo: "AMÉRICA DE CALI"
    },

    // SANTA FE (COL)
    "sfe/titular/red": {
        codigo: "/colors red 90 E0E0E0 F6F6F8 EB0505 EB0505",
        nombreEquipo: "SANTA FE (COL)"
    },
    "sfe/titular/blue": {
        codigo: "/colors blue 90 E0E0E0 F6F6F8 EB0505 EB0505",
        nombreEquipo: "SANTA FE (COL)"
    },
    "sfe/alternativa/red": {
        codigo: "/colors red 90 EB0505 EB0505 FFFFFF FFFFFF",
        nombreEquipo: "SANTA FE (COL)"
    },
    "sfe/alternativa/blue": {
        codigo: "/colors blue 90 EB0505 EB0505 FFFFFF FFFFFF",
        nombreEquipo: "SANTA FE (COL)"
    },

    // DEPORTIVO CALI
    "cal/titular/red": {
        codigo: "/colors red 90 FFFFFF 05393C 013037 05393C",
        nombreEquipo: "DEPORTIVO CALI"
    },
    "cal/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 05393C 013037 05393C",
        nombreEquipo: "DEPORTIVO CALI"
    },
    "cal/alternativa/red": {
        codigo: "/colors red 90 1B474B EFEFEF FFFFFF EFEFEF",
        nombreEquipo: "DEPORTIVO CALI"
    },
    "cal/alternativa/blue": {
        codigo: "/colors blue 90 1B474B EFEFEF FFFFFF EFEFEF",
        nombreEquipo: "DEPORTIVO CALI"
    },
    "cal/tercera/red": {
        codigo: "/colors red 90 4E514D 7DF356",
        nombreEquipo: "DEPORTIVO CALI"
    },
    "cal/tercera/blue": {
        codigo: "/colors blue 90 4E514D 7DF356",
        nombreEquipo: "DEPORTIVO CALI"
    },

    // ONCE CALDAS
    "onc/titular/red": {
        codigo: "/colors red 180 171717 FFFFFF",
        nombreEquipo: "ONCE CALDAS"
    },
    "onc/titular/blue": {
        codigo: "/colors blue 180 171717 FFFFFF",
        nombreEquipo: "ONCE CALDAS"
    },
    "onc/alternativa/red": {
        codigo: "/colors red 40 FFFFFF 171717",
        nombreEquipo: "ONCE CALDAS"
    },
    "onc/alternativa/blue": {
        codigo: "/colors blue 40 FFFFFF 171717",
        nombreEquipo: "ONCE CALDAS"
    },
    "onc/tercera/red": {
        codigo: "/colors red 40 FFFFFF 1C69BB",
        nombreEquipo: "ONCE CALDAS"
    },
    "onc/tercera/blue": {
        codigo: "/colors blue 40 FFFFFF 1C69BB",
        nombreEquipo: "ONCE CALDAS"
    },

    // CERRO PORTEÑO
    "ccp/titular/red": {
        codigo: "/colors red 180 FFFFFF E10602 00158C E10602",
        nombreEquipo: "CERRO PORTEÑO"
    },
    "ccp/titular/blue": {
        codigo: "/colors blue 180 FFFFFF E10602 00158C E10602",
        nombreEquipo: "CERRO PORTEÑO"
    },
    "ccp/alternativa/red": {
        codigo: "/colors red 60 1A3E7A FFFFFF",
        nombreEquipo: "CERRO PORTEÑO"
    },
    "ccp/alternativa/blue": {
        codigo: "/colors blue 60 1A3E7A FFFFFF",
        nombreEquipo: "CERRO PORTEÑO"
    },

    // OLIMPIA
    "oli/titular/red": {
        codigo: "/colors red 90 A28026 FFFFFF 0D0D0D FFFFFF",
        nombreEquipo: "OLIMPIA"
    },
    "oli/titular/blue": {
        codigo: "/colors blue 90 A28026 FFFFFF 0D0D0D FFFFFF",
        nombreEquipo: "OLIMPIA"
    },
    "oli/alternativa/red": {
        codigo: "/colors red 40 FFFFFF 48424C",
        nombreEquipo: "OLIMPIA"
    },
    "oli/alternativa/blue": {
        codigo: "/colors blue 40 FFFFFF 48424C",
        nombreEquipo: "OLIMPIA"
    },

    // GUARANÍ
    "gua/titular/red": {
        codigo: "/colors red 180 FFFFFF FDD537 1C1B16 FDD537",
        nombreEquipo: "GUARANÍ"
    },
    "gua/titular/blue": {
        codigo: "/colors blue 180 FFFFFF FDD537 1C1B16 FDD537",
        nombreEquipo: "GUARANÍ"
    },
    "gua/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 504B48 201F1B 504B48",
        nombreEquipo: "GUARANÍ"
    },
    "gua/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 504B48 201F1B 504B48",
        nombreEquipo: "GUARANÍ"
    },
    // LIBERTAD
    "lib/titular/red": {
        codigo: "/colors red 180 5D636E FFFFFF 16161E FFFFFF",
        nombreEquipo: "LIBERTAD"
    },
    "lib/titular/blue": {
        codigo: "/colors blue 180 5D636E FFFFFF 16161E FFFFFF",
        nombreEquipo: "LIBERTAD"
    },
    "lib/alternativa/red": {
        codigo: "/colors red 40 FFFFFF 171B1E",
        nombreEquipo: "LIBERTAD"
    },
    "lib/alternativa/blue": {
        codigo: "/colors blue 40 FFFFFF 171B1E",
        nombreEquipo: "LIBERTAD"
    },

    // SOUTHAMPTON
    "sou/titular/red": {
        codigo: "/colors red 180 191B1F FF0028 FFFFFF FF0028",
        nombreEquipo: "SOUTHAMPTON"
    },
    "sou/titular/blue": {
        codigo: "/colors blue 180 191B1F FF0028 FFFFFF FF0028",
        nombreEquipo: "SOUTHAMPTON"
    },
    "sou/alternativa/red": {
        codigo: "/colors red 90 E2FB40 FDFE4B 283639 283639",
        nombreEquipo: "SOUTHAMPTON"
    },
    "sou/alternativa/blue": {
        codigo: "/colors blue 90 E2FB40 FDFE4B 283639 283639",
        nombreEquipo: "SOUTHAMPTON"
    },

    // WATFORD
    "wat/titular/red": {
        codigo: "/colors red 180 F53117 FADF09 161616",
        nombreEquipo: "WATFORD"
    },
    "wat/titular/blue": {
        codigo: "/colors blue 180 F53117 FADF09 161616",
        nombreEquipo: "WATFORD"
    },

    // WILLEM II
    "wil/titular/red": {
        codigo: "/colors red 180 0A0A0A 223263 FFFFFF F7014C",
        nombreEquipo: "WILLEM II"
    },
    "wil/titular/blue": {
        codigo: "/colors blue 180 0A0A0A 223263 FFFFFF F7014C",
        nombreEquipo: "WILLEM II"
    },
    "wil/alternativa/red": {
        codigo: "/colors red 180 FFFFFF A42F62 6B436F A42F62",
        nombreEquipo: "WILLEM II"
    },
    "wil/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF A42F62 6B436F A42F62",
        nombreEquipo: "WILLEM II"
    },
    "wil/tercera/red": {
        codigo: "/colors red 90 C09926 C72C27 FFFFFF 0A2245",
        nombreEquipo: "WILLEM II"
    },
    "wil/tercera/blue": {
        codigo: "/colors blue 90 C09926 C72C27 FFFFFF 0A2245",
        nombreEquipo: "WILLEM II"
    },

    // ALVARADO
    "alv/titular/red": {
        codigo: "/colors red 44 091021 1E2F55 FFFFFF 1E2F55",
        nombreEquipo: "ALVARADO"
    },
    "alv/titular/blue": {
        codigo: "/colors blue 44 091021 1E2F55 FFFFFF 1E2F55",
        nombreEquipo: "ALVARADO"
    },
    "alv/alternativa/red": {
        codigo: "/colors red 33 091021 FFFFFF 022C77 FFFFFF",
        nombreEquipo: "ALVARADO"
    },
    "alv/alternativa/blue": {
        codigo: "/colors blue 33 091021 FFFFFF 022C77 FFFFFF",
        nombreEquipo: "ALVARADO"
    },

    // AGROPECUARIO
    "agr/titular/red": {
        codigo: "/colors red 180 FCFCFC 168C4B BA2C24 168C4B",
        nombreEquipo: "AGROPECUARIO"
    },
    "agr/titular/blue": {
        codigo: "/colors blue 180 FCFCFC 168C4B BA2C24 168C4B",
        nombreEquipo: "AGROPECUARIO"
    },
    "agr/alternativa/red": {
        codigo: "/colors red 180 151515 1C5F3A FFFFFF BA2C24",
        nombreEquipo: "AGROPECUARIO"
    },
    "agr/alternativa/blue": {
        codigo: "/colors blue 180 151515 1C5F3A FFFFFF BA2C24",
        nombreEquipo: "AGROPECUARIO"
    },

    // RIVER (UY)
    "riu/titular/red": {
        codigo: "/colors red 360 000000 FFFFFF D20502 FFFFFF",
        nombreEquipo: "RIVER (UY)"
    },
    "riu/titular/blue": {
        codigo: "/colors blue 360 000000 FFFFFF D20502 FFFFFF",
        nombreEquipo: "RIVER (UY)"
    },
    "riu/alternativa/red": {
        codigo: "/colors red 180 FFFFFF FE0002",
        nombreEquipo: "RIVER (UY)"
    },
    "riu/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF FE0002",
        nombreEquipo: "RIVER (UY)"
    },

    // GALATASARAY
    "gs/titular/red": {
        codigo: "/colors red 0 FFFFFF FBBA00 AB092E",
        nombreEquipo: "GALATASARAY"
    },
    "gs/titular/blue": {
        codigo: "/colors blue 0 FFFFFF FBBA00 AB092E",
        nombreEquipo: "GALATASARAY"
    },
    "gs/alternativa/red": {
        codigo: "/colors red 180 8D1D1D E3CFB3",
        nombreEquipo: "GALATASARAY"
    },
    "gs/alternativa/blue": {
        codigo: "/colors blue 180 8D1D1D E3CFB3",
        nombreEquipo: "GALATASARAY"
    },
    "gs/tercera/red": {
        codigo: "/colors red 180 AB1D28 C9C5C9",
        nombreEquipo: "GALATASARAY"
    },
    "gs/tercera/blue": {
        codigo: "/colors blue 180 AB1D28 C9C5C9",
        nombreEquipo: "GALATASARAY"
    },
    // FENERBAHCE
    "fb/titular/red": {
        codigo: "/colors red 180 020E1F FFF100 014582 FFF100",
        nombreEquipo: "FENERBAHCE"
    },
    "fb/titular/blue": {
        codigo: "/colors blue 180 020E1F FFF100 014582 FFF100",
        nombreEquipo: "FENERBAHCE"
    },
    "fb/alternativa/red": {
        codigo: "/colors red 180 2F3A67 F4E800",
        nombreEquipo: "FENERBAHCE"
    },
    "fb/alternativa/blue": {
        codigo: "/colors blue 180 2F3A67 F4E800",
        nombreEquipo: "FENERBAHCE"
    },

    // BESIKTAS
    "bjk/titular/red": {
        codigo: "/colors red 180 000000 FFFFFF",
        nombreEquipo: "BESIKTAS"
    },
    "bjk/titular/blue": {
        codigo: "/colors blue 180 000000 FFFFFF",
        nombreEquipo: "BESIKTAS"
    },
    "bjk/alternativa/red": {
        codigo: "/colors red 180 000000 FB3333",
        nombreEquipo: "BESIKTAS"
    },
    "bjk/alternativa/blue": {
        codigo: "/colors blue 180 000000 FB3333",
        nombreEquipo: "BESIKTAS"
    },

    // AMÉRICA (MX)
    "amc/titular/red": {
        codigo: "/colors red 180 223346 FBF993",
        nombreEquipo: "AMÉRICA (MX)"
    },
    "amc/titular/blue": {
        codigo: "/colors blue 180 223346 FBF993",
        nombreEquipo: "AMÉRICA (MX)"
    },
    "amc/alternativa/red": {
        codigo: "/colors red 180 F2F2F2 1A2C38",
        nombreEquipo: "AMÉRICA (MX)"
    },
    "amc/alternativa/blue": {
        codigo: "/colors blue 180 F2F2F2 1A2C38",
        nombreEquipo: "AMÉRICA (MX)"
    },

    // CRUZ AZUL
    "cruz/titular/red": {
        codigo: "/colors red 180 FFFFFF 263D9A",
        nombreEquipo: "CRUZ AZUL"
    },
    "cruz/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 263D9A",
        nombreEquipo: "CRUZ AZUL"
    },
    "cruz/alternativa/red": {
        codigo: "/colors red 180 31357E FFFFFF",
        nombreEquipo: "CRUZ AZUL"
    },
    "cruz/alternativa/blue": {
        codigo: "/colors blue 180 31357E FFFFFF",
        nombreEquipo: "CRUZ AZUL"
    },

    // MONTERREY
    "mty/titular/red": {
        codigo: "/colors red 180 7D7E80 23354F FFFFFF 23354F",
        nombreEquipo: "MONTERREY"
    },
    "mty/titular/blue": {
        codigo: "/colors blue 180 7D7E80 23354F FFFFFF 23354F",
        nombreEquipo: "MONTERREY"
    },

    // CHIVAS
    "chv/titular/red": {
        codigo: "/colors red 180 052E4E FFFFFF FE3548 FFFFFF",
        nombreEquipo: "CHIVAS"
    },
    "chv/titular/blue": {
        codigo: "/colors blue 180 052E4E FFFFFF FE3548 FFFFFF",
        nombreEquipo: "CHIVAS"
    },

    // TIGRES
    "tgs/titular/red": {
        codigo: "/colors red 90 04407A FBC026 017CD9 FBC026",
        nombreEquipo: "TIGRES"
    },
    "tgs/titular/blue": {
        codigo: "/colors blue 90 04407A FBC026 017CD9 FBC026",
        nombreEquipo: "TIGRES"
    },

    // LIGA DE QUITO
    "ldu/titular/red": {
        codigo: "/colors red 360 060541 FFFFFF",
        nombreEquipo: "LIGA DE QUITO"
    },
    "ldu/titular/blue": {
        codigo: "/colors blue 360 060541 FFFFFF",
        nombreEquipo: "LIGA DE QUITO"
    },
    "ldu/alternativa/red": {
        codigo: "/colors red 180 D1BF58 D8060E",
        nombreEquipo: "LIGA DE QUITO"
    },
    "ldu/alternativa/blue": {
        codigo: "/colors blue 180 D1BF58 D8060E",
        nombreEquipo: "LIGA DE QUITO"
    },
    "ldu/tercera/red": {
        codigo: "/colors red 180 F53315 111832",
        nombreEquipo: "LIGA DE QUITO"
    },
    "ldu/tercera/blue": {
        codigo: "/colors blue 180 F53315 111832",
        nombreEquipo: "LIGA DE QUITO"
    },

    // BARCELONA SC
    "bsc/titular/red": {
        codigo: "/colors red 180 C90613 F9D532",
        nombreEquipo: "BARCELONA SC"
    },
    "bsc/titular/blue": {
        codigo: "/colors blue 180 C90613 F9D532",
        nombreEquipo: "BARCELONA SC"
    },
    "bsc/alternativa/red": {
        codigo: "/colors red 180 FD6600 67020F",
        nombreEquipo: "BARCELONA SC"
    },
    "bsc/alternativa/blue": {
        codigo: "/colors blue 180 FD6600 67020F",
        nombreEquipo: "BARCELONA SC"
    },

    // EMELEC
    "eme/titular/red": {
        codigo: "/colors red 148 FFFFFF 025CCC 004390 025CCC",
        nombreEquipo: "EMELEC"
    },
    "eme/titular/blue": {
        codigo: "/colors blue 148 FFFFFF 025CCC 004390 025CCC",
        nombreEquipo: "EMELEC"
    },
    "eme/alternativa/red": {
        codigo: "/colors red 180 0151C2 FFFFFF",
        nombreEquipo: "EMELEC"
    },
    "eme/alternativa/blue": {
        codigo: "/colors blue 180 0151C2 FFFFFF",
        nombreEquipo: "EMELEC"
    },

    // INDEPENDIENTE DEL VALLE
    "idv/titular/red": {
        codigo: "/colors red 90 FFFFFF 001638 001638 001638",
        nombreEquipo: "INDEPENDIENTE DEL VALLE"
    },
    "idv/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 001638 001638 001638",
        nombreEquipo: "INDEPENDIENTE DEL VALLE"
    },
    "idv/alternativa/red": {
        codigo: "/colors red 90 FFFFFF EC70AC EC599F E45195",
        nombreEquipo: "INDEPENDIENTE DEL VALLE"
    },
    "idv/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF EC70AC EC599F E45195",
        nombreEquipo: "INDEPENDIENTE DEL VALLE"
    },
    "idv/clasica/red": {
        codigo: "/colors red 180 FFFFFF 012D6B 231F20 012D6B",
        nombreEquipo: "INDEPENDIENTE DEL VALLE"
    },
    "idv/clasica/blue": {
        codigo: "/colors blue 180 FFFFFF 012D6B 231F20 012D6B",
        nombreEquipo: "INDEPENDIENTE DEL VALLE"
    },

    // OLYMPIQUE LYON
    "ol/titular/red": {
        codigo: "/colors red 60 113A80 FBFDFC",
        nombreEquipo: "OLYMPIQUE LYON"
    },
    "ol/titular/blue": {
        codigo: "/colors blue 60 113A80 FBFDFC",
        nombreEquipo: "OLYMPIQUE LYON"
    },
    "ol/alternativa/red": {
        codigo: "/colors red 0 E8E9EA 212C52 1D3C7F 212C52",
        nombreEquipo: "OLYMPIQUE LYON"
    },
    "ol/alternativa/blue": {
        codigo: "/colors blue 0 E8E9EA 222C52 1D3C7F 222C52",
        nombreEquipo: "OLYMPIQUE LYON"
    },

    // SAN TELMO
    "stel/titular/red": {
        codigo: "/colors red 180 FFFFFF 3CADFE 24364C 3CADFE",
        nombreEquipo: "SAN TELMO"
    },
    "stel/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 3CADFE 24364C 3CADFE",
        nombreEquipo: "SAN TELMO"
    },
    "stel/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 0D2B43 39A2FE FFFFFF",
        nombreEquipo: "SAN TELMO"
    },
    "stel/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 0D2B43 39A2FE FFFFFF",
        nombreEquipo: "SAN TELMO"
    },

    // DEPORTIVO MERLO
    "mer/titular/red": {
        codigo: "/colors red 45 666A78 FFFFFF 050C40 FFFFFF",
        nombreEquipo: "DEP. MERLO"
    },
    "mer/titular/blue": {
        codigo: "/colors blue 45 666A78 FFFFFF 050C40 FFFFFF",
        nombreEquipo: "DEP. MERLO"
    },
    "mer/alternativa/red": {
        codigo: "/colors red 45 FFFFFF 050505 04113D 050505",
        nombreEquipo: "DEP. MERLO"
    },
    "mer/alternativa/blue": {
        codigo: "/colors blue 45 FFFFFF 050505 04113D 050505",
        nombreEquipo: "DEP. MERLO"
    },
    "mer/tercera/red": {
        codigo: "/colors red 90 FFFFFF 660B0A",
        nombreEquipo: "DEP. MERLO"
    },
    "mer/tercera/blue": {
        codigo: "/colors blue 90 FFFFFF 660B0A",
        nombreEquipo: "DEP. MERLO"
    },

    // ARGENTINO DE QUILMES
    "adq/titular/red": {
        codigo: "/colors red 180 0A0A0A FFFFFF 76C4F0 FFFFFF",
        nombreEquipo: "ARGENTINO DE QUILMES"
    },
    "adq/titular/blue": {
        codigo: "/colors blue 180 0A0A0A FFFFFF 76C4F0 FFFFFF",
        nombreEquipo: "ARGENTINO DE QUILMES"
    },
    "adq/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 777A89 000000 777A89",
        nombreEquipo: "ARGENTINO DE QUILMES"
    },
    "adq/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 777A89 000000 777A89",
        nombreEquipo: "ARGENTINO DE QUILMES"
    },

    // VALENCIA
    "val/titular/red": {
        codigo: "/colors red 33 141205 FE7103 F8F7F8 F8F7F8",
        nombreEquipo: "VALENCIA"
    },
    "val/titular/blue": {
        codigo: "/colors blue 33 141205 FE7103 F8F7F8 F8F7F8",
        nombreEquipo: "VALENCIA"
    },
    "val/alternativa/red": {
        codigo: "/colors red 90 FF671E E55C19 161419 161419",
        nombreEquipo: "VALENCIA"
    },
    "val/alternativa/blue": {
        codigo: "/colors blue 90 FF671E E55C19 161419 161419",
        nombreEquipo: "VALENCIA"
    },
    "val/tercera/red": {
        codigo: "/colors red 123 F0FDFE 0C83D5 21BCF4",
        nombreEquipo: "VALENCIA"
    },
    "val/tercera/blue": {
        codigo: "/colors blue 123 F0FDFE 0C83D5 21BCF4",
        nombreEquipo: "VALENCIA"
    },

    // REAL BETIS
    "bet/titular/red": {
        codigo: "/colors red 180 000000 2CB764 FFFFFF 2CB764",
        nombreEquipo: "REAL BETIS"
    },
    "bet/titular/blue": {
        codigo: "/colors blue 180 000000 2CB764 FFFFFF 2CB764",
        nombreEquipo: "REAL BETIS"
    },

    // CRYSTAL PALACE
    "cry/titular/red": {
        codigo: "/colors red 180 FFFFFF C11930 01449B C11930",
        nombreEquipo: "CRYSTAL PALACE"
    },
    "cry/titular/blue": {
        codigo: "/colors blue 180 FFFFFF C11930 01449B C11930",
        nombreEquipo: "CRYSTAL PALACE"
    },
    "cry/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 242227 01449B 242227",
        nombreEquipo: "CRYSTAL PALACE"
    },
    "cry/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 242227 01449B 242227",
        nombreEquipo: "CRYSTAL PALACE"
    },
    "cry/tercera/red": {
        codigo: "/colors red 45 0731C3 FFFFFF ED1628 FFFFFF",
        nombreEquipo: "CRYSTAL PALACE"
    },
    "cry/tercera/blue": {
        codigo: "/colors blue 45 0731C3 FFFFFF ED1628 FFFFFF",
        nombreEquipo: "CRYSTAL PALACE"
    },

    // JUVENTUD ANTONIANA
    "cja/titular/red": {
        codigo: "/colors red 45 8892A6 FFFFFF 304268 FFFFFF",
        nombreEquipo: "JUVENTUD ANTONIANA"
    },
    "cja/titular/blue": {
        codigo: "/colors blue 45 8892A6 FFFFFF 304268 FFFFFF",
        nombreEquipo: "JUVENTUD ANTONIANA"
    },
    "cja/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 17286E 304268 17286E",
        nombreEquipo: "JUVENTUD ANTONIANA"
    },
    "cja/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 17286E 304268 17286E",
        nombreEquipo: "JUVENTUD ANTONIANA"
    },
    "cja/tercera/red": {
        codigo: "/colors red 45 0F1014 113653 FFFFFF 3D2813",
        nombreEquipo: "JUVENTUD ANTONIANA"
    },
    "cja/tercera/blue": {
        codigo: "/colors blue 45 0F1014 113653 FFFFFF 3D2813",
        nombreEquipo: "JUVENTUD ANTONIANA"
    },

    // GIMNASIA Y TIRO
    "gyt/titular/red": {
        codigo: "/colors red 180 000000 A8E0F9 FFFFFF A8E0F9",
        nombreEquipo: "GIMNASIA Y TIRO"
    },
    "gyt/titular/blue": {
        codigo: "/colors blue 180 000000 A8E0F9 FFFFFF A8E0F9",
        nombreEquipo: "GIMNASIA Y TIRO"
    },
    "gyt/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 141657 181965 141657",
        nombreEquipo: "GIMNASIA Y TIRO"
    },
    "gyt/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 141657 181965 141657",
        nombreEquipo: "GIMNASIA Y TIRO"
    },
    "gyt/tercera/red": {
        codigo: "/colors red 45 FFFFFF 0A0A0A",
        nombreEquipo: "GIMNASIA Y TIRO"
    },
    "gyt/tercera/blue": {
        codigo: "/colors blue 45 FFFFFF 0A0A0A",
        nombreEquipo: "GIMNASIA Y TIRO"
    },

    // PATRONATO
    "pat/titular/red": {
        codigo: "/colors red 180 FFFFFF B20000 0C0C0C B20000",
        nombreEquipo: "PATRONATO"
    },
    "pat/titular/blue": {
        codigo: "/colors blue 180 FFFFFF B20000 0C0C0C B20000",
        nombreEquipo: "PATRONATO"
    },
    "pat/alternativa/red": {
        codigo: "/colors red 180 000000 E8171F FFFFFF FFFFFF",
        nombreEquipo: "PATRONATO"
    },
    "pat/alternativa/blue": {
        codigo: "/colors blue 180 000000 E8171F FFFFFF FFFFFF",
        nombreEquipo: "PATRONATO"
    },

    // RAYO VALLECANO
    "ray/titular/red": {
        codigo: "/colors red 28 000000 FFFFFF FF2E29 FFFFFF",
        nombreEquipo: "RAYO VALLECANO"
    },
    "ray/titular/blue": {
        codigo: "/colors blue 28 000000 FFFFFF FF2E29 FFFFFF",
        nombreEquipo: "RAYO VALLECANO"
    },
    "ray/alternativa/red": {
        codigo: "/colors red 28 FFFFFF FE322B 130F10 FE322B",
        nombreEquipo: "RAYO VALLECANO"
    },
    "ray/alternativa/blue": {
        codigo: "/colors blue 28 FFFFFF FE322B 130F10 FE322B",
        nombreEquipo: "RAYO VALLECANO"
    },
    "ray/tercera/red": {
        codigo: "/colors red 28 FFFFFF 130F10 00A4D2 130F10",
        nombreEquipo: "RAYO VALLECANO"
    },
    "ray/tercera/blue": {
        codigo: "/colors blue 28 FFFFFF 130F10 00A4D2 130F10",
        nombreEquipo: "RAYO VALLECANO"
    },

    // LEVANTE
    "lev/titular/red": {
        codigo: "/colors red 180 FFFFFF 0A1E97 A60727 0A1E97",
        nombreEquipo: "LEVANTE"
    },
    "lev/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 0A1E97 A60727 0A1E97",
        nombreEquipo: "LEVANTE"
    },
    "lev/alternativa/red": {
        codigo: "/colors red 180 191717 FFFFFF 000DD8 FFFFFF",
        nombreEquipo: "LEVANTE"
    },
    "lev/alternativa/blue": {
        codigo: "/colors blue 180 191717 FFFFFF 000DD8 FFFFFF",
        nombreEquipo: "LEVANTE"
    },
    "lev/tercera/red": {
        codigo: "/colors red 180 191717 E2E2E2",
        nombreEquipo: "LEVANTE"
    },
    "lev/tercera/blue": {
        codigo: "/colors blue 180 191717 E2E2E2",
        nombreEquipo: "LEVANTE"
    },

    // GETAFE
    "get/titular/red": {
        codigo: "/colors red 180 FFFFFF 086BD3",
        nombreEquipo: "GETAFE"
    },
    "get/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 086BD3",
        nombreEquipo: "GETAFE"
    },
    "get/alternativa/red": {
        codigo: "/colors red 180 FFFFFF F34C28",
        nombreEquipo: "GETAFE"
    },
    "get/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF F34C28",
        nombreEquipo: "GETAFE"
    },

    // ZENIT
    "zen/titular/red": {
        codigo: "/colors red 146 FFFFFF 1BB1E3 0E8BC1 0F649A",
        nombreEquipo: "ZENIT"
    },
    "zen/titular/blue": {
        codigo: "/colors blue 146 FFFFFF 1BB1E3 0E8BC1 0F649A",
        nombreEquipo: "ZENIT"
    },
    "zen/alternativa/red": {
        codigo: "/colors red 180 0099C3 FFFFFF",
        nombreEquipo: "ZENIT"
    },
    "zen/alternativa/blue": {
        codigo: "/colors blue 180 0099C3 FFFFFF",
        nombreEquipo: "ZENIT"
    },

    // CSKA MOSCÚ
    "csk/titular/red": {
        codigo: "/colors red 180 FFFFFF FF2039 016AD7 FF2039",
        nombreEquipo: "CSKA MOSCÚ"
    },
    "csk/titular/blue": {
        codigo: "/colors blue 180 FFFFFF FF2039 016AD7 FF2039",
        nombreEquipo: "CSKA MOSCÚ"
    },
    "csk/alternativa/red": {
        codigo: "/colors red 180 024FBB FFFFFF FF2039 FFFFFF",
        nombreEquipo: "CSKA MOSCÚ"
    },
    "csk/alternativa/blue": {
        codigo: "/colors blue 180 024FBB FFFFFF FF2039 FFFFFF",
        nombreEquipo: "CSKA MOSCÚ"
    },
    "csk/tercera/red": {
        codigo: "/colors red 134 082957 FEAC48 FEAC48 01438F",
        nombreEquipo: "CSKA MOSCÚ"
    },
    "csk/tercera/blue": {
        codigo: "/colors blue 134 082957 FEAC48 FEAC48 01438F",
        nombreEquipo: "CSKA MOSCÚ"
    },

    // LOKOMOTIV
    "lok/titular/red": {
        codigo: "/colors red 236 FFFFFF 025948 025948 C70B24",
        nombreEquipo: "LOKOMOTIV"
    },
    "lok/titular/blue": {
        codigo: "/colors blue 236 FFFFFF 025948 025948 C70B24",
        nombreEquipo: "LOKOMOTIV"
    },
    "lok/alternativa/red": {
        codigo: "/colors red 90 E71218 026052 FFFFFF FFFFFF",
        nombreEquipo: "LOKOMOTIV"
    },
    "lok/alternativa/blue": {
        codigo: "/colors blue 90 E71218 026052 FFFFFF FFFFFF",
        nombreEquipo: "LOKOMOTIV"
    },
    "lok/tercera/red": {
        codigo: "/colors red 90 E0E2E1 CD090A 525157 525157",
        nombreEquipo: "LOKOMOTIV"
    },
    "lok/tercera/blue": {
        codigo: "/colors blue 90 E0E2E1 CD090A 525157 525157",
        nombreEquipo: "LOKOMOTIV"
    },
    // SPARTAK MOSCÚ
    "spm/titular/red": {
        codigo: "/colors red 90 8A939E D4001D FBFEFD D4001D",
        nombreEquipo: "SPARTAK MOSCÚ"
    },
    "spm/titular/blue": {
        codigo: "/colors blue 90 8A939E D4001D FBFEFD D4001D",
        nombreEquipo: "SPARTAK MOSCÚ"
    },
    "spm/alternativa/red": {
        codigo: "/colors red 90 4F0000 FFFFFF CE1D31 FFFFFF",
        nombreEquipo: "SPARTAK MOSCÚ"
    },
    "spm/alternativa/blue": {
        codigo: "/colors blue 90 4F0000 FFFFFF CE1D31 FFFFFF",
        nombreEquipo: "SPARTAK MOSCÚ"
    },

    // DYNAMO MOSCOW
    "din/titular/red": {
        codigo: "/colors red 90 FDFFFE 0066CD",
        nombreEquipo: "DYNAMO MOSCOW"
    },
    "din/titular/blue": {
        codigo: "/colors blue 90 FDFFFE 0066CD",
        nombreEquipo: "DYNAMO MOSCOW"
    },
    "din/alternativa/red": {
        codigo: "/colors red 90 1F71D7 FFFFFF",
        nombreEquipo: "DYNAMO MOSCOW"
    },
    "din/alternativa/blue": {
        codigo: "/colors blue 90 1F71D7 FFFFFF",
        nombreEquipo: "DYNAMO MOSCOW"
    },

    // DYNAMO KIEV
    "dyk/titular/red": {
        codigo: "/colors red 90 146DD3 FFFFFF",
        nombreEquipo: "DYNAMO KIEV"
    },
    "dyk/titular/blue": {
        codigo: "/colors blue 90 146DD3 FFFFFF",
        nombreEquipo: "DYNAMO KIEV"
    },
    "dyk/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 0167B2",
        nombreEquipo: "DYNAMO KIEV"
    },
    "dyk/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 0167B2",
        nombreEquipo: "DYNAMO KIEV"
    },

    // SHAKHTAR DONETSK
    "sha/titular/red": {
        codigo: "/colors red 1 000000 F39C4D EF3B24",
        nombreEquipo: "SHAKHTAR DONETSK"
    },
    "sha/titular/blue": {
        codigo: "/colors blue 1 000000 F39C4D EF3B24",
        nombreEquipo: "SHAKHTAR DONETSK"
    },
    "sha/alternativa/red": {
        codigo: "/colors red 1 000000 AC9E9B DAD0CF AC9E9B",
        nombreEquipo: "SHAKHTAR DONETSK"
    },
    "sha/alternativa/blue": {
        codigo: "/colors blue 1 000000 AC9E9B DAD0CF AC9E9B",
        nombreEquipo: "SHAKHTAR DONETSK"
    },

    // JAPÓN
    "jap/titular/red": {
        codigo: "/colors red 90 F4363B 202531 305797 388BE7",
        nombreEquipo: "JAPÓN"
    },
    "jap/titular/blue": {
        codigo: "/colors blue 90 F4363B 202531 305797 388BE7",
        nombreEquipo: "JAPÓN"
    },
    "jap/alternativa/red": {
        codigo: "/colors red 180 B52024 F7FDFF",
        nombreEquipo: "JAPÓN"
    },
    "jap/alternativa/blue": {
        codigo: "/colors blue 180 B52024 F7FDFF",
        nombreEquipo: "JAPÓN"
    },

    // NUEVA ZELANDA
    "nze/titular/red": {
        codigo: "/colors red 33 191E22 FFFFFF",
        nombreEquipo: "NUEVA ZELANDA"
    },
    "nze/titular/blue": {
        codigo: "/colors blue 33 191E22 FFFFFF",
        nombreEquipo: "NUEVA ZELANDA"
    },
    "nze/alternativa/red": {
        codigo: "/colors red 240 F5F5F5 232323 232323 2E2F33",
        nombreEquipo: "NUEVA ZELANDA"
    },
    "nze/alternativa/blue": {
        codigo: "/colors blue 240 F5F5F5 232323 232323 2E2F33",
        nombreEquipo: "NUEVA ZELANDA"
    },

    // COREA DEL NORTE
    "cno/titular/red": {
        codigo: "/colors red 33 FFFFFF FF0000",
        nombreEquipo: "COREA DEL NORTE"
    },
    "cno/titular/blue": {
        codigo: "/colors blue 33 FFFFFF FF0000",
        nombreEquipo: "COREA DEL NORTE"
    },
    "cno/alternativa/red": {
        codigo: "/colors red 240 FF0000 F5F9FF",
        nombreEquipo: "COREA DEL NORTE"
    },
    "cno/alternativa/blue": {
        codigo: "/colors blue 240 FF0000 F5F9FF",
        nombreEquipo: "COREA DEL NORTE"
    },
    "cno/bandera/red": {
        codigo: "/colors red 90 FFFFFF 024FA2 ED1C27 024FA2",
        nombreEquipo: "COREA DEL NORTE"
    },
    "cno/bandera/blue": {
        codigo: "/colors blue 90 FFFFFF 024FA2 ED1C27 024FA2",
        nombreEquipo: "COREA DEL NORTE"
    },

    // AUSTRIA
    "aut/titular/red": {
        codigo: "/colors red 33 FFFFFF D80B2A",
        nombreEquipo: "AUSTRIA"
    },
    "aut/titular/blue": {
        codigo: "/colors blue 33 FFFFFF D80B2A",
        nombreEquipo: "AUSTRIA"
    },
    "aut/alternativa/red": {
        codigo: "/colors red 240 000000 FFFFFF",
        nombreEquipo: "AUSTRIA"
    },
    "aut/alternativa/blue": {
        codigo: "/colors blue 240 000000 FFFFFF",
        nombreEquipo: "AUSTRIA"
    },
    "aut/bandera/red": {
        codigo: "/colors red 90 000000 ED2939 FFFFFF ED2939",
        nombreEquipo: "AUSTRIA"
    },
    "aut/bandera/blue": {
        codigo: "/colors blue 90 000000 ED2939 FFFFFF ED2939",
        nombreEquipo: "AUSTRIA"
    },

    // ATLANTA UNITED
    "atlu/titular/red": {
        codigo: "/colors red 180 C2B28E 222021 C70C41 222021",
        nombreEquipo: "ATLANTA UNITED"
    },
    "atlu/titular/blue": {
        codigo: "/colors blue 180 C2B28E 222021 C70C41 222021",
        nombreEquipo: "ATLANTA UNITED"
    },
    "atlu/alternativa/red": {
        codigo: "/colors red 240 FF774D E1E5E6",
        nombreEquipo: "ATLANTA UNITED"
    },
    "atlu/alternativa/blue": {
        codigo: "/colors blue 240 FF774D E1E5E6",
        nombreEquipo: "ATLANTA UNITED"
    },

    // LA GALAXY
    "la/titular/red": {
        codigo: "/colors red 35 FDC904 FFFFFF 232941 FFFFFF",
        nombreEquipo: "LA GALAXY"
    },
    "la/titular/blue": {
        codigo: "/colors blue 35 FDC904 FFFFFF 232941 FFFFFF",
        nombreEquipo: "LA GALAXY"
    },
    "la/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 294A73 1E2037 294A73",
        nombreEquipo: "LA GALAXY"
    },
    "la/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 294A73 1E2037 294A73",
        nombreEquipo: "LA GALAXY"
    },

    // TORONTO FC
    "tofc/titular/red": {
        codigo: "/colors red 33 FFFFFF E50126",
        nombreEquipo: "TORONTO FC"
    },
    "tofc/titular/blue": {
        codigo: "/colors blue 33 FFFFFF E50126",
        nombreEquipo: "TORONTO FC"
    },
    "tofc/alternativa/red": {
        codigo: "/colors red 240 1D1C21 E6EBEF",
        nombreEquipo: "TORONTO FC"
    },
    "tofc/alternativa/blue": {
        codigo: "/colors blue 240 1D1C21 E6EBEF",
        nombreEquipo: "TORONTO FC"
    },

    // NEW YORK CITY
    "nyc/titular/red": {
        codigo: "/colors red 33 102A5B 82BCEC",
        nombreEquipo: "NEW YORK CITY"
    },
    "nyc/titular/blue": {
        codigo: "/colors blue 33 102A5B 82BCEC",
        nombreEquipo: "NEW YORK CITY"
    },
    "nyc/alternativa/red": {
        codigo: "/colors red 240 7CBEEA 4D5361",
        nombreEquipo: "NEW YORK CITY"
    },
    "nyc/alternativa/blue": {
        codigo: "/colors blue 240 7CBEEA 4D5361",
        nombreEquipo: "NEW YORK CITY"
    },
    // LOS ANGELES FC
    "lafc/titular/red": {
        codigo: "/colors red 33 CBAD6F 322E2B",
        nombreEquipo: "LOS ANGELES FC"
    },
    "lafc/titular/blue": {
        codigo: "/colors blue 33 CBAD6F 322E2B",
        nombreEquipo: "LOS ANGELES FC"
    },
    "lafc/alternativa/red": {
        codigo: "/colors red 240 AEAFB1 EFEEF3",
        nombreEquipo: "LOS ANGELES FC"
    },
    "lafc/alternativa/blue": {
        codigo: "/colors blue 240 AEAFB1 EFEEF3",
        nombreEquipo: "LOS ANGELES FC"
    },

    // SEATTLE SOUNDERS
    "sea/titular/red": {
        codigo: "/colors red 33 FFFFFF 98C067",
        nombreEquipo: "SEATTLE SOUNDERS"
    },
    "sea/titular/blue": {
        codigo: "/colors blue 33 FFFFFF 98C067",
        nombreEquipo: "SEATTLE SOUNDERS"
    },
    "sea/alternativa/red": {
        codigo: "/colors red 240 FFFFFF 2C2A2F 2C2A2F E18298",
        nombreEquipo: "SEATTLE SOUNDERS"
    },
    "sea/alternativa/blue": {
        codigo: "/colors blue 240 FFFFFF 2C2A2F 2C2A2F E18298",
        nombreEquipo: "SEATTLE SOUNDERS"
    },

    // NEW YORK RED BULL
    "nyrb/titular/red": {
        codigo: "/colors red 33 8C0C2D D0D0D2",
        nombreEquipo: "NEW YORK RB"
    },
    "nyrb/titular/blue": {
        codigo: "/colors blue 33 8C0C2D D0D0D2",
        nombreEquipo: "NEW YORK RB"
    },
    "nyrb/alternativa/red": {
        codigo: "/colors red 240 FFFFFF F1273D",
        nombreEquipo: "NEW YORK RB"
    },
    "nyrb/alternativa/blue": {
        codigo: "/colors blue 240 FFFFFF F1273D",
        nombreEquipo: "NEW YORK RB"
    },

    // PORTLAND TIMBERS
    "ptim/titular/red": {
        codigo: "/colors red 90 DFB231 293728 31492F 293728",
        nombreEquipo: "PORTLAND TIMBERS"
    },
    "ptim/titular/blue": {
        codigo: "/colors blue 90 DFB231 293728 31492F 293728",
        nombreEquipo: "PORTLAND TIMBERS"
    },
    "ptim/alternativa/red": {
        codigo: "/colors red 240 486551 FFFFFF",
        nombreEquipo: "PORTLAND TIMBERS"
    },
    "ptim/alternativa/blue": {
        codigo: "/colors blue 240 486551 FFFFFF",
        nombreEquipo: "PORTLAND TIMBERS"
    },

    // COLO COLO
    "cco/titular/red": {
        codigo: "/colors red 33 000000 F6F6F7",
        nombreEquipo: "COLO COLO"
    },
    "cco/titular/blue": {
        codigo: "/colors blue 33 000000 F6F6F7",
        nombreEquipo: "COLO COLO"
    },
    "cco/alternativa/red": {
        codigo: "/colors red 240 CFCFCF 212223 212223 FFFFFF",
        nombreEquipo: "COLO COLO"
    },
    "cco/alternativa/blue": {
        codigo: "/colors blue 240 CFCFCF 212223 212223 FFFFFF",
        nombreEquipo: "COLO COLO"
    },

    // U DE CHILE
    "udc/titular/red": {
        codigo: "/colors red 33 F4F4F4 1C2445",
        nombreEquipo: "U DE CHILE"
    },
    "udc/titular/blue": {
        codigo: "/colors blue 33 F4F4F4 1C2445",
        nombreEquipo: "U DE CHILE"
    },
    "udc/alternativa/red": {
        codigo: "/colors red 90 F7F7F7 F33134 611C1C F33134",
        nombreEquipo: "U DE CHILE"
    },
    "udc/alternativa/blue": {
        codigo: "/colors blue 90 F7F7F7 F33134 611C1C F33134",
        nombreEquipo: "U DE CHILE"
    },

    // STRONGEST
    "stg/titular/red": {
        codigo: "/colors red 180 FFFFFF FECE2D 1D1B1E FECE2D",
        nombreEquipo: "STRONGEST"
    },
    "stg/titular/blue": {
        codigo: "/colors blue 180 FFFFFF FECE2D 1D1B1E FECE2D",
        nombreEquipo: "STRONGEST"
    },
    "stg/alternativa/red": {
        codigo: "/colors red 180 030303 FFFFFF EDAE00 FFFFFF",
        nombreEquipo: "STRONGEST"
    },
    "stg/alternativa/blue": {
        codigo: "/colors blue 180 030303 FFFFFF EDAE00 FFFFFF",
        nombreEquipo: "STRONGEST"
    },

    // WILSTERMANN
    "wtm/titular/red": {
        codigo: "/colors red 33 FFFFFF ED1E3C",
        nombreEquipo: "WILSTERMANN"
    },
    "wtm/titular/blue": {
        codigo: "/colors blue 33 FFFFFF ED1E3C",
        nombreEquipo: "WILSTERMANN"
    },
    "wtm/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 1F3E70 16304C 1F3E70",
        nombreEquipo: "WILSTERMANN"
    },
    "wtm/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 1F3E70 16304C 1F3E70",
        nombreEquipo: "WILSTERMANN"
    },

    // BOLIVAR
    "blv/titular/red": {
        codigo: "/colors red 33 21406B 92E2FF",
        nombreEquipo: "BOLIVAR"
    },
    "blv/titular/blue": {
        codigo: "/colors blue 33 21406B 92E2FF",
        nombreEquipo: "BOLIVAR"
    },
    "blv/alternativa/red": {
        codigo: "/colors red 180 D8DDEE 333B45",
        nombreEquipo: "BOLIVAR"
    },
    "blv/alternativa/blue": {
        codigo: "/colors blue 180 D8DDEE 333B45",
        nombreEquipo: "BOLIVAR"
    },

    // EVERTON FC
    "eve/titular/red": {
        codigo: "/colors red 180 F9F9F9 15428A",
        nombreEquipo: "EVERTON FC"
    },
    "eve/titular/blue": {
        codigo: "/colors blue 180 F9F9F9 15428A",
        nombreEquipo: "EVERTON FC"
    },
    "eve/alternativa/red": {
        codigo: "/colors red 180 0C1448 FA6754",
        nombreEquipo: "EVERTON FC"
    },
    "eve/alternativa/blue": {
        codigo: "/colors blue 180 0C1448 FA6754",
        nombreEquipo: "EVERTON FC"
    },

    // AS MONACO
    "asm/titular/red": {
        codigo: "/colors red 61 FEB60A B8242E AD232E FEFEFE",
        nombreEquipo: "AS MONACO"
    },
    "asm/titular/blue": {
        codigo: "/colors blue 61 FEB60A B8242E AD232E FEFEFE",
        nombreEquipo: "AS MONACO"
    },
    "asm/alternativa/red": {
        codigo: "/colors red 180 D5A651 1F2023",
        nombreEquipo: "AS MONACO"
    },
    "asm/alternativa/blue": {
        codigo: "/colors blue 180 D5A651 1F2023",
        nombreEquipo: "AS MONACO"
    },
    "asm/tercera/red": {
        codigo: "/colors red 180 255E9A 93D9F5",
        nombreEquipo: "AS MONACO"
    },
    "asm/tercera/blue": {
        codigo: "/colors blue 180 255E9A 93D9F5",
        nombreEquipo: "AS MONACO"
    },
    // ATALANTA
    "ata/titular/red": {
        codigo: "/colors red 180 FFFFFF 0269B8 251E25 0269B8",
        nombreEquipo: "ATALANTA"
    },
    "ata/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 0269B8 251E25 0269B8",
        nombreEquipo: "ATALANTA"
    },
    "ata/alternativa/red": {
        codigo: "/colors red 90 357FFF 2F71E2 181818 FFFFFF",
        nombreEquipo: "ATALANTA"
    },
    "ata/alternativa/blue": {
        codigo: "/colors blue 90 357FFF 2F71E2 181818 FFFFFF",
        nombreEquipo: "ATALANTA"
    },
    "ata/tercera/red": {
        codigo: "/colors red 0 FFFFFF 874834",
        nombreEquipo: "ATALANTA"
    },
    "ata/tercera/blue": {
        codigo: "/colors blue 0 FFFFFF 874834",
        nombreEquipo: "ATALANTA"
    },

    // FC BASEL
    "bas/titular/red": {
        codigo: "/colors red 180 FFFFFF BC051F BC051F 1B3F86",
        nombreEquipo: "FC BASEL"
    },
    "bas/titular/blue": {
        codigo: "/colors blue 180 FFFFFF BC051F BC051F 1B3F86",
        nombreEquipo: "FC BASEL"
    },
    "bas/alternativa/red": {
        codigo: "/colors red 0 1A1A1A E1E1E1",
        nombreEquipo: "FC BASEL"
    },
    "bas/alternativa/blue": {
        codigo: "/colors blue 0 1A1A1A E1E1E1",
        nombreEquipo: "FC BASEL"
    },
    "bas/tercera/red": {
        codigo: "/colors red 0 FFFFFF 222222",
        nombreEquipo: "FC BASEL"
    },
    "bas/tercera/blue": {
        codigo: "/colors blue 0 FFFFFF 222222",
        nombreEquipo: "FC BASEL"
    },
    "bas/clasica/red": {
        codigo: "/colors red 0 FFE500 E40327 0E3B85",
        nombreEquipo: "FC BASEL"
    },
    "bas/clasica/blue": {
        codigo: "/colors blue 0 FFE500 E40327 0E3B85",
        nombreEquipo: "FC BASEL"
    },

    // U CATÓLICA
    "uca/titular/red": {
        codigo: "/colors red 90 FE0000 FFFFFF 2148A0 FFFFFF",
        nombreEquipo: "U CATÓLICA"
    },
    "uca/titular/blue": {
        codigo: "/colors blue 90 FE0000 FFFFFF 2148A0 FFFFFF",
        nombreEquipo: "U CATÓLICA"
    },
    "uca/alternativa/red": {
        codigo: "/colors red 60 FFFFFF D22F1E",
        nombreEquipo: "U CATÓLICA"
    },
    "uca/alternativa/blue": {
        codigo: "/colors blue 60 FFFFFF D22F1E",
        nombreEquipo: "U CATÓLICA"
    },
    "uca/tercera/red": {
        codigo: "/colors red 90 FF0000 2148A0 FFFFFF 2148A0",
        nombreEquipo: "U CATÓLICA"
    },
    "uca/tercera/blue": {
        codigo: "/colors blue 90 FF0000 2148A0 FFFFFF 2148A0",
        nombreEquipo: "U CATÓLICA"
    },

    // COBRELOA
    "cob/titular/red": {
        codigo: "/colors red 30 FFFFFF FF4B15 CC3900",
        nombreEquipo: "COBRELOA"
    },
    "cob/titular/blue": {
        codigo: "/colors blue 30 FFFFFF FF4B15 CC3900",
        nombreEquipo: "COBRELOA"
    },
    "cob/alternativa/red": {
        codigo: "/colors red 30 000000 FFFFFF CFCFCF",
        nombreEquipo: "COBRELOA"
    },
    "cob/alternativa/blue": {
        codigo: "/colors blue 30 000000 FFFFFF CFCFCF",
        nombreEquipo: "COBRELOA"
    },
    "cob/tercera/red": {
        codigo: "/colors red 30 FFFFFF 45485B 1A1A1A",
        nombreEquipo: "COBRELOA"
    },
    "cob/tercera/blue": {
        codigo: "/colors blue 30 FFFFFF 45485B 1A1A1A",
        nombreEquipo: "COBRELOA"
    },

    // PALESTINO
    "cdp/titular/red": {
        codigo: "/colors red 0 000000 FFFFFF 047B4E E30000",
        nombreEquipo: "PALESTINO"
    },
    "cdp/titular/blue": {
        codigo: "/colors blue 0 000000 FFFFFF 047B4E E30000",
        nombreEquipo: "PALESTINO"
    },
    "cdp/alternativa/red": {
        codigo: "/colors red 0 FAFAFA E30000 000503 047B4E",
        nombreEquipo: "PALESTINO"
    },
    "cdp/alternativa/blue": {
        codigo: "/colors blue 0 FAFAFA E30000 000503 047B4E",
        nombreEquipo: "PALESTINO"
    },

    // MELGAR
    "mel/titular/red": {
        codigo: "/colors red 0 FFFFFF EC1B30 2A2A2A",
        nombreEquipo: "MELGAR"
    },
    "mel/titular/blue": {
        codigo: "/colors blue 0 FFFFFF EC1B30 2A2A2A",
        nombreEquipo: "MELGAR"
    },
    "mel/alternativa/red": {
        codigo: "/colors red 0 2A2A2A ECEFF4 EC1B31 ECEFF4",
        nombreEquipo: "MELGAR"
    },
    "mel/alternativa/blue": {
        codigo: "/colors blue 0 2A2A2A ECEFF4 EC1B31 ECEFF4",
        nombreEquipo: "MELGAR"
    },

    // UNIVERSITARIO
    "unv/titular/red": {
        codigo: "/colors red 0 812124 E1DCC5",
        nombreEquipo: "UNIVERSITARIO"
    },
    "unv/titular/blue": {
        codigo: "/colors blue 0 812124 E1DCC5",
        nombreEquipo: "UNIVERSITARIO"
    },
    "unv/alternativa/red": {
        codigo: "/colors red 0 FFFFFF 902C38",
        nombreEquipo: "UNIVERSITARIO"
    },
    "unv/alternativa/blue": {
        codigo: "/colors blue 0 FFFFFF 902C38",
        nombreEquipo: "UNIVERSITARIO"
    },

    // ALIANZA LIMA
    "ali/titular/red": {
        codigo: "/colors red 180 D9030F 062247 FFFFFF 062247",
        nombreEquipo: "ALIANZA LIMA"
    },
    "ali/titular/blue": {
        codigo: "/colors blue 180 D9030F 062247 FFFFFF 062247",
        nombreEquipo: "ALIANZA LIMA"
    },
    "ali/alternativa/red": {
        codigo: "/colors red 40 F4F4F4 1A2639 253143 253143",
        nombreEquipo: "ALIANZA LIMA"
    },
    "ali/alternativa/blue": {
        codigo: "/colors blue 40 F4F4F4 1A2639 253143 253143",
        nombreEquipo: "ALIANZA LIMA"
    },

    // SPORTING CRISTAL
    "cri/titular/red": {
        codigo: "/colors red 0 032543 61C5ED",
        nombreEquipo: "SPORTING CRISTAL"
    },
    "cri/titular/blue": {
        codigo: "/colors blue 0 032543 61C5ED",
        nombreEquipo: "SPORTING CRISTAL"
    },
    "cri/alternativa/red": {
        codigo: "/colors red -90 FFFFFF 212C4B 334A7F",
        nombreEquipo: "SPORTING CRISTAL"
    },
    "cri/alternativa/blue": {
        codigo: "/colors blue -90 FFFFFF 212C4B 334A7F",
        nombreEquipo: "SPORTING CRISTAL"
    },
    "cri/tercera/red": {
        codigo: "/colors red 41 1C1C1C FFFFFF 3CBEEF FFFFFF",
        nombreEquipo: "SPORTING CRISTAL"
    },
    "cri/tercera/blue": {
        codigo: "/colors blue 41 1C1C1C FFFFFF 3CBEEF FFFFFF",
        nombreEquipo: "SPORTING CRISTAL"
    },
    // RUSIA
    "rus/titular/red": {
        codigo: "/colors red 90 FFFFFF C4021D C4323F D43941",
        nombreEquipo: "RUSIA"
    },
    "rus/titular/blue": {
        codigo: "/colors blue 90 FFFFFF C4021D C4323F D43941",
        nombreEquipo: "RUSIA"
    },
    "rus/alternativa/red": {
        codigo: "/colors red -90 114577 EFEFF0",
        nombreEquipo: "RUSIA"
    },
    "rus/alternativa/blue": {
        codigo: "/colors blue -90 114577 EFEFF0",
        nombreEquipo: "RUSIA"
    },
    "rus/bandera/red": {
        codigo: "/colors red 90 DECC57 FFFFFF 0039A6 D52B1E",
        nombreEquipo: "RUSIA"
    },
    "rus/bandera/blue": {
        codigo: "/colors blue 90 DECC57 FFFFFF 0039A6 D52B1E",
        nombreEquipo: "RUSIA"
    },

    // ESTADOS UNIDOS
    "usa/titular/red": {
        codigo: "/colors red 122 005588 FFFFFF FFFFFF B30119",
        nombreEquipo: "EEUU"
    },
    "usa/titular/blue": {
        codigo: "/colors blue 122 005588 FFFFFF FFFFFF B30119",
        nombreEquipo: "EEUU"
    },
    "usa/alternativa/red": {
        codigo: "/colors red -122 F2F4F5 E30212 273D87 273D87",
        nombreEquipo: "EEUU"
    },
    "usa/alternativa/blue": {
        codigo: "/colors blue -122 F2F4F5 E30212 273D87 273D87",
        nombreEquipo: "EEUU"
    },
    "usa/tercera/red": {
        codigo: "/colors red -90 FBFBFA 013354",
        nombreEquipo: "EEUU"
    },
    "usa/tercera/blue": {
        codigo: "/colors blue -90 FBFBFA 013354",
        nombreEquipo: "EEUU"
    },
    "usa/clasica/red": {
        codigo: "/colors red -90 101085 FF2E2E FFFFFF 1C59FF",
        nombreEquipo: "EEUU"
    },
    "usa/clasica/blue": {
        codigo: "/colors blue -90 101085 FF2E2E FFFFFF 1C59FF",
        nombreEquipo: "EEUU"
    },

    // ALMAGRO
    "alm/titular/red": {
        codigo: "/colors red 0 FFFFFF 0137D5 18181A 0137D5",
        nombreEquipo: "ALMAGRO"
    },
    "alm/titular/blue": {
        codigo: "/colors blue 0 FFFFFF 0137D5 18181A 0137D5",
        nombreEquipo: "ALMAGRO"
    },
    "alm/alternativa/red": {
        codigo: "/colors red 90 1783FF 003CDB 1F1F21 FDFDFD",
        nombreEquipo: "ALMAGRO"
    },
    "alm/alternativa/blue": {
        codigo: "/colors blue 90 1783FF 003CDB 1F1F21 FDFDFD",
        nombreEquipo: "ALMAGRO"
    },

    // NIGERIA
    "nga/titular/red": {
        codigo: "/colors red 180 000000 1D633C F7FAF7 1D633C",
        nombreEquipo: "NIGERIA"
    },
    "nga/titular/blue": {
        codigo: "/colors blue 180 000000 1D633C F7FAF7 1D633C",
        nombreEquipo: "NIGERIA"
    },
    "nga/alternativa/red": {
        codigo: "/colors red -90 FFFFFF 294040",
        nombreEquipo: "NIGERIA"
    },
    "nga/alternativa/blue": {
        codigo: "/colors blue -90 FFFFFF 294040",
        nombreEquipo: "NIGERIA"
    },

    // ECUADOR
    "ecu/titular/red": {
        codigo: "/colors red 90 1E2A52 042A95 EBD301 EBD301",
        nombreEquipo: "ECUADOR"
    },
    "ecu/titular/blue": {
        codigo: "/colors blue 90 1E2A52 042A95 EBD301 EBD301",
        nombreEquipo: "ECUADOR"
    },
    "ecu/alternativa/red": {
        codigo: "/colors red 90 EDFE2D 777B6E",
        nombreEquipo: "ECUADOR"
    },
    "ecu/alternativa/blue": {
        codigo: "/colors blue 90 EDFE2D 777B6E",
        nombreEquipo: "ECUADOR"
    },

    // CADU
    "cadu/titular/red": {
        codigo: "/colors red 180 0F0F0F 0A94DC 2CCAF8 0A94DC",
        nombreEquipo: "CADU"
    },
    "cadu/titular/blue": {
        codigo: "/colors blue 180 0F0F0F 0A94DC 2CCAF8 0A94DC",
        nombreEquipo: "CADU"
    },
    "cadu/alternativa/red": {
        codigo: "/colors red 135 007EFC FFFFFF 47C4FB FFFFFF",
        nombreEquipo: "CADU"
    },
    "cadu/alternativa/blue": {
        codigo: "/colors blue 135 007EFC FFFFFF 47C4FB FFFFFF",
        nombreEquipo: "CADU"
    },

    // URSS
    "urss/titular/red": {
        codigo: "/colors red 90 FFFFFF B00819",
        nombreEquipo: "URSS"
    },
    "urss/titular/blue": {
        codigo: "/colors blue 90 FFFFFF B00819",
        nombreEquipo: "URSS"
    },
    "urss/alternativa/red": {
        codigo: "/colors red 90 AB0818 FAFAFA",
        nombreEquipo: "URSS"
    },
    "urss/alternativa/blue": {
        codigo: "/colors blue 90 AB0818 FAFAFA",
        nombreEquipo: "URSS"
    },

    // YUGOSLAVIA
    "yug/titular/red/1990": {
        codigo: "/colors red 153 FFFFFF 0F4BA1 0F4BA1 DE0000",
        nombreEquipo: "YUGOSLAVIA"
    },
    "yug/titular/blue/1990": {
        codigo: "/colors blue 153 FFFFFF 0F4BA1 0F4BA1 DE0000",
        nombreEquipo: "YUGOSLAVIA"
    },
    "yug/alternativa/red/1990": {
        codigo: "/colors red 153 0D4BB2 FFFFFF FFFFFF DD251D",
        nombreEquipo: "YUGOSLAVIA"
    },
    "yug/alternativa/blue/1990": {
        codigo: "/colors blue 153 0D4BB2 FFFFFF FFFFFF DD251D",
        nombreEquipo: "YUGOSLAVIA"
    },
    "yug/titular/red/1984": {
        codigo: "/colors red 90 FFFFFF 18529D",
        nombreEquipo: "YUGOSLAVIA"
    },
    "yug/titular/blue/1984": {
        codigo: "/colors blue 90 FFFFFF 18529D",
        nombreEquipo: "YUGOSLAVIA"
    },
    "yug/alternativa/red/1984": {
        codigo: "/colors red 90 00388E FFFFFF",
        nombreEquipo: "YUGOSLAVIA"
    },
    "yug/alternativa/blue/1984": {
        codigo: "/colors blue 90 00388E FFFFFF",
        nombreEquipo: "YUGOSLAVIA"
    },
    "yug/bandera/red": {
        codigo: "/colors red 90 DE0000 003893 FFFFFF DE0000",
        nombreEquipo: "YUGOSLAVIA"
    },
    "yug/bandera/blue": {
        codigo: "/colors blue 90 DE0000 003893 FFFFFF DE0000",
        nombreEquipo: "YUGOSLAVIA"
    },

    // ALUMNI
    "alu/titular/red": {
        codigo: "/colors red 180 000000 FF0000 FFFFFF FF0000",
        nombreEquipo: "ALUMNI"
    },
    "alu/titular/blue": {
        codigo: "/colors blue 180 000000 FF0000 FFFFFF FF0000",
        nombreEquipo: "ALUMNI"
    },
    "alu/alternativa/red": {
        codigo: "/colors red 90 000000 E30F10 FFFFFF E30F10",
        nombreEquipo: "ALUMNI"
    },
    "alu/alternativa/blue": {
        codigo: "/colors blue 90 000000 E30F10 FFFFFF E30F10",
        nombreEquipo: "ALUMNI"
    },

    // VILLA SAN CARLOS
    "vsc/titular/red": {
        codigo: "/colors red 42 131B2A 48B8E5 FFFFFF 48B8E5",
        nombreEquipo: "VILLA SAN CARLOS"
    },
    "vsc/titular/blue": {
        codigo: "/colors blue 42 131B2A 48B8E5 FFFFFF 48B8E5",
        nombreEquipo: "VILLA SAN CARLOS"
    },
    "vsc/alternativa/red": {
        codigo: "/colors red 56 F0F0F0 01C8FF 292C34 292C34",
        nombreEquipo: "VILLA SAN CARLOS"
    },
    "vsc/alternativa/blue": {
        codigo: "/colors blue 56 F0F0F0 01C8FF 292C34 292C34",
        nombreEquipo: "VILLA SAN CARLOS"
    },

    // LOMAS ATHLETIC
    "loa/titular/red": {
        codigo: "/colors red 180 F5DC00 336633 D90000 336633",
        nombreEquipo: "LOMAS ATHLETIC"
    },
    "loa/titular/blue": {
        codigo: "/colors blue 180 F5DC00 336633 D90000 336633",
        nombreEquipo: "LOMAS ATHLETIC"
    },
    "loa/escudo/red": {
        codigo: "/colors red 180 FCC916 015440 DD191A 015440",
        nombreEquipo: "LOMAS ATHLETIC"
    },
    "loa/escudo/blue": {
        codigo: "/colors blue 180 FCC916 015440 DD191A 015440",
        nombreEquipo: "LOMAS ATHLETIC"
    },

    // CHECOSLOVAQUIA
    "cze/titular/red": {
        codigo: "/colors red 180 FFFFFF BE2620",
        nombreEquipo: "CHECOSLOVAQUIA"
    },
    "cze/titular/blue": {
        codigo: "/colors blue 180 FFFFFF BE2620",
        nombreEquipo: "CHECOSLOVAQUIA"
    },
    "cze/alternativa/red": {
        codigo: "/colors red 180 AC1013 FFFFFF",
        nombreEquipo: "CHECOSLOVAQUIA"
    },
    "cze/alternativa/blue": {
        codigo: "/colors blue 180 AC1013 FFFFFF",
        nombreEquipo: "CHECOSLOVAQUIA"
    },

    // FC NANTES
    "fcn/titular/red": {
        codigo: "/colors red 180 007037 FEE030 1AAD67 FEE030",
        nombreEquipo: "FC NANTES"
    },
    "fcn/titular/blue": {
        codigo: "/colors blue 180 007037 FEE030 1AAD67 FEE030",
        nombreEquipo: "FC NANTES"
    },
    "fcn/alternativa/red": {
        codigo: "/colors red 60 FFFF00 228B67 167554 167554",
        nombreEquipo: "FC NANTES"
    },
    "fcn/alternativa/blue": {
        codigo: "/colors blue 60 FFFF00 228B67 167554 167554",
        nombreEquipo: "FC NANTES"
    },
    // SAINT ETIENNE
    "ste/titular/red": {
        codigo: "/colors red 90 FFFFFF 0F6B46 1B9365 1B9365",
        nombreEquipo: "SAINT ETIENNE"
    },
    "ste/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 0F6B46 1B9365 1B9365",
        nombreEquipo: "SAINT ETIENNE"
    },
    "ste/alternativa/red": {
        codigo: "/colors red 90 4C6E5D 147858 FFFFFF FFFFFF",
        nombreEquipo: "SAINT ETIENNE"
    },
    "ste/alternativa/blue": {
        codigo: "/colors blue 90 4C6E5D 147858 FFFFFF FFFFFF",
        nombreEquipo: "SAINT ETIENNE"
    },
    "ste/tercera/red": {
        codigo: "/colors red 90 FFFFFF 727085 8E909D 8E909D",
        nombreEquipo: "SAINT ETIENNE"
    },
    "ste/tercera/blue": {
        codigo: "/colors blue 90 FFFFFF 727085 8E909D 8E909D",
        nombreEquipo: "SAINT ETIENNE"
    },

    // RENNES
    "ren/titular/red": {
        codigo: "/colors red 180 F0F0F0 000000 DC0D15",
        nombreEquipo: "RENNES"
    },
    "ren/titular/blue": {
        codigo: "/colors blue 180 F0F0F0 000000 DC0D15",
        nombreEquipo: "RENNES"
    },
    "ren/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 276DD6 1B50B5 276DD6",
        nombreEquipo: "RENNES"
    },
    "ren/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 276DD6 1B50B5 276DD6",
        nombreEquipo: "RENNES"
    },
    "ren/tercera/red": {
        codigo: "/colors red 180 000000 FFDF00",
        nombreEquipo: "RENNES"
    },
    "ren/tercera/blue": {
        codigo: "/colors blue 180 000000 FFDF00",
        nombreEquipo: "RENNES"
    },

    // FC NYVA VINNYTSIA
    "nyv/titular/red": {
        codigo: "/colors red 180 FFFFFF 42A161",
        nombreEquipo: "FC NYVA VINNYTSIA"
    },
    "nyv/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 42A161",
        nombreEquipo: "FC NYVA VINNYTSIA"
    },
    "nyv/alternativa/red": {
        codigo: "/colors red 90 439B73 3AA070 FFFFFF FFFFFF",
        nombreEquipo: "FC NYVA VINNYTSIA"
    },
    "nyv/alternativa/blue": {
        codigo: "/colors blue 90 439B73 3AA070 FFFFFF FFFFFF",
        nombreEquipo: "FC NYVA VINNYTSIA"
    },

    // ORLANDO CITY
    "orl/titular/red": {
        codigo: "/colors red 70 FFFFFF 3F0B74 360963 360963",
        nombreEquipo: "ORLANDO CITY"
    },
    "orl/titular/blue": {
        codigo: "/colors blue 70 FFFFFF 3F0B74 360963 360963",
        nombreEquipo: "ORLANDO CITY"
    },
    "orl/alternativa/red": {
        codigo: "/colors red 180 3F0B74 FFFFFF",
        nombreEquipo: "ORLANDO CITY"
    },
    "orl/alternativa/blue": {
        codigo: "/colors blue 180 3F0B74 FFFFFF",
        nombreEquipo: "ORLANDO CITY"
    },

    // ESTUDIANTES (BA)
    "eba/titular/red": {
        codigo: "/colors red 180 8C8C8C FFFFFF 000000 FFFFFF",
        nombreEquipo: "ESTUDIANTES (BA)"
    },
    "eba/titular/blue": {
        codigo: "/colors blue 180 8C8C8C FFFFFF 000000 FFFFFF",
        nombreEquipo: "ESTUDIANTES (BA)"
    },
    "eba/alternativa/red": {
        codigo: "/colors red 115 050505 EAE4E6 FFFFFF A89D9B",
        nombreEquipo: "ESTUDIANTES (BA)"
    },
    "eba/alternativa/blue": {
        codigo: "/colors blue 115 050505 EAE4E6 FFFFFF A89D9B",
        nombreEquipo: "ESTUDIANTES (BA)"
    },

    // ALMIRANTE BROWN
    "abrown/titular/red": {
        codigo: "/colors red 180 FFFFFF EBC80E 000000 EBC80E",
        nombreEquipo: "ALMIRANTE BROWN"
    },
    "abrown/titular/blue": {
        codigo: "/colors blue 180 FFFFFF EBC80E 000000 EBC80E",
        nombreEquipo: "ALMIRANTE BROWN"
    },
    "abrown/alternativa/red": {
        codigo: "/colors red 0 FFF34F 131313 131313 EBC80E",
        nombreEquipo: "ALMIRANTE BROWN"
    },
    "abrown/alternativa/blue": {
        codigo: "/colors blue 0 FFF34F 131313 131313 EBC80E",
        nombreEquipo: "ALMIRANTE BROWN"
    },
    "abrown/tercera/red": {
        codigo: "/colors red 90 E3C10E 1D1D1D FFFFFF EBC60D",
        nombreEquipo: "ALMIRANTE BROWN"
    },
    "abrown/tercera/blue": {
        codigo: "/colors blue 90 E3C10E 1D1D1D FFFFFF EBC60D",
        nombreEquipo: "ALMIRANTE BROWN"
    },

    // CENTRO DEPORTIVO ROCA
    "cdybgr/titular/red": {
        codigo: "/colors red 0 F7F3FF DC1E37 1C1A26",
        nombreEquipo: "CENTRO DEP. ROCA"
    },
    "cdybgr/titular/blue": {
        codigo: "/colors blue 0 F7F3FF DC1E37 1C1A26",
        nombreEquipo: "CENTRO DEP. ROCA"
    },
    "cdybgr/alternativa/red": {
        codigo: "/colors red 0 000000 FC224A FFFFFF C51641",
        nombreEquipo: "CENTRO DEP. ROCA"
    },
    "cdybgr/alternativa/blue": {
        codigo: "/colors blue 0 000000 FC224A FFFFFF C51641",
        nombreEquipo: "CENTRO DEP. ROCA"
    },
    "cdybgr/tercera/red": {
        codigo: "/colors red 0 757575 1E1916 FFFFFF DE231C",
        nombreEquipo: "CENTRO DEP. ROCA"
    },
    "cdybgr/tercera/blue": {
        codigo: "/colors blue 0 757575 1E1916 FFFFFF DE231C",
        nombreEquipo: "CENTRO DEP. ROCA"
    },
    "cdybgr/cuarta/red": {
        codigo: "/colors red 90 817F85 1E1916 FFFFFF DC241C",
        nombreEquipo: "CENTRO DEP. ROCA"
    },
    "cdybgr/cuarta/blue": {
        codigo: "/colors blue 90 817F85 1E1916 FFFFFF DC241C",
        nombreEquipo: "CENTRO DEP. ROCA"
    },
    "cdybgr/quinta/red": {
        codigo: "/colors red 0 D6BD8B 1E1916 FFFFFF DC1E37",
        nombreEquipo: "CENTRO DEP. ROCA"
    },
    "cdybgr/quinta/blue": {
        codigo: "/colors blue 0 D6BD8B 1E1916 FFFFFF DC1E37",
        nombreEquipo: "CENTRO DEP. ROCA"
    },

    // BOCHOFILO BOCHAZO
    "bochz/titular/red": {
        codigo: "/colors red 40 33376B BE2833 FFFFFF 2348A0",
        nombreEquipo: "BOCHOFILO BOCHAZO"
    },
    "bochz/titular/blue": {
        codigo: "/colors blue 40 33376B BE2833 FFFFFF 2348A0",
        nombreEquipo: "BOCHOFILO BOCHAZO"
    },

    // DINAMO ZAGREB
    "dzg/titular/red": {
        codigo: "/colors red 180 FFFFFF 0456C6",
        nombreEquipo: "DINAMO ZAGREB"
    },
    "dzg/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 0456C6",
        nombreEquipo: "DINAMO ZAGREB"
    },
    "dzg/alternativa/red": {
        codigo: "/colors red 60 1B1F10 DDFF51 E1FD5B",
        nombreEquipo: "DINAMO ZAGREB"
    },
    "dzg/alternativa/blue": {
        codigo: "/colors blue 60 1B1F10 DDFF51 E1FD5B",
        nombreEquipo: "DINAMO ZAGREB"
    },
    "dzg/tercera/red": {
        codigo: "/colors red 120 E5E811 213C69 1555AC",
        nombreEquipo: "DINAMO ZAGREB"
    },
    "dzg/tercera/blue": {
        codigo: "/colors blue 120 E5E811 213C69 1555AC",
        nombreEquipo: "DINAMO ZAGREB"
    },

    // BAYER LEVERKUSEN
    "b04/titular/red": {
        codigo: "/colors red 180 F6F8F7 252526 363636 252526",
        nombreEquipo: "BAYER LEVERKUSEN"
    },
    "b04/titular/blue": {
        codigo: "/colors blue 180 F6F8F7 252526 363636 252526",
        nombreEquipo: "BAYER LEVERKUSEN"
    },
    "b04/alternativa/red": {
        codigo: "/colors red 0 F1F2F4 E30720 F12D31 E30720",
        nombreEquipo: "BAYER LEVERKUSEN"
    },
    "b04/alternativa/blue": {
        codigo: "/colors blue 0 F1F2F4 E30720 F12D31 E30720",
        nombreEquipo: "BAYER LEVERKUSEN"
    },
    "b04/tercera/red": {
        codigo: "/colors red 30 262930 CACFD5 C3CCD3 CACFD5",
        nombreEquipo: "BAYER LEVERKUSEN"
    },
    "b04/tercera/blue": {
        codigo: "/colors blue 30 262930 CACFD5 C3CCD3 CACFD5",
        nombreEquipo: "BAYER LEVERKUSEN"
    },

    // VENEZIA FC
    "venfc/titular/red": {
        codigo: "/colors red 0 FFFFFF FE7200 161C28 008956",
        nombreEquipo: "VENEZIA FC"
    },
    "venfc/titular/blue": {
        codigo: "/colors blue 0 FFFFFF FE7200 161C28 008956",
        nombreEquipo: "VENEZIA FC"
    },

    // ATHLETIC BILBAO
    "ath/titular/red": {
        codigo: "/colors red 0 020300 EA011E FFFFFF EA011E",
        nombreEquipo: "ATHLETIC BILBAO"
    },
    "ath/titular/blue": {
        codigo: "/colors blue 0 020300 EA011E FFFFFF EA011E",
        nombreEquipo: "ATHLETIC BILBAO"
    },
    "ath/alternativa/red": {
        codigo: "/colors red 121 DECB89 225F3E 225F3E 30734A",
        nombreEquipo: "ATHLETIC BILBAO"
    },
    "ath/alternativa/blue": {
        codigo: "/colors blue 121 DECB89 225F3E 225F3E 30734A",
        nombreEquipo: "ATHLETIC BILBAO"
    },

    // ESPANYOL
    "rcde/titular/red": {
        codigo: "/colors red 0 272624 FFFFFF 006DB5 FFFFFF",
        nombreEquipo: "ESPANYOL"
    },
    "rcde/titular/blue": {
        codigo: "/colors blue 0 272624 FFFFFF 006DB5 FFFFFF",
        nombreEquipo: "ESPANYOL"
    },
    "rcde/alternativa/red": {
        codigo: "/colors red 0 FFFFFF 275F56 1B81D3 EBEDF2",
        nombreEquipo: "ESPANYOL"
    },
    "rcde/alternativa/blue": {
        codigo: "/colors blue 0 FFFFFF 275F56 1B81D3 EBEDF2",
        nombreEquipo: "ESPANYOL"
    },
    "rcde/tercera/red": {
        codigo: "/colors red 90 1E1916 F5CDCD F5ECE3 39282E",
        nombreEquipo: "ESPANYOL"
    },
    "rcde/tercera/blue": {
        codigo: "/colors blue 90 1E1916 F5CDCD F5ECE3 39282E",
        nombreEquipo: "ESPANYOL"
    },
    // RB LEIPZIG
    "rbl/titular/red": {
        codigo: "/colors red 60 DC0741 F0EDEE E3E0E1",
        nombreEquipo: "RB LEIPZIG"
    },
    "rbl/titular/blue": {
        codigo: "/colors blue 60 DC0741 F0EDEE E3E0E1",
        nombreEquipo: "RB LEIPZIG"
    },
    "rbl/alternativa/red": {
        codigo: "/colors red 180 DC0741 0D1E2D",
        nombreEquipo: "RB LEIPZIG"
    },
    "rbl/alternativa/blue": {
        codigo: "/colors blue 180 DC0741 0D1E2D",
        nombreEquipo: "RB LEIPZIG"
    },
    "rbl/tercera/red": {
        codigo: "/colors red 90 FEFEFE 242426 0E4182 A60D17",
        nombreEquipo: "RB LEIPZIG"
    },
    "rbl/tercera/blue": {
        codigo: "/colors blue 90 FEFEFE 242426 0E4182 A60D17",
        nombreEquipo: "RB LEIPZIG"
    },

    // MONTEVIDEO CITY TORQUE
    "mct/titular/red": {
        codigo: "/colors red 60 FFFFFF 76B3E2",
        nombreEquipo: "MONTEVIDEO CITY"
    },
    "mct/titular/blue": {
        codigo: "/colors blue 60 FFFFFF 76B3E2",
        nombreEquipo: "MONTEVIDEO CITY"
    },
    "mct/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 322D2A 413C39 484743",
        nombreEquipo: "MONTEVIDEO CITY"
    },
    "mct/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 322D2A 413C39 484743",
        nombreEquipo: "MONTEVIDEO CITY"
    },

    // MONTEVIDEO WANDERERS
    "wan/titular/red": {
        codigo: "/colors red 180 B8B8B8 FFFFFF 000000 FFFFFF",
        nombreEquipo: "MONTEVIDEO WANDERERS"
    },
    "wan/titular/blue": {
        codigo: "/colors blue 180 B8B8B8 FFFFFF 000000 FFFFFF",
        nombreEquipo: "MONTEVIDEO WANDERERS"
    },
    "wan/alternativa/red": {
        codigo: "/colors red 180 000000 78DEF9 A6E2F9 78DEF9",
        nombreEquipo: "MONTEVIDEO WANDERERS"
    },
    "wan/alternativa/blue": {
        codigo: "/colors blue 180 000000 78DEF9 A6E2F9 78DEF9",
        nombreEquipo: "MONTEVIDEO WANDERERS"
    },
    "wan/tercera/red": {
        codigo: "/colors red 180 000000 FFFFFF F1F1F1 FFFFFF",
        nombreEquipo: "MONTEVIDEO WANDERERS"
    },
    "wan/tercera/blue": {
        codigo: "/colors blue 180 000000 FFFFFF F1F1F1 FFFFFF",
        nombreEquipo: "MONTEVIDEO WANDERERS"
    },

    // HAMBURGER SV
    "hsv/titular/red": {
        codigo: "/colors red 90 0071D7 D40121 F2F1F7 F2F1F7",
        nombreEquipo: "HAMBURGER SV"
    },
    "hsv/titular/blue": {
        codigo: "/colors blue 90 0071D7 D40121 F2F1F7 F2F1F7",
        nombreEquipo: "HAMBURGER SV"
    },
    "hsv/alternativa/red": {
        codigo: "/colors red 180 FFFFFF FBB6D5 6D5E7C FBB6D5",
        nombreEquipo: "HAMBURGER SV"
    },
    "hsv/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF FBB6D5 6D5E7C FBB6D5",
        nombreEquipo: "HAMBURGER SV"
    },
    "hsv/tercera/red": {
        codigo: "/colors red 180 FFFFFF 2D2B2C 0D497D 2D2B2C",
        nombreEquipo: "HAMBURGER SV"
    },
    "hsv/tercera/blue": {
        codigo: "/colors blue 180 FFFFFF 2D2B2C 0D497D 2D2B2C",
        nombreEquipo: "HAMBURGER SV"
    },

    // NEWCASTLE UNITED
    "new/titular/red": {
        codigo: "/colors red 180 EA323E F6F5FA 29242A F6F5FA",
        nombreEquipo: "NEWCASTLE UNITED"
    },
    "new/titular/blue": {
        codigo: "/colors blue 180 EA323E F6F5FA 29242A F6F5FA",
        nombreEquipo: "NEWCASTLE UNITED"
    },
    "new/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 1C2023 143439 143439",
        nombreEquipo: "NEWCASTLE UNITED"
    },
    "new/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 1C2023 143439 143439",
        nombreEquipo: "NEWCASTLE UNITED"
    },
    "new/tercera/red": {
        codigo: "/colors red 90 111C4D EC440A F06C0F F06C0F",
        nombreEquipo: "NEWCASTLE UNITED"
    },
    "new/tercera/blue": {
        codigo: "/colors blue 90 111C4D EC440A F06C0F F06C0F",
        nombreEquipo: "NEWCASTLE UNITED"
    },

    // WEST HAM UNITED
    "whu/titular/red": {
        codigo: "/colors red 90 F3F2F7 C4E0EC 7C0C25 7C0C25",
        nombreEquipo: "WEST HAM"
    },
    "whu/titular/blue": {
        codigo: "/colors blue 90 F3F2F7 C4E0EC 7C0C25 7C0C25",
        nombreEquipo: "WEST HAM"
    },
    "whu/alternativa/red": {
        codigo: "/colors red 90 781A32 A8D5FF F4F4F4 F4F4F4",
        nombreEquipo: "WEST HAM"
    },
    "whu/alternativa/blue": {
        codigo: "/colors blue 90 781A32 A8D5FF F4F4F4 F4F4F4",
        nombreEquipo: "WEST HAM"
    },
    "whu/tercera/red": {
        codigo: "/colors red 58 FFFFFF AB2FC3 2C2B54 342F5F",
        nombreEquipo: "WEST HAM"
    },
    "whu/tercera/blue": {
        codigo: "/colors blue 58 FFFFFF AB2FC3 2C2B54 342F5F",
        nombreEquipo: "WEST HAM"
    },
    "whu/titular/red/2019": {
        codigo: "/colors red 90 FFFFFF A3C3EA 751A2C 751A2C",
        nombreEquipo: "WEST HAM"
    },
    "whu/titular/blue/2019": {
        codigo: "/colors blue 90 FFFFFF A3C3EA 751A2C 751A2C",
        nombreEquipo: "WEST HAM"
    },

    // TORONTO FC
    "tofc/titular/red": {
        codigo: "/colors red 33 FFFFFF E50126",
        nombreEquipo: "TORONTO FC"
    },
    "tofc/titular/blue": {
        codigo: "/colors blue 33 FFFFFF E50126",
        nombreEquipo: "TORONTO FC"
    },
    "tofc/alternativa/red": {
        codigo: "/colors red 240 1D1C21 E6EBEF",
        nombreEquipo: "TORONTO FC"
    },
    "tofc/alternativa/blue": {
        codigo: "/colors blue 240 1D1C21 E6EBEF",
        nombreEquipo: "TORONTO FC"
    },

    // INTER MIAMI CF
    "mia/titular/red": {
        codigo: "/colors red 180 2E2322 FEA3B4",
        nombreEquipo: "INTER MIAMI"
    },
    "mia/titular/blue": {
        codigo: "/colors blue 180 2E2322 FEA3B4",
        nombreEquipo: "INTER MIAMI"
    },
    "mia/alternativa/red": {
        codigo: "/colors red 90 FBCCD4 212123 2E2E30 212123",
        nombreEquipo: "INTER MIAMI"
    },
    "mia/alternativa/blue": {
        codigo: "/colors blue 90 FBCCD4 212123 2E2E30 212123",
        nombreEquipo: "INTER MIAMI"
    },

    // DEPORTIVO ESPAÑOL
    "cde/titular/red": {
        codigo: "/colors red 66 FFFFFF FFC100 CD0000 CD0000",
        nombreEquipo: "DEP. ESPAÑOL"
    },
    "cde/titular/blue": {
        codigo: "/colors blue 66 FFFFFF FFC100 CD0000 CD0000",
        nombreEquipo: "DEP. ESPAÑOL"
    },
    "cde/alternativa/red": {
        codigo: "/colors red 66 242D51 C80000 FFFFFF FFFFFF",
        nombreEquipo: "DEP. ESPAÑOL"
    },
    "cde/alternativa/blue": {
        codigo: "/colors blue 66 242D51 C80000 FFFFFF FFFFFF",
        nombreEquipo: "DEP. ESPAÑOL"
    },

    // SPORTIVO ITALIANO
    "sit/titular/red": {
        codigo: "/colors red 307 FFFFFF 1367C0 1367C0 374A89",
        nombreEquipo: "SPORTIVO ITALIANO"
    },
    "sit/titular/blue": {
        codigo: "/colors blue 307 FFFFFF 1367C0 1367C0 374A89",
        nombreEquipo: "SPORTIVO ITALIANO"
    },
    "sit/alternativa/red": {
        codigo: "/colors red 65 1E2C94 0D3986 FFFFFF FFFFFF",
        nombreEquipo: "SPORTIVO ITALIANO"
    },
    "sit/alternativa/blue": {
        codigo: "/colors blue 65 1E2C94 0D3986 FFFFFF FFFFFF",
        nombreEquipo: "SPORTIVO ITALIANO"
    },
    "sit/tercera/red": {
        codigo: "/colors red 180 FAF7FF 0C785B DF1B2B 0C785B",
        nombreEquipo: "SPORTIVO ITALIANO"
    },
    "sit/tercera/blue": {
        codigo: "/colors blue 180 FAF7FF 0C785B DF1B2B 0C785B",
        nombreEquipo: "SPORTIVO ITALIANO"
    },
    // CLUB DEPORTIVO MANDIYÚ
    "mdy/titular/red": {
        codigo: "/colors red 90 1AAD69 11B065 FFFFFF FFFFFF",
        nombreEquipo: "DEP. MANDIYÚ"
    },
    "mdy/titular/blue": {
        codigo: "/colors blue 90 1AAD69 11B065 FFFFFF FFFFFF",
        nombreEquipo: "DEP. MANDIYÚ"
    },
    "mdy/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 81D368 61CA65 61CA65",
        nombreEquipo: "DEP. MANDIYÚ"
    },
    "mdy/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 81D368 61CA65 61CA65",
        nombreEquipo: "DEP. MANDIYÚ"
    },

    // HULL CITY
    "hul/titular/red": {
        codigo: "/colors red 247 000000 F77F15 F77F15 180602",
        nombreEquipo: "HULL CITY"
    },
    "hul/titular/blue": {
        codigo: "/colors blue 247 000000 F77F15 F77F15 180602",
        nombreEquipo: "HULL CITY"
    },
    "hul/alternativa/red": {
        codigo: "/colors red 180 000000 FFFFFF",
        nombreEquipo: "HULL CITY"
    },
    "hul/alternativa/blue": {
        codigo: "/colors blue 180 000000 FFFFFF",
        nombreEquipo: "HULL CITY"
    },
    "hul/tercera/red": {
        codigo: "/colors red 247 FFFFFF 227592 227592 FFB10F",
        nombreEquipo: "HULL CITY"
    },
    "hul/tercera/blue": {
        codigo: "/colors blue 247 FFFFFF 227592 227592 FFB10F",
        nombreEquipo: "HULL CITY"
    },

    // WOLVERHAMPTON
    "wol/titular/red": {
        codigo: "/colors red 90 000000 F98E29 FB9F33 FDAD3B",
        nombreEquipo: "WOLVERHAMPTON"
    },
    "wol/titular/blue": {
        codigo: "/colors blue 90 000000 F98E29 FB9F33 FDAD3B",
        nombreEquipo: "WOLVERHAMPTON"
    },
    "wol/alternativa/red": {
        codigo: "/colors red 61 FFFFFF F99F03 202020 202020",
        nombreEquipo: "WOLVERHAMPTON"
    },
    "wol/alternativa/blue": {
        codigo: "/colors blue 61 FFFFFF F99F03 202020 202020",
        nombreEquipo: "WOLVERHAMPTON"
    },
    "wol/tercera/red": {
        codigo: "/colors red 0 F5F5F5 1F6452 3AAC88",
        nombreEquipo: "WOLVERHAMPTON"
    },
    "wol/tercera/blue": {
        codigo: "/colors blue 0 F5F5F5 1F6452 3AAC88",
        nombreEquipo: "WOLVERHAMPTON"
    },

    // CERRO LARGO
    "crl/titular/red": {
        codigo: "/colors red 180 1F1E26 FFFFFF 2454DF FFFFFF",
        nombreEquipo: "CERRO LARGO"
    },
    "crl/titular/blue": {
        codigo: "/colors blue 180 1F1E26 FFFFFF 2454DF FFFFFF",
        nombreEquipo: "CERRO LARGO"
    },
    "crl/alternativa/red": {
        codigo: "/colors red 61 1F1E26 0098CA",
        nombreEquipo: "CERRO LARGO"
    },
    "crl/alternativa/blue": {
        codigo: "/colors blue 61 1F1E26 0098CA",
        nombreEquipo: "CERRO LARGO"
    },

    // OLD CALEDONIANS FOOTBALL CLUB
    "ocfc/titular/red": {
        codigo: "/colors red 90 191919 F7F6FB",
        nombreEquipo: "OLD CALEDONIANS"
    },
    "ocfc/titular/blue": {
        codigo: "/colors blue 90 191919 F7F6FB",
        nombreEquipo: "OLD CALEDONIANS"
    },

    // DEFENSOR SPORTING
    "dfs/titular/red": {
        codigo: "/colors red 60 FFFFFF 6D4DB4",
        nombreEquipo: "DEFENSOR SPORTING"
    },
    "dfs/titular/blue": {
        codigo: "/colors blue 60 FFFFFF 6D4DB4",
        nombreEquipo: "DEFENSOR SPORTING"
    },
    "dfs/alternativa/red": {
        codigo: "/colors red 90 402E6B FFFFFF 6D4DB4 FFFFFF",
        nombreEquipo: "DEFENSOR SPORTING"
    },
    "dfs/alternativa/blue": {
        codigo: "/colors blue 90 402E6B FFFFFF 6D4DB4 FFFFFF",
        nombreEquipo: "DEFENSOR SPORTING"
    },

    // EVERTON VIÑA DEL MAR
    "evdm/titular/red": {
        codigo: "/colors red 90 FFFFFF 212647 FFE751 212647",
        nombreEquipo: "EVERTON VIÑA DEL MAR"
    },
    "evdm/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 212647 FFE751 212647",
        nombreEquipo: "EVERTON VIÑA DEL MAR"
    },
    "evdm/alternativa/red": {
        codigo: "/colors red 90 FFFFFF FFD763 303454 FFD763",
        nombreEquipo: "EVERTON VIÑA DEL MAR"
    },
    "evdm/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF FFD763 303454 FFD763",
        nombreEquipo: "EVERTON VIÑA DEL MAR"
    },

    // UNIÓN LA CALERA
    "ulc/titular/red": {
        codigo: "/colors red 50 FFFFFF BA1D38 D70100",
        nombreEquipo: "UNIÓN LA CALERA"
    },
    "ulc/titular/blue": {
        codigo: "/colors blue 50 FFFFFF BA1D38 D70100",
        nombreEquipo: "UNIÓN LA CALERA"
    },
    "ulc/alternativa/red": {
        codigo: "/colors red 66 000000 E31D39 FFFFFF FFFFFF",
        nombreEquipo: "UNIÓN LA CALERA"
    },
    "ulc/alternativa/blue": {
        codigo: "/colors blue 66 000000 E31D39 FFFFFF FFFFFF",
        nombreEquipo: "UNIÓN LA CALERA"
    },

    // AUDAX ITALIANO
    "aud/titular/red": {
        codigo: "/colors red 60 FFFFFF 045AD1",
        nombreEquipo: "AUDAX ITALIANO"
    },
    "aud/titular/blue": {
        codigo: "/colors blue 60 FFFFFF 045AD1",
        nombreEquipo: "AUDAX ITALIANO"
    },
    "aud/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 118247",
        nombreEquipo: "AUDAX ITALIANO"
    },
    "aud/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 118247",
        nombreEquipo: "AUDAX ITALIANO"
    },
    "aud/tercera/red": {
        codigo: "/colors red 90 339455 FFFFFF",
        nombreEquipo: "AUDAX ITALIANO"
    },
    "aud/tercera/blue": {
        codigo: "/colors blue 90 339455 FFFFFF",
        nombreEquipo: "AUDAX ITALIANO"
    },
    // HUACHIPATO
    "hua/titular/red": {
        codigo: "/colors red 180 FBFB1D 2B79F7 1F1F21 2B79F7",
        nombreEquipo: "HUACHIPATO"
    },
    "hua/titular/blue": {
        codigo: "/colors blue 180 FBFB1D 2B79F7 1F1F21 2B79F7",
        nombreEquipo: "HUACHIPATO"
    },
    "hua/alternativa/red": {
        codigo: "/colors red 180 FCFAFF BD1F36 711F2D BD1F36",
        nombreEquipo: "HUACHIPATO"
    },
    "hua/alternativa/blue": {
        codigo: "/colors blue 180 FCFAFF BD1F36 711F2D BD1F36",
        nombreEquipo: "HUACHIPATO"
    },

    // DEPORTES IQUIQUE
    "iqu/titular/red": {
        codigo: "/colors red 180 000000 A5D4FE 9DD3FF",
        nombreEquipo: "DEPORTES IQUIQUE"
    },
    "iqu/titular/blue": {
        codigo: "/colors blue 180 000000 A5D4FE 9DD3FF",
        nombreEquipo: "DEPORTES IQUIQUE"
    },
    "iqu/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 2557DA FF1727 2557DA",
        nombreEquipo: "DEPORTES IQUIQUE"
    },
    "iqu/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 2557DA FF1727 2557DA",
        nombreEquipo: "DEPORTES IQUIQUE"
    },

    // O'HIGGINS
    "ohi/titular/red": {
        codigo: "/colors red 60 000000 90C4EB",
        nombreEquipo: "O'HIGGINS"
    },
    "ohi/titular/blue": {
        codigo: "/colors blue 60 000000 90C4EB",
        nombreEquipo: "O'HIGGINS"
    },
    "ohi/alternativa/red": {
        codigo: "/colors red 60 FFFFFF 1E1E1F",
        nombreEquipo: "O'HIGGINS"
    },
    "ohi/alternativa/blue": {
        codigo: "/colors blue 60 FFFFFF 1E1E1F",
        nombreEquipo: "O'HIGGINS"
    },
    "ohi/tercera/red": {
        codigo: "/colors red 90 000000 FFFFFF BCBFC4 FFFFFF",
        nombreEquipo: "O'HIGGINS"
    },
    "ohi/tercera/blue": {
        codigo: "/colors blue 90 000000 FFFFFF BCBFC4 FFFFFF",
        nombreEquipo: "O'HIGGINS"
    },

    // UNIÓN ESPAÑOLA
    "ues/titular/red": {
        codigo: "/colors red 90 FFFFFF C5142E CF0D27 E01A33",
        nombreEquipo: "UNIÓN ESPAÑOLA"
    },
    "ues/titular/blue": {
        codigo: "/colors blue 90 FFFFFF C5142E CF0D27 E01A33",
        nombreEquipo: "UNIÓN ESPAÑOLA"
    },
    "ues/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 5D5D5D 717173 848484",
        nombreEquipo: "UNIÓN ESPAÑOLA"
    },
    "ues/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 5D5D5D 717173 848484",
        nombreEquipo: "UNIÓN ESPAÑOLA"
    },

    // SANTIAGO WANDERERS
    "swa/titular/red": {
        codigo: "/colors red 90 78FF28 017060 024A3E 024A3E",
        nombreEquipo: "SANTIAGO WANDERERS"
    },
    "swa/titular/blue": {
        codigo: "/colors blue 90 78FF28 017060 024A3E 024A3E",
        nombreEquipo: "SANTIAGO WANDERERS"
    },
    "swa/alternativa/red": {
        codigo: "/colors red 90 154142 FFFFFF C8C7CC FFFFFF",
        nombreEquipo: "SANTIAGO WANDERERS"
    },
    "swa/alternativa/blue": {
        codigo: "/colors blue 90 154142 FFFFFF C8C7CC FFFFFF",
        nombreEquipo: "SANTIAGO WANDERERS"
    },

    // CURICÓ UNIDO
    "cur/titular/red": {
        codigo: "/colors red 35 6E1010 FFFFFF D92814 FFFFFF",
        nombreEquipo: "CURICÓ UNIDO"
    },
    "cur/titular/blue": {
        codigo: "/colors blue 35 6E1010 FFFFFF D92814 FFFFFF",
        nombreEquipo: "CURICÓ UNIDO"
    },
    "cur/alternativa/red": {
        codigo: "/colors red 35 ABABAB D92814 FFFFFF D92814",
        nombreEquipo: "CURICÓ UNIDO"
    },
    "cur/alternativa/blue": {
        codigo: "/colors blue 35 ABABAB D92814 FFFFFF D92814",
        nombreEquipo: "CURICÓ UNIDO"
    },

    // DEPORTES ANTOFAGASTA
    "cda/titular/red": {
        codigo: "/colors red 0 1865A5 FFFFFF 328AF8",
        nombreEquipo: "DEP. ANTOFAGASTA"
    },
    "cda/titular/blue": {
        codigo: "/colors blue 0 1865A5 FFFFFF 328AF8",
        nombreEquipo: "DEP. ANTOFAGASTA"
    },
    "cda/alternativa/red": {
        codigo: "/colors red 0 FFFFFF 1A1A1A D71F29",
        nombreEquipo: "DEP. ANTOFAGASTA"
    },
    "cda/alternativa/blue": {
        codigo: "/colors blue 0 FFFFFF 1A1A1A D71F29",
        nombreEquipo: "DEP. ANTOFAGASTA"
    },

    // U. DE CONCEPCIÓN
    "ucon/titular/red": {
        codigo: "/colors red 90 2C3554 F1E63E F1E63E F1E63E",
        nombreEquipo: "U. DE CONCEPCIÓN"
    },
    "ucon/titular/blue": {
        codigo: "/colors blue 90 2C3554 F1E63E F1E63E F1E63E",
        nombreEquipo: "U. DE CONCEPCIÓN"
    },
    "ucon/alternativa/red": {
        codigo: "/colors red 60 FEEB2C 6285ED 293155 293155",
        nombreEquipo: "U. DE CONCEPCIÓN"
    },
    "ucon/alternativa/blue": {
        codigo: "/colors blue 60 FEEB2C 6285ED 293155 293155",
        nombreEquipo: "U. DE CONCEPCIÓN"
    },

    // DEPORTES LA SERENA
    "dls/titular/red": {
        codigo: "/colors red 60 FEFEFE 530928 450722 450722",
        nombreEquipo: "DEP. LA SERENA"
    },
    "dls/titular/blue": {
        codigo: "/colors blue 60 FEFEFE 530928 450722 450722",
        nombreEquipo: "DEP. LA SERENA"
    },
    "dls/alternativa/red": {
        codigo: "/colors red 60 5D0027 FFFFFF EEEEEE EEEEEE",
        nombreEquipo: "DEP. LA SERENA"
    },
    "dls/alternativa/blue": {
        codigo: "/colors blue 60 5D0027 FFFFFF EEEEEE EEEEEE",
        nombreEquipo: "DEP. LA SERENA"
    },
    // COQUIMBO UNIDO
    "coq/titular/red": {
        codigo: "/colors red 0 000000 202020 F4C505",
        nombreEquipo: "COQUIMBO UNIDO"
    },
    "coq/titular/blue": {
        codigo: "/colors blue 0 000000 202020 F4C505",
        nombreEquipo: "COQUIMBO UNIDO"
    },
    "coq/alternativa/red": {
        codigo: "/colors red 55 000000 E7E7E7 E7E7E7 F4C606",
        nombreEquipo: "COQUIMBO UNIDO"
    },
    "coq/alternativa/blue": {
        codigo: "/colors blue 55 000000 E7E7E7 E7E7E7 F4C606",
        nombreEquipo: "COQUIMBO UNIDO"
    },

    // SPIDERMAN
    "spiderman/red": {
        codigo: "/colors red 90 DF1F2D DF1F2D 2B3784 2B3784",
        nombreEquipo: "TEAM SPIDERMAN"
    },
    "spiderman/blue": {
        codigo: "/colors blue 90 DF1F2D DF1F2D 2B3784 2B3784",
        nombreEquipo: "TEAM SPIDERMAN"
    },

    // HULK
    "hulk/red": {
        codigo: "/colors red 90 A2CD48 A2CD48 A2CD48 875094",
        nombreEquipo: "TEAM HULK"
    },
    "hulk/blue": {
        codigo: "/colors blue 90 A2CD48 A2CD48 A2CD48 875094",
        nombreEquipo: "TEAM HULK"
    },

    // CAPITÁN AMÉRICA
    "capitanamerica/red": {
        codigo: "/colors red 90 FFFFFF 1849CA 1849CA EC2004",
        nombreEquipo: "TEAM CAPITÁN AMÉRICA"
    },
    "capitanamerica/blue": {
        codigo: "/colors blue 90 FFFFFF 1849CA 1849CA EC2004",
        nombreEquipo: "TEAM CAPITÁN AMÉRICA"
    },

    // BATMAN
    "batman/red": {
        codigo: "/colors red 90 FDFF00 282E3C 282E3C 505C7C",
        nombreEquipo: "TEAM BATMAN"
    },
    "batman/blue": {
        codigo: "/colors blue 90 FDFF00 282E3C 282E3C 505C7C",
        nombreEquipo: "TEAM BATMAN"
    },

    // BELGRANO ATHLETIC CLUB
    "bac/titular/red": {
        codigo: "/colors red 90 FFFFFF FFCC00 994C00 FFCC00",
        nombreEquipo: "BELGRANO ATHLETIC CLUB"
    },
    "bac/titular/blue": {
        codigo: "/colors blue 90 FFFFFF FFCC00 994C00 FFCC00",
        nombreEquipo: "BELGRANO ATHLETIC CLUB"
    },
    "bac/alternativa/red": {
        codigo: "/colors red 180 FFEB20 1B7967 FE3045 1B7967",
        nombreEquipo: "BELGRANO ATHLETIC CLUB"
    },
    "bac/alternativa/blue": {
        codigo: "/colors blue 180 FFEB20 1B7967 FE3045 1B7967",
        nombreEquipo: "BELGRANO ATHLETIC CLUB"
    },

    // ROSARIO ATHLETIC CLUB
    "roac/titular/red": {
        codigo: "/colors red 0 FFFFFF 8F3A52 229CD8",
        nombreEquipo: "ROSARIO ATHLETIC CLUB"
    },
    "roac/titular/blue": {
        codigo: "/colors blue 0 FFFFFF 8F3A52 229CD8",
        nombreEquipo: "ROSARIO ATHLETIC CLUB"
    },

    // CLUB ATLÉTICO PORTEÑO
    "caport/titular/red": {
        codigo: "/colors red 0 2B2B2B FFFFFF 4B55D9 FFFFFF",
        nombreEquipo: "CA. PORTEÑO"
    },
    "caport/titular/blue": {
        codigo: "/colors blue 0 2B2B2B FFFFFF 4B55D9 FFFFFF",
        nombreEquipo: "CA. PORTEÑO"
    },

    // VILLAREAL
    "vil/titular/red": {
        codigo: "/colors red 90 194667 F9EA6B",
        nombreEquipo: "VILLAREAL"
    },
    "vil/titular/blue": {
        codigo: "/colors blue 90 194667 F9EA6B",
        nombreEquipo: "VILLAREAL"
    },
    "vil/alternativa/red": {
        codigo: "/colors red 90 E1DC06 143151",
        nombreEquipo: "VILLAREAL"
    },
    "vil/alternativa/blue": {
        codigo: "/colors blue 90 E1DC06 143151",
        nombreEquipo: "VILLAREAL"
    },

    // CELTA DE VIGO
    "cel/titular/red": {
        codigo: "/colors red 136 141414 43B5F4 8DDDFE 8DDDFE",
        nombreEquipo: "CELTA DE VIGO"
    },
    "cel/titular/blue": {
        codigo: "/colors blue 136 141414 43B5F4 8DDDFE 8DDDFE",
        nombreEquipo: "CELTA DE VIGO"
    },

    // MALLORCA
    "mll/titular/red": {
        codigo: "/colors red 90 FFFFFF FE5341 D42A2A D42A2A",
        nombreEquipo: "MALLORCA"
    },
    "mll/titular/blue": {
        codigo: "/colors blue 90 FFFFFF FE5341 D42A2A D42A2A",
        nombreEquipo: "MALLORCA"
    },

    // LEEDS UNITED
    "lee/titular/red": {
        codigo: "/colors red 123 000000 E7FE68 FFFFFF FFFFFF",
        nombreEquipo: "LEEDS UNITED"
    },
    "lee/titular/blue": {
        codigo: "/colors blue 123 000000 E7FE68 FFFFFF FFFFFF",
        nombreEquipo: "LEEDS UNITED"
    },
    "lee/alternativa/red": {
        codigo: "/colors red 123 FFFFFF 00113D 021A86 021A86",
        nombreEquipo: "LEEDS UNITED"
    },
    "lee/alternativa/blue": {
        codigo: "/colors blue 123 FFFFFF 00113D 021A86 021A86",
        nombreEquipo: "LEEDS UNITED"
    },

    // SUIZA
    "sui/titular/red": {
        codigo: "/colors red 90 F3EDF1 F8F8F8 F6272F F6272F",
        nombreEquipo: "SUIZA"
    },
    "sui/titular/blue": {
        codigo: "/colors blue 90 F3EDF1 F8F8F8 F6272F F6272F",
        nombreEquipo: "SUIZA"
    },
    "sui/alternativa/red": {
        codigo: "/colors red 90 A12638 F6F7FC F9EBF5 F1DDE4",
        nombreEquipo: "SUIZA"
    },
    "sui/alternativa/blue": {
        codigo: "/colors blue 90 A12638 F6F7FC F9EBF5 F1DDE4",
        nombreEquipo: "SUIZA"
    },
    "sui/titular2021/red": {
        codigo: "/colors red 90 FFFFFF 770316 E40017 E40017",
        nombreEquipo: "SUIZA"
    },
    "sui/titular2021/blue": {
        codigo: "/colors blue 90 FFFFFF 770316 E40017 E40017",
        nombreEquipo: "SUIZA"
    },

    // SUECIA
    "swe/titular/red": {
        codigo: "/colors red 123 2D4466 F3E731",
        nombreEquipo: "SUECIA"
    },
    "swe/titular/blue": {
        codigo: "/colors blue 123 2D4466 F3E731",
        nombreEquipo: "SUECIA"
    },
    "swe/alternativa/red": {
        codigo: "/colors red 90 F3EA5D F0EB0B 152A49 1B2E4E",
        nombreEquipo: "SUECIA"
    },
    "swe/alternativa/blue": {
        codigo: "/colors blue 90 F3EA5D F0EB0B 152A49 1B2E4E",
        nombreEquipo: "SUECIA"
    },

    // CRUCERO DEL NORTE
    "cdn/titular/red": {
        codigo: "/colors red 90 000000 FEED6B FEED6B 5F5D58",
        nombreEquipo: "CRUCERO DEL NORTE"
    },
    "cdn/titular/blue": {
        codigo: "/colors blue 90 000000 FEED6B FEED6B 5F5D58",
        nombreEquipo: "CRUCERO DEL NORTE"
    },
    "cdn/titular/2014/red": {
        codigo: "/colors red 0 1E1E1E F8E409 F58603",
        nombreEquipo: "CRUCERO DEL NORTE"
    },
    "cdn/titular/2014/blue": {
        codigo: "/colors blue 0 1E1E1E F8E409 F58603",
        nombreEquipo: "CRUCERO DEL NORTE"
    },
    "cdn/alternativa/2014/red": {
        codigo: "/colors red 0 1E1D2D EB5C32 EEED33",
        nombreEquipo: "CRUCERO DEL NORTE"
    },
    "cdn/alternativa/2014/blue": {
        codigo: "/colors blue 0 1E1D2D EB5C32 EEED33",
        nombreEquipo: "CRUCERO DEL NORTE"
    },
    "cdn/titular/2013/red": {
        codigo: "/colors red 116 1D1E10 E74A03 F8E622 F8E622",
        nombreEquipo: "CRUCERO DEL NORTE"
    },
    "cdn/titular/2013/blue": {
        codigo: "/colors blue 116 1D1E10 E74A03 F8E622 F8E622",
        nombreEquipo: "CRUCERO DEL NORTE"
    },

    // SC BRAGA
    "scb/titular/red": {
        codigo: "/colors red 127 C2C2C2 FFFFFF FD2F22 FD2F22",
        nombreEquipo: "SC BRAGA"
    },
    "scb/titular/blue": {
        codigo: "/colors blue 127 C2C2C2 FFFFFF FD2F22 FD2F22",
        nombreEquipo: "SC BRAGA"
    },

    // SPORTING CP
    "spo/titular/red": {
        codigo: "/colors red 90 252A30 0F8469 FFFFFF 0F8469",
        nombreEquipo: "SPORTING CP"
    },
    "spo/titular/blue": {
        codigo: "/colors blue 90 252A30 0F8469 FFFFFF 0F8469",
        nombreEquipo: "SPORTING CP"
    },

    // FC PORTO
    "fcp/titular/red": {
        codigo: "/colors red 180 F83539 013FBB FFFFFF 013FBB",
        nombreEquipo: "FC PORTO"
    },
    "fcp/titular/blue": {
        codigo: "/colors blue 180 F83539 013FBB FFFFFF 013FBB",
        nombreEquipo: "FC PORTO"
    },

    // SL BENFICA
    "ben/titular/red": {
        codigo: "/colors red 90 FFFFFF E62B32",
        nombreEquipo: "SL BENFICA"
    },
    "ben/titular/blue": {
        codigo: "/colors blue 90 FFFFFF E62B32",
        nombreEquipo: "SL BENFICA"
    },
    // CAMERÚN
    "cmr/titular/red": {
        codigo: "/colors red 110 F7D504 CF1F24 016D3C 016D3C",
        nombreEquipo: "CAMERÚN"
    },
    "cmr/titular/blue": {
        codigo: "/colors blue 110 F7D504 CF1F24 016D3C 016D3C",
        nombreEquipo: "CAMERÚN"
    },
    "cmr/alternativa/red": {
        codigo: "/colors red 110 048350 E22B31 F6E000 FAD701",
        nombreEquipo: "CAMERÚN"
    },
    "cmr/alternativa/blue": {
        codigo: "/colors blue 110 048350 E22B31 F6E000 FAD701",
        nombreEquipo: "CAMERÚN"
    },

    // COSTA DE MARFIL
    "cdm/titular/red": {
        codigo: "/colors red 90 EEEEEE 038650 FE9D01 F26909",
        nombreEquipo: "COSTA DE MARFIL"
    },
    "cdm/titular/blue": {
        codigo: "/colors blue 90 EEEEEE 038650 FE9D01 F26909",
        nombreEquipo: "COSTA DE MARFIL"
    },
    "cdm/alternativa/red": {
        codigo: "/colors red 90 FFAD2F F7F7F9",
        nombreEquipo: "COSTA DE MARFIL"
    },
    "cdm/alternativa/blue": {
        codigo: "/colors blue 90 FFAD2F F7F7F9",
        nombreEquipo: "COSTA DE MARFIL"
    },

    // UCRANIA
    "ukr/titular/red": {
        codigo: "/colors red 90 0083D5 019FE0 FAEA59 FAEA59",
        nombreEquipo: "UCRANIA"
    },
    "ukr/titular/blue": {
        codigo: "/colors blue 90 0083D5 019FE0 FAEA59 FAEA59",
        nombreEquipo: "UCRANIA"
    },
    "ukr/alternativa/red": {
        codigo: "/colors red 90 EEDD30 129CEA 12A9ED 12A9ED",
        nombreEquipo: "UCRANIA"
    },
    "ukr/alternativa/blue": {
        codigo: "/colors blue 90 EEDD30 129CEA 12A9ED 12A9ED",
        nombreEquipo: "UCRANIA"
    },
    "ukr/bandera/red": {
        codigo: "/colors red 90 24167D 005BBB FFD500",
        nombreEquipo: "UCRANIA"
    },
    "ukr/bandera/blue": {
        codigo: "/colors blue 90 24167D 005BBB FFD500",
        nombreEquipo: "UCRANIA"
    },

    // SAN MIGUEL
    "sm/titular/red": {
        codigo: "/colors red 180 0366C1 00933F FFFFFF 00933F",
        nombreEquipo: "SAN MIGUEL"
    },
    "sm/titular/blue": {
        codigo: "/colors blue 180 0366C1 00933F FFFFFF 00933F",
        nombreEquipo: "SAN MIGUEL"
    },
    "sm/alternativa/red": {
        codigo: "/colors red 55 80E7A6 2F485E 25374D 243145",
        nombreEquipo: "SAN MIGUEL"
    },
    "sm/alternativa/blue": {
        codigo: "/colors blue 55 80E7A6 2F485E 25374D 243145",
        nombreEquipo: "SAN MIGUEL"
    },

    // LAFERRERE
    "laf/titular/red": {
        codigo: "/colors red 180 D71E3E 346838 FFFFFF 346838",
        nombreEquipo: "LAFERRERE"
    },
    "laf/titular/blue": {
        codigo: "/colors blue 180 D71E3E 346838 FFFFFF 346838",
        nombreEquipo: "LAFERRERE"
    },

    // MÉXICO
    "mex/titular/red": {
        codigo: "/colors red 90 FFFFFF 045D55 067957 08A56C",
        nombreEquipo: "MÉXICO"
    },
    "mex/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 045D55 067957 08A56C",
        nombreEquipo: "MÉXICO"
    },
    "mex/alternativa/red": {
        codigo: "/colors red 70 E53A4C 048545 FFFFFF FFFFFF",
        nombreEquipo: "MÉXICO"
    },
    "mex/alternativa/blue": {
        codigo: "/colors blue 70 E53A4C 048545 FFFFFF FFFFFF",
        nombreEquipo: "MÉXICO"
    },
    "mex/bandera/red": {
        codigo: "/colors red 0 4D2A15 006847 FFFFFF CE1126",
        nombreEquipo: "MÉXICO"
    },
    "mex/bandera/blue": {
        codigo: "/colors blue 0 4D2A15 006847 FFFFFF CE1126",
        nombreEquipo: "MÉXICO"
    },
    "mex/tercera/red": {
        codigo: "/colors red 70 19744A 8A2F3E F1F1F3 F6F6F6",
        nombreEquipo: "MÉXICO"
    },
    "mex/tercera/blue": {
        codigo: "/colors blue 70 19744A 8A2F3E F1F1F3 F6F6F6",
        nombreEquipo: "MÉXICO"
    },

    // SENEGAL
    "sen/titular/red": {
        codigo: "/colors red 90 01A283 E3EFF2 F4F2E3 F9E7EC",
        nombreEquipo: "SENEGAL"
    },
    "sen/titular/blue": {
        codigo: "/colors blue 90 01A283 E3EFF2 F4F2E3 F9E7EC",
        nombreEquipo: "SENEGAL"
    },
    "sen/alternativa/red": {
        codigo: "/colors red 90 C3EC31 C0E933 38543F 38543F",
        nombreEquipo: "SENEGAL"
    },
    "sen/alternativa/blue": {
        codigo: "/colors blue 90 C3EC31 C0E933 38543F 38543F",
        nombreEquipo: "SENEGAL"
    },
    "sen/bandera/red": {
        codigo: "/colors red 0 028768 02AF94 F6DC47 FC1A2E",
        nombreEquipo: "SENEGAL"
    },
    "sen/bandera/blue": {
        codigo: "/colors blue 0 028768 02AF94 F6DC47 FC1A2E",
        nombreEquipo: "SENEGAL"
    },

    // IRÁN
    "irn/titular/red": {
        codigo: "/colors red 120 C52936 5CC26E FFFFFF FFFFFF",
        nombreEquipo: "IRÁN"
    },
    "irn/titular/blue": {
        codigo: "/colors blue 120 C52936 5CC26E FFFFFF FFFFFF",
        nombreEquipo: "IRÁN"
    },
    "irn/alternativa/red": {
        codigo: "/colors red 120 FFFFFF 88DC91 F0273A F0273A",
        nombreEquipo: "IRÁN"
    },
    "irn/alternativa/blue": {
        codigo: "/colors blue 120 FFFFFF 88DC91 F0273A F0273A",
        nombreEquipo: "IRÁN"
    },

    // POLONIA
    "pol/titular/red": {
        codigo: "/colors red 63 AB0C28 F1F2F7",
        nombreEquipo: "POLONIA"
    },
    "pol/titular/blue": {
        codigo: "/colors blue 63 AB0C28 F1F2F7",
        nombreEquipo: "POLONIA"
    },
    "pol/alternativa/red": {
        codigo: "/colors red 63 FFFFFF AD011B",
        nombreEquipo: "POLONIA"
    },
    "pol/alternativa/blue": {
        codigo: "/colors blue 63 FFFFFF AD011B",
        nombreEquipo: "POLONIA"
    },

    // COSTA RICA
    "crc/titular/red": {
        codigo: "/colors red 90 FFFFFF 0252B0 D80122 D80122",
        nombreEquipo: "COSTA RICA"
    },
    "crc/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 0252B0 D80122 D80122",
        nombreEquipo: "COSTA RICA"
    },
    "crc/alternativa/red": {
        codigo: "/colors red 90 263849 122A41 FFFFFF FFFFFF",
        nombreEquipo: "COSTA RICA"
    },
    "crc/alternativa/blue": {
        codigo: "/colors blue 90 263849 122A41 FFFFFF FFFFFF",
        nombreEquipo: "COSTA RICA"
    },

    // CANADÁ
    "can/titular/red": {
        codigo: "/colors red 90 FFFFFF F11D34 E20025 E20025",
        nombreEquipo: "CANADÁ"
    },
    "can/titular/blue": {
        codigo: "/colors blue 90 FFFFFF F11D34 E20025 E20025",
        nombreEquipo: "CANADÁ"
    },
    "can/alternativa/red": {
        codigo: "/colors red 65 ED4459 D70125 F8F8FA F8F8FA",
        nombreEquipo: "CANADÁ"
    },
    "can/alternativa/blue": {
        codigo: "/colors blue 65 ED4459 D70125 F8F8FA F8F8FA",
        nombreEquipo: "CANADÁ"
    },

    // MARRUECOS
    "mar/titular/red": {
        codigo: "/colors red 90 FFFFFF 038A4A F4001A F4001A",
        nombreEquipo: "MARRUECOS"
    },
    "mar/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 038A4A F4001A F4001A",
        nombreEquipo: "MARRUECOS"
    },
    "mar/alternativa/red": {
        codigo: "/colors red 90 098468 7F2830 FFFFFF FFFFFF",
        nombreEquipo: "MARRUECOS"
    },
    "mar/alternativa/blue": {
        codigo: "/colors blue 90 098468 7F2830 FFFFFF FFFFFF",
        nombreEquipo: "MARRUECOS"
    },

    // SERBIA
    "srb/titular/red": {
        codigo: "/colors red 120 E1B876 AF0013 CF0221 CF0221",
        nombreEquipo: "SERBIA"
    },
    "srb/titular/blue": {
        codigo: "/colors blue 120 E1B876 AF0013 CF0221 CF0221",
        nombreEquipo: "SERBIA"
    },
    "srb/alternativa/red": {
        codigo: "/colors red 90 C7DE45 1F2545 FFFFFF FFFFFF",
        nombreEquipo: "SERBIA"
    },
    "srb/alternativa/blue": {
        codigo: "/colors blue 90 C7DE45 1F2545 FFFFFF FFFFFF",
        nombreEquipo: "SERBIA"
    },
    // GHANA
    "gha/titular/red": {
        codigo: "/colors red 90 0A745C 211C22 D3D2D9 FFFFFF",
        nombreEquipo: "GHANA"
    },
    "gha/titular/blue": {
        codigo: "/colors blue 90 0A745C 211C22 D3D2D9 FFFFFF",
        nombreEquipo: "GHANA"
    },
    "gha/alternativa/red": {
        codigo: "/colors red 90 006E49 1A241C F4E100 F4E100",
        nombreEquipo: "GHANA"
    },
    "gha/alternativa/blue": {
        codigo: "/colors blue 90 006E49 1A241C F4E100 F4E100",
        nombreEquipo: "GHANA"
    },

    // TÚNEZ
    "tun/titular/red": {
        codigo: "/colors red 90 FE4C4F F1F2F8 FFFFFF",
        nombreEquipo: "TÚNEZ"
    },
    "tun/titular/blue": {
        codigo: "/colors blue 90 FE4C4F F1F2F8 FFFFFF",
        nombreEquipo: "TÚNEZ"
    },
    "tun/alternativa/red": {
        codigo: "/colors red 90 FFFFFF FC2539 EB0A2F",
        nombreEquipo: "TÚNEZ"
    },
    "tun/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF FC2539 EB0A2F",
        nombreEquipo: "TÚNEZ"
    },

    // DINAMARCA
    "den/titular/red": {
        codigo: "/colors red 90 FFFFFF F2F1F7 BD0215 DD0023",
        nombreEquipo: "DINAMARCA"
    },
    "den/titular/blue": {
        codigo: "/colors blue 90 FFFFFF F2F1F7 BD0215 DD0023",
        nombreEquipo: "DINAMARCA"
    },
    "den/alternativa/red": {
        codigo: "/colors red 65 E02435 CA0B2C FFFFFF FFFFFF",
        nombreEquipo: "DINAMARCA"
    },
    "den/alternativa/blue": {
        codigo: "/colors blue 65 E02435 CA0B2C FFFFFF FFFFFF",
        nombreEquipo: "DINAMARCA"
    },

    // ARABIA SAUDITA
    "ksa/titular/red": {
        codigo: "/colors red 90 02906A FFFFFF",
        nombreEquipo: "ARABIA SAUDITA"
    },
    "ksa/titular/blue": {
        codigo: "/colors blue 90 02906A FFFFFF",
        nombreEquipo: "ARABIA SAUDITA"
    },
    "ksa/alternativa/red": {
        codigo: "/colors red 130 EBF0F3 033D31 033D31 02906A",
        nombreEquipo: "ARABIA SAUDITA"
    },
    "ksa/alternativa/blue": {
        codigo: "/colors blue 130 EBF0F3 033D31 033D31 02906A",
        nombreEquipo: "ARABIA SAUDITA"
    },

    // COREA DEL SUR
    "kor/titular/red": {
        codigo: "/colors red 90 0F0C0F FFB6D1 FF859E EF3A46",
        nombreEquipo: "COREA DEL SUR"
    },
    "kor/titular/blue": {
        codigo: "/colors blue 90 0F0C0F FFB6D1 FF859E EF3A46",
        nombreEquipo: "COREA DEL SUR"
    },
    "kor/alternativa/red": {
        codigo: "/colors red 76 DEBF80 1C1D24 FFFFFF FFFFFF",
        nombreEquipo: "COREA DEL SUR"
    },
    "kor/alternativa/blue": {
        codigo: "/colors blue 76 DEBF80 1C1D24 FFFFFF FFFFFF",
        nombreEquipo: "COREA DEL SUR"
    },

    // PLAZA COLONIA
    "pcol/titular/red": {
        codigo: "/colors red 114 095320 5FB286 A8C3B2 FFFFFF",
        nombreEquipo: "PLAZA COLONIA"
    },
    "pcol/titular/blue": {
        codigo: "/colors blue 114 095320 5FB286 A8C3B2 FFFFFF",
        nombreEquipo: "PLAZA COLONIA"
    },
    "pcol/alternativa/red": {
        codigo: "/colors red 63 1BA470 151F29",
        nombreEquipo: "PLAZA COLONIA"
    },
    "pcol/alternativa/blue": {
        codigo: "/colors blue 63 1BA470 151F29",
        nombreEquipo: "PLAZA COLONIA"
    },

    // DEPORTIVO TACHIRA
    "tach/titular/red": {
        codigo: "/colors red 180 FFFFFF FFD401 171918 FFD401",
        nombreEquipo: "DEPORTIVO TACHIRA"
    },
    "tach/titular/blue": {
        codigo: "/colors blue 180 FFFFFF FFD401 171918 FFD401",
        nombreEquipo: "DEPORTIVO TACHIRA"
    },
    "tach/alternativa/red": {
        codigo: "/colors red 124 000100 FFCD00 CECBD2 F1F1F1",
        nombreEquipo: "DEPORTIVO TACHIRA"
    },
    "tach/alternativa/blue": {
        codigo: "/colors blue 124 000100 FFCD00 CECBD2 F1F1F1",
        nombreEquipo: "DEPORTIVO TACHIRA"
    },

    // CARACAS
    "carc/titular/red": {
        codigo: "/colors red 128 FFFFFF 271B1D C72F2C C72F2C",
        nombreEquipo: "CARACAS"
    },
    "carc/titular/blue": {
        codigo: "/colors blue 128 FFFFFF 271B1D C72F2C C72F2C",
        nombreEquipo: "CARACAS"
    },
    "carc/alternativa/red": {
        codigo: "/colors red 128 000000 FFFFFF EAEAEA",
        nombreEquipo: "CARACAS"
    },
    "carc/alternativa/blue": {
        codigo: "/colors blue 128 000000 FFFFFF EAEAEA",
        nombreEquipo: "CARACAS"
    },

    // MONAGAS
    "mng/titular/red": {
        codigo: "/colors red 180 FFFFFF 000045 A10000 000045",
        nombreEquipo: "MONAGAS"
    },
    "mng/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 000045 A10000 000045",
        nombreEquipo: "MONAGAS"
    },
    "mng/alternativa/red": {
        codigo: "/colors red 128 000000 DDFF00",
        nombreEquipo: "MONAGAS"
    },
    "mng/alternativa/blue": {
        codigo: "/colors blue 128 000000 DDFF00",
        nombreEquipo: "MONAGAS"
    },

    // DEPORTIVO LARA
    "dlar/titular/red": {
        codigo: "/colors red 180 F0F0F0 E70026 302A2E E70026",
        nombreEquipo: "DEP. LARA"
    },
    "dlar/titular/blue": {
        codigo: "/colors blue 180 F0F0F0 E70026 302A2E E70026",
        nombreEquipo: "DEP. LARA"
    },
    "dlar/alternativa/red": {
        codigo: "/colors red 128 B31F2B FFFFFF",
        nombreEquipo: "DEP. LARA"
    },
    "dlar/alternativa/blue": {
        codigo: "/colors blue 128 B31F2B FFFFFF",
        nombreEquipo: "DEP. LARA"
    },

    // UNIVERSIDAD CESAR VALLEJO
    "ucv/titular/red": {
        codigo: "/colors red 180 FFFFFF F9591D FD6617 FD6617",
        nombreEquipo: "U. CESAR VALLEJO"
    },
    "ucv/titular/blue": {
        codigo: "/colors blue 180 FFFFFF F9591D FD6617 FD6617",
        nombreEquipo: "U. CESAR VALLEJO"
    },
    "ucv/alternativa/red": {
        codigo: "/colors red 180 FFFFFF 031B47 03173D 03173D",
        nombreEquipo: "U. CESAR VALLEJO"
    },
    "ucv/alternativa/blue": {
        codigo: "/colors blue 180 FFFFFF 031B47 03173D 03173D",
        nombreEquipo: "U. CESAR VALLEJO"
    },

    // CLUB DEPORTIVO UNIVERSIDAD CATOLICA
    "depuca/titular/red": {
        codigo: "/colors red 180 042544 9DCCE1 96C8E1",
        nombreEquipo: "CLUB DEP. UNIVERSIDAD CATOLICA"
    },
    "depuca/titular/blue": {
        codigo: "/colors blue 180 042544 9DCCE1 96C8E1",
        nombreEquipo: "CLUB DEP. UNIVERSIDAD CATOLICA"
    },
    "depuca/alternativa/red": {
        codigo: "/colors red 180 D9EBF4 141414 000000 141414",
        nombreEquipo: "CLUB DEP. UNIVERSIDAD CATOLICA"
    },
    "depuca/alternativa/blue": {
        codigo: "/colors blue 180 D9EBF4 141414 000000 141414",
        nombreEquipo: "CLUB DEP. UNIVERSIDAD CATOLICA"
    },

    // DEPORTES TOLIMA
    "deptol/titular/red": {
        codigo: "/colors red 180 BF9A4A 700A1D 771124",
        nombreEquipo: "DEPORTES TOLIMA"
    },
    "deptol/titular/blue": {
        codigo: "/colors blue 180 BF9A4A 700A1D 771124",
        nombreEquipo: "DEPORTES TOLIMA"
    },
    "deptol/alternativa/red": {
        codigo: "/colors red 90 771124 BF9A4A FFFFFF FFFFFF",
        nombreEquipo: "DEPORTES TOLIMA"
    },
    "deptol/alternativa/blue": {
        codigo: "/colors blue 90 771124 BF9A4A FFFFFF FFFFFF",
        nombreEquipo: "DEPORTES TOLIMA"
    },

    // INDEPENDIENTE PETROLERO
    "pet/titular/red": {
        codigo: "/colors red 180 636363 AA0515 FFFFFF AA0515",
        nombreEquipo: "INDEPENDIENTE PETROLERO"
    },
    "pet/titular/blue": {
        codigo: "/colors blue 180 636363 AA0515 FFFFFF AA0515",
        nombreEquipo: "INDEPENDIENTE PETROLERO"
    },
    "pet/alternativa/red": {
        codigo: "/colors red 90 FFFFFF 8A0D15 C6121E 8A0D15",
        nombreEquipo: "INDEPENDIENTE PETROLERO"
    },
    "pet/alternativa/blue": {
        codigo: "/colors blue 90 FFFFFF 8A0D15 C6121E 8A0D15",
        nombreEquipo: "INDEPENDIENTE PETROLERO"
    },

    // ALWAYS READY
    "alwr/titular/red": {
        codigo: "/colors red 33 1A1A1C FFFFFF FE323D FFFFFF",
        nombreEquipo: "ALWAYS READY"
    },
    "alwr/titular/blue": {
        codigo: "/colors blue 33 1A1A1C FFFFFF FE323D FFFFFF",
        nombreEquipo: "ALWAYS READY"
    },
    "alwr/alternativa/red": {
        codigo: "/colors red 34 FFFFFF 9F2240 D43742 9F2240",
        nombreEquipo: "ALWAYS READY"
    },
    "alwr/alternativa/blue": {
        codigo: "/colors blue 34 FFFFFF 9F2240 D43742 9F2240",
        nombreEquipo: "ALWAYS READY"
    },

    // FORTALEZA
    "fort/titular/red": {
        codigo: "/colors red 90 FFFFFF F91838 11328F F91838",
        nombreEquipo: "FORTALEZA"
    },
    "fort/titular/blue": {
        codigo: "/colors blue 90 FFFFFF F91838 11328F F91838",
        nombreEquipo: "FORTALEZA"
    },
    "fort/alternativa/red": {
        codigo: "/colors red 34 040A5E FAFAFA",
        nombreEquipo: "FORTALEZA"
    },
    "fort/alternativa/blue": {
        codigo: "/colors blue 34 040A5E FAFAFA",
        nombreEquipo: "FORTALEZA"
    },

    // RB BRAGANTINO
    "rbb/titular/red": {
        codigo: "/colors red -50 FE0302 E9E9E9 FFFFFF E9E9E9",
        nombreEquipo: "RB BRAGANTINO"
    },
    "rbb/titular/blue": {
        codigo: "/colors blue -50 FE0302 E9E9E9 FFFFFF E9E9E9",
        nombreEquipo: "RB BRAGANTINO"
    },
    "rbb/alternativa/red": {
        codigo: "/colors red -50 FFFFFF 000000 151515 000000",
        nombreEquipo: "RB BRAGANTINO"
    },
    "rbb/alternativa/blue": {
        codigo: "/colors blue -50 FFFFFF 000000 151515 000000",
        nombreEquipo: "RB BRAGANTINO"
    },
    "rbb/tercera/red": {
        codigo: "/colors red -50 FFFFFF FF1112 DE0609 FF1112",
        nombreEquipo: "RB BRAGANTINO"
    },
    "rbb/tercera/blue": {
        codigo: "/colors blue -50 FFFFFF FF1112 DE0609 FF1112",
        nombreEquipo: "RB BRAGANTINO"
    },

    // AMÉRICA MINEIRO
    "amcmin/titular/red": {
        codigo: "/colors red 180 FFFFFF 6EC576 27272F 6EC576",
        nombreEquipo: "AMÉRICA MINEIRO"
    },
    "amcmin/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 6EC576 27272F 6EC576",
        nombreEquipo: "AMÉRICA MINEIRO"
    },
    "amcmin/alternativa/red": {
        codigo: "/colors red 90 107837 026B2E EFEFEF FAFAFA",
        nombreEquipo: "AMÉRICA MINEIRO"
    },
    "amcmin/alternativa/blue": {
        codigo: "/colors blue 90 107837 026B2E EFEFEF FAFAFA",
        nombreEquipo: "AMÉRICA MINEIRO"
    },
    // TORINO
    "tor/titular/red": {
        codigo: "/colors red 90 FBFAF8 900A23",
        nombreEquipo: "TORINO"
    },
    "tor/titular/blue": {
        codigo: "/colors blue 90 FBFAF8 900A23",
        nombreEquipo: "TORINO"
    },
    "tor/alternativa/red": {
        codigo: "/colors red 60 A2374B F0F1F6",
        nombreEquipo: "TORINO"
    },
    "tor/alternativa/blue": {
        codigo: "/colors blue 60 A2374B F0F1F6",
        nombreEquipo: "TORINO"
    },

    // GENOA
    "gen/titular/red": {
        codigo: "/colors red 0 E2BF61 DB001E 262E45",
        nombreEquipo: "GENOA"
    },
    "gen/titular/blue": {
        codigo: "/colors blue 0 E2BF61 DB001E 262E45",
        nombreEquipo: "GENOA"
    },
    "gen/alternativa/red": {
        codigo: "/colors red 90 F6D903 FFFFFF F8011E 27305B",
        nombreEquipo: "GENOA"
    },
    "gen/alternativa/blue": {
        codigo: "/colors blue 90 F6D903 FFFFFF F8011E 27305B",
        nombreEquipo: "GENOA"
    },

    // PALERMO
    "plm/titular/red": {
        codigo: "/colors red 0 2E272E F8C6E1",
        nombreEquipo: "PALERMO"
    },
    "plm/titular/blue": {
        codigo: "/colors blue 0 2E272E F8C6E1",
        nombreEquipo: "PALERMO"
    },
    "plm/alternativa/red": {
        codigo: "/colors red 90 2F2C33 FDC7DF F0F3FA F0F3FA",
        nombreEquipo: "PALERMO"
    },
    "plm/alternativa/blue": {
        codigo: "/colors blue 90 2F2C33 FDC7DF F0F3FA F0F3FA",
        nombreEquipo: "PALERMO"
    },

    // CHIEVO VERONA
    "chver/titular/red": {
        codigo: "/colors red 90 0BA3EE F8C6E1 F4EF5F F4EF5F",
        nombreEquipo: "CHIEVO VERONA"
    },
    "chver/titular/blue": {
        codigo: "/colors blue 90 0BA3EE F8C6E1 F4EF5F F4EF5F",
        nombreEquipo: "CHIEVO VERONA"
    },
    "chver/alternativa/red": {
        codigo: "/colors red 0 FFFFFF 06ACFA 069DF0 06ACFA",
        nombreEquipo: "CHIEVO VERONA"
    },
    "chver/alternativa/blue": {
        codigo: "/colors blue 0 FFFFFF 06ACFA 069DF0 06ACFA",
        nombreEquipo: "CHIEVO VERONA"
    },

    // BARRACAS CENTRAL
    "barr/titular/red": {
        codigo: "/colors red 180 7D1622 E20613 FFFFFF E20613",
        nombreEquipo: "BARRACAS CENTRAL"
    },
    "barr/titular/blue": {
        codigo: "/colors blue 180 7D1622 E20613 FFFFFF E20613",
        nombreEquipo: "BARRACAS CENTRAL"
    },
    "barr/alternativa/red": {
        codigo: "/colors red 180 EF2233 E8E8E8 FFFFFF E8E8E8",
        nombreEquipo: "BARRACAS CENTRAL"
    },
    "barr/alternativa/blue": {
        codigo: "/colors blue 180 EF2233 E8E8E8 FFFFFF E8E8E8",
        nombreEquipo: "BARRACAS CENTRAL"
    },
    "barr/tercera/red": {
        codigo: "/colors red 180 EE4F3A 3D3F3E 768282 3D3F3E",
        nombreEquipo: "BARRACAS CENTRAL"
    },
    "barr/tercera/blue": {
        codigo: "/colors blue 180 EE4F3A 3D3F3E 768282 3D3F3E",
        nombreEquipo: "BARRACAS CENTRAL"
    },

    // GALES
    "gal/titular/red": {
        codigo: "/colors red 180 FFFFFF ED051F",
        nombreEquipo: "GALES"
    },
    "gal/titular/blue": {
        codigo: "/colors blue 180 FFFFFF ED051F",
        nombreEquipo: "GALES"
    },
    "gal/alternativa/red": {
        codigo: "/colors red 90 F40719 017457 F9E10F F9E10F",
        nombreEquipo: "GALES"
    },
    "gal/alternativa/blue": {
        codigo: "/colors blue 90 F40719 017457 F9E10F F9E10F",
        nombreEquipo: "GALES"
    },

    // AUSTRALIA
    "aus/titular/red": {
        codigo: "/colors red 90 204B44 F4C91A",
        nombreEquipo: "AUSTRALIA"
    },
    "aus/titular/blue": {
        codigo: "/colors blue 90 204B44 F4C91A",
        nombreEquipo: "AUSTRALIA"
    },
    "aus/alternativa/red": {
        codigo: "/colors red 70 FDE140 323556 1A8692 1A8692",
        nombreEquipo: "AUSTRALIA"
    },
    "aus/alternativa/blue": {
        codigo: "/colors blue 70 FDE140 323556 1A8692 1A8692",
        nombreEquipo: "AUSTRALIA"
    },

    // SARMIENTO DE JUNÍN
    "sar/titular/red": {
        codigo: "/colors red 90 FFFFFF 377039 2D6332 225228",
        nombreEquipo: "SARMIENTO DE JUNÍN"
    },
    "sar/titular/blue": {
        codigo: "/colors blue 90 FFFFFF 377039 2D6332 225228",
        nombreEquipo: "SARMIENTO DE JUNÍN"
    },
    "sar/alternativa/red": {
        codigo: "/colors red 90 15402F 9FD2C3 FFFFFF FFFFFF",
        nombreEquipo: "SARMIENTO DE JUNÍN"
    },
    "sar/alternativa/blue": {
        codigo: "/colors blue 90 15402F 9FD2C3 FFFFFF FFFFFF",
        nombreEquipo: "SARMIENTO DE JUNÍN"
    },

    // 1K
    "1k/titular/red": {
        codigo: "/colors red 60 FFFFFF E873B3 352770 352770",
        nombreEquipo: "1K"
    },
    "1k/titular/blue": {
        codigo: "/colors blue 60 FFFFFF E873B3 352770 352770",
        nombreEquipo: "1K"
    },

    // ANIQUILADORES FC
    "aniquiladores/titular/red": {
        codigo: "/colors red 180 110E0F CB2C37 FFFFFF CB2C37",
        nombreEquipo: "ANIQUILADORES FC"
    },
    "aniquiladores/titular/blue": {
        codigo: "/colors blue 180 110E0F CB2C37 FFFFFF CB2C37",
        nombreEquipo: "ANIQUILADORES FC"
    },

    // JIJANTES FC
    "jijantes/titular/red": {
        codigo: "/colors red 180 FFFFFF 01317E B50E2A 01317E",
        nombreEquipo: "JIJANTES FC"
    },
    "jijantes/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 01317E B50E2A 01317E",
        nombreEquipo: "JIJANTES FC"
    },

    // ULTIMATE MOSTOLES
    "mostoles/titular/red": {
        codigo: "/colors red 180 BEA06D 0A0A0C 17171C 0A0A0C",
        nombreEquipo: "ULTIMATE MOSTOLES"
    },
    "mostoles/titular/blue": {
        codigo: "/colors blue 180 BEA06D 0A0A0C 17171C 0A0A0C",
        nombreEquipo: "ULTIMATE MOSTOLES"
    },

    // XBUYER TEAM
    "xbuyer/titular/red": {
        codigo: "/colors red 180 EEEE65 23477A 145EAB 0A71D0",
        nombreEquipo: "XBUYER TEAM"
    },
    "xbuyer/titular/blue": {
        codigo: "/colors blue 180 EEEE65 23477A 145EAB 0A71D0",
        nombreEquipo: "XBUYER TEAM"
    },

    // RAYO DE BARCELONA
    "rayo/titular/red": {
        codigo: "/colors red 66 F5ED07 171717 171717 F5ED07",
        nombreEquipo: "RAYO DE BARCELONA"
    },
    "rayo/titular/blue": {
        codigo: "/colors blue 66 F5ED07 171717 171717 F5ED07",
        nombreEquipo: "RAYO DE BARCELONA"
    },

    // PÍO FC
    "pio/titular/red": {
        codigo: "/colors red 1 1D1D1D E4E3E8",
        nombreEquipo: "PÍO FC"
    },
    "pio/titular/blue": {
        codigo: "/colors blue 1 1D1D1D E4E3E8",
        nombreEquipo: "PÍO FC"
    },

    // 9Z TEAM
    "9z/titular/red": {
        codigo: "/colors red 62 FFFFFF 342971 42266F",
        nombreEquipo: "9Z TEAM"
    },
    "9z/titular/blue": {
        codigo: "/colors blue 62 FFFFFF 342971 42266F",
        nombreEquipo: "9Z TEAM"
    },

    // FURIA
    "furia/titular/red": {
        codigo: "/colors red 62 FFFFFF 1D2127 1D2127 61646C",
        nombreEquipo: "FURIA"
    },
    "furia/titular/blue": {
        codigo: "/colors blue 62 FFFFFF 1D2127 1D2127 61646C",
        nombreEquipo: "FURIA"
    },

    // ISURUS GAMING
    "isurus/titular/red": {
        codigo: "/colors red 180 000000 EBEBEB 00FFBB EBEBEB",
        nombreEquipo: "ISURUS GAMING"
    },
    "isurus/titular/blue": {
        codigo: "/colors blue 180 000000 EBEBEB 00FFBB EBEBEB",
        nombreEquipo: "ISURUS GAMING"
    },

    // FURIUS GAMING
    "furius/titular/red": {
        codigo: "/colors red 40 AF2268 19232B",
        nombreEquipo: "FURIUS GAMING"
    },
    "furius/titular/blue": {
        codigo: "/colors blue 40 AF2268 19232B",
        nombreEquipo: "FURIUS GAMING"
    },

    // TRONCOS FC
    "troncos/titular/red": {
        codigo: "/colors red 180 104D3B 07B16F FFFFFF 07B16F",
        nombreEquipo: "TRONCOS FC"
    },
    "troncos/titular/blue": {
        codigo: "/colors blue 180 104D3B 07B16F FFFFFF 07B16F",
        nombreEquipo: "TRONCOS FC"
    },

    // KUNISPORTS
    "kunisports/titular/red": {
        codigo: "/colors red 90 FF0165 FFFFFF 797677 191418",
        nombreEquipo: "KUNISPORTS"
    },
    "kunisports/titular/blue": {
        codigo: "/colors blue 90 FF0165 FFFFFF 797677 191418",
        nombreEquipo: "KUNISPORTS"
    },

    // SAIYANS FC
    "saiyans/titular/red": {
        codigo: "/colors red 56 FFFFFF 033894 E54718 E23D15",
        nombreEquipo: "SAIYANS FC"
    },
    "saiyans/titular/blue": {
        codigo: "/colors blue 56 FFFFFF 033894 E54718 E23D15",
        nombreEquipo: "SAIYANS FC"
    },

    // PORCINOS FC
    "porcinos/titular/red": {
        codigo: "/colors red 65 FFFFFF FFBAD4 FFBAD4 FDE7F3",
        nombreEquipo: "PORCINOS FC"
    },
    "porcinos/titular/blue": {
        codigo: "/colors blue 65 FFFFFF FFBAD4 FFBAD4 FDE7F3",
        nombreEquipo: "PORCINOS FC"
    },

    // EL BARRIO FC
    "barrio/titular/red": {
        codigo: "/colors red 65 FFFFFF 012168 012168 00183C",
        nombreEquipo: "EL BARRIO FC"
    },
    "barrio/titular/blue": {
        codigo: "/colors blue 65 FFFFFF 012168 012168 00183C",
        nombreEquipo: "EL BARRIO FC"
    },

    // DOUGLAS HAIG
    "dou/titular/red": {
        codigo: "/colors red 180 FFFFFF 000000 FF1111 000000",
        nombreEquipo: "DOUGLAS HAIG"
    },
    "dou/titular/blue": {
        codigo: "/colors blue 180 FFFFFF 000000 FF1111 000000",
        nombreEquipo: "DOUGLAS HAIG"
    },
    "dou/alternativa/red": {
        codigo: "/colors red 65 000000 FF1111 FFFFFF FFFFFF",
        nombreEquipo: "DOUGLAS HAIG"
    },
    "dou/alternativa/blue": {
        codigo: "/colors blue 65 000000 FF1111 FFFFFF FFFFFF",
        nombreEquipo: "DOUGLAS HAIG"
    }
};

// 1. Primero, arreglemos parseColors para que devuelva un objeto con el formato esperado
function parseColors(codigo) {
    console.log("parseColors recibió:", codigo);
    
    if (!codigo || typeof codigo !== 'string') {
        console.error("Error: parseColors recibió un valor inválido:", codigo);
        return null;
    }
    
    try {
        // Formato esperado: "/colors [red|blue] [angle] [textColor] [color1] [color2] ..."
        var partes = codigo.split(' ');
        
        if (partes.length < 5) {
            console.error("❌ Formato de código inválido:", codigo);
            return null;
        }
        
        // Determinar el equipo (red o blue)
        var equipoStr = partes[1].toLowerCase();
        var equipo = equipoStr === 'red' ? Team.RED : Team.BLUE;
        
        // Obtener el ángulo
        var angulo = parseInt(partes[2], 10);
        
        // Obtener el color del texto (convertir hex a número)
        var colorTexto = parseInt("0x" + partes[3], 16);
        
        // Obtener los colores (convertir hex a número)
        var colores = [];
        for (var i = 4; i < partes.length; i++) {
            colores.push(parseInt("0x" + partes[i], 16));
        }
        
        console.log("Colores parseados:");
        console.log("Equipo:", equipo);
        console.log("Ángulo:", angulo);
        console.log("Color de texto:", colorTexto);
        console.log("Colores:", colores);
        
        // Devolver un objeto con el formato esperado
        return {
            team: equipo,
            angle: angulo,
            textColor: colorTexto,
            colors: colores
        };
    } catch (error) {
        console.error("❌ Error al analizar colores:", error, "Input:", codigo);
        return null;
    }
}
// Modificar la función obtenerCamiseta

// 2. Ahora, arreglemos obtenerCamiseta para usar correctamente parseColors
function obtenerCamiseta(equipoClave) {
    let equipo = camisetasEquipos[equipoClave];
    if (!equipo) {
        console.error(`[❌] Equipo no encontrado: ${equipoClave}`);
        return null;
    }

    console.log(`Obteniendo camiseta para ${equipoClave}:`, equipo);
    
    // Verificar que la camiseta tenga el código
    if (!equipo.codigo) {
        console.error("❌ La camiseta no tiene código:", equipo);
        return null;
    }
    
    let datos = parseColors(equipo.codigo);
    if (!datos) {
        console.error(`[❌] No se pudo parsear el código de colores para: ${equipoClave}`);
        return null;
    }
    
    // Actualizamos las variables globales según el equipo
    if (datos.team === Team.RED) {
        teamRedName = equipo.nombreEquipo || "EQUIPO LOCAL"; 
    } else if (datos.team === Team.BLUE) {
        teamBlueName = equipo.nombreEquipo || "EQUIPO VISITANTE";
    }

    return {
        team: datos.team,
        angle: datos.angle,
        textColor: datos.textColor,
        colors: datos.colors,
        nombreEquipo: equipo.nombreEquipo || equipoClave
    };
}
// Función para extraer abreviaturas de las claves de camisetas
function obtenerAbreviatura(clave) {
    // Asumimos que las claves tienen formato como "river1", "river2", "boca1", etc.
    // La abreviatura sería los primeros 3 caracteres (o ajustá esto según tu formato)
    const match = clave.match(/^([a-zA-Z]+)(\d+)?$/);
    if (match) {
        return match[1].toLowerCase(); // Solo la parte alfabética, convertida a minúsculas
    }
    return null;
}

// Función para seleccionar un partido aleatorio
function seleccionarPartidoAleatorio() {
    // Calcular el total de "demanda" de todos los partidos
    var totalDemanda = 0;
    for (var i = 0; i < opciones.length; i++) {
        totalDemanda += opciones[i].demanda;
    }
    
    // Seleccionar un número aleatorio dentro del rango de la demanda total
    var seleccion = Math.floor(Math.random() * totalDemanda);
    
    // Encontrar qué partido corresponde a la selección
    var acumulado = 0;
    for (var i = 0; i < opciones.length; i++) {
        acumulado += opciones[i].demanda;
        if (seleccion < acumulado) {
            return opciones[i];
        }
    }
    
    // En caso de fallo, devolver el primer partido
    return opciones[0];
}

// Función para aplicar un partido aleatorio al inicio del juego
// Modificar la función aplicarCamisetasAleatorias

// Función mejorada para aplicar camisetas aleatorias
function aplicarCamisetasAleatorias() {
    console.log("Aplicando camisetas aleatorias...");
    
    var partidoSeleccionado = seleccionarPartidoAleatorio();
    
    try {
        partidoSeleccionado.partido();
        console.log(`✅ Camisetas aplicadas: Rojo = ${teamRedName}, Azul = ${teamBlueName}`);
        
        // Anunciar el partido con estilo
        room.sendAnnouncement(
            centerText("━━━━━━━━━━━━━━━━━━━━━"),
            null, 
            0xFFFFFF, 
            "normal"
        );
        
        room.sendAnnouncement(
            centerText("⚽ ¡NUEVO PARTIDO! ⚽"),
            null, 
            0x00FFFF, 
            "bold", 
            2
        );
        
        room.sendAnnouncement(
            centerText(`${teamRedName}`),
            null, 
            0xFF3333, 
            "bold"
        );
        
        room.sendAnnouncement(
            centerText("🆚"),
            null, 
            0xFFFFFF, 
            "bold"
        );
        
        room.sendAnnouncement(
            centerText(`${teamBlueName}`),
            null, 
            0x3333FF, 
            "bold"
        );
        
        room.sendAnnouncement(
            centerText("━━━━━━━━━━━━━━━━━━━━━"),
            null, 
            0xFFFFFF, 
            "normal"
        );
    } catch (error) {
        console.error("❌ Error al aplicar camisetas aleatorias:", error);
        
        // En caso de error, aplicar camisetas predeterminadas
        room.setTeamColors(Team.RED, 30, 0x231F20, [0xFFFFFF, 0xEE1B2C, 0xFFFFFF]);
        room.setTeamColors(Team.BLUE, 90, 0xFFFFFF, [0x033F86, 0xFAB900, 0x033F86]);
        teamRedName = "RIVER PLATE";
        teamBlueName = "BOCA JRS.";
        
        // Anunciar el partido predeterminado
        room.sendAnnouncement(
            centerText("⚠️ ¡ERROR AL CARGAR CAMISETAS! ⚠️"),
            null, 
            0xFF5500, 
            "bold", 
            1
        );
        
        room.sendAnnouncement(
            centerText("Se han aplicado camisetas predeterminadas"),
            null, 
            0xFFCC00, 
            "normal"
        );
        
        room.sendAnnouncement(
            centerText("⚽ ¡NUEVO PARTIDO! ⚽"),
            null, 
            0x00FFFF, 
            "bold", 
            2
        );
        
        room.sendAnnouncement(
            centerText(`${teamRedName} 🆚 ${teamBlueName}`),
            null, 
            0xFFFFFF, 
            "bold"
        );
    }
}


// Función para aplicar camiseta por clave simplificada (mejorada)
// Función para aplicar camiseta por clave simplificada (con estética mejorada)
function aplicarCamisetaSimple(player, equipoBase, variante) {
    console.log(`Aplicando camiseta: ${equipoBase}${variante}`);
    
    if (player.team === Team.SPECTATORS) {
        room.sendAnnouncement(
            centerText("⚠️ ¡ERROR! ⚠️"),
            player.id, 
            0xFF5500, 
            "bold", 
            1
        );
        room.sendAnnouncement(
            centerText("Tenés que estar en un equipo para usar una camiseta"),
            player.id, 
            0xFF0000, 
            "normal"
        );
        return false;
    }
    
    // Determinar qué clave usar según el equipo del jugador
    const teamStr = player.team === Team.RED ? "red" : "blue";
    const teamColor = player.team === Team.RED ? 0xFF3333 : 0x3333FF;
    
    // Mapeo de variantes a claves reales
    const variantesMap = {
        "1": "/titular/",
        "2": "/alternativa/",
        "3": "/tercera/"
    };
    
    // Mapeo de variantes a nombres
    const variantesNombre = {
        "1": "Titular",
        "2": "Alternativa",
        "3": "Tercera"
    };
    
    // Si no se especifica variante o no es válida, usar la titular
    const variantePath = variantesMap[variante] || "/titular/";
    const varianteNombre = variantesNombre[variante] || "Titular";
    
    // Construir la clave completa
    const claveCompleta = equipoBase + variantePath + teamStr;
    
    console.log(`Buscando camiseta con clave: ${claveCompleta}`);
    
    // Buscar la camiseta en el objeto camisetasEquipos
    if (!camisetasEquipos[claveCompleta]) {
        // Intentar con formato alternativo (por ejemplo, "riv1red")
        const claveAlternativa = `${equipoBase}${variante}${teamStr}`;
        
        if (!camisetasEquipos[claveAlternativa]) {
            // Intentar con formato simple (por ejemplo, "riv")
            if (!camisetasEquipos[equipoBase]) {
                room.sendAnnouncement(
                    centerText("⚠️ ¡CAMISETA NO ENCONTRADA! ⚠️"),
                    player.id, 
                    0xFF5500, 
                    "bold", 
                    1
                );
                room.sendAnnouncement(
                    centerText(`No se encontró la camiseta para: ${equipoBase}`),
                    player.id, 
                    0xFF0000, 
                    "normal"
                );
                
                // Sugerir algunas camisetas disponibles
                let camisetasDisponibles = Object.keys(camisetasEquipos).filter(k => 
                    k.includes(teamStr) && k.includes("/titular/")
                ).slice(0, 3);
                
                if (camisetasDisponibles.length > 0) {
                    room.sendAnnouncement(
                        centerText("💡 Prueba con estas opciones:"),
                        player.id, 
                        0xFFCC00, 
                        "normal"
                    );
                    
                    camisetasDisponibles.forEach(clave => {
                        let equipo = camisetasEquipos[clave].nombreEquipo || clave;
                        room.sendAnnouncement(
                            `• ${clave.split('/')[0]}1: ${equipo}`,
                            player.id, 
                            0xFFFFFF, 
                            "normal"
                        );
                    });
                }
                
                return false;
            }
            
            // Si existe el equipo pero no la variante específica, usar la entrada simple
            aplicarCamisetaPorClave(player, equipoBase);
            return true;
        }
        
        // Si se encontró la clave alternativa, usarla
        aplicarCamisetaPorClave(player, claveAlternativa);
        return true;
    }
    
    // Si se encontró la clave completa, aplicar la camiseta
    const camiseta = camisetasEquipos[claveCompleta];
    
    // Verificar que la camiseta tenga código
    if (!camiseta.codigo) {
        room.sendAnnouncement(
            centerText("⚠️ ¡ERROR! ⚠️"),
            player.id, 
            0xFF5500, 
            "bold", 
            1
        );
        room.sendAnnouncement(
            centerText("La camiseta no tiene código definido"),
            player.id, 
            0xFF0000, 
            "normal"
        );
        return false;
    }
    
    try {
        // Parsear el código de la camiseta
        const partes = camiseta.codigo.split(' ');
        
        if (partes.length < 5) {
            room.sendAnnouncement(
                centerText("⚠️ ¡ERROR DE FORMATO! ⚠️"),
                player.id, 
                0xFF5500, 
                "bold", 
                1
            );
            return false;
        }
        
        // Obtener los valores
        const angulo = parseInt(partes[2], 10);
        const colorTexto = parseInt("0x" + partes[3], 16);
        
        // Obtener los colores
        const colores = [];
        for (let i = 4; i < partes.length; i++) {
            colores.push(parseInt("0x" + partes[i], 16));
        }
        
        // Aplicar los colores al equipo del jugador
        room.setTeamColors(player.team, angulo, colorTexto, colores);
        
        // Actualizar el nombre del equipo
        if (player.team === Team.RED) {
            teamRedName = camiseta.nombreEquipo;
        } else {
            teamBlueName = camiseta.nombreEquipo;
        }
        
        // Anunciar el cambio con estilo
        room.sendAnnouncement(
            centerText("━━━━━━━━━━━━━━━━━━━━━"),
            null, 
            0xFFFFFF, 
            "normal"
        );
        
        room.sendAnnouncement(
            centerText("👕 ¡CAMBIO DE CAMISETA! 👕"),
            null, 
            0x00FFFF, 
            "bold", 
            2
        );
        
        room.sendAnnouncement(
            centerText(`${player.name} eligió:`),
            null, 
            0xFFFFFF, 
            "normal"
        );
        
        room.sendAnnouncement(
            centerText(`${camiseta.nombreEquipo} (${varianteNombre})`),
            null, 
            teamColor, 
            "bold"
        );
        
        room.sendAnnouncement(
            centerText("━━━━━━━━━━━━━━━━━━━━━"),
            null, 
            0xFFFFFF, 
            "normal"
        );
        
        return true;
    } catch (error) {
        console.error("Error al aplicar camiseta:", error);
        room.sendAnnouncement(
            centerText("⚠️ ¡ERROR! ⚠️"),
            player.id, 
            0xFF5500, 
            "bold", 
            1
        );
        room.sendAnnouncement(
            centerText("No se pudo aplicar la camiseta"),
            player.id, 
            0xFF0000, 
            "normal"
        );
        return false;
    }
}

// 3. Finalmente, arreglemos aplicarCamisetaPorClave para usar las funciones correctamente
function aplicarCamisetaPorClave(player, clave) {
    console.log(`Jugador ${player.name} intenta aplicar camiseta: ${clave}`);
    
    const team = player.team;
    if (team === Team.SPECTATORS) {
        room.sendAnnouncement("❌ Tenés que estar en un equipo para usar una camiseta.", player.id, 0xFF0000, "bold");
        return false;
    }
    
    // Determinar qué clave usar según el equipo del jugador
    // Asumiendo que las claves tienen sufijos como "red1", "blue2", etc.
    let claveCompleta = clave;
    if (!clave.includes("red") && !clave.includes("blue")) {
        claveCompleta = team === Team.RED ? `${clave}red1` : `${clave}blue1`;
    }
    
    console.log(`Buscando camiseta con clave: ${claveCompleta}`);
    
    // Intentar con la clave completa primero
    let camiseta = obtenerCamiseta(claveCompleta);
    
    // Si no se encuentra, intentar con la clave original
    if (!camiseta) {
        console.log(`No se encontró ${claveCompleta}, intentando con ${clave}`);
        camiseta = obtenerCamiseta(clave);
    }
    
    if (camiseta) {
        console.log(`Aplicando camiseta:`, camiseta);
        
        // Verificar que el equipo del jugador coincida con el equipo de la camiseta
        if (camiseta.team !== team) {
            room.sendAnnouncement(`❌ Esta camiseta es para el otro equipo.`, player.id, 0xFF0000, "bold");
            return false;
        }
        
        // Aplicar los colores
        room.setTeamColors(team, camiseta.angle, camiseta.textColor, camiseta.colors);
        
        // Actualizar el nombre del equipo
        if (team === Team.RED) {
            teamRedName = camiseta.nombreEquipo;
        } else {
            teamBlueName = camiseta.nombreEquipo;
        }
        
        // Anunciar el cambio de camiseta
        room.sendAnnouncement(
            centerText(`👕 ¡CAMBIO DE CAMISETA! 👕`),
            null,
            0x00FFFF,
            "bold",
            2
        );
        room.sendAnnouncement(
            centerText(`${player.name} cambió la camiseta a ${camiseta.nombreEquipo}`),
            null,
            team === Team.RED ? 0xFF3333 : 0x3333FF,
            "bold"
        );
        
        return true;
    } else {
        room.sendAnnouncement(`❌ No se encontró la camiseta: ${clave}`, player.id, 0xFF0000, "bold");
        console.error(`No se encontró la camiseta con clave: ${clave} ni ${claveCompleta}`);
        return false;
    }
}

// Función para depurar el sistema de camisetas (útil para diagnosticar problemas)
room.onCommand_debugcamisetas = function(player) {
    if (!hasPermission(player, "admin")) {
        room.sendAnnouncement("❌ No tenés permiso para usar este comando.", player.id, 0xFF0000, "bold");
        return false;
    }
    
    console.log("Camisetas disponibles:", Object.keys(camisetasEquipos));
    
    // Mostrar las primeras 5 camisetas con sus detalles
    let contador = 0;
    for (let clave in camisetasEquipos) {
        if (contador >= 5) break;
        console.log(`Clave: ${clave}`, camisetasEquipos[clave]);
        contador++;
    }
    
    room.sendAnnouncement("✅ Información de depuración enviada a la consola.", player.id, 0x00FF00, "bold");
    return false;
};

// Función para aplicar un partido específico por su índice
function aplicarPartidoEspecifico(indice) {
    if (indice >= 0 && indice < opciones.length) {
        try {
            opciones[indice].partido();
            console.log("✅ Camisetas aplicadas: Rojo =" + teamRed + ", Azul = " + teamBlue);
            return true;
        } catch (error) {
            console.error("❌ Error al aplicar partido específico:", error);
            return false;
        }
    } else {
        console.error("❌ Índice de partido inválido:", indice);
        return false;
    }
}

// Función para listar camisetas disponibles de manera simplificada

// Función para listar camisetas disponibles (con estética mejorada)
function listarCamisetasDisponibles(player) {
    if (player.team === Team.SPECTATORS) {
        room.sendAnnouncement(
            centerText("⚠️ ¡ERROR! ⚠️"),
            player.id, 
            0xFF5500, 
            "bold", 
            1
        );
        room.sendAnnouncement(
            centerText("Tenés que estar en un equipo para ver camisetas disponibles"),
            player.id, 
            0xFF0000, 
            "normal"
        );
        return;
    }
    
    const teamColorCode = player.team === Team.RED ? 0xFF3333 : 0x3333FF;
    const teamName = player.team === Team.RED ? "ROJO 🔴" : "AZUL 🔵";
    
    room.sendAnnouncement(
        centerText("━━━━━━━━━━━━━━━━━━━━━"),
        player.id, 
        0xFFFFFF, 
        "normal"
    );
    
    room.sendAnnouncement(
        centerText(`👕 CAMISETAS PARA EQUIPO ${teamName} 👕`),
        player.id, 
        teamColorCode, 
        "bold"
    );
    
    room.sendAnnouncement(
        centerText("━━━━━━━━━━━━━━━━━━━━━"),
        player.id, 
        0xFFFFFF, 
        "normal"
    );
    
    // Crear un mapa de equipos disponibles
    const equiposDisponibles = new Map();
    
    // Recorrer todas las claves de camisetas
    for (let clave in camisetasEquipos) {
        // Filtrar por equipo del jugador
        const teamStr = player.team === Team.RED ? "red" : "blue";
        if (!clave.includes(teamStr)) continue;
        
        // Extraer el nombre base del equipo (antes de la primera /)
        const equipoBase = clave.split('/')[0];
        
        if (!equiposDisponibles.has(equipoBase)) {
            equiposDisponibles.set(equipoBase, {
                nombre: camisetasEquipos[clave].nombreEquipo || equipoBase,
                variantes: []
            });
        }
        
        // Determinar la variante
        if (clave.includes("/titular/")) {
            equiposDisponibles.get(equipoBase).variantes.push("1");
        } else if (clave.includes("/alternativa/")) {
            equiposDisponibles.get(equipoBase).variantes.push("2");
        } else if (clave.includes("/tercera/")) {
            equiposDisponibles.get(equipoBase).variantes.push("3");
        }
    }
    
    // Mostrar los equipos y sus variantes disponibles
    let equiposArray = Array.from(equiposDisponibles.entries());
    
    // Categorizar equipos por ligas/regiones
    const categorias = {
        "UEFA": ["riv", "boc", "rac", "ind", "est", "bar", "rea", "atl", "man", "liv", "che", "ars", "juv", "mil", "int", "bay", "dor", "psg"],
        "CONMEBOL": ["riv", "boc", "rac", "ind", "est", "fla", "cor", "pal", "sao", "gre", "colo", "nac", "pen"],
        "CONCACAF": ["ame", "gua", "mon", "tig", "cruz", "lag", "dc", "gal", "nyr", "orl", "sea", "tor"],
        "Selecciones": ["arg", "bra", "uru", "chi", "col", "per", "ecu", "par", "ven", "bol", "esp", "fra", "ale", "ita", "ing", "por", "bel", "hol"]
    };
    
    // Mostrar equipos por categoría
    for (let [categoria, prefijos] of Object.entries(categorias)) {
        let equiposCategoria = equiposArray.filter(([clave, _]) => 
            prefijos.some(prefijo => clave.startsWith(prefijo))
        );
        
        if (equiposCategoria.length > 0) {
            room.sendAnnouncement(
                centerText(`🏆 ${categoria} 🏆`),
                player.id, 
                0xFFCC00, 
                "bold"
            );
            
            // Mostrar los equipos en grupos de 3
            for (let i = 0; i < equiposCategoria.length; i += 3) {
                let mensaje = "";
                for (let j = i; j < Math.min(i + 3, equiposCategoria.length); j++) {
                    const [clave, info] = equiposCategoria[j];
                    const variantesStr = info.variantes.sort().join(",");
                    mensaje += `• ${clave}[${variantesStr}]: ${info.nombre}   `;
                }
                room.sendAnnouncement(
                    mensaje,
                    player.id, 
                    0xFFFFFF, 
                    "normal"
                );
            }
        }
    }
    
    // Mostrar otros equipos que no entran en las categorías
    let otrosEquipos = equiposArray.filter(([clave, _]) => 
        !Object.values(categorias).flat().some(prefijo => clave.startsWith(prefijo))
    );
    
    if (otrosEquipos.length > 0) {
        room.sendAnnouncement(
            centerText("🏆 OTROS EQUIPOS 🏆"),
            player.id, 
            0xFFCC00, 
            "bold"
        );
        
        // Mostrar los equipos en grupos de 3
        for (let i = 0; i < otrosEquipos.length; i += 3) {
            let mensaje = "";
            for (let j = i; j < Math.min(i + 3, otrosEquipos.length); j++) {
                const [clave, info] = otrosEquipos[j];
                const variantesStr = info.variantes.sort().join(",");
                mensaje += `• ${clave}[${variantesStr}]: ${info.nombre}   `;
            }
            room.sendAnnouncement(
                mensaje,
                player.id, 
                0xFFFFFF, 
                "normal"
            );
        }
    }
    
    room.sendAnnouncement(
        centerText("━━━━━━━━━━━━━━━━━━━━━"),
        player.id, 
        0xFFFFFF, 
        "normal"
    );
    
    room.sendAnnouncement(
        centerText("📋 INSTRUCCIONES 📋"),
        player.id, 
        0x00FFCC, 
        "bold"
    );
    
    room.sendAnnouncement(
        centerText("Para usar una camiseta, escribí:"),
        player.id, 
        0xFFFFFF, 
        "normal"
    );
    
    room.sendAnnouncement(
        centerText("[equipo][variante]"),
        player.id, 
        teamColorCode, 
        "bold"
    );
    
    room.sendAnnouncement(
        centerText("Ejemplo: riv1 (titular), riv2 (alternativa), riv3 (tercera)"),
        player.id, 
        0xFFFFFF, 
        "normal"
    );
    
    room.sendAnnouncement(
        centerText("━━━━━━━━━━━━━━━━━━━━━"),
        player.id, 
        0xFFFFFF, 
        "normal"
    );
}

function UEFAFun(player) { // !camisetas
    room.sendAnnouncement("UEFA 🌍: !premierleague ✦ !ligue1 ✦  !bundesliga ✦ !seriea ✦ !serieb ✦ !laliga ✦ !eredivisie ✦ !primeiraliga ✦ !superlig ✦ !campeonatoruso ✦ !1hnl ✦ !premierucrania  !superligasuiza ✦ !nb1 ", player.id, 0xea9999, "bold", 0);
}
function CONMEBOLFun(player) { // !camisetas
    room.sendAnnouncement("CONMEBOL 🌎: !primera ✦ !ascenso ✦ !brasileirao ✦ !campeonatouruguayo ✦ !ligaparaguaya ✦ !ligaaguila ✦ !ligapro ✦ !liga1peru ✦ !campeonatochileno ✦ !ligaboliviana ✦ !ligavenezolana", player.id, 0xa4c2f4, "bold", 0);
}
function CONCACAFFun(player) { // !camisetas
    room.sendAnnouncement("CONCACAF 🌎: !ligamx ✦ !mls", player.id, 0xffd966, "bold", 0);
}


function CamisetasFun(player) { // !camisetas
    room.sendAnnouncement("!UEFA 🌍✦ !CONMEBOL 🌎✦ !CONCACAF 🌎✦ !paises 🌐✦ !fantasmas  👻 ✦ !amateurs 🛡✦ !superheroes 🦸 | !haxball | !esports", player.id, 0xb4a7d6, "bold", 0);
    setTimeout(function() {
      var paso1 = "📢 ¡Hola! ¿Quieres jugar con la camiseta de tu equipo favorito? Es muy fácil, sigue estos pasos:\n\n";
      paso1 += "1️⃣ Escribe las letras abreviadas de tu equipo (por ejemplo, riv para River Plate, boc para Boca Juniors, arg para Argentina, bra para Brasil, etc.) 🏟️";
      room.sendAnnouncement(paso1, player.id, 0xffffff, "bold", 0);
    }, 5000);

    setTimeout(function() {
      var paso2 = "2️⃣ Luego, escribe el número de la variante que quieras usar (1, 2 o 3) no todos tienen variante 3, pero probá. ";
      room.sendAnnouncement(paso2, player.id, 0xffffff, "bold", 0);
    }, 8000);


}

function SuperHeroesFun(player) { // !fantasmas
    room.sendAnnouncement("💪 SUPERHÉROES: ", player.id, 0xfaebd6, "bold", 0);
    room.sendAnnouncement("MARVEL: SPIDERMAN | HULK | CAPITANAMERICA", player.id, 0xfaebd6, "bold", 0);
    room.sendAnnouncement("DC: BATMAN", player.id, 0xfaebd6, "bold", 0);
}

function FantasmasFun(player) { // !fantasmas
    room.sendAnnouncement("📜 👻 EQUIPOS FANTASMAS: ", player.id, 0xfaebd6, "bold", 0);
    room.sendAnnouncement("🌍 exSelecciones:  | URSS | YUG | CZE", player.id, 0xfaebd6, "bold", 0);
    room.sendAnnouncement("🛡 exClubes: | ALU | LOA | OCFC | BAC | ROAC | CAPORT", player.id, 0xfaebd6, "bold", 0);
}

function SuperligaFun(player) { // !superliga
    room.sendAnnouncement("🅰 PRIMERA DIVISIÓN: | RIV | BOC | RAC | IND | SLO | EST | VEL | LAN | DYJ", player.id, 0xADF4FF, "bold", 0); 
    room.sendAnnouncement(" | AAAJ | NOB | CEN | ARSE | BAND | TAL | CSF | HUR | GIM ", player.id, 0xADF4FF, "bold", 0); 
    room.sendAnnouncement(" | UNI | ALD | ATU | CCS | GOD | PAT | BARR | TIG | PLA | SAR", player.id, 0xADF4FF, "bold", 0); 
}

function AscensoFun(player) { // !ascenso
    room.sendAnnouncement('🅱 ASCENSO: | ALB | FCO | CHA | ATL |  SMT | OLP | BEL | QUI | MOR | NCH | ALM | SMSJ | ABROWN', player.id, 0xDB1414, "bold", 0); 
    room.sendAnnouncement('| DOC | SCH | RIE | AGR | ALV | STEL​ | MER | AdQ | CJA | GyT | CADU | VSC | EBA | BOCHZ | CDE | SIT | MDY | CDN | LAF | SM | DOU', player.id, 0xDB1414, "bold", 0); 
}

function EquiposAmateursFun(player) { // !ascenso
    room.sendAnnouncement('🔰 AMATEURS (LIGAS BARRIALES) : | CDYBGR', player.id, 0xDB1414, "bold", 0); 
}

function CampeonatoChilenoFun(player) { // !campeonatochileno
    room.sendAnnouncement("(🇨🇱) CAMPEONATO CHILENO:  | CCO | UDC | UCA | CDP | COB | EVDM | ULC |", player.id, 0xFF2A12, "bold", 0); 
    room.sendAnnouncement("| AUD | HUA | IQU | OHI | UES | SWA | CUR | CDA | UCON | DLS | COQ", player.id, 0xFF2A12, "bold", 0); 
}

function LigaBolivianaFun(player) { // !ligaboliviana
    room.sendAnnouncement("(🇧🇴) LIGA BOLIVIANA:  | BLV | STG | WTM | PET | ALWR", player.id, 0x5ACC31, "bold", 0); 
}

function MLSFun(player) { // !mls
    room.sendAnnouncement("(🇺🇸) MLS: | LA | TOFC | NYC | ATLU | LAFC | SEA | NYRB | PTIM | ORL | MIA", player.id, 0x1930FF, "bold", 0); 
}

function LigaUruguayaFun(player) { // !campeonatouruguayo
    room.sendAnnouncement('(🇺🇾) CAMPEONATO URUGUAYO: | NAC | PEN | DAN | RAM | RIU | WAN | MCT | CRL | DFS | PCOL', player.id, 0x69CDFF, "bold", 0); 
}

function CampeonatoRusoFun(player) { // !campeonatoruso
    room.sendAnnouncement('(🇷🇺) CAMPEONATO RUSO: | SPM | CSK | ZEN | LOK | DIN', player.id, 0xe11a22, "bold", 0); 
}

function PremierUcranianaFun(player) { // !premierucrania
    room.sendAnnouncement('(🇺🇦) LIGA PREMIER UCRANIA: | SHA | DYK | NYV', player.id, 0xFFF954, "bold", 0); 
}

function LaLigaFun(player) { // !laliga
    room.sendAnnouncement('(🇪🇸) LALIGA: | RMA | BAR | ATM | SEV | VIL | VAL | ATH | GET | CEL | BET | LEV | RAY | RCDE | MLL', player.id, 0xFF2A00, "bold", 0); 
}

function LigaAguilaFun(player) { // !ligaaguila
    room.sendAnnouncement('(🇨🇴) LIGA ÁGUILA: | ATN | MIL | AME | SFE | CAL | ONC | DEPTOL', player.id, 0xFFE959, "bold", 0); 
}

function LigaParaguayaFun(player) { // !ligaparaguaya
    room.sendAnnouncement('(🇵🇾) LIGA PARAGUAYA: | CCP | OLI | GUA | LIB', player.id, 0xa3a3a3, "bold", 0);
}

function SerieATIMFun(player) { // !seriea
    room.sendAnnouncement('(🇮🇹) SERIE A: | JUV | INT | ACM | ATA | NAP | LAZ | ROM | FIO | TOR | GEN | PLM | CHVER', player.id, 0x6699FF, "bold", 0);
}

function SerieBItaliaFun(player) { // !seriea
    room.sendAnnouncement('(🇮🇹) SERIE B: | VENFC', player.id, 0x6699FF, "bold", 0);
}

function BrasilLeagueFun(player) { // !brasileirão
    room.sendAnnouncement('(🇧🇷) BRASILEIRAO: SAO | SAN | CRU | FLA | PAL | CAM | SCI | GRE | COR | BOT | PAR | FLU | VAS | FORT | RBB | AMCMIN', player.id, 0xF7FF19, "bold", 0);
}

function PremierLeagueFun(player) { // !premierleague
    room.sendAnnouncement('(🇬🇧) PREMIER LEAGUE: MCI | LIV | CHE | MUN | TOT | LEI | ARS | EVE | WHU | WOL | AVL | NEW | SOU | WAT | CRY | LEE | FUL | WBA | HUL', player.id, 0xFFFFFF, "bold", 0); 
}

function SuperLigFun(player) { // !superlig
    room.sendAnnouncement('(🇹🇷) SUPER LIG: | GS | FB | BJK ', player.id, 0xFA0000, "bold", 0); 
}

function LigaVenezolanaFun(player) { // !ligavenezolana
    room.sendAnnouncement('(🇻🇪) Liga Venezolana: TACH | CARC | MNG | DLAR', player.id, 0xF7FF19, "bold", 0);
}

function PaisesFun(player) { // !paises
    room.sendAnnouncement('🌍 EUROPA: FRA | ALE | ITA | ESP | ING | BELG | POR | HOL | CRO | | GAL | RUS | SWE | SUI | AUT | UKR | POL | MAR | SRB | TUN | DEN', player.id, 0x5793FA, "bold", 0);  
    room.sendAnnouncement('🌎 AMÉRICA: BRA | ARG | COL | URU | CHI | USA  | MEX | ECU | PGY | PER | VEN | BOL | CAN | CRC', player.id, 0x5793FA, "bold", 0);  
    room.sendAnnouncement('🌏 ASIA y OCEANIA: JAP | QAT | CNO | NZE | IRN | KOR | KSA | AUS', player.id, 0x5793FA, "bold", 0); 
    room.sendAnnouncement('🌍 AFRICA: NGA | CDM | CMR | SEN | GHA', player.id, 0x5793FA, "bold", 0); 
}

function BundesligaFun(player) { // !bundesliga
    room.sendAnnouncement('(🇩🇪) BUNDESLIGA: | FCB | BVB | RBL | B04 | HSV', player.id, 0xF5FAF8, "bold", 0); 
}

function EredivisieFun(player) { // !eredivisie
    room.sendAnnouncement('(🇳🇱) EREDIVISIE: | AJA | FEY | PSV | WIL', player.id, 0xFA6400, "bold", 0); 
} 

function Ligue1Fun(player) { // !ligue1
    room.sendAnnouncement('(🇫🇷) LIGUE 1: | PSG | OGC | OM | OL | ASM | FCN | REN | STE', player.id, 0x3744FA, "bold", 0); 
}

function LigaMXFun(player) { // !ligamx
    room.sendAnnouncement('(🇲🇽) LIGA MX: | AMC | CHV | CRUZ | TGS | MTY', player.id, 0x75FF59, "bold", 0); 
} 

function LigaProFun(player) { // !ligapro
    room.sendAnnouncement('(🇪🇨) LIGA PRO: | LDU | BSC | EME | IDV | DEPUCA', player.id, 0xFAFF5C, "bold", 0); 
}

function RaiffeisenSuperLeagueFun(player) { // !superligasuiza
    room.sendAnnouncement('(🇨🇭) RAIFFEISEN SUPER LEAGUE: | BAS | ', player.id, 0xFF0A0A, "bold", 0); 
}

function Liga1PeruFun(player) { // !liga1peru
    room.sendAnnouncement('(🇵🇪) LIGA 1: | UNV | ALI | CRI | MEL | UCV', player.id, 0xFF1C1C, "bold", 0); 
}

function PrimeiraLigaFun(player) { // !primeiraliga
    room.sendAnnouncement('(🇵🇹) Primeira Liga: | BEN | SPO | FCP | SCB', player.id, 0xFF3B3B, "bold", 0); 
}

function EquiposEsportsFun(player) { // !esports
    room.sendAnnouncement("(🎮) EQUIPOS ESPORTS:  | FURIA | ISURUS | 9Z | KUNISPORT | TRONCOS | PORCINOS | SAIYANS | BARRIO | ANIQUILADORES |", player.id, 0x00FF00, "bold", 0); 
    room.sendAnnouncement("| JIJANTES | MOSTOLES | RAYO | XBUYER | 1K | FURIUS | PIO |", player.id, 0x00FF00, "bold", 0); 
    return false;
}



// Comando para cambiar camiseta con formato simplificado
room.onCommand_camiseta = function(player, args) {
    if (!args || args.length === 0) {
        listarCamisetasDisponibles(player);
        return false;
    }
    
    const comando = args[0].toLowerCase();
    
    // Verificar si el comando tiene el formato "equipo+número"
    const match = comando.match(/^([a-z]+)([1-3])$/);
    
    if (match) {
        // Si tiene el formato correcto, extraer el equipo y la variante
        const equipo = match[1];
        const variante = match[2];
        aplicarCamisetaSimple(player, equipo, variante);
    } else {
        // Si no tiene el formato correcto, intentar con el método anterior
        aplicarCamisetaPorClave(player, comando);
    }
    
    return false;
};

// 6. Agreguemos un comando para ver las camisetas disponibles
room.onCommand_camisetas = function(player) {
    listarCamisetasDisponibles(player);
    return false;
};

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

function handleQuickMessage(player, quickMessageNumber) {
    // Verificar que el jugador esté en un equipo activo
    if (player.team === Team.SPECTATORS) {
        room.sendAnnouncement("⚠️ Tenés que estar en un equipo para usar mensajes rápidos", player.id, 0xFF9900, "bold");
        return;
    }
    
    console.log("Mensaje rápido solicitado:", quickMessageNumber);
    
    // Verificar que el número de mensaje existe
    if (quickMessages[quickMessageNumber]) {
        // Reemplazar ${player.name} si existe en el mensaje
        let message = quickMessages[quickMessageNumber].replace(/\$\{player\.name\}/g, player.name);
        
        console.log("Enviando mensaje rápido:", message);
        
        // Color según el equipo del jugador
        let messageColor = player.team === Team.RED ? 0xFF4949 : 0x4949FF;
        
        // Enviar como anuncio en lugar de chat
        room.sendAnnouncement(`${player.name}: ${message}`, null, messageColor, "normal", 0);
    } else {
        console.log("Mensaje rápido no encontrado. Disponibles:", Object.keys(quickMessages));
        room.sendAnnouncement(`⚠️ Mensaje rápido #${quickMessageNumber} no encontrado`, player.id, 0xFF9900);
    }
}







var opciones = [
    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xf5b606;
            redColor = [0x011ede, 0xc80056];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "BARCELONA";

            blueAngle = 73;
            blueTextColor = 0x0f2145;
            blueColor = [0xffc10a, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "REAL MADRID";
        },
        demanda: 600 // Demanda muy alta
    },
    {
        partido: function () {
            redAngle = 30;
            redTextColor = 0x231f20;
            redColor = [0xffffff, 0xee1b2c, 0xffffff];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "RIVER PLATE";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x033f86, 0xfab900, 0x033f86];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BOCA JRS.";
        },
        demanda: 600 // Alta demanda
    },
    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xffffff;
            redColor = [0xD90119, 0xC7011A, 0xAB0918];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "MANCHESTER UNITED";

            blueAngle = 90;
            blueTextColor = 0xffffff;
            blueColor = [0x95c1e6];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "MANCHESTER CITY";
        },
        demanda: 600 // Alta demanda
    },
    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xFFFFFF;
            redColor = [0xdc052d, 0xed0038, 0xed0038];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "BAYERN  DE MUNICH";

            blueAngle = 90;
            blueTextColor = 0x1d1d1b;
            blueColor = [0x1d1d1b, 0xfad515, 0xfad515];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BORUSSIA DORTMUND";
        },
        demanda: 500 // Alta demanda
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xffffff;
            redColor = [0xdf061b, 0x000000, 0xdf061b];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "AC MILAN";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x00239c, 0x000000, 0x00239c];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "INTER MILAN";
        },
        demanda: 500 // Alta demanda, partidos históricos en la Serie A
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xffffff;
            redColor = [0x1a2747, 0xde0319, 0x1a2747];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "PSG";

            blueAngle = 61;
            blueTextColor = 0xc99740;
            blueColor = [0x00a4dc, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "OLYMPIQUE MARSELLA";
        },
        demanda: 150 // Gran rivalidad en la Ligue 1 de Francia
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xffffff;
            redColor = [0xdf061b, 0x000000, 0xdf061b];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "AC MILAN";

            blueAngle = 180;
            blueTextColor = 0xf7c902;
            blueColor = [0x1f1a20, 0xffffff, 0x1f1a20];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "JUVENTUS";
        },
        demanda: 150 // Un enfrentamiento de alto nivel entre equipos históricos
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0x00a032;
            redColor = [0xffcd00];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "BRASIL";

            blueAngle = 180;
            blueTextColor = 0x1e2930;
            blueColor = [0x98cef0, 0xffffff, 0x98cef0];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ARGENTINA";
        },
        demanda: 450 // Enfrentamiento entre dos de los equipos más grandes de América
    },


   {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xf3010f;
            redColor = [0xf8f8f8];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "INGLATERRA";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x000000, 0xDD0000, 0xFFCE00];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ALEMANIA";
        },
        demanda: 200 // Un clásico del fútbol europeo con dos de las selecciones más fuertes.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0x00a032;
            redColor = [0xffcd00];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "BRASIL";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x000000, 0xDD0000, 0xFFCE00];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ALEMANIA";
        },
        demanda: 150 // Ambos equipos tienen una enorme base de seguidores y tradición mundial.
    },

    {
        partido: function () {
    	redAngle = 90;  // Ángulo para el equipo rojo
    	redTextColor = 0xFFFFFF;  // Color del texto del equipo rojo
    	redColor = [0x000000, 0xDD0000, 0xFFCE00];  // Colores de Alemania (negro, rojo, amarillo)
    	room.setTeamColors(1, redAngle, redTextColor, redColor);
    	teamRed = "ALEMANIA";

    	blueAngle = 0;  // Ángulo para el equipo azul
    	blueTextColor = 0x0064aa;  // Color del texto del equipo azul
    	blueColor = [0x009e3f, 0xFFFFFF, 0xe40321];  // Colores de Italia (verde, blanco, rojo)
    	room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
    	teamBlue = "ITALIA";
        },
        demanda: 300 // Italia y Alemania son selecciones históricas, aunque quizás con un poco menos de rivalidad directa.
    },

    {
        partido: function () {
            redAngle = 70;
            redTextColor = 0xffc000;
            redColor = [0xbb0c10];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ESPAÑA";

            blueAngle = 90;
            blueTextColor = 0xeabc78;
            blueColor = [0x1b2a4a];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FRANCIA";
        },
        demanda: 200 // Un gran partido europeo con mucha rivalidad reciente en competiciones como la Eurocopa y la Copa del Mundo.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xffffff;
            redColor = [0xdd0125, 0x211f25, 0xdd0125];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "FLAMENGO";

            blueAngle = 69;
            blueTextColor = 0x801f32;
            blueColor = [0xffffff, 0xffffff, 0x621b21];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FLUMINENSE";
        },
        demanda: 150 // Clásico carioca, una de las rivalidades más grandes de Brasil.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xfad948;
            redColor = [0xbc0021];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "LIVERPOOL";

            blueAngle = 69;
            blueTextColor = 0x1b1a20;
            blueColor = [0xc70317, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "MANCHESTER UNITED";
        },
        demanda: 150 // Enfrentamiento clásico de la Premier League con grandes seguidores en todo el mundo.
    },

    {
        partido: function () {
            redAngle = 60;
            redTextColor = 0xffffff;
            redColor = [0xec1c24];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "INDEPENDIENTE";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x033f86, 0xfab900, 0x033f86];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BOCA JRS.";
        },
        demanda: 120 // Clásico argentino, una de las rivalidades más intensas en el fútbol mundial.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0x292a6d;
            redColor = [0xe3221d, 0xffffff, 0xe3221d];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ATLÉTICO MADRID";

            blueAngle = 73;
            blueTextColor = 0x0f2145;
            blueColor = [0xffc10a, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "REAL MADRID";
        },
        demanda: 150 // Enfrentamiento de alto nivel en La Liga, con una gran rivalidad entre los dos grandes de Madrid.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xE3BA5B;
            redColor = [0xffffff, 0xe40615, 0xcd043a];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ARSENAL FC";

            blueAngle = 66;
            blueTextColor = 0xfbb700;
            blueColor = [0x001489];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "CHELSEA";
        },
        demanda: 150 // Clásico londinense, entre dos grandes rivales de la Premier League.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xffb200;
            redColor = [0x8f001c];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "AS ROMA";

            blueAngle = 180;
            blueTextColor = 0xffffff;
            blueColor = [0x81c6ee, 0x8ccaee , 0x81c6ee];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "LAZIO";
        },
        demanda: 120 // Clásico italiano, aunque menos mediático que los de otras ligas.
    },

    {
        partido: function () {
            redAngle = 30;
            redTextColor = 0x231f20;
            redColor = [0xffffff, 0xee1b2c, 0xffffff];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "RIVER PLATE";

            blueAngle = 180;
            blueTextColor = 0x002942;
            blueColor = [0x00a5e3, 0xFFFFFF, 0x00a5e3];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "RACING";
        },
        demanda: 150 // Uno de los clásicos más importantes de Argentina, muy seguido en todo el país.
    },

    {
        partido: function () {
            redAngle = 60;
            redTextColor = 0xffffff;
            redColor = [0xec1c24];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "INDEPENDIENTE";

            blueAngle = 180;
            blueTextColor = 0x002942;
            blueColor = [0x00a5e3, 0xFFFFFF, 0x00a5e3];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "RACING";
        },
        demanda: 600 // Rivalidad argentina entre dos equipos de Avellaneda, con mucha historia.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xe9282d, 0x1d3b56, 0xe9282d];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SAN LORENZO";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x033f86, 0xfab900, 0x033f86];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BOCA JRS.";
        },
        demanda: 450 // Clásico del fútbol argentino con una gran rivalidad, especialmente en Buenos Aires.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xffffff;
            redColor = [0xee1d23, 0x000000];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "NEWELLS";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0xfcd828, 0x144178, 0xfcd828];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ROSARIO CENTRAL";
        },
        demanda: 550 // Un clásico rosarino con una gran historia, muy importante en la ciudad de Rosario.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xFFFFFF;
            redColor = [0x6a2331, 0x74192e, 0x74192e];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "LANÚS";

            blueAngle = 180;
            blueTextColor = 0xb59859;
            blueColor = [0x007836, 0xffffff, 0x007836];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BANFIELD";
        },
        demanda: 50 // Clásico del fútbol argentino, aunque menos mediático que otros clásicos más populares.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xa7a9ab;
            redColor = [0x1e315a, 0xFFFFFF, 0x1e315a];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "TALLERES (C)";

            blueAngle = 70;
            blueTextColor = 0xffffff;
            blueColor = [0x1a120c, 0x009cd0, 0x009cd0];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BELGRANO";
        },
        demanda: 50 // Clásico cordobés, con mucha rivalidad y apoyo de los hinchas en Córdoba.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0x000000;
            redColor = [0xF4F4F6];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "CORINTHIANS";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x006337, 0x00713d, 0x00713d];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "PALMEIRAS";
        },
        demanda: 120 // Un clásico del fútbol brasileño con gran seguimiento, especialmente en São Paulo.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xffffff;
            redColor = [0x9e0424, 0x1c6137, 0x9e0424];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "FLUMINENSE";

            blueAngle = 29;
            blueTextColor = 0xd42a2a;
            blueColor = [0x19181B, 0xE6E6E4, 0x19181B];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "VASCO DA GAMA";
        },
        demanda: 50 // Un clásico carioca entre dos de los clubes más tradicionales de Río de Janeiro.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xFFFFFF;
            redColor = [0x006337, 0x00713d, 0x00713d];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "PALMEIRAS";

            blueAngle = 90;
            blueTextColor = 0x3b4043;
            blueColor = [0xf1f5f6];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "SANTOS FC";
        },
        demanda: 120 // Un clásico paulista entre dos gigantes del fútbol brasileño, con una gran rivalidad en São Paulo.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xFFFFFF;
            redColor = [0xff020c];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SC INTERNACIONAL";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x009ee2, 0x05171d, 0x009ee2];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "GREMIO";
        },
        demanda: 120 // Un clásico gaucho muy esperado por los hinchas de Porto Alegre, con una rivalidad histórica.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xced3d9;
            redColor = [0x0b245f, 0x214196, 0x7e6fb8];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ARGENTINA";

            blueAngle = 90;
            blueTextColor = 0x000000;
            blueColor = [0x75cbfa];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "URUGUAY";
        },
        demanda: 100 // El clásico rioplatense entre dos de las selecciones más grandes de Sudamérica.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xE0B85A;
            redColor = [0xffffff, 0xe40615, 0xe40615];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ARSENAL FC";

            blueAngle = 72;
            blueTextColor = 0x111836;
            blueColor = [0x0b0e1e, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "TOTTENHAM";
        },
        demanda: 70 // Un clásico del fútbol inglés con mucha rivalidad, especialmente en el norte de Londres.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xFFFFFF;
            redColor = [0xfbba00, 0xab092e];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "GALATASARAY";

            blueAngle = 180;
            blueTextColor = 0x020E1F;
            blueColor = [0xfff100, 0x014582, 0xfff100];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FENERBAHCE";
        },
        demanda: 50 // Un clásico turco entre dos de los equipos más grandes de Estambul, muy popular y lleno de historia.
    },

    {
        partido: function () {
            redAngle = 60;
            redTextColor = 0xFFFFFF;
            redColor = [0xdc0316, 0xdc0316, 0x08265c];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "MEDELLIN";

            blueAngle = 180;
            blueTextColor = 0x000000;
            blueColor = [0x018c4b, 0xffffff, 0x018c4b];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ATL. NACIONAL (COL)";
        },
        demanda: 55 // Un clásico colombiano entre dos de los clubes más emblemáticos del país, muy disputado.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0x000000;
            redColor = [0x039940, 0xffffff, 0x039940];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "CELTIC";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x01319f];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "RANGERS";
        },
        demanda: 55 // El Old Firm de Escocia, una de las rivalidades más intensas y antiguas del fútbol europeo.
    },

    {
        partido: function () {
            redAngle = 33;
            redTextColor = 0x000000;
            redColor = [0xF6F6F7];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "COLO COLO";

            blueAngle = 33;
            blueTextColor = 0xf4f4f4;
            blueColor = [0x1C2445];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "U DE CHILE";
        },
        demanda: 35 // Un clásico del fútbol chileno, conocido por la rivalidad entre los dos equipos más grandes del país.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xffffff;
            redColor = [0x00824A, 0x006327, 0x006327];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "FERRO";

            blueAngle = 180;
            blueTextColor = 0x0063a8;
            blueColor = [0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "VELEZ";
        },
        demanda: 36 // Un enfrentamiento argentino de gran historia, con dos clubes que representan diferentes estilos de fútbol.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xe9282d, 0x1d3b56, 0xe9282d];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SAN LORENZO";

            blueAngle = 180;
            blueTextColor = 0x0063a8;
            blueColor = [0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "VELEZ";
        },
        demanda: 35 // Un clásico argentino entre dos equipos de gran tradición, ambos de la ciudad de Buenos Aires.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xe9282d, 0x1d3b56, 0xe9282d];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SAN LORENZO";

            blueAngle = 52;
            blueTextColor = 0xff0000;
            blueColor = [0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "HURACÁN";
        },
        demanda: 156 // El clásico entre estos dos equipos del barrio de Boedo y Parque Patricios, siempre lleno de pasión.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0x323232;
            redColor = [0xe41815, 0xFFFFFF, 0xe41815];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ESTUDIANTES (LP)";

            blueAngle = 90;
            blueTextColor = 0x00afef;
            blueColor = [0xFFFFFF, 0x12175e, 0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "GIMNASIA (LP)";
        },
        demanda: 544 // El clásico platense, un enfrentamiento muy esperado en la ciudad de La Plata entre dos de sus clubes más representativos.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0x812124;
            redColor = [0xE1DCC5];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "UNIVERSITARIO";

            blueAngle = 180;
            blueTextColor = 0xd9030f;
            blueColor = [0x062247, 0xFFFFFF, 0x062247];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ALIANZA LIMA";
        },
        demanda: 35 // Un enfrentamiento clásico del fútbol peruano, muy esperado en el país, entre dos de los clubes más grandes de Lima.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xFFFFFF;
            redColor = [0xF7F8FA, 0xd71716, 0xd71716];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "INDEPENDIENTE SANTA FE";

            blueAngle = 55;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x232937, 0x1252b3, 0x1252b3];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "MILLONARIOS";
        },
        demanda: 330 // Un clásico del fútbol colombiano entre dos equipos de gran rivalidad de Bogotá, conocidos por su historia.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xffca00, 0x000000, 0xffca00];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "PEÑAROL";

            blueAngle = 55;
            blueTextColor = 0xd0142c;
            blueColor = [0x003895, 0xFFFFFF, 0x003895];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "NACIONAL (UY)";
        },
        demanda: 610 // El clásico del fútbol uruguayo entre los dos clubes más grandes de Montevideo, con una rivalidad de larga data.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xe10602, 0x00158c, 0xe10602];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "CERRO PORTEÑO";

            blueAngle = 90;
            blueTextColor = 0xa28026;
            blueColor = [0xFFFFFF, 0x0d0d0d, 0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "OLIMPIA";
        },
        demanda: 125 // Un clásico del fútbol paraguayo entre los dos equipos más grandes de Asunción, cargado de historia y emoción.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xf7c902;
            redColor = [0x1f1a20, 0xffffff, 0x1f1a20];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "JUVENTUS";

            blueAngle = 180;
            blueTextColor = 0xffffff;
            blueColor = [0x01b9eb];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "NAPOLI";
        },
        demanda: 70 // El clásico italiano, un enfrentamiento entre los dos clubes más importantes del sur de Italia, con mucha historia y rivalidad.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xceac02;
            redColor = [0xffffff, 0xda0120, 0xffffff];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "AJAX";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x0b826e, 0x02917f, 0x0b826e];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FEYENOORD";
        },
        demanda: 100 // El clásico de los Países Bajos, con la rivalidad de estos dos grandes clubes de Ámsterdam y Rotterdam.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xFFFFFF;
            redColor = [0xe30613];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SL BENFICA";

            blueAngle = 180;
            blueTextColor = 0xd0000c;
            blueColor = [0x0747ab, 0xffffff, 0x0747ab];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FC PORTO";
        },
        demanda: 70 // El clásico del fútbol portugués, un duelo tradicional entre los dos equipos más importantes de Lisboa y Oporto.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xff6300, 0x060902, 0xff6300];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SHAKHTAR DONETSK";

            blueAngle = 65;
            blueTextColor = 0x027fd9;
            blueColor = [0x0289da, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "DYNAMO KYIV";
        },
        demanda: 70 // Un enfrentamiento de dos grandes equipos ucranianos con una gran rivalidad entre Shakhtar Donetsk y Dynamo Kyiv.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xFFFFFF;
            redColor = [0xe30613];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SL BENFICA";

            blueAngle = 90;
            blueTextColor = 0x000000;
            blueColor = [0x008359, 0xffffff, 0x008359];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "SPORTING CP";
        },
        demanda: 100 // El derbi lisboeta entre SL Benfica y Sporting CP, con una rivalidad centenaria en la ciudad de Lisboa.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xffb200;
            redColor = [0x8f001c];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "AS ROMA";

            blueAngle = 180;
            blueTextColor = 0xffffff;
            blueColor = [0x01b9eb];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "NAPOLI";
        },
        demanda: 80 // El clásico italiano, una rivalidad entre dos de los clubes más grandes del país: Roma y Nápoles.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xf7c902;
            redColor = [0x1f1a20, 0xffffff, 0x1f1a20];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "JUVENTUS";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x00239c, 0x000000, 0x00239c];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "INTER MILAN";
        },
        demanda: 120 // Un enfrentamiento clásico de Italia, entre la Juventus y el Inter de Milán, dos de los equipos más exitosos de la Serie A.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0x0A1129;
            redColor = [0xffba00, 0x0033cc, 0xffba00];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "TIGRES UANL";

            blueAngle = 180;
            blueTextColor = 0xe50913;
            blueColor = [0x0e2141, 0xffffff, 0x0e2141];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "MONTERREY";
        },
        demanda: 65 // Un clásico regio de la liga mexicana, lleno de rivalidad y pasión.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xffffff;
            redColor = [0xdd0125, 0x211f25, 0xdd0125];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "FLAMENGO";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x006337, 0x00713d, 0x00713d];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "PALMEIRAS";
        },
        demanda: 220 // Un clásico brasileño muy esperado entre estos dos equipos, con mucha historia y rivalidad.
    },

    {
        partido: function () {
            redAngle = 123;
            redTextColor = 0x005da4;
            redColor = [0xeb2a2f, 0xFFFFFF, 0xeb2a2f];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ARGENTINOS JRS.";

            blueAngle = 90;
            blueTextColor = 0xfd6f21;
            blueColor = [0xFFFFFF, 0x5a3e22, 0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "PLATENSE";
        },
        demanda: 65 // Un partido entre equipos del fútbol argentino con rivalidad y mucha historia local.
    },

    {
        partido: function () {
            redAngle = 130;
            redTextColor = 0xf9cd39;
            redColor = [0xa92121, 0xa92121, 0x01553e];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "PORTUGAL";

            blueAngle = 180;
            blueTextColor = 0x1e2930;
            blueColor = [0x98cef0, 0xffffff, 0x98cef0];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ARGENTINA";
        },
        demanda: 200 // Un partido internacional entre selecciones de gran nivel con historia de enfrentamientos.
    },

    {
        partido: function () {
            redAngle = 66;
            redTextColor = 0xffffff;
            redColor = [0xf36b22];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "HOLANDA";

            blueAngle = 180;
            blueTextColor = 0x1e2930;
            blueColor = [0x98cef0, 0xffffff, 0x98cef0];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ARGENTINA";
        },
        demanda: 40 // Otro clásico internacional, con equipos de renombre mundial enfrentándose.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0x0064aa;
            redColor = [0x009e3f, 0xFFFFFF, 0xe40321];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ITALIA";

            blueAngle = 90;
            blueTextColor = 0x000000;
            blueColor = [0x75cbfa];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "URUGUAY";
        },
        demanda: 140 // Un clásico de selecciones de nivel mundial, con mucha historia en la Copa del Mundo.
    },

   {
        partido: function () {
            redAngle = 0;
            redTextColor = 0x0064aa;
            redColor = [0x009e3f, 0xFFFFFF, 0xe40321];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ITALIA";

            blueAngle = 90;
            blueTextColor = 0xeabc78;
            blueColor = [0x1b2a4a];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FRANCIA";
        },
        demanda: 200 // Un enfrentamiento clásico entre dos selecciones de renombre mundial, con mucha historia en competiciones internacionales.
    },


    // Agregar más opciones según sea necesario
];

let Cor = {
    Rojo: 0xFA5646,
    Naranja: 0xFFC12F,
    Verde: 0x7DFA89,
    Azul: 0x05C5FF,
    Amarillo: 0xFFFF17,
    Gris: 0xCCCCCC,
    Blanco: 0xFFFFFF,
    AzulClaro: 0x6ECAFF,
    AzulPolvo: 0xB0E0E6,
    Púrpura: 0x800080,
    Platino: 0xE5E4E2,
    Dorado: 0xffd700,
    Plateado: 0xd5d5d5,
    Bronce: 0x896728,
    Cardo: 0xD8BFD8,
    Caqui: 0xF0E68C,
    AzulAlicia: 0xF0F8FF,
    BlancoFantasma: 0xF8F8FF,
    Nieve: 0xFFFAFA,
    ConchaMar: 0xFFF5EE,
    BlancoFloral: 0xFFFAF0,
    HumoBlanco: 0xF5F5F5,
    Beige: 0xF5F5DC,
    EncajeAntiguo: 0xFDF5E6,
    Marfil: 0xFFFFF0,
    Lino: 0xFAF0E6,
    SedaMaíz: 0xFFF8DC,
    BlancoAntiguo: 0xFAEBD7,
    AlmendraBlanqueada: 0xFFEBCD,
    Bisque: 0xFFE4C4,
    AmarilloClaro: 0xFFFFE0,
    LimónChiffon: 0xFFFACD,
    AmarilloDoradoClaro: 0xFAFAD2,
    BatidoPapaya: 0xFFEFD5,
    Melocotón: 0xFFDAB9,
    Mocasín: 0xFFE4B5,
    DoradoPálido: 0xEEE8AA,
    AzulOscuro: 0x426AD6,
    Advertencia: 0xff9966
}

    // Mensajes rápidos usando números
 

    const secondsToResetAvatar = 3;
    var registro = new Map();
    const css = "border:2px solid;padding:8px;background:";
    room.setTeamsLock(true);
    var message;
    var Botdivulga;
    var msg1;
    var msg1Time = 1500000;
    var Deus = [];
    var BotdivulgaTime = 900000;
    var adminPassword = 4002;

    var vip1 = [];
    var vip2 = [];
    var vip3 = [];

    /* ESTÁDIO */

    const playerRadius = 15;
    var ballRadius = 6.25;
    const triggerDistance = playerRadius + ballRadius + 0.01;



    var aloneMap = '{"name":"AHA Classic (Training) v2.1","width":420,"height":200,"bg":{"type":"grass","width":370,"height":170,"kickOffRadius":75},"vertexes":[{"x":-370,"y":170,"cMask":["ball"]},{"x":-370,"y":64,"cMask":["ball"]},{"x":-370,"y":-64,"cMask":["ball"]},{"x":-370,"y":-170,"cMask":["ball"]},{"x":370,"y":170,"cMask":["ball"]},{"x":370,"y":64,"cMask":["ball"]},{"x":370,"y":-64,"cMask":["ball"]},{"x":370,"y":-170,"cMask":["ball"]},{"x":-380,"y":-64,"bCoef":3,"cMask":["ball"]},{"x":-400,"y":-44,"bCoef":3,"cMask":["ball"]},{"x":-400,"y":44,"bCoef":3,"cMask":["ball"]},{"x":-380,"y":64,"bCoef":3,"cMask":["ball"]},{"x":380,"y":-64,"bCoef":3,"cMask":["ball"]},{"x":400,"y":-44,"bCoef":3,"cMask":["ball"]},{"x":400,"y":44,"bCoef":3,"cMask":["ball"]},{"x":380,"y":64,"bCoef":3,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":2,"v1":3,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":4,"v1":5,"bias":40,"vis":false,"cMask":["ball"]},{"v0":6,"v1":7,"bias":40,"vis":false,"cMask":["ball"]},{"v0":9,"v1":8,"bCoef":3,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":9,"v1":10,"bCoef":3,"cMask":["ball"]},{"v0":11,"v1":10,"bCoef":3,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":12,"v1":13,"bCoef":3,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":13,"v1":14,"bCoef":3,"cMask":["ball"]},{"v0":14,"v1":15,"bCoef":3,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]}],"planes":[{"normal":[0,1],"dist":-170,"cMask":["ball"]},{"normal":[0,-1],"dist":-170,"cMask":["ball"]},{"normal":[0,1],"dist":-200,"bCoef":0.1},{"normal":[0,-1],"dist":-200,"bCoef":0.1},{"normal":[1,0],"dist":-420,"bCoef":0.1},{"normal":[-1,0],"dist":-420,"bCoef":0.1}],"goals":[],"discs":[{"radius":9.3,"bCoef":0.45,"invMass":1.12,"damping":0.9893,"cGroup":["ball","kick","score"]},{"pos":[-370,64],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[-370,-64],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[370,64],"radius":8,"invMass":0,"color":"CCCCFF"},{"pos":[370,-64],"radius":8,"invMass":0,"color":"CCCCFF"}],"playerPhysics":{},"ballPhysics":"disc0","spawnDistance":30}';
    var classicMap = '{"name":"AHA Classic v2.1","width":420,"height":200,"bg":{"type":"grass","width":370,"height":170,"kickOffRadius":75},"vertexes":[{"x":-370,"y":170,"cMask":["ball"]},{"x":-370,"y":64,"cMask":["ball"]},{"x":-370,"y":-64,"cMask":["ball"]},{"x":-370,"y":-170,"cMask":["ball"]},{"x":370,"y":170,"cMask":["ball"]},{"x":370,"y":64,"cMask":["ball"]},{"x":370,"y":-64,"cMask":["ball"]},{"x":370,"y":-170,"cMask":["ball"]},{"x":0,"y":200,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":75,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-75,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-200,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":-380,"y":-64,"bCoef":0.1,"cMask":["ball"]},{"x":-400,"y":-44,"bCoef":0.1,"cMask":["ball"]},{"x":-400,"y":44,"bCoef":0.1,"cMask":["ball"]},{"x":-380,"y":64,"bCoef":0.1,"cMask":["ball"]},{"x":380,"y":-64,"bCoef":0.1,"cMask":["ball"]},{"x":400,"y":-44,"bCoef":0.1,"cMask":["ball"]},{"x":400,"y":44,"bCoef":0.1,"cMask":["ball"]},{"x":380,"y":64,"bCoef":0.1,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":2,"v1":3,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":4,"v1":5,"bias":40,"vis":false,"cMask":["ball"]},{"v0":6,"v1":7,"bias":40,"vis":false,"cMask":["ball"]},{"v0":13,"v1":12,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":13,"v1":14,"bCoef":0.1,"cMask":["ball"]},{"v0":15,"v1":14,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":16,"v1":17,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":17,"v1":18,"bCoef":0.1,"cMask":["ball"]},{"v0":18,"v1":19,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":8,"v1":9,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":9,"v1":10,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":10,"v1":9,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["redKO"]},{"v0":10,"v1":11,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"planes":[{"normal":[0,1],"dist":-170,"cMask":["ball"]},{"normal":[0,-1],"dist":-170,"cMask":["ball"]},{"normal":[0,1],"dist":-200,"bCoef":0.1},{"normal":[0,-1],"dist":-200,"bCoef":0.1},{"normal":[1,0],"dist":-420,"bCoef":0.1},{"normal":[-1,0],"dist":-420,"bCoef":0.1}],"goals":[{"p0":[-370,64],"p1":[-370,-64],"team":"red"},{"p0":[370,64],"p1":[370,-64],"team":"blue"}],"discs":[{"radius":9.3,"bCoef":0.45,"invMass":1.12,"damping":0.9893,"cGroup":["ball","kick","score"]},{"pos":[-370,64],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[-370,-64],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[370,64],"radius":8,"invMass":0,"color":"CCCCFF"},{"pos":[370,-64],"radius":8,"invMass":0,"color":"CCCCFF"}],"playerPhysics":{},"ballPhysics":"disc0","spawnDistance":170}'; // Insert your map for 1v1 and 2v2 here. To get minimum file size, here are the instructions : 1. Download the map 2. Go to https://cssminifier.com 3. Paste the result
    var bigMap = '{"name":"AHA Big v2.1","width":600,"height":270,"bg":{"type":"grass","width":550,"height":240,"kickOffRadius":80},"vertexes":[{"x":-550,"y":240,"cMask":["ball"]},{"x":-550,"y":80,"cMask":["ball"]},{"x":-550,"y":-80,"cMask":["ball"]},{"x":-550,"y":-240,"cMask":["ball"]},{"x":550,"y":240,"cMask":["ball"]},{"x":550,"y":80,"cMask":["ball"]},{"x":550,"y":-80,"cMask":["ball"]},{"x":550,"y":-240,"cMask":["ball"]},{"x":0,"y":270,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-270,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":-560,"y":-80,"bCoef":0.1,"cMask":["ball"]},{"x":-580,"y":-60,"bCoef":0.1,"cMask":["ball"]},{"x":-580,"y":60,"bCoef":0.1,"cMask":["ball"]},{"x":-560,"y":80,"bCoef":0.1,"cMask":["ball"]},{"x":560,"y":-80,"bCoef":0.1,"cMask":["ball"]},{"x":580,"y":-60,"bCoef":0.1,"cMask":["ball"]},{"x":580,"y":60,"bCoef":0.1,"cMask":["ball"]},{"x":560,"y":80,"bCoef":0.1,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":2,"v1":3,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":4,"v1":5,"bias":40,"vis":false,"cMask":["ball"]},{"v0":6,"v1":7,"bias":40,"vis":false,"cMask":["ball"]},{"v0":13,"v1":12,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":13,"v1":14,"bCoef":0.1,"cMask":["ball"]},{"v0":15,"v1":14,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":16,"v1":17,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":17,"v1":18,"bCoef":0.1,"cMask":["ball"]},{"v0":18,"v1":19,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":8,"v1":9,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":9,"v1":10,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":10,"v1":9,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["redKO"]},{"v0":10,"v1":11,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"planes":[{"normal":[0,1],"dist":-240,"cMask":["ball"]},{"normal":[0,-1],"dist":-240,"cMask":["ball"]},{"normal":[0,1],"dist":-270,"bCoef":0.1},{"normal":[0,-1],"dist":-270,"bCoef":0.1},{"normal":[1,0],"dist":-600,"bCoef":0.1},{"normal":[-1,0],"dist":-600,"bCoef":0.1}],"goals":[{"p0":[-550,80],"p1":[-550,-80],"team":"red"},{"p0":[550,80],"p1":[550,-80],"team":"blue"}],"discs":[{"radius":9.3,"bCoef":0.45,"invMass":1.12,"damping":0.9893,"cGroup":["ball","kick","score"]},{"pos":[-550,80],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[-550,-80],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[550,80],"radius":8,"invMass":0,"color":"CCCCFF"},{"pos":[550,-80],"radius":8,"invMass":0,"color":"CCCCFF"}],"playerPhysics":{},"ballPhysics":"disc0","spawnDistance":350}'; // Read above

    /* OPÇÕES */

    var afkLimit = 20; // 
    var drawTimeLimit = 1; // minutos
    var maxTeamSize = 3; // máximo de jogadores num time, isso funciona para 1 (você pode querer adaptar as coisas para remover algumas estatísticas inúteis em 1v1, como assist ou cs), 2, 3 ou 4
    var slowMode = 0;
    // Variables para el sistema de slow mode
var playerLastMessages = new Map(); // Mapa para rastrear último mensaje de cada jugador
var slowModeWarnings = new Map(); // Contador de advertencias por jugador



    /* JOGADORES */
    const MASTER_AUTH = "OIYE4QbPXlzoDlR7cnj01i0-h3IIfSt5t0x8QtLt4oc"; // Reemplazá esto con tu auth de HaxBall


    const Role = { 
        PLAYER: 0, 
        ADMIN_TEMP: 1, 
        ADMIN_PERM: 2, 
        SUPERADMIN: 3, 
        CO_OWNER: 4, 
        OWNER: 5,
        MASTER: 6  // Mantenemos MASTER como el rol más alto
    };

var autoStart = null;

// Variables globales para control de estado
let isBalancing = false;
let isChoosing = false;

// Al inicio del archivo, junto a tus otras variables globales

// Esta función debe llamarse ANTES de room.startGame() en cualquier parte del código




    // Objeto para almacenar roles personalizados por auth
    var playerRoles = new Map(); // Usar Map en lugar de objeto simple
    // Agregar con las otras variables globales
    const mutedPlayers = new Map(); // Map para guardar {id: {name, auth, until}}
    const bannedPlayers = new Map(); // Map para guardar {auth: {name, until}}
    // Agregar con las otras variables globales
    const spyingAdmins = new Set(); // Set para guardar los IDs de admins espiando
    // Contraseñas para roles (añade esto cerca de tus otras variables globales)
    var rolePasswords = {
        [Role.MASTER]: "jubilado123",
        [Role.OWNER]: "lisensiado123",
        [Role.CO_OWNER]: "lisensiado",
        [Role.SUPERADMIN]: "parmegiano",
        [Role.ADMIN_PERM]: "mondongo123"
        // No incluir ADMIN_TEMP ni PLAYER ya que no deberían tener contraseña
    };




    const Team = {
        SPECTATORS: 0,
        RED: 1,
        BLUE: 2
    };
    var extendedP = [];
    const eP = {
        ID: 0,
        AUTH: 1,
        CONN: 2,
        AFK: 3,
        ACT: 4,
        GK: 5,
        MUTE: 6
    };
    const Ss = {
        GA: 0,
        WI: 1,
        DR: 2,
        LS: 3,
        WR: 4,
        GL: 5,
        AS: 6,
        GK: 7,
        CS: 8,
        CP: 9,
        RL: 10,
        NK: 11
    }
    var players;
    var teamR;
    var teamB;
    var teamS;
    var messageHistory = [0, 0, 0, 0, 0, 0];
    var messageCounter = 0;

    /* GAME */

    var lastTeamTouched; // records who was the last to touch the ball
    var lastPlayersTouched; // allows you to receive good goal notifications (must be lastPlayersKicked, waiting for a next update to get better control of shots on target)
    var countAFK = false; // created to get better control of the activity, kicks if it's AFK
    var activePlay = false; // created to gain better control of ball possession
    var goldenGoal = false;
    var SMSet = new Set(); // set created to get slow mode which is useful in ChooseMode
    var banList = []; // keep track of bans, so we can unban people if we want

    /* STATS */

    var game;
    var GKList = ["", ""];
    var Rposs = 0;
    var Bposs = 0;
    var point = [{
        "x": 0,
        "y": 0
    }, {
        "x": 0,
        "y": 0
    }]; // created to obtain ball speed
    var ballSpeed;
    var lastWinner = Team.SPECTATORS;
    var streak = 0;
    var allBlues = [3]; // this is to count the players who should be counted for statistics. This includes players who left after the game started.
    var allReds = [3];

    /* BALANCE AND RECRUITMENT */

    var inChooseMode = false; // this variable allows you to distinguish the 2 phases of the game and choose which ones should be treated very differently
    var redCaptainChoice = "";
    var blueCaptainChoice = "";
    var chooseTime = 20;
    var timeOutCap;
// Variables para rastrear qué capitanes están listos
// Variables para rastrear el estado de selección de cada equipo
let redTeamDoneSelecting = false;
let blueTeamDoneSelecting = false;



    /* ASSISTANT */

    var checkTimeVariable = false; // this is created so that chat doesn't get spammed when a game ends via timeLimit
    var announced = false;
    var statNumber = 0; // this allows the room to receive statistical information every X minutes
    var endGameVariable = false; // this variable with the one below helps distinguish cases where games are stopped because they are over from those where games are stopped due to player movements or team resets
    var resettingTeams = false;
    var capLeft = false;
    var statInterval = 6;

    loadMap(aloneMap, scoreLimitPractice, timeLimitPractice);
    loadMap(classicMap, scoreLimitClassic, timeLimitClassic);
    loadMap(bigMap, scoreLimitBig, timeLimitBig);



    function isMatchInProgress() {
        const scores = room.getScores();
        return scores !== null && scores.time !== 0;
    }

    function isGameInTransition() {
        return isBalancing || isChoosing || room.getScores() === null;
    }
    
    /* OBJECTS */

    function Goal(time, team, striker, assist) {
        this.time = time;
        this.team = team;
        this.striker = striker;
        this.assist = assist;
    }

    function Game(date, scores, goals) {
        this.date = date;
        this.scores = scores;
        this.goals = goals;
    }

    // function setRegister(player, senha) {
    //    if (registro.get(player.name)) room.sendAnnouncement('Você já está registrado.', player.id);
    //    else {
    //        registro.set(player.name, senha);
    //        localStorage.setItem("registros", JSON.stringify([...registro]));
    //        room.sendAnnouncement('Registrado!', player.id, 0x2FE436);
    //        room.sendAnnouncement(`Senha: ${senha}`, player.id, 0x2FE436);
    //    }
    //}

    //function getLogin(player, senha) {
    //    if (registro.get(player.name)) {
    //        if (registro.get(player.name) == senha) {
    //            room.sendAnnouncement(`${player.name} logou!`, null, 0x2FE436);
    //        } else room.sendAnnouncement('Senha incorreta.', player.id, 0xFF0000);
    //    } else room.sendAnnouncement('Você não está registrado.', player.id, 0xFF0000);
    //}

    /* FUNCTIONS */


// Variable global para el temporizador de inicio automático


// Llamar a esta función al final de la selección
// setupAutoStart();
    
    /* ADMIN FUNCTIONS */
    // Nueva función auxiliar para obtener el formato del chat
// Función getChatFormat modificada para incluir ELO pero mantener tu estructura original
// Función mejorada de getChatFormat para mostrar ELO + rol admin
function getChatFormat(player) {
    const auth = getAuth(player);
    if (!auth) return { prefix: "", chatColor: 0xFFFFFF };
    
    let stats = JSON.parse(localStorage.getItem(auth)) || {};
    
    // Obtenemos rango por ELO
    let eloPrefix = "";
    let playerElo = ELO_DEFAULT;
    
    // Intentamos obtener el ELO del localStorage
    if (stats.elo) {
        playerElo = stats.elo;
    } else {
        // Si no tiene ELO en localStorage, intentamos obtenerlo de Firebase
        try {
            const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
            fetch(url)
                .then(response => response.json())
                .then(userData => {
                    if (userData && userData.elo) {
                        stats.elo = userData.elo;
                        playerElo = userData.elo;
                        localStorage.setItem(auth, JSON.stringify(stats));
                    }
                })
                .catch(error => console.error("Error obteniendo ELO:", error));
        } catch (e) {
            console.error("Error en la consulta de ELO:", e);
        }
    }
    
    // Obtenemos el emoji del rango ELO
    const eloRank = getEloRank(playerElo);
    // Formato: Emoji + número de ELO
    eloPrefix = `${eloRank.icon} ${playerElo} | `;
    
    let role = getRole(player);
    let rolePrefix = "";
    let chatColor = 0xFFFFFF; // Color por defecto

    // Determinamos prefijo y color según rol de admin
    switch (role) {
        case Role.MASTER:
            rolePrefix = "👑 MASTER | ";
            chatColor = 0xffb02e;
            break;
        case Role.OWNER:
            rolePrefix = "👑 OWNER | ";
            chatColor = 0xffb02e;
            break;
        case Role.CO_OWNER:
            rolePrefix = "⭐ CO-OWNER | ";
            chatColor = 0xfcd53f;
            break;
        case Role.SUPERADMIN:
            rolePrefix = "🔰 SUPERADMIN | ";
            chatColor = 0x44911b;
            break;
        case Role.ADMIN_PERM:
            rolePrefix = "🛡️ ADMIN | ";
            chatColor = 0xc2cad1;
            break;
        case Role.ADMIN_TEMP:
            rolePrefix = "🔧 ADMIN-TEMP | ";
            chatColor = 0x6c6a76;
            break;
        default:
            rolePrefix = ""; // Jugadores normales sin prefijo de rol
            
            // Para jugadores normales, el color es el de su equipo
            if (player.team === 1) {
                chatColor = 0xE56E56; // Rojo
            } else if (player.team === 2) {
                chatColor = 0x5689E5; // Azul
            }
            break;
    }
    
    // Prefijo final: ELO + rol (si aplica)
    const prefix = eloPrefix + rolePrefix;
    
    return { prefix, chatColor };
}


    // Función auxiliar para obtener los mejores jugadores
    function getTopPlayers() {
        let players = [];
        // Recorremos todo el localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const stats = JSON.parse(localStorage.getItem(key));
                if (Array.isArray(stats) && stats.length >= 10) {
                    players.push({
                        auth: key,
                        name: stats[Ss.NK] || "???", // Nombre del jugador
                        goals: stats[Ss.GL] || 0,
                        assists: stats[Ss.AS] || 0,
                        cs: stats[Ss.CS] || 0
                    });
                }
            } catch (e) {
                continue; // Ignoramos entradas inválidas
            }
        }
        return players;
    }


    // Agregá una función para obtener el nombre del rol
    function getRoleName(role) {
        switch(role) {
            case Role.MASTER: return "Master";
            case Role.OWNER: return "Owner";
            case Role.CO_OWNER: return "Co-Owner";
            case Role.SUPERADMIN: return "Super Admin";
            case Role.ADMIN_PERM: return "Admin Permanente";
            case Role.ADMIN_TEMP: return "Admin Temporal";
            case Role.PLAYER: return "Jugador";
            default: return "Desconocido";
        }
    }

    // Y asegurémonos de que getRole funcione correctamente
    function getRole(player) {
        const auth = getAuth(player);
        if (!auth) return Role.PLAYER;


        return playerRoles.get(auth) || Role.PLAYER;
    }


    // 1. Agregar validación de roles
    function isValidRole(role) {
        return role >= Role.PLAYER && role <= Role.MASTER;
    }

    // 2. Función para verificar si un jugador puede dar cierto rol
    function canAssignRole(adminRole, targetRole) {
        return adminRole > targetRole; // Solo puede dar roles menores al suyo
    }


    function updateAdmins(excludedPlayerID = 0) {
        if (players.length != 0 && players.filter((p) => p.admin).length < maxAdmins) {
            let playerArray = players.filter((p) => p.id != excludedPlayerID && !p.admin);
            let arrayID = playerArray.map((player) => player.id);
            room.setPlayerAdmin(Math.min(...arrayID), true);
        }
    }




// 1. Primero arreglamos la función updatePlayerName
function updatePlayerName(player) {
    try {
        // La función setPlayerName no está disponible en esta versión de la API
        // En lugar de intentar cambiar el nombre, solo registramos el intento
        console.log(`Intentando actualizar nombre de ${player.name} - función no disponible`);
        
        // Podemos guardar el prefijo que querríamos aplicar para usarlo en otros lugares
        const role = getRole(player);
        let prefix = "";
        
        switch (role) {
            case Role.MASTER:
            case Role.OWNER:
                prefix = "👑 ";
                break;
            case Role.CO_OWNER:
                prefix = "⭐ ";
                break;
            case Role.SUPERADMIN:
                prefix = "🔰 ";
                break;
            case Role.ADMIN_PERM:
                prefix = "🛡️ ";
                break;
            default:
                prefix = "";
        }
        
        // Podemos guardar el prefijo en algún lugar para usarlo en mensajes
        // Por ejemplo, en un Map global
        if (typeof playerPrefixes === 'undefined') {
            window.playerPrefixes = new Map();
        }
        
        if (prefix) {
            playerPrefixes.set(player.id, prefix);
        }
        
        return true;
    } catch (error) {
        console.error("Error al actualizar nombre:", error);
        return false;
    }
}



// 2. También necesitamos arreglar la función updateAllPlayerNames
function updateAllPlayerNames() {
    try {
    const players = room.getPlayerList();
        if (!players || !Array.isArray(players)) return;
        
        // En lugar de intentar cambiar nombres, solo registramos el intento
        console.log("Actualizando nombres de todos los jugadores (función no disponible)");
        
        // Podemos recorrer los jugadores para actualizar sus prefijos en nuestro Map
    players.forEach(player => {
            if (player) {
        updatePlayerName(player);
            }
        });
        
        return true;
    } catch (error) {
        console.error("Error al actualizar todos los nombres:", error);
        return false;
    }
}

// Actualizar la función updatePlayerStats para sincronizar también con localStorage

function updatePlayerStats(player, statsUpdate) {
    const auth = getAuth(player);
    if (!auth) return;

    const url = `${FIREBASE_URL}/players/${auth}/stats.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(currentStats => {
        const updatedStats = {
            ...currentStats,
            ...statsUpdate
        };
        
        // Actualizamos también localStorage
        const localStats = JSON.parse(localStorage.getItem(auth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
        
        // Actualizamos los valores locales según los cambios en Firebase
        if (statsUpdate.games !== undefined) localStats[Ss.GA] = statsUpdate.games;
        if (statsUpdate.wins !== undefined) localStats[Ss.WI] = statsUpdate.wins;
        if (statsUpdate.losses !== undefined) localStats[Ss.LS] = statsUpdate.losses;
        if (statsUpdate.goals !== undefined) localStats[Ss.GL] = statsUpdate.goals;
        if (statsUpdate.assists !== undefined) localStats[Ss.AS] = statsUpdate.assists;
        if (statsUpdate.gk !== undefined) localStats[Ss.GK] = statsUpdate.gk;
        if (statsUpdate.cs !== undefined) localStats[Ss.CS] = statsUpdate.cs;
        if (statsUpdate.mvps !== undefined) localStats.mvps = statsUpdate.mvps; // Agregar MVPs
        
        // Recalculamos porcentajes
        localStats[Ss.WR] = localStats[Ss.GA] > 0 ? ((localStats[Ss.WI] / localStats[Ss.GA]) * 100).toFixed(2) : "0.00";
        localStats[Ss.CP] = localStats[Ss.GK] > 0 ? ((localStats[Ss.CS] / localStats[Ss.GK]) * 100).toFixed(2) : "0.00";
        
        localStorage.setItem(auth, JSON.stringify(localStats));
        
        // Guardamos en Firebase
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(updatedStats)
        });
    })
    .catch(error => console.error("Error actualizando stats:", error));
}


// Función para sincronizar estadísticas entre localStorage y Firebase
function syncPlayerStats(player, forceUpdate = false) {
    const auth = getAuth(player);
    if (!auth) return;
    
    // Primero obtenemos las stats locales
    const localStats = JSON.parse(localStorage.getItem(auth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
    
    // Luego obtenemos las stats de Firebase
    const url = `${FIREBASE_URL}/players/${auth}/stats.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(firebaseStats => {
        if (!firebaseStats && !forceUpdate) {
            // Si no hay datos en Firebase pero tenemos datos locales, subimos los datos locales
            if (localStats && localStats.some(stat => stat !== 0 && stat !== "0.00")) {
                const statsToUpload = {
                    games: localStats[Ss.GA] || 0,
                    wins: localStats[Ss.WI] || 0,
                    losses: localStats[Ss.LS] || 0,
                    goals: localStats[Ss.GL] || 0,
                    assists: localStats[Ss.AS] || 0,
                    gk: localStats[Ss.GK] || 0,
                    cs: localStats[Ss.CS] || 0
                };
                updatePlayerStats(player, statsToUpload);
                console.log(`Estadísticas locales de ${player.name} subidas a Firebase`);
            }
        } else if (firebaseStats && !forceUpdate) {
            // Si hay datos en Firebase pero queremos actualizar localStorage
            const updatedLocalStats = [
                firebaseStats.games || 0,
                firebaseStats.wins || 0,
                firebaseStats.losses || 0,
                ((firebaseStats.wins / firebaseStats.games) * 100).toFixed(2) || "0.00",
                firebaseStats.goals || 0,
                firebaseStats.assists || 0,
                firebaseStats.gk || 0,
                firebaseStats.cs || 0,
                ((firebaseStats.cs / firebaseStats.gk) * 100).toFixed(2) || "0.00"
            ];
            localStorage.setItem(auth, JSON.stringify(updatedLocalStats));
            console.log(`Estadísticas de Firebase de ${player.name} bajadas a localStorage`);
        } else if (forceUpdate) {
            // Forzar actualización desde local a Firebase
            const statsToUpload = {
                games: localStats[Ss.GA] || 0,
                wins: localStats[Ss.WI] || 0,
                losses: localStats[Ss.LS] || 0,
                goals: localStats[Ss.GL] || 0,
                assists: localStats[Ss.AS] || 0,
                gk: localStats[Ss.GK] || 0,
                cs: localStats[Ss.CS] || 0
            };
            updatePlayerStats(player, statsToUpload);
            console.log(`Actualización forzada de estadísticas de ${player.name} a Firebase`);
        }
    })
    .catch(error => console.error("Error sincronizando estadísticas:", error));
}

// Función para generar un código de recuperación fijo basado en el auth
function generateRecoveryCode(auth) {
    // Creamos un hash simple a partir del auth para tener siempre el mismo código para el mismo auth
    let hashCode = 0;
    for (let i = 0; i < auth.length; i++) {
        hashCode = (hashCode * 31 + auth.charCodeAt(i)) % 1000000;
    }
    
    // Convertimos el hash a una base 36 (0-9, A-Z) y tomamos 5 caracteres
    let code = hashCode.toString(36).toUpperCase();
    
    // Aseguramos que tenga 5 caracteres
    while (code.length < 5) {
        code = "0" + code;
    }
    if (code.length > 5) {
        code = code.slice(0, 5);
    }
    
    return code;
}

// Función para registrar usuario con código de recuperación
function registerUserWithCode(player, password) {
    const auth = getAuth(player);
    if (!auth) return false;
    
    const recoveryCode = generateRecoveryCode();
    const userData = {
        name: player.name,
        auth: auth,
        recoveryCode: recoveryCode,
        stats: {
            games: 0,
            wins: 0,
            losses: 0, 
            goals: 0,
            assists: 0,
            gk: 0,
            cs: 0
        }
    };
    
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            // Mostramos el código de recuperación al usuario
            room.sendAnnouncement(`✅ ¡Registrado con éxito!`, player.id, 0x00FF00, "bold");
            room.sendAnnouncement(`🔑 Tu código de recuperación es: ${recoveryCode}`, player.id, 0x00FF00, "bold");
            room.sendAnnouncement(`⚠️ GUARDÁ este código en un lugar seguro para recuperar tu cuenta si cambiás de dispositivo`, player.id, 0xFF7900, "bold");
            
            // Sincronizamos estadísticas si hay alguna en localStorage
            syncPlayerStats(player, true);
            return true;
        } else {
            console.error("Error al registrar:", response.statusText);
            return false;
        }
    })
    .catch(error => {
        console.error("Error al registrar:", error);
        return false;
    });
}




// Y modificar la función recover para usar el mismo método de generación de código
function recoverAccount(player, inputCode) {
    if (!inputCode || inputCode.length !== 5) {
        room.sendAnnouncement("❌ Código de recuperación inválido", player.id, 0xFF0000);
        return false;
    }
    
    // Buscar el código en la base de datos
    const url = `${FIREBASE_URL}/players.json?auth=${FIREBASE_API_KEY}`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (!data) {
            room.sendAnnouncement("❌ No hay cuentas registradas", player.id, 0xFF0000);
            return;
        }
        
        // Buscamos la cuenta que coincida con el código
        let foundAuth = null;
        let userData = null;
        
        Object.keys(data).forEach(authKey => {
            if (data[authKey].recoveryCode === inputCode) {
                foundAuth = authKey;
                userData = data[authKey];
            }
        });
        
        if (!foundAuth) {
            room.sendAnnouncement("❌ Código de recuperación no encontrado", player.id, 0xFF0000);
            return;
        }
        
        // Actualizamos el nuevo auth con los datos recuperados
        const currentAuth = getAuth(player);
        if (currentAuth === foundAuth) {
            room.sendAnnouncement("✅ Ya estás usando esta cuenta", player.id, 0x00FF00);
            return;
        }
        
        // Transferimos los datos al nuevo auth
        const newUserData = {
            ...userData,
            name: player.name,
            auth: currentAuth,
            recoveryCode: generateRecoveryCode(currentAuth) // Generamos un código nuevo para la nueva auth
        };
        
        // Guardar en la nueva ubicación
        fetch(`${FIREBASE_URL}/players/${currentAuth}.json?auth=${FIREBASE_API_KEY}`, {
            method: 'PUT',
            body: JSON.stringify(newUserData)
        })
        .then(response => {
            if (response.ok) {
                // Borrar la entrada antigua
                fetch(`${FIREBASE_URL}/players/${foundAuth}.json?auth=${FIREBASE_API_KEY}`, {
                    method: 'DELETE'
                });
                
                room.sendAnnouncement("✅ ¡Cuenta recuperada con éxito!", player.id, 0x00FF00, "bold");
                room.sendAnnouncement(`🔑 Tu nuevo código de recuperación es: ${newUserData.recoveryCode}`, player.id, 0x00FF00, "bold");
                
                // Actualizamos localStorage con los datos recuperados
                const localStats = [
                    userData.stats.games || 0,
                    userData.stats.wins || 0,
                    userData.stats.losses || 0,
                    ((userData.stats.wins / userData.stats.games) * 100).toFixed(2) || "0.00",
                    userData.stats.goals || 0,
                    userData.stats.assists || 0,
                    userData.stats.gk || 0,
                    userData.stats.cs || 0,
                    ((userData.stats.cs / userData.stats.gk) * 100).toFixed(2) || "0.00"
                ];
                
                localStorage.setItem(currentAuth, JSON.stringify(localStats));
            } else {
                room.sendAnnouncement("❌ Error al recuperar cuenta", player.id, 0xFF0000);
            }
        });
    })
    .catch(error => {
        console.error("Error al recuperar cuenta:", error);
        room.sendAnnouncement("❌ Error al buscar el código de recuperación", player.id, 0xFF0000);
    });
}


    function setPlayerRole(player, role) {
        const auth = getAuth(player);
        if (!auth) return false;
        
        // Actualizar el Map local
        playerRoles.set(auth, role);
        
        // Debug para verificar
        console.log(`Asignando rol ${getRoleName(role)} a ${player.name}`);
        
        // Dar admin de sala si es MASTER
        if (role === Role.MASTER) {
            room.setPlayerAdmin(player.id, true);
        }
        
        // Forzar actualización del formato del chat
        room.sendAnnouncement(`Debug - Rol asignado: ${getRoleName(role)}`, player.id, 0xFFFF00);
        
        return true;
    }

    // Función para verificar admin al entrar
    function checkAdminAuth(player) {
        if (!player.auth) return;

        firebaseFetch(`admins/${player.auth}`)
        .then(adminData => {
            if (adminData) {
                setPlayerRole(player, adminData.role);
                
                let welcomeMessage = "";
                let color = 0xFFD700;
                
                switch (adminData.role) {
                    case Role.MASTER:
                        welcomeMessage = `👑 ¡Bienvenido de nuevo MASTER ${player.name}!`;
                        room.setPlayerAdmin(player.id, true);
                        break;
                    case Role.OWNER:
                        welcomeMessage = `👑 ¡Bienvenido de nuevo OWNER ${player.name}!`;
                        break;
                    case Role.CO_OWNER:
                        welcomeMessage = `⭐ ¡Bienvenido de nuevo CO-OWNER ${player.name}!`;
                        break;
                    case Role.SUPERADMIN:
                        welcomeMessage = `🔰 ¡Bienvenido de nuevo SUPERADMIN ${player.name}!`;
                        break;
                    case Role.ADMIN_PERM:
                        welcomeMessage = `🛡️ ¡Bienvenido de nuevo ADMIN ${player.name}!`;
                        break;
                }
                
                room.sendAnnouncement(welcomeMessage, player.id, color, "bold");
                room.sendAnnouncement("✅ Login automático completado", player.id, 0x00FF00, "bold");
            }
        })
        .catch(error => {
            console.error("Error verificando admin:", error);
        });
    }


    // Función para guardar admin en Firebase
    function registerAdmin(player, password, role) {
        firebaseFetch(`admins/${player.auth}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: player.name,
                role: role,
                password: password,
                registeredDate: Date.now()
            })
        })
        .then(() => {
            setPlayerRole(player, role);
            room.sendAnnouncement(`✅ ¡Registro exitoso como ${getRoleName(role)}!`, player.id, 0x00FF00, "bold");
            room.sendAnnouncement("La próxima vez que entres, el login será automático", player.id, 0x00FF00);
            
            if (role === Role.MASTER) {
                room.setPlayerAdmin(player.id, true);
            }
        })
        .catch(error => {
            console.error("Error registrando admin:", error);
            room.sendAnnouncement("❌ Error al registrar", player.id, 0xFF0000);
        });
    }
    // 4. Agregar persistencia de roles
    function saveRoles() {
        // Guardar roles en localStorage o similar
        const rolesData = JSON.stringify(Array.from(playerRoles.entries()));
        localStorage.setItem('playerRoles', rolesData);
    }

    function loadRoles() {
        // Cargar roles guardados
        const rolesData = localStorage.getItem('playerRoles');
        if (rolesData) {
            playerRoles = new Map(JSON.parse(rolesData));
        }
    }

    // 5. Mejorar el sistema de contraseñas
    function validateRolePassword(player, targetRole, password) {
        if (!rolePasswords[targetRole]) return false;
        if (password !== rolePasswords[targetRole]) {
            room.sendAnnouncement("❌ Contraseña incorrecta!", player.id, 0xFF0000);
            return false;
        }
        return true;
    }


    // Función modificada formatRoleChatMessage para incluir indicador de AFK
    function formatRoleChatMessage(player, message) {
        // Obtener el rol del jugador
        let role = getRole(player);
        let rolePrefix = "";
        let messageColor = 0xFFFFFF;
        let useNegrita = false;
        
        // Obtener el nivel del jugador
        const playerLevel = getPlayerLevel(player);
        let levelDisplay = `${playerLevel.emoji} Lvl ${playerLevel.level} `;
        
        // Verificar si el jugador está AFK
        const isPlayerAFK = isAFK(player);
        let afkIndicator = isPlayerAFK ? "💤 " : ""; // Emoji ZZZ para jugadores AFK
        
        // Asignar prefijo y color según el rol
        switch (role) {
            case Role.MASTER:
                rolePrefix = `👑 MASTER ${levelDisplay}| ${afkIndicator}`;
                messageColor = 0xffb02e;
                useNegrita = true;
                break;
            case Role.OWNER:
                rolePrefix = `👑 OWNER ${levelDisplay}| ${afkIndicator}`;
                messageColor = 0xffb02e;
                useNegrita = true;
                break;
            case Role.CO_OWNER:
                rolePrefix = `⭐ CO-OWNER ${levelDisplay}| ${afkIndicator}`;
                messageColor = 0xfcd53f;
                useNegrita = true;
                break;
            case Role.SUPERADMIN:
                rolePrefix = `🔰 SUPERADMIN ${levelDisplay}| ${afkIndicator}`;
                messageColor = 0x44911b;
                useNegrita = true;
                break;
            case Role.ADMIN_PERM:
                rolePrefix = `🛡️ ADMIN ${levelDisplay}| ${afkIndicator}`;
                messageColor = 0xc2cad1;
                useNegrita = true;
                break;
            case Role.ADMIN_TEMP:
                rolePrefix = `🔧 ADMIN-TEMP ${levelDisplay}| ${afkIndicator}`;
                messageColor = 0x6c6a76;
                break;
            default:
                // Para jugadores normales, mostrar solo nivel y AFK si aplica
                rolePrefix = `${levelDisplay}${afkIndicator}`;
                messageColor = playerLevel.color;
                break;
        }
        
        // Enviar mensaje con el formato adecuado
        room.sendAnnouncement(`${rolePrefix}${player.name}: ${message}`, null, messageColor, useNegrita ? "bold" : "normal");
        return false; // Impedir que se muestre el mensaje original
    }


    function centerText(string) {
        var space = parseInt((80 - string.length) * 0.8, 10);
        if (space <= 0) {
            return '';
        }
        return ' '.repeat(space) + string + ' '.repeat(space);
    };


    /* AUXILIARY FUNCTIONS */

    function getRandomInt(max) { // returns a random number from 0 to max-1
        return Math.floor(Math.random() * Math.floor(max));
    }

 
    function getTime(scores) { // returns the current game time
        return "[" + Math.floor(Math.floor(scores.time / 60) / 10).toString() + Math.floor(Math.floor(scores.time / 60) % 10).toString() + ":" + Math.floor(Math.floor(scores.time - (Math.floor(scores.time / 60) * 60)) / 10).toString() + Math.floor(Math.floor(scores.time - (Math.floor(scores.time / 60) * 60)) % 10).toString() + "]"
    }

    function pointDistance(p1, p2) {
        var d1 = p1.x - p2.x;
        var d2 = p1.y - p2.y;
        return Math.sqrt(d1 * d1 + d2 * d2);
    }

    /* BUTTONS */

    function download(conteudo, nomeDoArquivo, tipoDeArquivo) {
        let blob = new Blob([conteudo], {
            type: tipoDeArquivo
        });
        const link = window.document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = nomeDoArquivo;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }

    function topBtn() {
        if (teamS.length == 0) {
            return;
        } else {
            if (teamR.length == teamB.length) {
                if (teamS.length > 1) {
                    room.setPlayerTeam(teamS[0].id, Team.RED);
                    room.setPlayerTeam(teamS[1].id, Team.BLUE);
                }
                return;
            } else if (teamR.length < teamB.length) {
                room.setPlayerTeam(teamS[0].id, Team.RED);
            } else {
                room.setPlayerTeam(teamS[0].id, Team.BLUE);
            }
        }
    }

    function randomBtn() {
        if (teamS.length == 0) {
            return;
        } else {
            if (teamR.length == teamB.length) {
                if (teamS.length > 1) {
                    var r = getRandomInt(teamS.length);
                    room.setPlayerTeam(teamS[r].id, Team.RED);
                    teamS = teamS.filter((spec) => spec.id != teamS[r].id);
                    room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
                }
                return;
            } else if (teamR.length < teamB.length) {
                room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.RED);
            } else {
                room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
            }
        }
    }

    function blueToSpecBtn() {
        resettingTeams = true;
        setTimeout(() => {
            resettingTeams = false;
        }, 100);
        for (var i = 0; i < teamB.length; i++) {
            room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
        }
    }

    function redToSpecBtn() {
        resettingTeams = true;
        setTimeout(() => {
            resettingTeams = false;
        }, 100);
        for (var i = 0; i < teamR.length; i++) {
            room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
        }
    }

    function resetBtn() {
        resettingTeams = true;
        setTimeout(() => {
            resettingTeams = false;
        }, 100);
        if (teamR.length <= teamB.length) {
            for (var i = 0; i < teamR.length; i++) {
                room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
                room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
            }
            for (var i = teamR.length; i < teamB.length; i++) {
                room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
            }
        } else {
            for (var i = 0; i < teamB.length; i++) {
                room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
                room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
            }
            for (var i = teamB.length; i < teamR.length; i++) {
                room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
            }
        }
    }

    function blueToRedBtn() {
        resettingTeams = true;
        setTimeout(() => {
            resettingTeams = false;
        }, 100);
        for (var i = 0; i < teamB.length; i++) {
            room.setPlayerTeam(teamB[i].id, Team.RED);
        }
    }

    /* GAME FUNCTIONS */




    function checkTime() {
        const scores = room.getScores();
        game.scores = scores;
        
        // Variables para evitar spam de mensajes
         let drawTimeMessageSent = false;
         let endTimeMessageSent = false;
        
        if (Math.abs(scores.time - scores.timeLimit) <= 0.01 && scores.timeLimit != 0) {
            if (scores.red != scores.blue) {
                if (checkTimeVariable == false) {
                    checkTimeVariable = true;
                    setTimeout(() => {
                        checkTimeVariable = false;
                    }, 3000);
                    scores.red > scores.blue ? endGame(Team.RED) : endGame(Team.BLUE);
                    setTimeout(() => {
                        room.stopGame();
                    }, 2000);
                }
                return;
            }
            goldenGoal = true;
            room.sendAnnouncement('⚽ Gol de oro');
        }
      
    }
    
    function endGame(winner) {
        try {
            const players = room.getPlayerList();
      
            // Calcular la figura del partido de manera segura
    const matchPlayers = getMatchPlayers();
    const mvp = calculateMVP(matchPlayers);
    
            // Activar modo de selección si hay suficientes jugadores
            if (players.length >= 2 * maxTeamSize - 1) {
                activateChooseMode();
            }
            
            // Obtener y guardar puntuaciones
        const scores = room.getScores();
            if (!scores) {
                console.error("Error: No se pudieron obtener las puntuaciones");
                return;
            }
        
        game.scores = scores;
            
            // Calcular posesión
            Rposs = (Rposs + Bposs) > 0 ? Rposs / (Rposs + Bposs) : 0.5;
        Bposs = 1 - Rposs;
            
            // Actualizar ganador y racha
        lastWinner = winner;
        endGameVariable = true;
            
            // Anunciar resultado
        if (winner == Team.RED) {
            streak++;
            room.sendAnnouncement(
                '🔴 Ganó el equipo rojo. ' +
                    scores.red +
                    '-' +
                    scores.blue +
                    ' Racha actual: ' +
                    streak +
                    ' 🏆'
            );
        } else if (winner == Team.BLUE) {
            streak = 1;
            room.sendAnnouncement(
                '🔵 Ganó el equipo azul. ' +
                    scores.blue +
                    '-' +
                    scores.red +
                    ' Racha actual: ' +
                    streak +
                    ' 🏆'
            );
        } else {
            streak = 0;
            room.sendAnnouncement('💤 Draw limit reached! 💤');
        }
            
            // Anunciar posesión
        room.sendAnnouncement(
            '⭐ Posesión: 🔴 ' +
                (Rposs * 100).toPrecision(3).toString() +
                '% : ' +
                (Bposs * 100).toPrecision(3).toString() +
                '% 🔵'
        );
            
            // Anunciar vallas invictas con verificaciones de null
            if (scores) {
                // Verificar que GKList exista y tenga elementos
                if (Array.isArray(GKList) && GKList.length >= 2) {
                    const redGK = GKList[0];
                    const blueGK = GKList[1];
                    
                    if (scores.red === 0 && scores.blue === 0) {
                        // Ambos equipos mantuvieron valla invicta
                        if (redGK && blueGK) {
                            room.sendAnnouncement(
                                '🏆 ' + redGK.name + ' y ' + blueGK.name + ' Mantuvieron la valla invicta! '
                            );
                        }
                    } else if (scores.red === 0) {
                        // Solo el equipo azul mantuvo valla invicta
                        if (blueGK) {
                            room.sendAnnouncement('🏆 ' + blueGK.name + ' Mantuvo la valla invicta! ');
                        }
                    } else if (scores.blue === 0) {
                        // Solo el equipo rojo mantuvo valla invicta
                        if (redGK) {
                            room.sendAnnouncement('🏆 ' + redGK.name + ' Mantuvo la valla invicta! ');
                        }
                    }
                    
// Actualizar vallas invictas consecutivas para arqueros
                    if (redGK && scores) {
                        updateConsecutiveCleanSheets(redGK, scores.blue === 0);
                    }
                    
                    if (blueGK && scores) {
                        updateConsecutiveCleanSheets(blueGK, scores.red === 0);
                    }
                }
}
       
              // Anunciar la figura del partido al final
    if (mvp) {
        room.sendAnnouncement("", null, 0xFDC43A, "bold"); // Línea en blanco para separar
        room.sendAnnouncement("🌟 FIGURA DEL PARTIDO 🌟", null, 0xFDC43A, "bold");
        
        // Mostrar stats del MVP
        const mvpRank = getEloRank(mvp.elo || ELO_DEFAULT);
        room.sendAnnouncement(`${mvpRank.icon} ${mvp.name} - ${mvp.mvpPoints.toFixed(1)} puntos`, null, 0xFDC43A, "bold");
        
        let statLine = "";
        if (mvp.goals > 0) statLine += `⚽ ${mvp.goals} goles `;
        if (mvp.assists > 0) statLine += `👟 ${mvp.assists} asistencias `;
        if (mvp.saves > 0) statLine += `🧤 ${mvp.saves} atajadas `;
        if (mvp.cleanSheet) statLine += `🥅 Valla invicta `;
        
        room.sendAnnouncement(statLine, null, 0xFDC43A);
        
        // Incrementar contador de MVPs en la base de datos
        const auth = mvp.auth;
        if (auth) {
            const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
            fetch(url)
            .then(response => response.json())
            .then(userData => {
                if (userData) {
                    // Incrementar contador de MVPs o inicializarlo
                    const currentMvps = (userData.stats && userData.stats.mvps) ? userData.stats.mvps : 0;
                    
                                // Verificar que getPlayerById y updatePlayerStats existan
                                const mvpPlayer = getPlayerById(mvp.id);
                                if (mvpPlayer && typeof updatePlayerStats === 'function') {
                                    updatePlayerStats(mvpPlayer, {
                        mvps: currentMvps + 1
                    });
                                }
                }
            })
            .catch(error => console.error("Error actualizando MVPs:", error));
        }
    }

            // Actualizar estadísticas
            if (typeof updateStats === 'function') {
updateStats();
            }

            // Sincronizar estadísticas de jugadores con Firebase
            if (Array.isArray(players)) {
players.forEach(player => {
                    if (player && typeof syncPlayerStats === 'function') {
                        setTimeout(() => syncPlayerStats(player, true), 2000);
                    }
});
            }
// Actualizar ELO si fue un partido válido
if (Array.isArray(teamR) && Array.isArray(teamB) && teamR.length > 0 && teamB.length > 0) {
    // NUEVA VERIFICACIÓN: Comprobar si es un 3v3 completo
    if (teamR.length !== 3 || teamB.length !== 3) {
        // No es un 3v3 completo, mostrar mensaje y NO actualizar ELO
        room.sendAnnouncement("⚠️ ELO no actualizado: se requiere partido 3v3 completo", null, 0xFF9900, "bold");
        console.log(`ELO no actualizado - No es 3v3: Red ${teamR.length} vs Blue ${teamB.length}`);
    } else {
        // Es un 3v3, continuar con la actualización de ELO
        room.sendAnnouncement("✅ Partido 3v3 válido: Actualizando ELO de los jugadores", null, 0x00FF00);
        
        // Calcular ELO promedio de cada equipo
        const redTeamAvgElo = typeof getTeamAverageElo === 'function' ? getTeamAverageElo(teamR) : ELO_DEFAULT;
        const blueTeamAvgElo = typeof getTeamAverageElo === 'function' ? getTeamAverageElo(teamB) : ELO_DEFAULT;
    
        // Actualizar ELO para cada jugador según resultado
        const redWon = winner === Team.RED;
        const blueWon = winner === Team.BLUE;
    
        // Para jugadores rojos
        if (Array.isArray(teamR) && Array.isArray(game.goals)) {
            teamR.forEach(player => {
                if (!player) return;
                        
                // Calcular puntuación individual (goles + asistencias)
                let playerScore = 0;
                        
                game.goals.forEach(goal => {
                    if (goal && goal.striker && goal.striker.id === player.id) {
                        playerScore++; // Gol
                    }
                    if (goal && goal.assist && goal.assist.id === player.id) {
                        playerScore += 0.5; // Asistencia (vale medio punto)
                    }
                });
                        
                if (typeof updatePlayerElo === 'function') {
                    updatePlayerElo(player, redWon, playerScore, blueTeamAvgElo);
                }
            });
        }
    
        // Para jugadores azules
        if (Array.isArray(teamB) && Array.isArray(game.goals)) {
            teamB.forEach(player => {
                if (!player) return;
                        
                // Calcular puntuación individual (goles + asistencias)
                let playerScore = 0;
                        
                game.goals.forEach(goal => {
                    if (goal && goal.striker && goal.striker.id === player.id) {
                        playerScore++; // Gol
                    }
                    if (goal && goal.assist && goal.assist.id === player.id) {
                        playerScore += 0.5; // Asistencia (vale medio punto)
                    }
                });
                        
                if (typeof updatePlayerElo === 'function') {
                    updatePlayerElo(player, blueWon, playerScore, redTeamAvgElo);
                }
            });
        }
    }
}

        // Con esto:
   setTimeout(() => {
        try {
            // Intentar actualizar nombres, pero no preocuparse si falla
            if (typeof updateAllPlayerNames === 'function') {
    updateAllPlayerNames();
            }
        } catch (e) {
            console.error("No se pudieron actualizar los nombres:", e);
        }
    }, 5000);
            
            // Balancear equipos después de un tiempo
            setTimeout(() => {
                console.log("Ejecutando balanceTeams después de terminar el partido");
                if (typeof balanceTeams === 'function') {
                    balanceTeams();
                }
            }, 2500);
            
        } catch (error) {
            console.error("Error en endGame:", error);
        }
    }
    
    function quickRestart() {
        room.stopGame();
        setTimeout(() => {
            room.startGame();
        }, 2000);
    }
    
    function resumeGame() {
        setTimeout(() => {
            room.startGame();
        }, 2000);
        setTimeout(() => {
            room.pauseGame(false);
        }, 1000);
    }
    
    function activateChooseMode() {
        inChooseMode = true;
        slowMode = 2;
        
        // Anunciar a todos que estamos en modo selección
        room.sendAnnouncement('¡Modo de selección activado! Los capitanes elegirán a los jugadores.', null, 0x00FF00);
        room.sendAnnouncement('Modo lento de 2 segundos activado.', null, 0x00FF00);
        
        // Asegurarse de que el juego esté pausado
        if (room.getScores() !== null) {
            room.pauseGame(true);
        }
        
        // Iniciar el proceso de selección
        setTimeout(() => {
            choosePlayer();
        }, 500);
    }
    function deactivateChooseMode() {
        inChooseMode = false;
        clearTimeout(timeOutCap);
        
        if (slowMode != 0) {
            slowMode = 0;
            room.sendAnnouncement('Modo lento desactivado.', null, 0x00FF00);
        }
        
        redCaptainChoice = '';
        blueCaptainChoice = '';
        
        room.sendAnnouncement('Modo de selección terminado. ¡Que comience el partido!', null, 0x00FF00);
    }
    
    function loadMap(map, scoreLim, timeLim) {
        if (map == aloneMap) {
            room.setCustomStadium(aloneMap);
        } else if (map == classicMap) {
            classicMap != ''
                ? room.setCustomStadium(classicMap)
                : room.setDefaultStadium('Classic');
        } else if (map == bigMap) {
            bigMap != '.'
                ? room.setCustomStadium(bigMap)
                : room.setDefaultStadium('Big');
        } else {
            room.setCustomStadium(map);
        }
        room.setScoreLimit(scoreLim);
        room.setTimeLimit(timeLim);
    }
    


    


    


// PLAYER FUNCTIONS //

    function getAuth(player) {
        if (!player) return null;
        
        const playerData = extendedP.find(p => p && p[eP.ID] === player.id);
        return playerData ? playerData[eP.AUTH] : null;
    }
    function getAFK(player) {
        try {
            const playerData = extendedP.find(a => a[0] === player.id);
            return playerData ? playerData[eP.AFK] : false;
        } catch (error) {
            console.error("Error en getAFK:", error);
            return false;
        }
    }
    
    function setAFK(player, value) {
        if (value) {
            updateRoleOnPlayerOut(); // Cuando entra en AFK
        } else {
            updateRoleOnPlayerIn(); // Cuando sale de AFK
        }
       
        try {
            const playerData = extendedP.find(a => a[0] === player.id);
            if (playerData) {
                playerData[eP.AFK] = value;
            } else {
                console.error(`No se encontró datos para el jugador ${player.name} (ID: ${player.id})`);
            }
        } catch (error) {
            console.error("Error en setAFK:", error);
        }
    }
    function getActivity(player) {
        return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.ACT] : null;
    }

    function setActivity(player, value) {
        extendedP.filter((a) => a[0] == player.id).forEach((player) => player[eP.ACT] = value);
    }

    
// Función para actualizar rachas de vallas invictas
function updateConsecutiveCleanSheets(player, keptCleanSheet) {
    const auth = getAuth(player);
    if (!auth) return;
    
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(userData => {
        if (!userData) return;
        
        // Inicializar stats si no existen
        if (!userData.stats) userData.stats = {};
        
        // Contador actual de vallas invictas consecutivas
        let currentConsecutiveCS = userData.stats.currentConsecutiveCS || 0;
        
        // Récord máximo de vallas invictas consecutivas
        let maxConsecutiveCS = userData.stats.maxConsecutiveCS || 0;
        
        if (keptCleanSheet) {
            // Incrementar contador actual
            currentConsecutiveCS++;
            
            // Actualizar récord si es necesario
            if (currentConsecutiveCS > maxConsecutiveCS) {
                maxConsecutiveCS = currentConsecutiveCS;
                
                // Anunciar nuevo récord si es significativo (3+)
                if (maxConsecutiveCS >= 3) {
                    room.sendAnnouncement(`🏆 ¡${player.name} estableció un nuevo récord personal de ${maxConsecutiveCS} vallas invictas consecutivas!`, null, 0xFDC43A, "bold");
                }
            }
        } else {
            // Reiniciar contador si recibió goles
            currentConsecutiveCS = 0;
        }
        
        // Actualizar stats en Firebase
        const updatedStats = {
            ...userData.stats,
            currentConsecutiveCS: currentConsecutiveCS,
            maxConsecutiveCS: maxConsecutiveCS
        };
        
        fetch(`${FIREBASE_URL}/players/${auth}/stats.json?auth=${FIREBASE_API_KEY}`, {
            method: 'PUT',
            body: JSON.stringify(updatedStats)
        });
    })
    .catch(error => console.error("Error actualizando vallas invictas consecutivas:", error));
}


// 1. Primero arreglamos las funciones getGK y setGK
function getGK(team) {
    try {
        // Verificar que el equipo sea un número válido (1 o 2)
        if (team !== 1 && team !== 2) {
            return null;
        }
        
        // Verificar que extendedP existe y tiene elementos
        if (!extendedP || !Array.isArray(extendedP) || !extendedP.length) {
            return null;
        }

        let maxGKTime = -1;
        let gkPlayer = null;

        // Buscar el jugador con más tiempo como GK en el equipo
        for (let i = 0; i < extendedP.length; i++) {
            const playerData = extendedP[i];
            if (!playerData || !Array.isArray(playerData)) continue;

            // Verificar que el ID del jugador es válido
            const playerId = playerData[eP.ID];
            if (playerId == null) continue;

            const player = room.getPlayer(playerId);
            // Verificar que el jugador existe y está en el equipo correcto
            if (!player || player.team !== team) continue;

            const gkTime = playerData[eP.GK] || 0;
            if (gkTime > maxGKTime) {
                maxGKTime = gkTime;
                gkPlayer = player;
            }
        }

            return gkPlayer;
    } catch (err) {
        return null;
    }
}

// Nueva función para obtener el tiempo como GK de un jugador
function getGKTime(player) {
    try {
        if (!player || player.id == null) return 0;
        
        // Buscar al jugador en extendedP
        for (let i = 0; i < extendedP.length; i++) {
            if (extendedP[i] && extendedP[i][eP.ID] === player.id) {
                return extendedP[i][eP.GK] || 0;
            }
        }
        
        return 0;
    } catch (err) {
        return 0;
    }
}

// Función setGK mejorada
function setGK(player, value) {
    try {
        // Verificar si el jugador es válido
        if (!player || player.id == null) {
            return false;
        }
        
        // Buscar al jugador en extendedP y actualizar su tiempo como GK
        for (let i = 0; i < extendedP.length; i++) {
            if (extendedP[i] && extendedP[i][eP.ID] === player.id) {
                extendedP[i][eP.GK] = value;
            return true;
        }
        }
        
        return false;
    } catch (err) {
        return false;
    }
}

// Función para verificar si un jugador puede hablar según el slow mode
function canPlayerChat(player) {
    // Si el slow mode está desactivado, siempre puede hablar
    if (slowMode <= 0) return true;
    
    // Si es admin, puede hablar siempre (opcional, puedes quitar esta línea)
    if (getRole(player) >= Role.ADMIN_PERM) return true;
    
    const now = Date.now();
    const lastMessageTime = playerLastMessages.get(player.id) || 0;
    const timeElapsed = now - lastMessageTime;
    const minTimeRequired = 1000 / slowMode; // Tiempo mínimo entre mensajes en ms
    
    // Actualizar el tiempo del último mensaje
    playerLastMessages.set(player.id, now);
    
    // Si no ha pasado suficiente tiempo, es spam
    if (timeElapsed < minTimeRequired) {
        // Incrementar contador de advertencias
        const warnings = slowModeWarnings.get(player.id) || 0;
        slowModeWarnings.set(player.id, warnings + 1);
        
        // Si excede 3 advertencias, mutear por 1 minuto
        if (warnings >= 2) {
            const muteUntil = now + 60000; // 1 minuto
            mutedPlayers.set(player.id, {
                name: player.name,
                auth: player.auth,
                until: muteUntil
            });
            
            room.sendAnnouncement(`🤐 ${player.name} ha sido muteado por 1 minuto por spam.`, null, 0xFF4C4C, "bold");
            slowModeWarnings.delete(player.id); // Reiniciar advertencias
            return false;
        }
        
        // Mostrar advertencia
        room.sendAnnouncement(`⚠️ Slow mode activado: Espera ${(minTimeRequired/1000).toFixed(1)} segundos entre mensajes. Advertencia ${warnings + 1}/3`, player.id, 0xFF9900, "bold");
        return false;
    } else {
        // Si ha pasado suficiente tiempo, reiniciar las advertencias
        slowModeWarnings.delete(player.id);
        return true;
    }
}


    function getMute(player) {
        return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.MUTE] : null;
    }

    function setMute(player, value) {
        extendedP.filter((a) => a[0] == player.id).forEach((player) => player[eP.MUTE] = value);
    }


/* BALANCE & CHOOSE FUNCTIONS */


// Función para obtener todos los jugadores que participaron en el partido
function getMatchPlayers() {
    const players = [];
    
    // Convertir objetos de jugadores a un formato más fácil de trabajar
    teamR.forEach(player => {
        const goals = getPlayerGoals(player);
        const assists = getPlayerAssists(player);
        const isGK = player.id === GKList[0]?.id;
        const team = Team.RED;
        const cleanSheet = isGK && game.scores && game.scores.blue === 0;
        
        // Estimar atajadas (no tenemos dato real, usamos una aproximación)
        // En un futuro podrías rastrear atajadas reales durante el partido
        const saves = isGK ? Math.floor(Math.random() * 5) + 1 : 0; // Valor aleatorio para demo
        
        players.push({
            id: player.id,
            name: player.name,
            auth: getAuth(player),
            team: team,
            goals: goals,
            assists: assists,
            isGK: isGK,
            cleanSheet: cleanSheet,
            saves: saves,
            elo: JSON.parse(localStorage.getItem(getAuth(player)))?.elo || ELO_DEFAULT
        });
    });
    
    teamB.forEach(player => {
        const goals = getPlayerGoals(player);
        const assists = getPlayerAssists(player);
        const isGK = player.id === GKList[1]?.id;
        const team = Team.BLUE;
        const cleanSheet = isGK && game.scores && game.scores.red === 0;
        
        // Estimar atajadas
        const saves = isGK ? Math.floor(Math.random() * 5) + 1 : 0; // Valor aleatorio para demo
        
        players.push({
            id: player.id,
            name: player.name,
            auth: getAuth(player),
            team: team,
            goals: goals,
            assists: assists,
            isGK: isGK,
            cleanSheet: cleanSheet,
            saves: saves,
            elo: JSON.parse(localStorage.getItem(getAuth(player)))?.elo || ELO_DEFAULT
        });
    });
    
    return players;
}

// Función calculateMVP corregida
function calculateMVP() {
    // Verificamos que game.scores exista y tenga los valores necesarios
    if (!game || !game.scores) {
        console.error("Error en calculateMVP: game.scores no está definido");
        return;
    }
    
    // Determinamos el equipo ganador
    let winningTeam = null;
    if (game.scores.red > game.scores.blue) {
        winningTeam = Team.RED;
    } else if (game.scores.blue > game.scores.red) {
        winningTeam = Team.BLUE;
    } else {
        // En caso de empate, no hay MVP
        console.log("Empate - No se calcula MVP");
        return;
    }
    
    // Obtener jugadores del equipo ganador
    const winningPlayers = room.getPlayerList().filter(p => p.team === winningTeam);
    
    // Si no hay jugadores en el equipo ganador, salimos
    if (!winningPlayers || winningPlayers.length === 0) {
        console.log("No hay jugadores en el equipo ganador");
        return;
    }
    
    // Calcular puntuaciones para MVP
    let bestScore = -1;
    let mvpPlayer = null;
    
    winningPlayers.forEach(player => {
        // Buscar estadísticas del jugador
        const playerStats = getPlayerStats(player);
        if (!playerStats) return;
        
        // Calcular puntuación MVP (ajusta esta fórmula según tus preferencias)
        const goals = playerStats.goals || 0;
        const assists = playerStats.assists || 0;
        const saves = playerStats.saves || 0;
        
        // Fórmula de ejemplo: goles*3 + asistencias*2 + atajadas*1
        const mvpScore = (goals * 3) + (assists * 2) + (saves * 1);
        
        // Actualizar si es el mejor hasta ahora
        if (mvpScore > bestScore) {
            bestScore = mvpScore;
            mvpPlayer = player;
        }
    });
    
    // Si encontramos un MVP, anunciarlo y actualizar sus estadísticas
    if (mvpPlayer && bestScore > 0) {
        // Anunciar MVP
        room.sendAnnouncement(`🌟 MVP DEL PARTIDO: ${mvpPlayer.name}`, null, 0xFFD700, "bold");
        
        // Actualizar estadísticas de MVP en localStorage
        const auth = getAuth(mvpPlayer);
        if (auth) {
            try {
                let stats = JSON.parse(localStorage.getItem(auth)) || {};
                stats.mvps = (stats.mvps || 0) + 1;
                localStorage.setItem(auth, JSON.stringify(stats));
                
                // También actualizar en Firebase si está disponible
                const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
                fetch(url)
                    .then(response => response.json())
                    .then(userData => {
                        if (userData) {
                            if (!userData.stats) userData.stats = {};
                            userData.stats.mvps = (userData.stats.mvps || 0) + 1;
                            
                            fetch(url, {
                                method: 'PATCH',
                                body: JSON.stringify({ stats: userData.stats })
                            });
                        }
                    })
                    .catch(error => console.error("Error actualizando MVP en Firebase:", error));
            } catch (e) {
                console.error("Error actualizando MVP en localStorage:", e);
            }
        }
    }
}

// Función auxiliar para obtener estadísticas de un jugador
function getPlayerStats(player) {
    if (!player || !game || !game.goals || !game.assists) return null;
    
    // Contar goles
    const goals = game.goals.filter(g => g.scorer && g.scorer.id === player.id).length;
    
    // Contar asistencias
    const assists = game.assists.filter(a => a.assister && a.assister.id === player.id).length;
    
    // Contar atajadas (si tienes esta estadística)
    const saves = 0; // Implementa esto si tienes un sistema de atajadas
    
    return { goals, assists, saves };
}

// Función para obtener los goles de un jugador en el partido actual
function getPlayerGoals(player) {
    if (!game || !game.goals) return 0;
    
    // Contar goles donde este jugador es el que hizo el gol
    return game.goals.filter(goal => goal.striker && goal.striker.id === player.id).length;
}

// Función para obtener las asistencias de un jugador en el partido actual
function getPlayerAssists(player) {
    if (!game || !game.goals) return 0;
    
    // Contar goles donde este jugador dio la asistencia
    return game.goals.filter(goal => goal.assist && goal.assist.id === player.id).length;
}

// Función para obtener un jugador por ID
function getPlayerById(id) {
    return room.getPlayerList().find(p => p.id === id);
}

function updateRoleOnPlayerIn() {
    updateTeams();
    
    // Log para depuración
    console.log("Jugador entró. Equipos actuales:", 
                "Rojos:", teamR.length, 
                "Azules:", teamB.length, 
                "Espectadores:", teamS.length);
    
    if (inChooseMode) {
        if (players.length == 6) {
            loadMap(bigMap, scoreLimitBig, timeLimitBig);
        }
        getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
    }
    
    // Llamamos a balanceTeams que ahora incluye la lógica para iniciar el partido
    balanceTeams();
}
function updateRoleOnPlayerOut() {
    updateTeams();
    if (room.getScores() != null) {
        var scores = room.getScores();
        if (
            players.length >= 2 * maxTeamSize &&
            scores.time >= (5 / 6) * game.scores.timeLimit &&
            teamR.length != teamB.length
        ) {
            if (teamR.length < teamB.length) {
                if (scores.blue - scores.red == 2) {
                    endGame(Team.BLUE);
                    room.sendChat('🤖 Ragequit detected. Game ended 🤖');
                    setTimeout(() => {
                        room.stopGame();
                    }, 100);
                    return;
                }
            } else {
                if (scores.red - scores.blue == 2) {
                    endGame(Team.RED);
                    room.sendChat('🤖 Ragequit detected. Game ended 🤖');
                    setTimeout(() => {
                        room.stopGame();
                    }, 100);
                    return;
                }
            }
        }
    }
    if (inChooseMode) {
        if (players.length == 5) {
            loadMap(classicMap, scoreLimitClassic, timeLimitClassic);
        }
        if (teamR.length == 0 || teamB.length == 0) {
            teamR.length == 0
                ? room.setPlayerTeam(teamS[0].id, Team.RED)
                : room.setPlayerTeam(teamS[0].id, Team.BLUE);
            return;
        }
        if (Math.abs(teamR.length - teamB.length) == teamS.length) {
            room.sendChat(
                '🤖 No choices left, let me handle this situation... 🤖'
            );
            deactivateChooseMode();
            resumeGame();
            var b = teamS.length;
            if (teamR.length > teamB.length) {
                for (var i = 0; i < b; i++) {
                    setTimeout(() => {
                        room.setPlayerTeam(teamS[0].id, Team.BLUE);
                    }, 5 * i);
                }
            } else {
                for (var i = 0; i < b; i++) {
                    setTimeout(() => {
                        room.setPlayerTeam(teamS[0].id, Team.RED);
                    }, 5 * i);
                }
            }
            return;
        }
        if (streak == 0 && room.getScores() == null) {
            if (Math.abs(teamR.length - teamB.length) == 2) {
                // if someone left a team has 2 more players than the other one, put the last chosen guy back in his place so it's fair
                room.sendChat('🤖 Balancing teams... 🤖');
                teamR.length > teamB.length
                    ? room.setPlayerTeam(
                          teamR[teamR.length - 1].id,
                          Team.SPECTATORS
                      )
                    : room.setPlayerTeam(
                          teamB[teamB.length - 1].id,
                          Team.SPECTATORS
                      );
            }
        }
        if (teamR.length == teamB.length && teamS.length < 2) {
            deactivateChooseMode();
            resumeGame();
            return;
        }
        capLeft
            ? choosePlayer()
            : getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
    }
    balanceTeams();
}
function balanceTeams() {
    if (!inChooseMode) {
        if (players.length == 1 && teamR.length == 0) {
            quickRestart();
            loadMap(aloneMap, 0, 0);
            room.setPlayerTeam(players[0].id, Team.RED);
        } else if (
            Math.abs(teamR.length - teamB.length) == teamS.length &&
            teamS.length > 0
        ) {
            const n = Math.abs(teamR.length - teamB.length);
            if (players.length == 2) {
                quickRestart();
                loadMap(classicMap, scoreLimitClassic, timeLimitClassic);
            }
            if (teamR.length > teamB.length) {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(teamS[i].id, Team.BLUE);
                }
            } else {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(teamS[i].id, Team.RED);
                }
            }
        } else if (Math.abs(teamR.length - teamB.length) > teamS.length) {
            const n = Math.abs(teamR.length - teamB.length);
            if (players.length == 1) {
                quickRestart();
                loadMap(aloneMap, 0, 0);
                room.setPlayerTeam(players[0].id, Team.RED);
                return;
            } else if (players.length == 5) {
                quickRestart();
                loadMap(classicMap, scoreLimitClassic, timeLimitClassic);
            }
            if (players.length == maxTeamSize * 2 - 1) {
                allReds = [];
                allBlues = [];
            }
            if (teamR.length > teamB.length) {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(
                        teamR[teamR.length - 1 - i].id,
                        Team.SPECTATORS
                    );
                }
            } else {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(
                        teamB[teamB.length - 1 - i].id,
                        Team.SPECTATORS
                    );
                }
            }
        } else if (
            Math.abs(teamR.length - teamB.length) < teamS.length &&
            teamR.length != teamB.length
        ) {
            room.pauseGame(true);
            activateChooseMode();
            choosePlayer();
        } else if (
            teamS.length >= 2 &&
            teamR.length == teamB.length &&
            teamR.length < maxTeamSize
        ) {
            if (teamR.length == 2) {
                quickRestart();
                loadMap(bigMap, scoreLimitBig, timeLimitBig);
            }
            topBtn();
        }
    }
}
function choosePlayer() {
    try {
    clearTimeout(timeOutCap);
        
        // Actualizar listas de equipos para asegurarnos de tener datos frescos
        updateTeams();
    
    // Verificar que haya espectadores para elegir
        if (!teamS || teamS.length === 0) {
        console.log("No hay espectadores para elegir");
            
            // Si no hay espectadores pero los equipos están desbalanceados, intentar balancearlos
            if (Math.abs(teamR.length - teamB.length) > 1) {
                console.log("Equipos desbalanceados, intentando balancear automáticamente");
                balanceTeams();
            }
            
            // Si ya no hay espectadores, desactivar el modo de selección
            if (inChooseMode) {
                console.log("Desactivando modo selección por falta de espectadores");
                deactivateChooseMode();
            }
            
        return;
    }
    
    // Verificar que haya al menos un equipo con jugadores
        if (!teamR || !teamB || (teamR.length === 0 && teamB.length === 0)) {
        console.log("Ambos equipos están vacíos, cancelando modo selección");
        deactivateChooseMode();
        return;
    }
    
    console.log("Iniciando selección - Rojo:", teamR.length, "Azul:", teamB.length, "Espectadores:", teamS.length);
    
        // Determinar qué capitán debe elegir basado en el tamaño de los equipos
    let captain = null;
    let teamColor = null;
        let teamName = "";
        let teamEmoji = "";
        
        // Lógica mejorada para determinar qué equipo elige:
        // - Si un equipo tiene menos jugadores, ese equipo elige
        // - Si ambos tienen igual número, el equipo rojo elige primero
        if ((teamR.length < teamB.length) || (teamR.length === teamB.length && teamR.length > 0)) {
            // Equipo rojo elige
            if (teamR.length > 0) {
        captain = teamR[0];
        teamColor = 0xFF3333; // Rojo más vibrante
                teamName = "ROJO";
                teamEmoji = "🔴";
            } else {
                console.log("Error: No hay jugadores en el equipo rojo");
                return;
            }
        } else if (teamB.length < teamR.length || (teamB.length === teamR.length && teamB.length > 0)) {
            // Equipo azul elige
            if (teamB.length > 0) {
                captain = teamB[0];
                teamColor = 0x3333FF; // Azul más vibrante
                teamName = "AZUL";
                teamEmoji = "🔵";
            } else {
                console.log("Error: No hay jugadores en el equipo azul");
                return;
            }
        } else {
            console.log("Error en la lógica de selección de capitán");
            return;
        }
        
        console.log(`Capitán seleccionado: ${captain ? captain.name : 'null'} del equipo ${teamName}`);
        console.log(`Estado de equipos: Rojo ${teamR.length}, Azul ${teamB.length}, Espectadores ${teamS.length}`);
        
        // Si hay un capitán válido, mostrar mensajes y lista de espectadores
        if (captain) {
        // Anuncio público de quién debe elegir (para todos)
        room.sendAnnouncement(
            centerText(`⚡ TURNO DE ELECCIÓN ⚡`), 
            null, 
            0xFFFFFF, 
            "bold", 
            2
        );
        room.sendAnnouncement(
                centerText(`El capitán ${captain.name} (${teamEmoji}) debe elegir un jugador`), 
            null, 
                teamColor, 
            "bold"
        );
        
            // Enviar mensaje SOLO al capitán
        room.sendAnnouncement(
            centerText(`🎮 ES TU TURNO DE ELEGIR 🎮`),
            captain.id,
                teamColor,
            "bold",
            2
        );
        
        room.sendAnnouncement(
            centerText(`Escribe un número o usa 'top', 'random', 'bottom'`),
            captain.id,
            0xFFFFFF,
            "bold"
        );
        
            // Mostrar la lista de espectadores al capitán
            getSpecList(captain, teamColor);
            
            // Configurar temporizadores para recordatorio y expulsión
        timeOutCap = setTimeout(
            function (player) {
                    if (player && room.getPlayer(player.id)) {
                room.sendAnnouncement(
                    centerText(`⚠️ ¡APURATE @${player.name}! ⚠️`),
                    player.id,
                            teamColor,
                    "bold",
                    1
                );
                room.sendAnnouncement(
                            centerText(`Solo ${Math.floor(chooseTime / 2)} segundos para elegir`),
                    player.id,
                    0xFFFFFF,
                    "bold"
                );
                
                timeOutCap = setTimeout(
                    function (player) {
                                if (player && room.getPlayer(player.id)) {
                                    // En lugar de expulsar, elegir automáticamente
        room.sendAnnouncement(
                                        centerText(`⏱️ ¡Tiempo agotado! Eligiendo automáticamente...`),
            null, 
                                        0xFF9900,
            "bold"
        );
        
                                    // Elegir un jugador aleatorio
                                    if (teamS.length > 0) {
                                        const randomIndex = Math.floor(Math.random() * teamS.length);
                                        const chosenPlayer = teamS[randomIndex];
                                        
                                        if (chosenPlayer) {
                                            const targetTeam = teamName === "ROJO" ? Team.RED : Team.BLUE;
                                            room.setPlayerTeam(chosenPlayer.id, targetTeam);
                                            
                room.sendAnnouncement(
                                                centerText(`Sistema eligió a ${chosenPlayer.name} para el equipo ${teamName}`),
                                                null,
                                                teamColor,
                    "bold"
                );
                
                                            // Continuar con la selección
                                            setTimeout(() => {
                                                if (inChooseMode) choosePlayer();
                                            }, 1000);
                                        }
                                    }
                                }
                    },
                    chooseTime * 500,
                    player
                );
                    }
            },
            chooseTime * 1000,
            captain
        );
        } else {
            console.log("No se pudo determinar un capitán válido");
            
            // Si no se puede determinar un capitán, intentar balancear automáticamente
            balanceTeams();
            deactivateChooseMode();
        }
    } catch (error) {
        console.error("Error en choosePlayer:", error);
        
        // En caso de error, intentar recuperarse
        balanceTeams();
        if (inChooseMode) {
            deactivateChooseMode();
        }
    }
}



// Función para procesar solicitudes de pausa
function processPauseRequest(player) {
    // Si ya hay una pausa activa, ignorar
    if (pausaActiva) {
        room.sendAnnouncement(`[❌] Ya hay una pausa activa en este momento.`, player.id, 0xFF0000, "bold", 2);
        return false;
    }

    // Si no hay una solicitud de pausa pendiente, crear una nueva
    if (!pausaSolicitada) {
        pausaSolicitada = true;
        jugadorSolicitante = player.id;
        room.sendAnnouncement(`⏸️ ${player.name} ha solicitado una pausa. Otro jugador debe confirmar escribiendo "p".`, null, 0xFFFF00, "bold", 2);
        
        // Configurar un timeout para cancelar la solicitud después de 10 segundos
        timeoutPausa = setTimeout(() => {
            if (pausaSolicitada && !pausaActiva) {
                room.sendAnnouncement(`⌛ La solicitud de pausa de ${player.name} ha expirado.`, null, 0xFF9900, "bold", 1);
                pausaSolicitada = false;
                jugadorSolicitante = null;
            }
        }, 10000); // 10 segundos
        
        return false;
    } 
    // Si hay una solicitud pendiente y este es otro jugador, confirmar la pausa
    else if (player.id !== jugadorSolicitante) {
        // Limpiar el timeout de cancelación
        clearTimeout(timeoutPausa);
        
        // Establecer pausa activa para evitar solicitudes múltiples
        pausaActiva = true;
        pausaSolicitada = false;
        
        // Enviar mensaje de confirmación
        room.sendAnnouncement(`✅ ${player.name} ha confirmado la pausa. El juego se detendrá por 20 segundos.`, null, 0x00FF00, "bold", 2);
        
        // Pausar el juego
        room.pauseGame(true);
        
        // Programar la reanudación del juego después de 20 segundos
        setTimeout(() => {
            // Enviar aviso 5 segundos antes de reanudar
            room.sendAnnouncement("⚠️ El partido se reanudará en 5 segundos.", null, 0xFFFF00, "bold", 2);
            
            // Programar la reanudación final
            setTimeout(() => {
                room.sendAnnouncement("▶️ La pausa ha terminado. ¡El partido se reanuda!", null, 0x00FF00, "bold", 2);
                room.pauseGame(false);
                
                // Reiniciar variables de pausa
                pausaSolicitada = false;
                jugadorSolicitante = null;
                pausaActiva = false;
            }, 5000);
        }, 15000); // 15 + 5 = 20 segundos en total
        
        return false;
    } 
    // Si el mismo jugador intenta confirmar su propia pausa
    else {
        room.sendAnnouncement(`[❌] No puedes confirmar tu propia solicitud de pausa. Otro jugador debe confirmarla.`, player.id, 0xFF0000, "bold", 2);
        return false;
    }
}


// Función para procesar solicitudes de reinicio
function processRestartRequest(player) {
    // Si ya hay un reinicio activo, ignorar
    if (reinicioSolicitado) {
        if (jugadorReinicio === player.id) {
            room.sendAnnouncement(`[❌] Ya solicitaste un reinicio. Espera a que otro jugador lo confirme.`, player.id, 0xFF0000, "bold", 2);
        } else {
            // Confirmar el reinicio
            clearTimeout(timeoutReinicio);
            reinicioSolicitado = false;
            jugadorReinicio = null;
            
            // Enviar mensaje de confirmación
            room.sendAnnouncement(`✅ ${player.name} ha confirmado el reinicio. El partido se reiniciará en 3 segundos.`, null, 0x00FF00, "bold", 2);
            
            // Reiniciar el partido
            setTimeout(() => {
                room.stopGame();
                setTimeout(() => {
                    room.startGame();
                }, 500);
            }, 3000);
        }
        return false;
    } else {
        // Nueva solicitud de reinicio
        reinicioSolicitado = true;
        jugadorReinicio = player.id;
        room.sendAnnouncement(`🔄 ${player.name} ha solicitado reiniciar el partido. Otro jugador debe confirmar escribiendo "me reinicio".`, null, 0xFFFF00, "bold", 2);
        
        // Configurar un timeout para cancelar la solicitud después de 10 segundos
        timeoutReinicio = setTimeout(() => {
            if (reinicioSolicitado) {
                room.sendAnnouncement(`⌛ La solicitud de reinicio de ${player.name} ha expirado.`, null, 0xFF9900, "bold", 1);
                reinicioSolicitado = false;
                jugadorReinicio = null;
            }
        }, 10000); // 10 segundos
        
        return false;
    }
}


// 1. Primero, vamos a mejorar la función getSpecList para mostrar correctamente la lista de espectadores
function getSpecList(captain, teamColor) {
    try {
        // Actualizar la lista de espectadores
        updateTeams();
        
        if (!teamS || teamS.length === 0) {
        room.sendAnnouncement(
                centerText("No hay jugadores disponibles para elegir"),
                captain.id,
                teamColor,
            "bold"
        );
        return;
    }
    
        // Mostrar cabecera
    room.sendAnnouncement(
            centerText("JUGADORES DISPONIBLES:"),
            captain.id,
            0xFFFFFF,
        "bold"
    );
    
        // Mostrar cada jugador con su número
        for (let i = 0; i < teamS.length; i++) {
            const player = teamS[i];
            if (!player) continue;
            
            // Obtener estadísticas básicas del jugador si están disponibles
            let statText = "";
            try {
                const auth = getAuth(player);
                if (auth) {
                    const stats = JSON.parse(localStorage.getItem(auth)) || {};
                    const games = stats[Ss.GA] || 0;
                    const wins = stats[Ss.WI] || 0;
                    const winRate = games > 0 ? ((wins / games) * 100).toFixed(0) : "0";
                    
                    statText = ` - ${games} partidos, ${winRate}% victorias`;
                }
            } catch (e) {
                console.error("Error obteniendo stats:", e);
            }
            
            // Mostrar jugador con número para selección
    room.sendAnnouncement(
                `${i + 1}. ${player.name}${statText}`,
                captain.id,
                teamColor,
        "normal"
    );
        }
    
        // Mostrar instrucciones
    room.sendAnnouncement(
            centerText("Escribe el NÚMERO del jugador que quieres elegir"),
            captain.id,
            0xFFFFFF,
        "bold"
    );
        
        console.log("Mostrando lista de espectadores al capitán", captain.name);
        return true;
    } catch (error) {
        console.error("Error en getSpecList:", error);
        return false;
    }
}


function updateTeams() {
    // update the players' list and all the teams' list
    players = room
        .getPlayerList()
        .filter((player) => player.id != 0 && !getAFK(player));
    teamR = players.filter((p) => p.team === Team.RED);
    teamB = players.filter((p) => p.team === Team.BLUE);
    teamS = players.filter((p) => p.team === Team.SPECTATORS);
}


function handleInactivity() {
    // handles inactivity : players will be kicked after afkLimit
    if (countAFK && teamR.length + teamB.length > 1) {
        for (var i = 0; i < teamR.length; i++) {
            setActivity(teamR[i], getActivity(teamR[i]) + 1);
        }
        for (var i = 0; i < teamB.length; i++) {
            setActivity(teamB[i], getActivity(teamB[i]) + 1);
        }
    }
    for (var i = 0; i < extendedP.length; i++) {
        if (extendedP[i][eP.ACT] == 60 * ((2 / 3) * afkLimit)) {
            room.sendAnnouncement(
                '[PV] ⛔ @' +
                    room.getPlayer(extendedP[i][eP.ID]).name +
                    ", si no se mueves o envías un mensaje en los próximos " +
                    Math.floor(afkLimit / 3) +
                    ' segundos, serás expulsado!',
                extendedP[i][eP.ID]
            );
        }
        if (extendedP[i][eP.ACT] >= 60 * afkLimit) {
            extendedP[i][eP.ACT] = 0;
            if (room.getScores().time <= afkLimit - 0.5) {
                setTimeout(() => {
                    !inChooseMode ? quickRestart() : room.stopGame();
                }, 10);
            }
            room.kickPlayer(extendedP[i][eP.ID], 'AFK', false);
        }
    }
}


function handleReinicioComando(player) {
    // Si es ADMIN_PERM o superior, reiniciar inmediatamente
    if (hasPermission(player, Role.ADMIN_PERM)) {
        room.sendAnnouncement("🔄 El partido se reiniciará ahora.", null, 0x00FF00, "bold", 2);
        room.stopGame();
        room.startGame();
        return false;
    }
    
    // Si es ADMIN_TEMP, solo permitir reinicio cuando el juego está detenido
    if (hasPermission(player, Role.ADMIN_TEMP) && getRole(player) < Role.ADMIN_PERM) {
        if (gameState === State.STOP) {
            room.sendAnnouncement("🔄 El partido se reiniciará ahora.", null, 0x00FF00, "bold", 2);
            room.stopGame();
            room.startGame();
            return true;
        } else {
            room.sendAnnouncement("[❌] Solo puedes reiniciar cuando el juego está detenido.", player.id, 0xFF0000, "bold", 2);
            return true;
        }
    }
    
    // Para jugadores normales, sistema de votación
    // Si no hay solicitud pendiente, crear una nueva
    if (!reinicioSolicitado) {
        reinicioSolicitado = true;
        jugadorSolicitanteReinicio = player.id;
        equipoSolicitanteReinicio = player.team;
        room.sendAnnouncement(`${player.name} ha solicitado reiniciar el partido. Se necesitan dos confirmaciones del equipo contrario escribiendo !rr.`, null, 0xFFFF00, "bold", 2);
        
        // Crear timeout de 10 segundos para cancelar si no hay suficientes confirmaciones
        timeoutReinicio = setTimeout(() => {
            if (reinicioSolicitado) {
                room.sendAnnouncement(`⚠️ La solicitud de reinicio de ${player.name} ha caducado por falta de confirmaciones.`, null, 0xFF9900, "bold", 2);
                // Reiniciar variables
                reinicioSolicitado = false;
                jugadorSolicitanteReinicio = null;
                equipoSolicitanteReinicio = null;
                confirmacionesReinicio = [];
            }
        }, 10000);
        
        return true;
    }
    
    // Si ya existe una solicitud, verificar si es del equipo contrario
    if (player.team !== equipoSolicitanteReinicio && player.team !== Team.SPECTATORS) {
        // Verificar que no haya confirmado ya
        if (!confirmacionesReinicio.includes(player.id)) {
            confirmacionesReinicio.push(player.id);
            room.sendAnnouncement(`${player.name} ha confirmado el reinicio del partido (${confirmacionesReinicio.length}/2).`, null, 0xFFFF00, "bold", 2);
            
            // Si hay suficientes confirmaciones, reiniciar
            if (confirmacionesReinicio.length >= 2) {
                // Cancelar el timeout porque ya tenemos suficientes confirmaciones
                clearTimeout(timeoutReinicio);
                
                room.sendAnnouncement("🔄 El partido se reiniciará ahora.", null, 0x00FF00, "bold", 2);
                room.stopGame();
                room.startGame();
                
                // Reiniciar variables
                reinicioSolicitado = false;
                jugadorSolicitanteReinicio = null;
                equipoSolicitanteReinicio = null;
                confirmacionesReinicio = [];
            }
        } else {
            room.sendAnnouncement(`[❌] Ya has confirmado el reinicio del partido.`, player.id, 0xFF0000, "bold", 2);
        }
        return true;
    } else if (player.id === jugadorSolicitanteReinicio) {
        room.sendAnnouncement(`[❌] Ya has solicitado el reinicio del partido.`, player.id, 0xFF0000, "bold", 2);
        return true;
    } else if (player.team === equipoSolicitanteReinicio) {
        room.sendAnnouncement(`[❌] Solo los jugadores del equipo contrario pueden confirmar el reinicio.`, player.id, 0xFF0000, "bold", 2);
        return true;
    } else if (player.team === Team.SPECTATORS) {
        room.sendAnnouncement(`[❌] Los espectadores no pueden confirmar el reinicio del partido.`, player.id, 0xFF0000, "bold", 2);
        return true;
    }
    
    return false;
}

/* STATS FUNCTIONS */

function getLastTouchOfTheBall() {
    const ballPosition = room.getBallPosition();
    updateTeams();
    for (var i = 0; i < players.length; i++) {
        if (players[i].position != null) {
            var distanceToBall = pointDistance(
                players[i].position,
                ballPosition
            );
            if (distanceToBall < triggerDistance) {
                !activePlay ? (activePlay = true) : null;
                if (
                    lastTeamTouched == players[i].team &&
                    lastPlayersTouched[0] != null &&
                    lastPlayersTouched[0].id != players[i].id
                ) {
                    lastPlayersTouched[1] = lastPlayersTouched[0];
                    lastPlayersTouched[0] = players[i];
                }
                lastTeamTouched = players[i].team;
            }
        }
    }
}

function getStats() {
    // gives possession, ball speed and GK of each team
    if (activePlay) {
        updateTeams();
        lastTeamTouched == Team.RED ? Rposs++ : Bposs++;
        var ballPosition = room.getBallPosition();
        point[1] = point[0];
        point[0] = ballPosition;
        ballSpeed = (pointDistance(point[0], point[1]) * 60 * 60 * 60) / 15000;
        var k = [-1, Infinity];
        for (var i = 0; i < teamR.length; i++) {
            if (teamR[i].position.x < k[1]) {
                k[0] = teamR[i];
                k[1] = teamR[i].position.x;
            }
        }
        k[0] != -1 ? setGK(k[0], getGK(k[0]) + 1) : null;
        k = [-1, -Infinity];
        for (var i = 0; i < teamB.length; i++) {
            if (teamB[i].position.x > k[1]) {
                k[0] = teamB[i];
                k[1] = teamB[i].position.x;
            }
        }
        k[0] != -1 ? setGK(k[0], getGK(k[0]) + 1) : null;
        findGK();
    }
}

function updateStats() {
    if (
        players.length >= 2 * maxTeamSize &&
        (game.scores.time >= (5 / 6) * game.scores.timeLimit ||
            game.scores.red == game.scores.scoreLimit ||
            game.scores.blue == game.scores.scoreLimit) &&
        allReds.length >= maxTeamSize &&
        allBlues.length >= maxTeamSize
    ) {
        var stats;
        for (var i = 0; i < allReds.length; i++) {
            localStorage.getItem(getAuth(allReds[i]))
                ? (stats = JSON.parse(
                      localStorage.getItem(getAuth(allReds[i]))
                  ))
                : (stats = [
                      0,
                      0,
                      0,
                      0,
                      '0.00',
                      0,
                      0,
                      0,
                      0,
                      '0.00',
                      'player',
                      allReds[i].name,
                  ]);
            stats[Ss.GA]++;
            lastWinner == Team.RED
                ? stats[Ss.WI]++
                : lastWinner == Team.BLUE
                ? stats[Ss.LS]++
                : stats[Ss.DR]++;
            stats[Ss.WR] = ((100 * stats[Ss.WI]) / stats[Ss.GA]).toPrecision(3);
            localStorage.setItem(getAuth(allReds[i]), JSON.stringify(stats));
        }
        for (var i = 0; i < allBlues.length; i++) {
            localStorage.getItem(getAuth(allBlues[i]))
                ? (stats = JSON.parse(
                      localStorage.getItem(getAuth(allBlues[i]))
                  ))
                : (stats = [
                      0,
                      0,
                      0,
                      0,
                      '0.00',
                      0,
                      0,
                      0,
                      0,
                      '0.00',
                      'player',
                      allBlues[i].name,
                  ]);
            stats[Ss.GA]++;
            lastWinner == Team.BLUE
                ? stats[Ss.WI]++
                : lastWinner == Team.RED
                ? stats[Ss.LS]++
                : stats[Ss.DR]++;
            stats[Ss.WR] = ((100 * stats[Ss.WI]) / stats[Ss.GA]).toPrecision(3);
            localStorage.setItem(getAuth(allBlues[i]), JSON.stringify(stats));
        }
        for (var i = 0; i < game.goals.length; i++) {
            if (game.goals[i].striker != null) {
                if (
                    allBlues
                        .concat(allReds)
                        .findIndex(
                            (player) => player.id == game.goals[i].striker.id
                        ) != -1
                ) {
                    stats = JSON.parse(
                        localStorage.getItem(getAuth(game.goals[i].striker))
                    );
                    stats[Ss.GL]++;
                    localStorage.setItem(
                        getAuth(game.goals[i].striker),
                        JSON.stringify(stats)
                    );
                }
            }
            if (game.goals[i].assist != null) {
                if (
                    allBlues
                        .concat(allReds)
                        .findIndex(
                            (player) => player.name == game.goals[i].assist.name
                        ) != -1
                ) {
                    stats = JSON.parse(
                        localStorage.getItem(getAuth(game.goals[i].assist))
                    );
                    stats[Ss.AS]++;
                    localStorage.setItem(
                        getAuth(game.goals[i].assist),
                        JSON.stringify(stats)
                    );
                }
            }
        }
        if (allReds.findIndex((player) => player.id == GKList[0].id) != -1) {
            stats = JSON.parse(localStorage.getItem(getAuth(GKList[0])));
            stats[Ss.GK]++;
            game.scores.blue == 0 ? stats[Ss.CS]++ : null;
            stats[Ss.CP] = ((100 * stats[Ss.CS]) / stats[Ss.GK]).toPrecision(3);
            localStorage.setItem(getAuth(GKList[0]), JSON.stringify(stats));
        }
        if (allBlues.findIndex((player) => player.id == GKList[1].id) != -1) {
            stats = JSON.parse(localStorage.getItem(getAuth(GKList[1])));
            stats[Ss.GK]++;
            game.scores.red == 0 ? stats[Ss.CS]++ : null;
            stats[Ss.CP] = ((100 * stats[Ss.CS]) / stats[Ss.GK]).toPrecision(3);
            localStorage.setItem(getAuth(GKList[1]), JSON.stringify(stats));
        }
    }
}

    /* STATISTICS FUNCTIONS */

    function getLastTouchOfTheBall() {
        const ballPosition = room.getBallPosition();
        updateTeams();
        for (var i = 0; i < players.length; i++) {
            if (players[i].position != null) {
                var distanceToBall = pointDistance(players[i].position, ballPosition);
                if (distanceToBall < triggerDistance) {
                    !activePlay ? activePlay = true : null;
                    if (lastTeamTouched == players[i].team && lastPlayersTouched[0] != null && lastPlayersTouched[0].id != players[i].id) {
                        lastPlayersTouched[1] = lastPlayersTouched[0];
                        lastPlayersTouched[0] = players[i];
                    }
                    lastTeamTouched = players[i].team;
                }
            }
        }
    }

    function getStats() { // gives possession, ball speed and GK of each team
        if (activePlay) {
            updateTeams();
            lastTeamTouched == Team.RED ? Rposs++ : Bposs++;
            var ballPosition = room.getBallPosition();
            point[1] = point[0];
            point[0] = ballPosition;
            ballSpeed = (pointDistance(point[0], point[1]) * 60 * 60 * 60) / 15000;
            var k = [-1, Infinity];
            for (var i = 0; i < teamR.length; i++) {
                if (teamR[i].position.x < k[1]) {
                    k[0] = teamR[i];
                    k[1] = teamR[i].position.x;
                }
            }
            k[0] != -1 ? setGK(k[0], getGK(k[0].team) + 1) : null;
            k = [-1, -Infinity];
            for (var i = 0; i < teamB.length; i++) {
                if (teamB[i].position.x > k[1]) {
                    k[0] = teamB[i];
                    k[1] = teamB[i].position.x;
                }
            }
            k[0] != -1 ? setGK(k[0], getGK(k[0].team) + 1) : null;
            findGK();
        }
    }

    function updateStats() {
        if (players.length >= 2 * maxTeamSize && (game.scores.time >= (5 / 6) * game.scores.timeLimit || game.scores.red == game.scores.scoreLimit || game.scores.blue == game.scores.scoreLimit) && allReds.length >= maxTeamSize && allBlues.length >= maxTeamSize) {
            var stats;
            for (var i = 0; i < allReds.length; i++) {
                localStorage.getItem(getAuth(allReds[i])) ? stats = JSON.parse(localStorage.getItem(getAuth(allReds[i]))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", allReds[i].name];
                stats[Ss.GA]++;
                lastWinner == Team.RED ? stats[Ss.WI]++ : lastWinner == Team.BLUE ? stats[Ss.LS]++ : stats[Ss.DR]++;
                stats[Ss.WR] = (100 * stats[Ss.WI] / stats[Ss.GA]).toPrecision(3);
                localStorage.setItem(getAuth(allReds[i]), JSON.stringify(stats));
            }
            for (var i = 0; i < allBlues.length; i++) {
                localStorage.getItem(getAuth(allBlues[i])) ? stats = JSON.parse(localStorage.getItem(getAuth(allBlues[i]))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", allBlues[i].name];
                stats[Ss.GA]++;
                lastWinner == Team.BLUE ? stats[Ss.WI]++ : lastWinner == Team.RED ? stats[Ss.LS]++ : stats[Ss.DR]++;
                stats[Ss.WR] = (100 * stats[Ss.WI] / stats[Ss.GA]).toPrecision(3);
                localStorage.setItem(getAuth(allBlues[i]), JSON.stringify(stats));
            }
            for (var i = 0; i < game.goals.length; i++) {
                if (game.goals[i].striker != null) {
                    if ((allBlues.concat(allReds)).findIndex((player) => player.id == game.goals[i].striker.id) != -1) {
                        stats = JSON.parse(localStorage.getItem(getAuth(game.goals[i].striker)));
                        stats[Ss.GL]++;
                        localStorage.setItem(getAuth(game.goals[i].striker), JSON.stringify(stats));
                    }
                }
                if (game.goals[i].assist != null) {
                    if ((allBlues.concat(allReds)).findIndex((player) => player.name == game.goals[i].assist.name) != -1) {
                        stats = JSON.parse(localStorage.getItem(getAuth(game.goals[i].assist)));
                        stats[Ss.AS]++;
                        localStorage.setItem(getAuth(game.goals[i].assist), JSON.stringify(stats));
                    }
                }
            }
            if (allReds.findIndex((player) => player.id == GKList[0].id) != -1) {
                stats = JSON.parse(localStorage.getItem(getAuth(GKList[0])));
                stats[Ss.GK]++;
                game.scores.blue == 0 ? stats[Ss.CS]++ : null;
                stats[Ss.CP] = (100 * stats[Ss.CS] / stats[Ss.GK]).toPrecision(3);
                localStorage.setItem(getAuth(GKList[0]), JSON.stringify(stats));
            }
            if (allBlues.findIndex((player) => player.id == GKList[1].id) != -1) {
                stats = JSON.parse(localStorage.getItem(getAuth(GKList[1])));
                stats[Ss.GK]++;
                game.scores.red == 0 ? stats[Ss.CS]++ : null;
                stats[Ss.CP] = (100 * stats[Ss.CS] / stats[Ss.GK]).toPrecision(3);
                localStorage.setItem(getAuth(GKList[1]), JSON.stringify(stats));
            }
        }
    }

    // Agregar estas funciones antes del onPlayerChat
    function normalizeString(str) {
        return str.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s]/g, "")
                .trim();
    }

    function findClosestPlayer(searchName, excludeId) {
        searchName = normalizeString(searchName);
        let bestMatch = null;
        let bestSimilarity = 0;

        room.getPlayerList().forEach(player => {
            if (player.id !== excludeId) {
                const normalizedName = normalizeString(player.name);
                
                // Búsqueda exacta
                if (normalizedName === searchName) {
                    bestMatch = player;
                    bestSimilarity = 1;
                    return;
                }
                
                // Búsqueda parcial
                if (normalizedName.includes(searchName) || searchName.includes(normalizedName)) {
                    const similarity = Math.min(searchName.length, normalizedName.length) / 
                                    Math.max(searchName.length, normalizedName.length);
                    if (similarity > bestSimilarity) {
                        bestSimilarity = similarity;
                        bestMatch = player;
                    }
                }
            }
        });

        // Retornamos el jugador solo si la similitud es mayor al 50%
        return bestSimilarity > 0.5 ? bestMatch : null;
    }

    function findGK() {
        var tab = [
            [-1, ""],
            [-1, ""]
        ];
        for (var i = 0; i < extendedP.length; i++) {
            if (room.getPlayer(extendedP[i][eP.ID]) != null && room.getPlayer(extendedP[i][eP.ID]).team == Team.RED) {
                if (tab[0][0] < extendedP[i][eP.GK]) {
                    tab[0][0] = extendedP[i][eP.GK];
                    tab[0][1] = room.getPlayer(extendedP[i][eP.ID]);
                }
            } else if (room.getPlayer(extendedP[i][eP.ID]) != null && room.getPlayer(extendedP[i][eP.ID]).team == Team.BLUE) {
                if (tab[1][0] < extendedP[i][eP.GK]) {
                    tab[1][0] = extendedP[i][eP.GK];
                    tab[1][1] = room.getPlayer(extendedP[i][eP.ID]);
                }
            }
        }
        GKList = [tab[0][1], tab[1][1]];
    }

    setInterval(() => {
        var tableau = [];
        if (statNumber % 5 == 0) {
            Object.keys(localStorage).forEach(function(key) {
                if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) {
                    tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.GA])]);
                }
            });
            if (tableau.length < 5) {
                return false;
            }
            tableau.sort(function(a, b) {
                return b[1] - a[1];
            });
            room.sendAnnouncement("Partidos jugados> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
        }
        if (statNumber % 5 == 1) {
            Object.keys(localStorage).forEach(function(key) {
                if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) {
                    tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.WI])]);
                }
            });
            if (tableau.length < 5) {
                return false;
            }
            tableau.sort(function(a, b) {
                return b[1] - a[1];
            });
            room.sendAnnouncement("Victorias> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
        }
        if (statNumber % 5 == 2) {
            Object.keys(localStorage).forEach(function(key) {
                if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) {
                    tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.GL])]);
                }
            });
            if (tableau.length < 5) {
                return false;
            }
            tableau.sort(function(a, b) {
                return b[1] - a[1];
            });
            room.sendAnnouncement("Goles> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
        }
        if (statNumber % 5 == 3) {
            Object.keys(localStorage).forEach(function(key) {
                if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) {
                    tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.AS])]);
                }
            });
            if (tableau.length < 5) {
                return false;
            }
            tableau.sort(function(a, b) {
                return b[1] - a[1];
            });
            room.sendAnnouncement("Asistencias> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
        }
        if (statNumber % 5 == 4) {
            Object.keys(localStorage).forEach(function(key) {
                if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) {
                    tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.CS])]);
                }
            });
            if (tableau.length < 5) {
                return false;
            }
            tableau.sort(function(a, b) {
                return b[1] - a[1];
            });
            room.sendAnnouncement("Paradas> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
        }
        statNumber++;
    }, statInterval * 60 * 1000);



    // Mensajes para goles normales
    const scorerMessages = [
        `⚽🎉 ¡Golazo de {scorer}!`,
        `🔥⚽ ¡Increíble definición de {scorer}! {gk} no pudo hacer nada.`,
        `💥🔥 {scorer} está imparable hoy, domina completamente a los de {rivalTeam}!`,
        `🤯💥⚡ ¡Qué golazo acaba de hacer {scorer}! ¡Espectacular!`,
        `👌⚽👏 ¡Bien definido por {scorer}!`,
        `🍷🚬🗿 La definición de {scorer} definitivamente es cine.`,
        `⚽🔥 ¡Golazo impresionante de {scorer}!`,
        `🔥⚽ Eduque {scorer}, eduque 👏👏`,
        `💪🔥⚽ Cuando sos crack, sos crack... ¡Y {scorer} lo acaba de demostrar! 👑`,
        `⚡⚽ {scorer} dejó sin opciones a {gk} con ese disparo perfecto!`,
        `💀⚽🔥 {rivalTeam} no sabe cómo detener a {scorer} hoy!`,
        `🤩⚡🔥 ¡Naa, qué golazo les marcó {scorer} a los de {rivalTeam}! 😱⚽`,
        `🎯⚽ ¡99 de definición! {scorer} la puso donde quería.`,
        `💥⚽🔥 ¡Ufff, qué golazo acaba de marcarle {scorer} a los de {rivalTeam}! 😱⚽`,
        `👀🔥 {scorer} dejó en ridículo a toda la defensa de {rivalTeam} con ese golazo!`
    ];

    // Mensajes para autogoles
    const ownGoalMessages = [
        `🤣 {scorer} Seguí así chad que vas a llegar muy cerca.🤦‍♂️`,
        `🤣 {scorer} Tenés que abrir el estadio, los burros hacen eso.🤦‍♂️`,
        `😵‍💫 Pero dale {scorer}, ¿tan quemado estás que la mandaste a tu propio arco? 🎯🤦‍♂️`,
        `🔥 Che, {scorer}, ¡la idea era hacer goles en el otro arco, master! 💀`,
        `💯 {scorer} vio un TikTok de "cómo NO jugar al haxball" y le salió de 10.`,
        `🔥 {scorer} es el jugador que todos queremos en el equipo... del rival.`,
        `🤨 {scorer}: "Quería probar si nuestro arquero estaba atento"`
    ];

    // Función para obtener un mensaje aleatorio
    function getRandomMessage(messages, replacements) {
        let message = messages[Math.floor(Math.random() * messages.length)];
        for (let key in replacements) {
            message = message.replace(`{${key}}`, replacements[key]);
        }
        return message;
    }


    // Definir commands antes de los eventos
    const commands = {

'nick': (player, args) => {
    // Verificar que haya un nuevo nombre
    if (!args[0]) {
        room.sendAnnouncement("❌ Uso: !nick <nuevo_nombre>", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener el auth del jugador
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth. Reconectate a la sala.", player.id, 0xFF0000);
        return false;
    }
    
    // Verificar que el jugador esté registrado
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(userData => {
        if (!userData) {
            room.sendAnnouncement("❌ No estás registrado. Registrate primero con !register", player.id, 0xFF0000);
            return;
        }
        
        // Armar el nuevo nombre (por si tiene espacios)
        const newNickname = args.join(" ");
        
        // Validar el nuevo nombre
        if (newNickname.length < 2 || newNickname.length > 25) {
            room.sendAnnouncement("❌ El nombre debe tener entre 2 y 25 caracteres.", player.id, 0xFF0000);
            return;
        }
        
        // Guardar el nombre anterior para mostrarlo
        const oldNickname = userData.name || player.name;
        
        // Actualizar el nombre en la base de datos
        userData.name = newNickname;
        
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(userData)
        })
        .then(() => {
            // Anunciar el cambio exitoso
            room.sendAnnouncement(`✅ Tu nombre ha sido actualizado: ${oldNickname} → ${newNickname}`, player.id, 0x00FF00, "bold");
            room.sendAnnouncement(`📝 El cambio se reflejará en los rankings y estadísticas. ¡Los datos se han preservado!`, player.id, 0x00FF00);
            
            // Opcional: actualizar el nombre local si tenemos una función para eso
            if (typeof updatePlayerName === 'function') {
                updatePlayerName(player);
            }
        })
        .catch(error => {
            console.error("Error actualizando nickname:", error);
            room.sendAnnouncement("❌ Ocurrió un error al actualizar tu nombre.", player.id, 0xFF0000);
        });
    })
    .catch(error => {
        console.error("Error verificando jugador:", error);
        room.sendAnnouncement("❌ Error al verificar tu cuenta.", player.id, 0xFF0000);
    });
    
    return false;
},

    // ... otros comandos ...
'slow': (player, args) => {
    // Verificar permisos
    if (getRole(player) < Role.ADMIN_PERM) {
        room.sendAnnouncement("❌ No tenés permisos para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    if (!args[0]) {
        room.sendAnnouncement(`ℹ️ Modo lento: ${slowMode > 0 ? slowMode + ' mensajes/segundo' : 'Desactivado'}`, player.id, 0x00FF00);
        return false;
    }
    
    const limit = parseFloat(args[0]);
    
    if (isNaN(limit) || limit < 0) {
        room.sendAnnouncement("❌ Uso: !slow <mensajes_por_segundo o 0 para desactivar>", player.id, 0xFF0000);
        return false;
    }
    
    slowMode = limit;
    
    // Limpiar registros
    playerLastMessages.clear();
    slowModeWarnings.clear();
    
    if (slowMode > 0) {
        room.sendAnnouncement(`🕒 ${player.name} ha activado el modo lento: Máximo ${slowMode} mensajes por segundo.`, null, 0x00FF00, "bold");
    } else {
        room.sendAnnouncement(`🕒 ${player.name} ha desactivado el modo lento.`, null, 0x00FF00, "bold");
    }
    
    return false;
},
  
        'debugdb': (player) => {
            const role = getRole(player);
            if (role < Role.MASTER) {
                room.sendAnnouncement("❌ No tenés permisos para usar este comando", player.id, 0xFF0000);
                return false;
            }

            firebaseFetch('admins')
            .then(admins => {
                if (!admins) {
                    room.sendAnnouncement("No hay admins registrados", player.id, 0xFFD700);
                    return;
                }

                console.log("📝 Contenido de la base de datos:");
                console.log(JSON.stringify(admins, null, 2));
                
                room.sendAnnouncement("✅ Datos mostrados en la consola", player.id, 0x00FF00);
                
                room.sendAnnouncement("📊 Resumen de la base de datos:", player.id, 0xFFD700, "bold");
                let adminCount = 0;
                let roleCount = {
                    [Role.MASTER]: 0,
                    [Role.OWNER]: 0,
                    [Role.CO_OWNER]: 0,
                    [Role.SUPERADMIN]: 0,
                    [Role.ADMIN_PERM]: 0
                };

                Object.values(admins).forEach(admin => {
                    adminCount++;
                    roleCount[admin.role]++;
                });

                room.sendAnnouncement(`Total de admins: ${adminCount}`, player.id, 0xFFD700);
                for (let role in roleCount) {
                    if (roleCount[role] > 0) {
                        room.sendAnnouncement(`${getRoleName(parseInt(role))}: ${roleCount[role]}`, player.id, 0xFFD700);
                    }
                }
            })
            .catch(error => {
                console.error("Error accediendo a la base de datos:", error);
                room.sendAnnouncement("❌ Error al acceder a la base de datos", player.id, 0xFF0000);
            });
            
            return false;
        },

        'checkrole': (player) => {
            const auth = getAuth(player);
            const role = getRole(player);
            room.sendAnnouncement(`Tu auth: ${auth}`, player.id, 0xFFFF00);
            room.sendAnnouncement(`Tu rol actual: ${getRoleName(role)}`, player.id, 0xFFFF00);
            room.sendAnnouncement(`Rol en Map: ${playerRoles.get(auth)}`, player.id, 0xFFFF00);
            return false;
        },
        // Comando para verificar tu auth
        'checkauth': (player) => {
            const playerData = extendedP.find(p => p[eP.ID] === player.id);
            const auth = playerData ? playerData[eP.AUTH] : null;
            
            if (auth) {
                room.sendAnnouncement(`Tu auth es: ${auth}`, player.id, 0x00FF00);
                room.sendAnnouncement(`Tu nombre es: ${player.name}`, player.id, 0x00FF00);
                room.sendAnnouncement(`Tu ID es: ${player.id}`, player.id, 0x00FF00);
            } else {
                room.sendAnnouncement("❌ No tenés auth asignado", player.id, 0xFF0000);
            }
            return false;
        },
        'removeadmin': (player, args) => {
            const role = getRole(player);
            if (role < Role.OWNER) {
                room.sendAnnouncement("❌ No tenés permisos para remover admins", player.id, 0xFF0000);
                return false;
            }

            if (!args[0]) {
                room.sendAnnouncement("❌ Uso: !removeadmin <auth>", player.id, 0xFF0000);
                return false;
            }

            const targetAuth = args[0];
            firebaseFetch(`admins/${targetAuth}`)
            .then(adminData => {
                if (!adminData) {
                    room.sendAnnouncement("❌ No se encontró ningún admin con ese auth", player.id, 0xFF0000);
                    return;
                }

                return firebaseFetch(`admins/${targetAuth}`, { method: 'DELETE' })
                .then(() => {
                    room.sendAnnouncement(`✅ Admin removido: ${adminData.name} (${getRoleName(adminData.role)})`, player.id, 0x00FF00);
                    
                    const targetPlayer = room.getPlayerList().find(p => p.auth === targetAuth);
                    if (targetPlayer) {
                        setPlayerRole(targetPlayer, Role.PLAYER);
                        room.sendAnnouncement("❌ Tu rol de admin ha sido removido", targetPlayer.id, 0xFF0000);
                    }
                });
            })
            .catch(error => {
                console.error("Error removiendo admin:", error);
                room.sendAnnouncement("❌ Error al remover admin", player.id, 0xFF0000);
            });
            
            return false;
        },
        'testdb': (player) => {
            const role = getRole(player);
            if (role < Role.ADMIN_PERM) {
                room.sendAnnouncement("❌ No tenés permisos para usar este comando", player.id, 0xFF0000);
                return false;
            }

            const url = `${FIREBASE_URL}/test.json?auth=${FIREBASE_API_KEY}`;
            fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    timestamp: Date.now(),
                    message: "Test de conexión"
                })
            })
            .then(() => {
                room.sendAnnouncement("✅ Conexión a la base de datos exitosa", player.id, 0x00FF00);
            })
            .catch(error => {
                console.error("Error:", error);
                room.sendAnnouncement("❌ Error de conexión", player.id, 0xFF0000);
            });

            return false;
        },
    
        'register': (player, args) => {
            if (args.length < 1) {
                room.sendAnnouncement("❌ Uso: !register <contraseña>", player.id, 0xFF0000);
                return false;
            }
            saveUser(player, args[0]);
            return false;
        },

          
    'recover': (player, args) => {
        if (!args || args.length < 1) {
            room.sendAnnouncement("❌ Uso: !recover [código]", player.id, 0xFF0000);
            return false;
        }
        
        const code = args[0].toUpperCase();
        recoverAccount(player, code);
        return false;
    },
    
    'sync': (player) => {
        syncPlayerStats(player);
        room.sendAnnouncement("🔄 Sincronizando estadísticas...", player.id, 0x00FF00);
        return false;
    },
    // Arreglar el comando 'me' para evitar NaN y mostrar el código siempre

// Comando para ver top goleadores
'goles': (player) => {
    // Obtener lista de todos los jugadores
    const url = `${FIREBASE_URL}/players.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(allPlayers => {
        if (!allPlayers) {
            room.sendAnnouncement("❌ No hay jugadores registrados", player.id, 0xFF0000);
            return;
        }
        
        // Crear array para ordenar
        const players = [];
        Object.keys(allPlayers).forEach(auth => {
            if (allPlayers[auth].stats && allPlayers[auth].stats.goals) {
                players.push({
                    name: allPlayers[auth].name,
                    goals: allPlayers[auth].stats.goals,
                    elo: allPlayers[auth].elo || ELO_DEFAULT
                });
            }
        });
        
        // Ordenar por goles (mayor a menor)
        players.sort((a, b) => b.goals - a.goals);
        
        // Mostrar los 10 mejores
        room.sendAnnouncement("⚽ TOP 10 GOLEADORES:", player.id, 0xFF4C4C, "bold");
        
        for (let i = 0; i < Math.min(10, players.length); i++) {
            const rank = getEloRank(players[i].elo);
            room.sendAnnouncement(`${i+1}. ${rank.icon} ${players[i].name} - ${players[i].goals} goles`, player.id, 0xFF4C4C);
        }
        
        // Si el jugador no está en el top 10, mostrar su posición
        const auth = getAuth(player);
        if (auth && allPlayers[auth] && allPlayers[auth].stats && allPlayers[auth].stats.goals) {
            const playerIndex = players.findIndex(p => p.name === player.name);
            
            if (playerIndex >= 10) {
                room.sendAnnouncement(`Tu posición: #${playerIndex + 1} (${allPlayers[auth].stats.goals} goles)`, player.id, 0xFF4C4C);
            }
        }
    })
    .catch(error => {
        console.error("Error obteniendo top:", error);
        room.sendAnnouncement("❌ Error al obtener el ranking", player.id, 0xFF0000);
    });
    
    return false;
},

// Comando para ver top asistidores
'asist': (player) => {
    // Obtener lista de todos los jugadores
    const url = `${FIREBASE_URL}/players.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(allPlayers => {
        if (!allPlayers) {
            room.sendAnnouncement("❌ No hay jugadores registrados", player.id, 0xFF0000);
            return;
        }
        
        // Crear array para ordenar
        const players = [];
        Object.keys(allPlayers).forEach(auth => {
            if (allPlayers[auth].stats && allPlayers[auth].stats.assists) {
                players.push({
                    name: allPlayers[auth].name,
                    assists: allPlayers[auth].stats.assists,
                    elo: allPlayers[auth].elo || ELO_DEFAULT
                });
            }
        });
        
        // Ordenar por asistencias (mayor a menor)
        players.sort((a, b) => b.assists - a.assists);
        
        // Mostrar los 10 mejores
        room.sendAnnouncement("👟 TOP 10 ASISTIDORES:", player.id, 0x73EC59, "bold");
        
        for (let i = 0; i < Math.min(10, players.length); i++) {
            const rank = getEloRank(players[i].elo);
            room.sendAnnouncement(`${i+1}. ${rank.icon} ${players[i].name} - ${players[i].assists} asistencias`, player.id, 0x73EC59);
        }
        
        // Si el jugador no está en el top 10, mostrar su posición
        const auth = getAuth(player);
        if (auth && allPlayers[auth] && allPlayers[auth].stats && allPlayers[auth].stats.assists) {
            const playerIndex = players.findIndex(p => p.name === player.name);
            
            if (playerIndex >= 10) {
                room.sendAnnouncement(`Tu posición: #${playerIndex + 1} (${allPlayers[auth].stats.assists} asistencias)`, player.id, 0x73EC59);
            }
        }
    })
    .catch(error => {
        console.error("Error obteniendo top:", error);
        room.sendAnnouncement("❌ Error al obtener el ranking", player.id, 0xFF0000);
    });
    
    return false;
},

// Comando para ver top MVPs
'mvps': (player) => {
    // Obtener lista de todos los jugadores
    const url = `${FIREBASE_URL}/players.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(allPlayers => {
        if (!allPlayers) {
            room.sendAnnouncement("❌ No hay jugadores registrados", player.id, 0xFF0000);
            return;
        }
        
        // Crear array para ordenar
        const players = [];
        Object.keys(allPlayers).forEach(auth => {
            if (allPlayers[auth].stats) {
                // Calculamos índice MVP: goles + (asistencias * 0.7) + (vallas invictas * 2)
                const stats = allPlayers[auth].stats;
                const goals = stats.goals || 0;
                const assists = stats.assists || 0;
                const cleanSheets = stats.cs || 0;
                const mvpIndex = goals + (assists * 0.7) + (cleanSheets * 2);
                
                players.push({
                    name: allPlayers[auth].name,
                    goals: goals,
                    assists: assists,
                    cleanSheets: cleanSheets,
                    mvpIndex: parseFloat(mvpIndex.toFixed(1)),
                    elo: allPlayers[auth].elo || ELO_DEFAULT
                });
            }
        });
        
        // Ordenar por índice MVP (mayor a menor)
        players.sort((a, b) => b.mvpIndex - a.mvpIndex);
        
        // Mostrar los 10 mejores
        room.sendAnnouncement("🏆 TOP 10 MVPs:", player.id, 0xFDC43A, "bold");
        
        for (let i = 0; i < Math.min(10, players.length); i++) {
            const rank = getEloRank(players[i].elo);
            room.sendAnnouncement(`${i+1}. ${rank.icon} ${players[i].name} - ${players[i].mvpIndex} puntos (${players[i].goals}G ${players[i].assists}A ${players[i].cleanSheets}CS)`, player.id, 0xFDC43A);
        }
        
        // Si el jugador no está en el top 10, mostrar su posición
        const auth = getAuth(player);
        if (auth && allPlayers[auth] && allPlayers[auth].stats) {
            const playerIndex = players.findIndex(p => p.name === player.name);
            
            if (playerIndex >= 10) {
                const stats = allPlayers[auth].stats;
                const goals = stats.goals || 0;
                const assists = stats.assists || 0;
                const cleanSheets = stats.cs || 0;
                const mvpIndex = (goals + (assists * 0.7) + (cleanSheets * 2)).toFixed(1);
                
                room.sendAnnouncement(`Tu posición: #${playerIndex + 1} (${mvpIndex} puntos)`, player.id, 0xFDC43A);
            }
        }
    })
    .catch(error => {
        console.error("Error obteniendo top:", error);
        room.sendAnnouncement("❌ Error al obtener el ranking", player.id, 0xFF0000);
    });
    
    return false;
},

'me': (player) => {
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth", player.id, 0xFF0000);
        return false;
    }
    
    // Generamos el código de recuperación de inmediato
    const recoveryCode = generateRecoveryCode(auth);
    
    // Sincronizamos primero
    syncPlayerStats(player);
    
    // Mostramos las estadísticas desde localStorage
    let stats = JSON.parse(localStorage.getItem(auth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
    
    // Calculamos valores seguros para evitar NaN o undefined
    const games = stats[Ss.GA] || 0;
    const wins = stats[Ss.WI] || 0;
    const losses = stats[Ss.LS] || 0;
    const winRate = games > 0 ? ((wins / games) * 100).toFixed(2) : "0.00";
    
    const goalkeeperGames = stats[Ss.GK] || 0;
    const cleanSheets = stats[Ss.CS] || 0;
    
    // Número de veces MVP (figura del partido)
    const mvps = stats.mvps || 0;
    
    // Mostramos estadísticas
    room.sendAnnouncement(`[📄] Estadísticas de ${player.name}:`, player.id, 0x73EC59, "bold");
    room.sendAnnouncement(`🎮 Partidos: ${games} | ✅ Victorias: ${wins} | ❌ Derrotas: ${losses} | WR: ${winRate}%`, player.id, 0x73EC59);
    room.sendAnnouncement(`⚽️ Goles: ${stats[Ss.GL] || 0} | 👟 Asistencias: ${stats[Ss.AS] || 0}`, player.id, 0x73EC59);
    
    // Solo mostrar stats de arquero si jugó como arquero
    if (goalkeeperGames > 0) {
        room.sendAnnouncement(`🧤 Partidos de arquero: ${goalkeeperGames} | 🥅 Vallas invictas: ${cleanSheets}`, player.id, 0x73EC59);
    }
    
    room.sendAnnouncement(`🌟 Veces MVP: ${mvps}`, player.id, 0x73EC59);
    
    // SIEMPRE mostramos el código de recuperación - sin importar si está registrado o no
    room.sendAnnouncement(`🔑 Tu código de recuperación: ${recoveryCode}`, player.id, 0xFF7900, "bold");
    room.sendAnnouncement("⚠️ No compartas tu código con nadie, es personal", player.id, 0xFF7900);

    // Si no está registrado, le recomendamos registrarse
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(userData => {
        if (!userData) {
            room.sendAnnouncement("ℹ️ Registrate con !register para guardar tus estadísticas permanentemente", player.id, 0xFF7900);
        } else {
            // Mostrar ELO y rango si está registrado
            const playerElo = userData.elo || ELO_DEFAULT;
            const rank = getEloRank(playerElo);
            room.sendAnnouncement(`🏆 Rango: ${rank.icon} ${rank.name} (ELO: ${playerElo})`, player.id, 0x73EC59);
            
            // Mostrar récord de vallas invictas consecutivas si existe
            if (userData.stats && userData.stats.maxConsecutiveCS !== undefined) {
                room.sendAnnouncement(`🏆 Récord de vallas invictas consecutivas: ${userData.stats.maxConsecutiveCS}`, player.id, 0x73EC59);
            }
            
            // Actualizamos el código de recuperación si no lo tiene
            if (!userData.recoveryCode) {
                userData.recoveryCode = recoveryCode;
                fetch(`${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`, {
                    method: 'PUT',
                    body: JSON.stringify(userData)
                });
            }
        }
    })
    .catch(error => {
        console.error("Error verificando registro:", error);
    });
    
    room.sendAnnouncement("「👓」 Este mensaje solo lo ves vos. Usá '!showme' para mostrar tus stats a todos!", player.id, 0xFF7900, "bold");
    return false;
},
// Ahora reemplaza los comandos reset-season y confirm-reset:

'codigo': (player) => {
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth", player.id, 0xFF0000);
        return false;
    }
    
    const recoveryCode = generateRecoveryCode(auth);
    room.sendAnnouncement(`🔑 Tu código de recuperación es: ${recoveryCode}`, player.id, 0xFF7900, "bold");
    room.sendAnnouncement("⚠️ Guarda este código en un lugar seguro. Lo necesitarás para recuperar tu cuenta.", player.id, 0xFF7900);
    
    return false;
},

'reset-season': (player) => {
    // Verificar si el jugador tiene permisos (OWNER o superior)
    if (getRole(player) < Role.OWNER) {
        room.sendAnnouncement("❌ Solo el OWNER o superior puede reiniciar la temporada", player.id, 0xFF0000);
        return false;
    }
    
    // Confirmar la acción
    room.sendAnnouncement("⚠️ ADVERTENCIA: Vas a reiniciar todas las estadísticas y ELO de todos los jugadores", player.id, 0xFF0000, "bold");
    room.sendAnnouncement("📝 Usa !confirm-reset para confirmar esta acción", player.id, 0xFF0000);
    
    // Guardamos una marca temporal para expirar la confirmación después de 30 segundos
    resetConfirmations.set(player.id, Date.now());
    
    return false;
},

'confirm-reset': (player) => {
    // Verificar si el jugador tiene permisos (OWNER o superior)
    if (getRole(player) < Role.OWNER) {
        room.sendAnnouncement("❌ Solo el OWNER o superior puede reiniciar la temporada", player.id, 0xFF0000);
        return false;
    }
    
    // Verificar si se ha solicitado una confirmación
    if (!resetConfirmations.has(player.id)) {
        room.sendAnnouncement("❌ Primero debes usar !reset-season", player.id, 0xFF0000);
        return false;
    }
    
    // Verificar si la confirmación no ha expirado (30 segundos)
    const confirmationTime = resetConfirmations.get(player.id);
    if (Date.now() - confirmationTime > 30000) {
        room.sendAnnouncement("❌ La solicitud de reinicio ha expirado. Usa !reset-season para comenzar de nuevo", player.id, 0xFF0000);
        resetConfirmations.delete(player.id);
        return false;
    }
    
    // Limpiar la confirmación
    resetConfirmations.delete(player.id);
    
    // Comenzar el proceso de reinicio
    room.sendAnnouncement("🔄 Iniciando reinicio de temporada...", null, 0xFF0000, "bold");
    
    // Obtener todos los jugadores registrados
    fetch(`${FIREBASE_URL}/players.json?auth=${FIREBASE_API_KEY}`)
    .then(response => response.json())
    .then(allPlayers => {
        if (!allPlayers) {
            room.sendAnnouncement("❌ No hay jugadores registrados", player.id, 0xFF0000);
            return;
        }
        
        let totalPlayers = Object.keys(allPlayers).length;
        let resetCount = 0;
        
        // Crear una copia de seguridad antes de resetear
        const backupDate = new Date().toISOString().replace(/:/g, '-');
        fetch(`${FIREBASE_URL}/seasons/${backupDate}.json?auth=${FIREBASE_API_KEY}`, {
            method: 'PUT',
            body: JSON.stringify(allPlayers)
        })
        .then(() => {
            room.sendAnnouncement("✅ Backup de la temporada anterior creado", null, 0x00FF00);
            
            // Resetear estadísticas de todos los jugadores
            Object.keys(allPlayers).forEach(auth => {
                const playerData = allPlayers[auth];
                
                // Reiniciar estadísticas pero mantener información de cuenta
                const resetData = {
                    ...playerData,
                    elo: ELO_DEFAULT,
                    stats: {
                        games: 0,
                        wins: 0,
                        losses: 0,
                        goals: 0,
                        assists: 0,
                        gk: 0,
                        cs: 0
                    }
                };
                
                // Actualizar en Firebase
                fetch(`${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`, {
                    method: 'PUT',
                    body: JSON.stringify(resetData)
                })
                .then(() => {
                    resetCount++;
                    
                    // Si es el último jugador, anunciar finalización
                    if (resetCount === totalPlayers) {
                        room.sendAnnouncement(`✅ ¡Temporada reiniciada! Se han reseteado las estadísticas de ${totalPlayers} jugadores`, null, 0x00FF00, "bold");
                        
                        // También reiniciamos localStorage para jugadores conectados
                        const connectedPlayers = room.getPlayerList();
                        connectedPlayers.forEach(connectedPlayer => {
                            const connAuth = getAuth(connectedPlayer);
                            if (connAuth) {
                                const localStats = JSON.parse(localStorage.getItem(connAuth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
                                // Resetear stats locales
                                localStats[Ss.GA] = 0; // Partidos
                                localStats[Ss.WI] = 0; // Victorias
                                localStats[Ss.LS] = 0; // Derrotas
                                localStats[Ss.WR] = "0.00"; // Win rate
                                localStats[Ss.GL] = 0; // Goles
                                localStats[Ss.AS] = 0; // Asistencias
                                localStats[Ss.GK] = 0; // Partidos de GK
                                localStats[Ss.CS] = 0; // Clean sheets
                                localStats[Ss.CP] = "0.00"; // Clean sheet %
                                localStats.elo = ELO_DEFAULT; // ELO
                                
                                localStorage.setItem(connAuth, JSON.stringify(localStats));
                                
                                // Actualizar nombre del jugador
                                updatePlayerName(connectedPlayer);
                                
                                // Notificar individualmente
                                room.sendAnnouncement("📊 Tus estadísticas han sido reiniciadas para la nueva temporada", connectedPlayer.id, 0x00FF00);
                            }
                        });
                        
                        // Actualizar todos los nombres con los nuevos rangos
                        updateAllPlayerNames();
                    }
                })
                .catch(error => {
                    console.error(`Error reseteando jugador ${auth}:`, error);
                });
            });
        })
        .catch(error => {
            console.error("Error creando backup:", error);
            room.sendAnnouncement("⚠️ No se pudo crear un backup, pero el reseteo continuará", null, 0xFF7900);
            
            // Continuar con el reseteo aunque el backup falle
            // (aquí duplicaríamos el código del reseteo)
        });
    })
    .catch(error => {
        console.error("Error obteniendo jugadores:", error);
        room.sendAnnouncement("❌ Error al reiniciar la temporada", player.id, 0xFF0000);
    });
    
    return false;
},

// Comando para actualizar manualmente los nombres con prefijo
'update-names': (player) => {
    if (getRole(player) < Role.ADMIN_PERM) {
        room.sendAnnouncement("❌ Solo administradores pueden usar este comando", player.id, 0xFF0000);
        return false;
    }
    
    updateAllPlayerNames();
    room.sendAnnouncement("✅ Nombres de jugadores actualizados con prefijos", player.id, 0x00FF00);
    
    return false;
},
// Comando para testear el sistema ELO
'test-elo': (player) => {
    if (getRole(player) < Role.PLAYER) {
        room.sendAnnouncement("❌ Solo administradores pueden usar este comando", player.id, 0xFF0000);
        return false;
    }
    
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth", player.id, 0xFF0000);
        return false;
    }
    
    // 1. Obtener ELO actual
    room.sendAnnouncement("🔍 Obteniendo ELO actual...", player.id, 0x00FF00);
    
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(userData => {
        if (!userData) {
            room.sendAnnouncement("❌ No estás registrado. Registrate con !register", player.id, 0xFF0000);
            return;
        }
        
        // Mostrar ELO y rango actuales
        const currentElo = userData.elo || ELO_DEFAULT;
        const currentRank = getEloRank(currentElo);
        
        room.sendAnnouncement("📊 ELO ANTES:", player.id, 0x00FF00, "bold");
        room.sendAnnouncement(`ELO: ${currentElo}`, player.id, 0x00FF00);
        room.sendAnnouncement(`Rango: ${currentRank.icon} ${currentRank.name}`, player.id, 0x00FF00);
        
        // 2. Simular varios escenarios
        room.sendAnnouncement("🔄 Simulando diferentes escenarios...", player.id, 0x00FF00);
        
        // Simular victoria contra equipo más débil (-200 ELO)
        const scenario1 = calculateElo(currentElo, currentElo - 200, true, 1);
        room.sendAnnouncement(`Victoria contra rival más débil (1 gol): ${currentElo} → ${scenario1} (${scenario1 - currentElo > 0 ? '+' : ''}${scenario1 - currentElo})`, player.id, 0x00FF00);
        
        // Simular victoria contra equipo igualado
        const scenario2 = calculateElo(currentElo, currentElo, true, 2);
        room.sendAnnouncement(`Victoria contra rival similar (2 goles): ${currentElo} → ${scenario2} (${scenario2 - currentElo > 0 ? '+' : ''}${scenario2 - currentElo})`, player.id, 0x00FF00);
        
        // Simular victoria contra equipo más fuerte (+200 ELO)
        const scenario3 = calculateElo(currentElo, currentElo + 200, true, 1);
        room.sendAnnouncement(`Victoria contra rival más fuerte (1 gol): ${currentElo} → ${scenario3} (${scenario3 - currentElo > 0 ? '+' : ''}${scenario3 - currentElo})`, player.id, 0x00FF00);
        
        // Simular derrota contra equipo más fuerte (+200 ELO)
        const scenario4 = calculateElo(currentElo, currentElo + 200, false, 0);
        room.sendAnnouncement(`Derrota contra rival más fuerte (0 goles): ${currentElo} → ${scenario4} (${scenario4 - currentElo > 0 ? '+' : ''}${scenario4 - currentElo})`, player.id, 0x00FF00);
        
        // 3. Aplicar un cambio real (victoria contra equipo más fuerte)
        const newElo = scenario3; // Usamos el escenario 3 (victoria contra rival más fuerte)
        
        // Actualizar ELO en Firebase
        userData.elo = newElo;
        
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(userData)
        })
        .then(() => {
            // También actualizamos en localStorage si existe
            const localStats = JSON.parse(localStorage.getItem(auth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
            localStats.elo = newElo;
            localStorage.setItem(auth, JSON.stringify(localStats));
            
            room.sendAnnouncement("💾 ELO actualizado en Firebase y localStorage", player.id, 0x00FF00);
            
            // 4. Verificar cambio y rango
            const newRank = getEloRank(newElo);
            room.sendAnnouncement("📊 ELO DESPUÉS:", player.id, 0x00FF00, "bold");
            room.sendAnnouncement(`ELO: ${newElo}`, player.id, 0x00FF00);
            room.sendAnnouncement(`Rango: ${newRank.icon} ${newRank.name}`, player.id, 0x00FF00);
            
            // Verificar si cambió de rango
            if (currentRank.name !== newRank.name) {
                room.sendAnnouncement(`¡Felicidades! Has subido de rango: ${currentRank.icon} ${currentRank.name} → ${newRank.icon} ${newRank.name}`, player.id, 0xFDC43A, "bold");
            }
            
            // 5. Probar el comando rank
            setTimeout(() => {
                room.sendAnnouncement("🔄 Verificando comando !rank...", player.id, 0x00FF00);
                commands.rank(player);
            }, 1000);
            
            // 6. Probar actualización en !me
            setTimeout(() => {
                room.sendAnnouncement("🔄 Verificando comando !me...", player.id, 0x00FF00);
                commands.me(player);
            }, 2000);
        });
    })
    .catch(error => {
        console.error("Error en test-elo:", error);
        room.sendAnnouncement("❌ Error al testear ELO", player.id, 0xFF0000);
    });
    
    return false;
},

// Comando para resetear ELO a valor inicial (para testeo)
'reset-elo': (player) => {
    if (getRole(player) < Role.ADMIN_PERM) {
        room.sendAnnouncement("❌ Solo administradores pueden usar este comando", player.id, 0xFF0000);
        return false;
    }
    
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth", player.id, 0xFF0000);
        return false;
    }
    
    // Resetear a ELO inicial
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(userData => {
        if (!userData) {
            room.sendAnnouncement("❌ No estás registrado", player.id, 0xFF0000);
            return;
        }
        
        // Guardar ELO actual antes de resetear
        const oldElo = userData.elo || ELO_DEFAULT;
        
        // Resetear a ELO inicial
        userData.elo = ELO_DEFAULT;
        
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(userData)
        })
        .then(() => {
            // También actualizamos en localStorage
            const localStats = JSON.parse(localStorage.getItem(auth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
            localStats.elo = ELO_DEFAULT;
            localStorage.setItem(auth, JSON.stringify(localStats));
            
            room.sendAnnouncement(`✅ ELO reseteado: ${oldElo} → ${ELO_DEFAULT}`, player.id, 0x00FF00);
        });
    })
    .catch(error => {
        console.error("Error al resetear ELO:", error);
        room.sendAnnouncement("❌ Error al resetear ELO", player.id, 0xFF0000);
    });
    
    return false;
},

// Comando para simular subidas rápidas de ELO (para testear rangos)
'add-elo': (player, args) => {
    if (getRole(player) < Role.ADMIN_PERM) {
        room.sendAnnouncement("❌ Solo administradores pueden usar este comando", player.id, 0xFF0000);
        return false;
    }
    
    // Verificar argumentos
    const amount = parseInt(args[0]);
    if (isNaN(amount)) {
        room.sendAnnouncement("❌ Uso: !add-elo <cantidad>", player.id, 0xFF0000);
        return false;
    }
    
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth", player.id, 0xFF0000);
        return false;
    }
    
    // Agregar ELO
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(userData => {
        if (!userData) {
            room.sendAnnouncement("❌ No estás registrado", player.id, 0xFF0000);
            return;
        }
        
        // ELO actual
        const currentElo = userData.elo || ELO_DEFAULT;
        const currentRank = getEloRank(currentElo);
        
        // Nuevo ELO
        const newElo = currentElo + amount;
        userData.elo = newElo;
        
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(userData)
        })
        .then(() => {
            // También actualizamos en localStorage
            const localStats = JSON.parse(localStorage.getItem(auth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
            localStats.elo = newElo;
            localStorage.setItem(auth, JSON.stringify(localStats));
            
            const newRank = getEloRank(newElo);
            room.sendAnnouncement(`✅ ELO actualizado: ${currentElo} → ${newElo} (${amount > 0 ? '+' : ''}${amount})`, player.id, 0x00FF00);
            
            // Verificar si cambió de rango
            if (currentRank.name !== newRank.name) {
                room.sendAnnouncement(`¡Felicidades! Has ${amount > 0 ? 'subido' : 'bajado'} de rango: ${currentRank.icon} ${currentRank.name} → ${newRank.icon} ${newRank.name}`, player.id, 0xFDC43A, "bold");
            }
        });
    })
    .catch(error => {
        console.error("Error al agregar ELO:", error);
        room.sendAnnouncement("❌ Error al agregar ELO", player.id, 0xFF0000);
    });
    
    return false;
},
// Agregar aliases para el comando 'me'
'stats': (player) => {
    // Simplemente llamamos al comando 'me'
    commands.me(player);
    return false;
},

'yo': (player) => {
    // Simplemente llamamos al comando 'me'
    commands.me(player);
    return false;
},
    
    // Comando mejorado para testear todas las estadísticas
'test-stats': (player) => {
    if (getRole(player) < Role.ADMIN_PERM) {
        room.sendAnnouncement("❌ Solo administradores pueden usar este comando", player.id, 0xFF0000);
        return false;
    }
    
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth", player.id, 0xFF0000);
        return false;
    }
    
    // 1. Obtener estadísticas actuales
    room.sendAnnouncement("🔍 Obteniendo estadísticas actuales...", player.id, 0x00FF00);
    const localStatsBefore = JSON.parse(localStorage.getItem(auth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
    
    // Mostrar estadísticas actuales detalladas
    room.sendAnnouncement("📊 Estadísticas ANTES:", player.id, 0x00FF00, "bold");
    room.sendAnnouncement(`Partidos: ${localStatsBefore[Ss.GA] || 0}`, player.id, 0x00FF00);
    room.sendAnnouncement(`Victorias: ${localStatsBefore[Ss.WI] || 0}`, player.id, 0x00FF00);
    room.sendAnnouncement(`Derrotas: ${localStatsBefore[Ss.LS] || 0}`, player.id, 0x00FF00);
    room.sendAnnouncement(`Goles: ${localStatsBefore[Ss.GL] || 0}`, player.id, 0x00FF00);
    room.sendAnnouncement(`Asistencias: ${localStatsBefore[Ss.AS] || 0}`, player.id, 0x00FF00);
    room.sendAnnouncement(`Partidos de Arquero: ${localStatsBefore[Ss.GK] || 0}`, player.id, 0x00FF00);
    room.sendAnnouncement(`Vallas Invictas: ${localStatsBefore[Ss.CS] || 0}`, player.id, 0x00FF00);
    
    // 2. Actualizar cada estadística
    const updatedLocalStats = [...localStatsBefore];
    updatedLocalStats[Ss.GA] = (parseInt(updatedLocalStats[Ss.GA]) || 0) + 2; // +2 partidos jugados
    updatedLocalStats[Ss.WI] = (parseInt(updatedLocalStats[Ss.WI]) || 0) + 1; // +1 victoria
    updatedLocalStats[Ss.LS] = (parseInt(updatedLocalStats[Ss.LS]) || 0) + 1; // +1 derrota
    updatedLocalStats[Ss.GL] = (parseInt(updatedLocalStats[Ss.GL]) || 0) + 3; // +3 goles
    updatedLocalStats[Ss.AS] = (parseInt(updatedLocalStats[Ss.AS]) || 0) + 2; // +2 asistencias
    updatedLocalStats[Ss.GK] = (parseInt(updatedLocalStats[Ss.GK]) || 0) + 1; // +1 partido de arquero
    updatedLocalStats[Ss.CS] = (parseInt(updatedLocalStats[Ss.CS]) || 0) + 1; // +1 valla invicta
    
    // Recalcular porcentajes
    updatedLocalStats[Ss.WR] = ((updatedLocalStats[Ss.WI] / updatedLocalStats[Ss.GA]) * 100).toFixed(2);
    updatedLocalStats[Ss.CP] = ((updatedLocalStats[Ss.CS] / updatedLocalStats[Ss.GK]) * 100).toFixed(2);
    
    // Guardar en localStorage
    localStorage.setItem(auth, JSON.stringify(updatedLocalStats));
    room.sendAnnouncement("💾 Estadísticas actualizadas en localStorage", player.id, 0x00FF00);
    
    // 3. Actualizar en Firebase
    const statsToUpdate = {
        games: updatedLocalStats[Ss.GA],
        wins: updatedLocalStats[Ss.WI],
        losses: updatedLocalStats[Ss.LS],
        goals: updatedLocalStats[Ss.GL],
        assists: updatedLocalStats[Ss.AS],
        gk: updatedLocalStats[Ss.GK],
        cs: updatedLocalStats[Ss.CS]
    };
    
    // Llamamos a updatePlayerStats para guardar en Firebase
    updatePlayerStats(player, statsToUpdate);
    room.sendAnnouncement("🔄 Enviando estadísticas a Firebase...", player.id, 0x00FF00);
    
    // 4. Verificar después de 3 segundos
    setTimeout(() => {
        // Verificar localStorage
        const localStatsAfter = JSON.parse(localStorage.getItem(auth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
        room.sendAnnouncement("📊 Estadísticas DESPUÉS (localStorage):", player.id, 0x00FF00, "bold");
        room.sendAnnouncement(`Partidos: ${localStatsAfter[Ss.GA] || 0}`, player.id, 0x00FF00);
        room.sendAnnouncement(`Victorias: ${localStatsAfter[Ss.WI] || 0}`, player.id, 0x00FF00);
        room.sendAnnouncement(`Derrotas: ${localStatsAfter[Ss.LS] || 0}`, player.id, 0x00FF00);
        room.sendAnnouncement(`Goles: ${localStatsAfter[Ss.GL] || 0}`, player.id, 0x00FF00);
        room.sendAnnouncement(`Asistencias: ${localStatsAfter[Ss.AS] || 0}`, player.id, 0x00FF00);
        room.sendAnnouncement(`Partidos de Arquero: ${localStatsAfter[Ss.GK] || 0}`, player.id, 0x00FF00);
        room.sendAnnouncement(`Vallas Invictas: ${localStatsAfter[Ss.CS] || 0}`, player.id, 0x00FF00);
        
        // Verificar Firebase
        const url = `${FIREBASE_URL}/players/${auth}/stats.json?auth=${FIREBASE_API_KEY}`;
        fetch(url)
        .then(response => response.json())
        .then(firebaseStats => {
            if (firebaseStats) {
                room.sendAnnouncement("📊 Estadísticas DESPUÉS (Firebase):", player.id, 0x00FF00, "bold");
                room.sendAnnouncement(`Partidos: ${firebaseStats.games || 0}`, player.id, 0x00FF00);
                room.sendAnnouncement(`Victorias: ${firebaseStats.wins || 0}`, player.id, 0x00FF00);
                room.sendAnnouncement(`Derrotas: ${firebaseStats.losses || 0}`, player.id, 0x00FF00);
                room.sendAnnouncement(`Goles: ${firebaseStats.goals || 0}`, player.id, 0x00FF00);
                room.sendAnnouncement(`Asistencias: ${firebaseStats.assists || 0}`, player.id, 0x00FF00);
                room.sendAnnouncement(`Partidos de Arquero: ${firebaseStats.gk || 0}`, player.id, 0x00FF00);
                room.sendAnnouncement(`Vallas Invictas: ${firebaseStats.cs || 0}`, player.id, 0x00FF00);
                
                // Verificar si todas las estadísticas coinciden
                const coinciden = 
                    firebaseStats.games == localStatsAfter[Ss.GA] &&
                    firebaseStats.wins == localStatsAfter[Ss.WI] &&
                    firebaseStats.losses == localStatsAfter[Ss.LS] &&
                    firebaseStats.goals == localStatsAfter[Ss.GL] &&
                    firebaseStats.assists == localStatsAfter[Ss.AS] &&
                    firebaseStats.gk == localStatsAfter[Ss.GK] &&
                    firebaseStats.cs == localStatsAfter[Ss.CS];
                
                if (coinciden) {
                    room.sendAnnouncement("✅ ¡ÉXITO! Todas las estadísticas coinciden entre localStorage y Firebase", player.id, 0x00FF00, "bold");
                } else {
                    room.sendAnnouncement("⚠️ Algunas estadísticas no coinciden entre localStorage y Firebase", player.id, 0xFF0000, "bold");
                }
            } else {
                room.sendAnnouncement("❌ No se encontraron estadísticas en Firebase", player.id, 0xFF0000);
                room.sendAnnouncement("💡 Asegúrate de estar registrado con !register", player.id, 0x00FF00);
            }
        })
        .catch(error => {
            console.error("Error verificando Firebase:", error);
            room.sendAnnouncement("❌ Error al verificar Firebase", player.id, 0xFF0000);
        });
    }, 3000);
    
    return false;
},

        'mute': (player, args) => {
            const role = getRole(player);
            if (role < Role.ADMIN_PERM) {
                room.sendAnnouncement("❌ No tenés permisos para mutear jugadores.", player.id, 0xFF0000);
                return false;
            }

            if (!args[0] || !args[0].startsWith('#')) {
                room.sendAnnouncement("❌ Uso: !mute #ID <minutos>", player.id, 0xFF0000);
                return false;
            }

            const targetId = parseInt(args[0].substring(1));
            const minutes = parseInt(args[1]) || 5; // 5 minutos por defecto
            const target = room.getPlayer(targetId);

            if (!target) {
                room.sendAnnouncement("❌ Jugador no encontrado.", player.id, 0xFF0000);
                return false;
            }

            const until = Date.now() + (minutes * 60 * 1000);
            mutedPlayers.set(target.id, {
                name: target.name,
                auth: target.auth,
                until: until
            });

            room.sendAnnouncement(`🤐 ${player.name} muteó a ${target.name} por ${minutes} minutos.`, null, 0xFF4C4C);
            return false;
        },

        'ban': (player, args) => {
            const role = getRole(player);
            if (role < Role.ADMIN_PERM) {
                room.sendAnnouncement("❌ No tenés permisos para banear jugadores.", player.id, 0xFF0000);
                return false;
            }

            if (!args[0] || !args[0].startsWith('#')) {
                room.sendAnnouncement("❌ Uso: !ban #ID <minutos> <razón>", player.id, 0xFF0000);
                return false;
            }

            const targetId = parseInt(args[0].substring(1));
            const minutes = parseInt(args[1]) || 60; // 1 hora por defecto
            const reason = args.slice(2).join(' ') || "Sin razón especificada";
            const target = room.getPlayer(targetId);

            if (!target) {
                room.sendAnnouncement("❌ Jugador no encontrado.", player.id, 0xFF0000);
                return false;
            }

            const until = Date.now() + (minutes * 60 * 1000);
            bannedPlayers.set(target.auth, {
                name: target.name,
                until: until,
                reason: reason
            });

            room.kickPlayer(target.id, `Baneado por ${minutes} minutos. Razón: ${reason}`, true);
            room.sendAnnouncement(`🔨 ${player.name} baneó a ${target.name} por ${minutes} minutos. Razón: ${reason}`, null, 0xFF4C4C);
            return false;
        },

        'kick': (player, args) => {
            const role = getRole(player);
            if (role < Role.ADMIN_PERM) {
                room.sendAnnouncement("❌ No tenés permisos para kickear jugadores.", player.id, 0xFF0000);
                return false;
            }

            if (!args[0] || !args[0].startsWith('#')) {
                room.sendAnnouncement("❌ Uso: !kick #ID <razón>", player.id, 0xFF0000);
                return false;
            }

            const targetId = parseInt(args[0].substring(1));
            const reason = args.slice(1).join(' ') || "Sin razón especificada";
            const target = room.getPlayer(targetId);

            if (!target) {
                room.sendAnnouncement("❌ Jugador no encontrado.", player.id, 0xFF0000);
                return false;
            }

            room.kickPlayer(target.id, reason, false);
            room.sendAnnouncement(`👢 ${player.name} kickeó a ${target.name}. Razón: ${reason}`, null, 0xFF4C4C);
            return false;
        },

        'muteados': (player) => {
            const role = getRole(player);
            if (role < Role.ADMIN_PERM) {
                room.sendAnnouncement("❌ No tenés permisos para ver la lista de muteados.", player.id, 0xFF0000);
                return false;
            }

            if (mutedPlayers.size === 0) {
                room.sendAnnouncement("📝 No hay jugadores muteados.", player.id, 0x00FF00);
                return false;
            }

            room.sendAnnouncement("📝 Lista de jugadores muteados:", player.id, 0xFDC43A, "bold");
            mutedPlayers.forEach((data, id) => {
                const timeLeft = Math.ceil((data.until - Date.now()) / 60000);
                if (timeLeft > 0) {
                    room.sendAnnouncement(`ID: ${id} | ${data.name} | ${timeLeft} minutos restantes`, player.id, 0xFDC43A);
                } else {
                    mutedPlayers.delete(id);
                }
            });
            return false;
        },

        'baneados': (player) => {
            const role = getRole(player);
            if (role < Role.ADMIN_PERM) {
                room.sendAnnouncement("❌ No tenés permisos para ver la lista de baneados.", player.id, 0xFF0000);
                return false;
            }

            if (bannedPlayers.size === 0) {
                room.sendAnnouncement("📝 No hay jugadores baneados.", player.id, 0x00FF00);
                return false;
            }

            room.sendAnnouncement("📝 Lista de jugadores baneados:", player.id, 0xFDC43A, "bold");
            bannedPlayers.forEach((data, auth) => {
                const timeLeft = Math.ceil((data.until - Date.now()) / 60000);
                if (timeLeft > 0) {
                    room.sendAnnouncement(`Auth: ${auth} | ${data.name} | ${timeLeft} minutos restantes | Razón: ${data.reason}`, player.id, 0xFDC43A);
                } else {
                    bannedPlayers.delete(auth);
                }
            });
            return false;
        },

        'unmute': (player, args) => {
            const role = getRole(player);
            if (role < Role.ADMIN_PERM) {
                room.sendAnnouncement("❌ No tenés permisos para desmutear jugadores.", player.id, 0xFF0000);
                return false;
            }

            if (!args[0] || !args[0].startsWith('#')) {
                room.sendAnnouncement("❌ Uso: !unmute #ID", player.id, 0xFF0000);
                return false;
            }

            const targetId = parseInt(args[0].substring(1));
            if (mutedPlayers.has(targetId)) {
                const playerName = mutedPlayers.get(targetId).name;
                mutedPlayers.delete(targetId);
                room.sendAnnouncement(`🔊 ${player.name} desmuteó a ${playerName}`, null, 0x00FF00);
            } else {
                room.sendAnnouncement("❌ Jugador no encontrado en la lista de muteados.", player.id, 0xFF0000);
            }
            return false;
        },

        'unban': (player, args) => {
            const role = getRole(player);
            if (role < Role.ADMIN_PERM) {
                room.sendAnnouncement("❌ No tenés permisos para desbanear jugadores.", player.id, 0xFF0000);
                return false;
            }

            if (!args[0]) {
                room.sendAnnouncement("❌ Uso: !unban <auth>", player.id, 0xFF0000);
                return false;
            }

            const auth = args[0];
            if (bannedPlayers.has(auth)) {
                const playerName = bannedPlayers.get(auth).name;
                bannedPlayers.delete(auth);
                room.sendAnnouncement(`🔓 ${player.name} desbaneó a ${playerName}`, null, 0x00FF00);
            } else {
                room.sendAnnouncement("❌ Jugador no encontrado en la lista de baneados.", player.id, 0xFF0000);
            }
            return false;
        },

        'spy': (player) => {
            const role = getRole(player);
            if (role >= Role.ADMIN_PERM) {
                if (spyingAdmins.has(player.id)) {
                    spyingAdmins.delete(player.id);
                    room.sendAnnouncement("🕵️ Modo espía desactivado", player.id, 0xFF4C4C, "bold");
                } else {
                    spyingAdmins.add(player.id);
                    room.sendAnnouncement("🕵️ Modo espía activado. Ahora podés ver todos los mensajes", player.id, 0x00FF00, "bold");
                }
            } else {
                room.sendAnnouncement("❌ No tenés permisos para usar este comando", player.id, 0xFF0000);
            }
            return false;
        },

        'login': (player, args) => {
            if (args.length < 1) {
                room.sendAnnouncement("❌ Uso: !login <contraseña>", player.id, 0xFF0000);
                return false;
            }
            loginUser(player, args[0]);
            return false;
        },

    'loginadm': (player, args) => {
            const auth = getAuth(player);
            if (!auth) {
                room.sendAnnouncement("❌ No se detectó tu auth. Reconectate a la sala.", player.id, 0xFF0000);
                return false;
            }

            if (args.length < 2) {
                room.sendAnnouncement("❌ Uso: !loginadm <rol> <contraseña>", player.id, 0xFF0000);
                return false;
            }

            const targetRole = args[0].toUpperCase();
            const password = args[1];

            if (!Role.hasOwnProperty(targetRole)) {
                room.sendAnnouncement("❌ Rol inválido", player.id, 0xFF0000);
                return false;
            }

            const roleValue = Role[targetRole];
            
            if (rolePasswords[roleValue] === password) {
                const url = `${FIREBASE_URL}/admins/${auth}.json?auth=${FIREBASE_API_KEY}`;
                fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify({
                        name: player.name,
                        role: roleValue,
                        password: password,
                        registeredDate: Date.now()
                    })
                })
                .then(() => {
                    // Actualizar el rol localmente
                    playerRoles.set(auth, roleValue);
                    
                    // Debug para verificar
                    console.log(`Rol asignado en loginadm: ${getRoleName(roleValue)}`);
                    console.log(`Rol en Map después de asignar: ${playerRoles.get(auth)}`);
                    
                    // Aplicar el rol
                    if (!setPlayerRole(player, roleValue)) {
                        throw new Error("Error al asignar el rol");
                    }
                    
                    room.sendAnnouncement(`✅ ¡Registro exitoso como ${getRoleName(roleValue)}!`, player.id, 0x00FF00, "bold");
                    
                    if (roleValue === Role.MASTER) {
                        room.setPlayerAdmin(player.id, true);
                    }
                    
                    // Verificar que el rol se asignó correctamente
                    const currentRole = getRole(player);
                    room.sendAnnouncement(`Debug - Rol actual: ${getRoleName(currentRole)}`, player.id, 0xFFFF00);
                })
                .catch(error => {
                    console.error("Error:", error);
                    room.sendAnnouncement("❌ Error al registrar", player.id, 0xFF0000);
                });
            } else {
                room.sendAnnouncement("❌ Contraseña incorrecta", player.id, 0xFF0000);
            }
            return false;
        },

        'admins': (player) => {
            const role = getRole(player);
            if (role < Role.MASTER) {
                room.sendAnnouncement("❌ No tenés permisos para ver la lista de admins", player.id, 0xFF0000);
                return false;
            }

            const adminsRef = firebase.database().ref('admins');
            adminsRef.once('value')
            .then(snapshot => {
                if (!snapshot.exists()) {
                    room.sendAnnouncement("No hay admins registrados", player.id, 0xFFD700);
                    return;
                }

                room.sendAnnouncement("📝 Lista de Admins Registrados:", player.id, 0xFFD700, "bold");
                snapshot.forEach(childSnapshot => {
                    const auth = childSnapshot.key;
                    const adminData = childSnapshot.val();
                    const date = new Date(adminData.registeredDate).toLocaleDateString();
                    room.sendAnnouncement(`${getRoleName(adminData.role)} | ${adminData.name} | Auth: ${auth} | Registrado: ${date}`, 
                        player.id, 0xFFD700);
                });
            })
            .catch(error => {
                console.error("Error obteniendo lista de admins:", error);
                room.sendAnnouncement("❌ Error al obtener la lista de admins", player.id, 0xFF0000);
            });
            
            return false;
        },

        'removeadmin': (player, args) => {
            const role = getRole(player);
            if (role < Role.MASTER) {
                room.sendAnnouncement("❌ No tenés permisos para remover admins", player.id, 0xFF0000);
                return false;
            }

            if (!args[0]) {
                room.sendAnnouncement("❌ Uso: !removeadmin <auth>", player.id, 0xFF0000);
                return false;
            }

            const targetAuth = args[0];
            const adminRef = firebase.database().ref(`admins/${targetAuth}`);

            adminRef.once('value')
            .then(snapshot => {
                if (!snapshot.exists()) {
                    room.sendAnnouncement("❌ No se encontró ningún admin con ese auth", player.id, 0xFF0000);
                    return;
                }

                const adminData = snapshot.val();
                adminRef.remove()
                .then(() => {
                    room.sendAnnouncement(`✅ Admin removido: ${adminData.name} (${getRoleName(adminData.role)})`, player.id, 0x00FF00);
                    
                    // Si el admin está en la sala, actualizar su rol
                    const targetPlayer = room.getPlayerList().find(p => p.auth === targetAuth);
                    if (targetPlayer) {
                        setPlayerRole(targetPlayer, Role.PLAYER);
                        room.sendAnnouncement("❌ Tu rol de admin ha sido removido", targetPlayer.id, 0xFF0000);
                    }
                });
            })
            .catch(error => {
                console.error("Error removiendo admin:", error);
                room.sendAnnouncement("❌ Error al remover admin", player.id, 0xFF0000);
            });
            
            return false;
        },

        'auth': (player) => {
            const role = getRole(player);
            if (role >= Role.MASTER) {
                room.sendAnnouncement(`Auth de ${player.name}: ${player.auth}`, player.id, 0x00FF00);
            } else {
                room.sendAnnouncement("❌ No tenés permisos para ver tu auth", player.id, 0xFF0000);
            }
            return false;
        },

        'admin': (player) => {
            const role = getRole(player);
            if (role >= Role.OWNER) {
                if (player.admin) {
                    room.setPlayerAdmin(player.id, false);
                    room.sendAnnouncement(`🔒 Admin removido de ${player.name}`, null, 0xFF0000);
                } else {
                    room.setPlayerAdmin(player.id, true);
                    room.sendAnnouncement(`🔓 Admin dado a ${player.name}`, null, 0x00FF00);
                }
            } else {
                room.sendAnnouncement("❌ No tenés permiso para usar este comando", player.id, 0xFF0000);
            }
            return false;
        },

        'role': (player) => {
            const roleData = playerRoles.get(player.auth);
            if (roleData) {
                const roleName = getRoleName(roleData.role);
                room.sendAnnouncement(`👤 Tu rol actual es: ${roleName}`, player.id, 0xFFD700);
                room.sendAnnouncement(`📅 Asignado el: ${new Date(roleData.assignedAt).toLocaleString()}`, player.id, 0xFFD700);
            } else {
                room.sendAnnouncement(`❌ No tenés un rol asignado`, player.id, 0xFF0000);
            }
            return false;
        },


        'goats': (player) => {
            const players = getTopPlayers();
            
            // Ordenamos por goles, asistencias y vallas invictas
            const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 3);
            const topAssists = [...players].sort((a, b) => b.assists - a.assists).slice(0, 3);
            const topKeepers = [...players].sort((a, b) => b.cs - a.cs).slice(0, 3);

            room.sendAnnouncement("👑 SALÓN DE LA FAMA - GOATS:", player.id, 0xFDC43A, "bold");
            
            // Mostramos los goleadores
            room.sendAnnouncement("⚽ TOP GOLEADORES:", player.id, 0xFDC43A, "bold");
            topScorers.forEach((p, i) => {
                const medals = ["🥇", "🥈", "🥉"];
                room.sendAnnouncement(`${medals[i]} ${p.name} - ${p.goals} goles`, player.id, 0xFDC43A);
            });

            // Mostramos los asistidores
            room.sendAnnouncement("👟 TOP ASISTENCIAS:", player.id, 0xFDC43A, "bold");
            topAssists.forEach((p, i) => {
                const medals = ["🥇", "🥈", "🥉"];
                room.sendAnnouncement(`${medals[i]} ${p.name} - ${p.assists} asistencias`, player.id, 0xFDC43A);
            });

            // Mostramos los porteros
            room.sendAnnouncement("🧤 TOP VALLAS INVICTAS:", player.id, 0xFDC43A, "bold");
            topKeepers.forEach((p, i) => {
                const medals = ["🥇", "🥈", "🥉"];
                room.sendAnnouncement(`${medals[i]} ${p.name} - ${p.cs} vallas invictas`, player.id, 0xFDC43A);
            });

            return false;
        },
'ranking': (player) => {
    // Simplemente llamamos al comando 'goats'
    commands.goats(player);
    return false;
},


// Modificar el comando 'showme' para NO mostrar el código de recuperación a todos

'showme': (player) => {
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth", player.id, 0xFF0000);
        return false;
    }
    
    // Sincronizamos primero
    syncPlayerStats(player);
    
    // Mostramos las estadísticas desde localStorage (sin código)
    let stats = JSON.parse(localStorage.getItem(auth)) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
    
    // Calculamos valores seguros para evitar NaN o undefined
    const games = stats[Ss.GA] || 0;
    const wins = stats[Ss.WI] || 0;
    const losses = stats[Ss.LS] || 0;
    const winRate = games > 0 ? ((wins / games) * 100).toFixed(2) : "0.00";
    
    const goalkeeperGames = stats[Ss.GK] || 0;
    const cleanSheets = stats[Ss.CS] || 0;
    
    // Número de veces MVP (figura del partido)
    const mvps = stats.mvps || 0;
    
    // Mostramos estadísticas para todos
    room.sendAnnouncement(`[📄] Estadísticas de ${player.name}:`, null, 0x73EC59, "bold");
    room.sendAnnouncement(`🎮 Partidos: ${games} | ✅ Victorias: ${wins} | ❌ Derrotas: ${losses} | WR: ${winRate}%`, null, 0x73EC59);
    room.sendAnnouncement(`⚽️ Goles: ${stats[Ss.GL] || 0} | 👟 Asistencias: ${stats[Ss.AS] || 0}`, null, 0x73EC59);
    
    // Solo mostrar stats de arquero si jugó como arquero
    if (goalkeeperGames > 0) {
        room.sendAnnouncement(`🧤 Partidos de arquero: ${goalkeeperGames} | 🥅 Vallas invictas: ${cleanSheets}`, null, 0x73EC59);
    }
    
    room.sendAnnouncement(`🌟 Veces MVP: ${mvps}`, null, 0x73EC59);
    
    // Intentar mostrar rango ELO si está disponible
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(userData => {
        if (userData && userData.elo) {
            const playerElo = userData.elo;
            const rank = getEloRank(playerElo);
            room.sendAnnouncement(`🏆 Rango: ${rank.icon} ${rank.name} (ELO: ${playerElo})`, null, 0x73EC59);
            
            // Mostrar récord de vallas invictas consecutivas si existe
            if (userData.stats && userData.stats.maxConsecutiveCS !== undefined) {
                room.sendAnnouncement(`🏆 Récord de vallas invictas consecutivas: ${userData.stats.maxConsecutiveCS}`, null, 0x73EC59);
            }
        }
    })
    .catch(error => {
        console.error("Error obteniendo ELO:", error);
    });
    
    return false;
},

        'bra': (player) => {
            if (player.team == Team.RED && player.id == teamR[0].id) {
                CaptainChoice = "!bra";
                room.setTeamColors(Team.RED, 0, 0x3347B3, [0x018434, 0xf8de2e, 0xf8de2e]);
                room.sendAnnouncement(`El capitán del equipo rojo, ${player.name}, eligió el uniforme [Brasil]!`, null, 0x30F55F, "bold");
            }
            else if (player.team == Team.BLUE && player.id == teamB[0].id) {
                CaptainChoice = "!bra";
                room.setTeamColors(Team.BLUE, 0, 0x3347B3, [0x018434, 0xF8DE2E, 0xF8DE2E]);
                room.sendAnnouncement(`El capitán del equipo azul, ${player.name}, eligió el uniforme [Brasil]!`, null, 0x30F55F, "bold");
            }
            return false;
        },

        'ger': (player) => {
            if (player.team == Team.RED && player.id == teamR[0].id) {
                CaptainChoice = "!ale";
                room.setTeamColors(Team.RED, 90, 0xFFFFFF, [0x121003, 0xC70000, 0xF5C600]);
                room.sendAnnouncement(`El capitán del equipo rojo, ${player.name}, eligió el uniforme [Alemania]!`, null, 0x30F55F, "bold");
            }
            else if (player.team == Team.BLUE && player.id == teamB[0].id) {
                CaptainChoice = "!ale";
                room.setTeamColors(Team.BLUE, 90, 0xFFFFFF, [0x121003, 0xC70000, 0xF5C600]);
                room.sendAnnouncement(`El capitán del equipo azul, ${player.name}, eligió el uniforme [Alemania]!`, null, 0x30F55F, "bold");
            }
            return false;
        },
       'nv': (player) => {
    room.kickPlayer(player.id, 'Nos vemos!', false);
    return false;
},
'bye': (player) => {
    room.kickPlayer(player.id, 'Nos vemos!', false);
    return false;
},
'bb': (player) => {
    room.kickPlayer(player.id, 'Nos vemos!', false);
    return false;
},
'ranks': (player) => {
    room.sendAnnouncement("🏆 RANGOS POR ELO:", player.id, 0xFDC43A, "bold");
    
    // Mostrar todos los rangos disponibles
    ELO_RANKS.forEach(rank => {
        room.sendAnnouncement(`${rank.icon} ${rank.name} (${rank.min}-${rank.max})`, player.id, 0xFDC43A);
    });
    
    return false;
},

'elo': (player) => {
    return 'ranks';
},

'rank': (player) => {
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth", player.id, 0xFF0000);
        return false;
    }
    
    // Intentar obtener ELO de Firebase
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(userData => {
        if (!userData) {
            room.sendAnnouncement("❌ No estás registrado. Registrate con !register", player.id, 0xFF0000);
            return;
        }
        
        const playerElo = userData.elo || ELO_DEFAULT;
        const rank = getEloRank(playerElo);
        
        room.sendAnnouncement(`🏆 Tu rango actual: ${rank.icon} ${rank.name}`, player.id, 0xFDC43A, "bold");
        room.sendAnnouncement(`📊 ELO: ${playerElo}`, player.id, 0xFDC43A);
        
        // Calcular puntos para siguiente rango
        if (rank !== ELO_RANKS[ELO_RANKS.length - 1]) {
            const nextRank = ELO_RANKS[ELO_RANKS.indexOf(rank) + 1];
            const pointsNeeded = nextRank.min - playerElo;
            room.sendAnnouncement(`🔼 Necesitás ${pointsNeeded} puntos más para subir a ${nextRank.icon} ${nextRank.name}`, player.id, 0xFDC43A);
        } else {
            room.sendAnnouncement("👑 ¡Ya alcanzaste el rango máximo! ¡Felicidades!", player.id, 0xFDC43A, "bold");
        }
    })
    .catch(error => {
        console.error("Error obteniendo rank:", error);
        room.sendAnnouncement("❌ Error al obtener tu rango", player.id, 0xFF0000);
    });
    
    return false;
},

'top': (player) => {
    // Obtener lista de todos los jugadores
    const url = `${FIREBASE_URL}/players.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(allPlayers => {
        if (!allPlayers) {
            room.sendAnnouncement("❌ No hay jugadores registrados", player.id, 0xFF0000);
            return;
        }
        
        // Crear array para ordenar
        const players = [];
        Object.keys(allPlayers).forEach(auth => {
            if (allPlayers[auth].elo) {
                players.push({
                    name: allPlayers[auth].name,
                    elo: allPlayers[auth].elo
                });
            }
        });
        
        // Ordenar por ELO (mayor a menor)
        players.sort((a, b) => b.elo - a.elo);
        
        // Mostrar los 10 mejores
        room.sendAnnouncement("🏆 TOP 10 JUGADORES:", player.id, 0xFDC43A, "bold");
        
        for (let i = 0; i < Math.min(10, players.length); i++) {
            const rank = getEloRank(players[i].elo);
            room.sendAnnouncement(`${i+1}. ${players[i].name} - ${players[i].elo} puntos ${rank.icon}`, player.id, 0xFDC43A);
        }
        
        // Si el jugador no está en el top 10, mostrar su posición
        const auth = getAuth(player);
        if (auth && allPlayers[auth] && allPlayers[auth].elo) {
            const playerIndex = players.findIndex(p => p.name === player.name);
            
            if (playerIndex >= 10) {
                room.sendAnnouncement(`Tu posición: #${playerIndex + 1} (${allPlayers[auth].elo} puntos)`, player.id, 0xFDC43A);
            }
        }
    })
    .catch(error => {
        console.error("Error obteniendo top:", error);
        room.sendAnnouncement("❌ Error al obtener el ranking", player.id, 0xFF0000);
    });
    
    return false;
},

'goats': (player) => {
    // Redirigir al comando top
    commands.top(player);
    return false;
},
'test-player': (player) => {
    if (getRole(player) < Role.OWNER) {
        room.sendAnnouncement("❌ Solo el OWNER puede usar este comando", player.id, 0xFF0000);
        return false;
    }
    
    // Guardar el rol actual
    const auth = getAuth(player);
    const currentRole = getRole(player);
    player._savedRole = currentRole; // Guardamos temporalmente
    
    // Cambiar a jugador normal temporalmente
    playerRoles.set(auth, Role.PLAYER);
    room.sendAnnouncement("👤 Ahora sos un jugador normal temporalmente (para pruebas)", player.id, 0x00FF00);
    room.sendAnnouncement("⚠️ Usá !restore-role para volver a ser admin", player.id, 0xFF7900, "bold");
    
    // Actualizar el nombre con el prefijo de ELO
    updatePlayerName(player);
    
    return false;
},

'restore-role': (player) => {
    const auth = getAuth(player);
    
    // Restaurar rol original
    if (player._savedRole) {
        playerRoles.set(auth, player._savedRole);
        room.sendAnnouncement(`👑 Rol restaurado: ${getRoleName(player._savedRole)}`, player.id, 0x00FF00);
        delete player._savedRole;
        
        // Actualizar el nombre
        updatePlayerName(player);
    } else {
        room.sendAnnouncement("❌ No tenés un rol guardado para restaurar", player.id, 0xFF0000);
    }
    
    return false;
},

   'help': (player) => {
    // Título
    room.sendAnnouncement("━━━━━━━━━━ 📋 COMANDOS DISPONIBLES 📋 ━━━━━━━━━━", player.id, 0x5EE7FF, "bold");
    
    // Comandos básicos
    room.sendAnnouncement("🔰 BÁSICOS:", player.id, 0x30F55F, "bold");
    room.sendAnnouncement("!register <contraseña> - Registrar cuenta", player.id, 0x30F55F);
    room.sendAnnouncement("!login <contraseña> - Iniciar sesión", player.id, 0x30F55F);
    room.sendAnnouncement("!recover <código> - Recuperar cuenta", player.id, 0x30F55F);
    
    // Comandos de equipo
    room.sendAnnouncement("🏆 PARTIDO:", player.id, 0xFDC43A, "bold");
    room.sendAnnouncement("!bb / !bye / !nv - Despedirse y salir", player.id, 0xFDC43A);
    room.sendAnnouncement("t <mensaje> - Chat de equipo", player.id, 0xFDC43A);
    room.sendAnnouncement("!camisetas - Ver opciones de uniformes", player.id, 0xFDC43A);
    room.sendAnnouncement("!rr - Pedir reinicio", player.id, 0xFDC43A);
    
    // Comandos de estadísticas
    room.sendAnnouncement("📊 ESTADÍSTICAS:", player.id, 0x73EC59, "bold");
    room.sendAnnouncement("!me / !stats / !yo - Ver mis estadísticas", player.id, 0x73EC59);
    room.sendAnnouncement("!showme - Mostrar estadísticas a todos", player.id, 0x73EC59);
    room.sendAnnouncement("!rank - Ver mi rango actual", player.id, 0x73EC59);
    room.sendAnnouncement("!top / !ranking - Ver mejores jugadores", player.id, 0x73EC59);
    room.sendAnnouncement("!ranks - Ver todos los rangos disponibles", player.id, 0x73EC59);
    
    // Comandos de administración (solo para admins)
    if (getRole(player) >= Role.ADMIN_PERM) {
        room.sendAnnouncement("🛡️ MODERACIÓN:", player.id, 0xFF7900, "bold");
        room.sendAnnouncement("!mute #<id> <minutos> - Silenciar jugador", player.id, 0xFF7900);
        room.sendAnnouncement("!unmute #<id> - Quitar silencio", player.id, 0xFF7900);
        room.sendAnnouncement("!kick #<id> <razón> - Expulsar jugador", player.id, 0xFF7900);
        room.sendAnnouncement("!ban #<id> <minutos> <razón> - Banear jugador", player.id, 0xFF7900);
        room.sendAnnouncement("!unban <auth> - Quitar ban", player.id, 0xFF7900);
        room.sendAnnouncement("!spy - Ver todos los mensajes", player.id, 0xFF7900);
        room.sendAnnouncement("!muteados / !baneados - Ver listas", player.id, 0xFF7900);
    }
    
    // Comandos de prueba del sistema ELO (solo para admins)
    if (getRole(player) >= Role.ADMIN_PERM) {
        room.sendAnnouncement("🏆 SISTEMA ELO:", player.id, 0xD4AF37, "bold");
        room.sendAnnouncement("!test-elo - Probar cálculo de ELO", player.id, 0xD4AF37);
        room.sendAnnouncement("!add-elo <cantidad> - Agregar/restar ELO", player.id, 0xD4AF37);
        room.sendAnnouncement("!reset-elo - Resetear ELO a inicial", player.id, 0xD4AF37);
        room.sendAnnouncement("!test-stats - Probar guardar estadísticas", player.id, 0xD4AF37);
        room.sendAnnouncement("!update-names - Actualizar prefijos", player.id, 0xD4AF37);
    }
    
    // Comandos exclusivos de owner
    if (getRole(player) >= Role.OWNER) {
        room.sendAnnouncement("👑 OWNER:", player.id, 0xFFD700, "bold");
        room.sendAnnouncement("!reset-season - Iniciar reinicio de temporada", player.id, 0xFFD700);
        room.sendAnnouncement("!confirm-reset - Confirmar reinicio", player.id, 0xFFD700);
        room.sendAnnouncement("!removeadmin <auth> - Quitar admin", player.id, 0xFFD700);
        room.sendAnnouncement("!loginadm <rol> <contraseña> - Registrar admin", player.id, 0xFFD700);
    }
    
    room.sendAnnouncement("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", player.id, 0x5EE7FF, "bold");
    return false;
}
    };


    /* EVENTS */

    /* PLAYER MOVEMENT */

  // 3. Ahora reemplazamos tu onPlayerJoin completo
    room.onPlayerJoin = function(player) {
        console.log("---------------------------------------------------");
        console.log("[📢] Nick: " + player.name);
        console.log("[📢] Conn: " + player.conn);
        console.log("[📢] Auth: " + player.auth);
        extendedP.push([player.id, player.auth, player.conn, false, 0, 0, false]);
        updateRoleOnPlayerIn();
        updateTeams();
        balanceTeams();
        // Verificar si el jugador está baneado
        if (bannedPlayers.has(getAuth(player))) {
            const banData = bannedPlayers.get(getAuth(player));
            const timeLeft = Math.ceil((banData.until - Date.now()) / 60000);
            
            if (timeLeft > 0) {
                room.kickPlayer(player.id, `Todavía estás baneado por ${timeLeft} minutos. Razón: ${banData.reason}`, true);
                return;
            } else {
                bannedPlayers.delete(getAuth(player));
            }
        }
    
        // Verificar admin en Firebase primero
        const auth = getAuth(player);
        if (auth) {
            const url = `${FIREBASE_URL}/admins/${auth}.json?auth=${FIREBASE_API_KEY}`;
            fetch(url)
            .then(response => response.json())
            .then(adminData => {
                if (adminData && adminData.role) {
                    // Guardar el rol en el Map local
                    playerRoles.set(auth, adminData.role);
                    
                    // Aplicar el rol
                    setPlayerRole(player, adminData.role);
                    
                    // Mensajes personalizados según el rol
                    let welcomeMessage = "";
                    let color = 0xFFD700;
                    
                    switch (adminData.role) {
                        case Role.MASTER:
                            welcomeMessage = `👑 ¡Bienvenido de nuevo MASTER ${player.name}!`;
                            room.setPlayerAdmin(player.id, true);
                            break;
                        case Role.OWNER:
                            welcomeMessage = `👑 ¡Bienvenido de nuevo OWNER ${player.name}!`;
                            break;
                        case Role.CO_OWNER:
                            welcomeMessage = `⭐ ¡Bienvenido de nuevo CO-OWNER ${player.name}!`;
                            break;
                        case Role.SUPERADMIN:
                            welcomeMessage = `🔰 ¡Bienvenido de nuevo SUPERADMIN ${player.name}!`;
                            break;
                        case Role.ADMIN_PERM:
                            welcomeMessage = `🛡️ ¡Bienvenido de nuevo ADMIN ${player.name}!`;
                            break;
                    }
                    
                    if (welcomeMessage) {
                        room.sendAnnouncement(welcomeMessage, player.id, color, "bold");
                        room.sendAnnouncement("✅ Login automático completado", player.id, 0x00FF00, "bold");
                    }
    
                    // Verificar stats del jugador después
                    return fetch(`${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`);
                } else {
                    // Si no es admin, verificar si es jugador registrado
                    return fetch(`${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`);
                }
            })
            .then(response => response.json())
            .then(userData => {
                if (userData) {
                    room.sendAnnouncement("✅ ¡Bienvenido de vuelta, " + player.name + "!", player.id, 0x00FF00);
                } else {
                    room.sendAnnouncement("👋 ¡Bienvenido! Usá !register <contraseña> para registrarte", player.id, 0xFF7B00);
                }
            })
            .catch(error => {
                console.error("Error en login automático:", error);
                room.sendAnnouncement("❌ Error en el login automático", player.id, 0xFF0000);
            });
        }
    

        room.sendAnnouncement("👋🏼 Bienvenido " + player.name + ", jugá como un chad.", null, 0x5EE7FF, "bold");
        if (room.getPlayerList().length > 1 && room.getPlayerList().length < 5) {
            room.sendAnnouncement("Loading the stadium...", player.id, 0xEDC021, "bold");
            setTimeout(() => {
                room.sendAnnouncement(" ---------------------------------------------------", player.id, 0xEDC021, "bold");
                room.sendAnnouncement("LA SALA ESTÁ SUJETA A CAMBIOS, PROYECTO EN PROGRESO...", player.id, 0xEDC021, "bold");
                room.sendAnnouncement(" ---------------------------------------------------", player.id, 0xEDC021, "bold");
            }, 2_000);
        }
        if (localStorage.getItem(player.auth) != null) {
            var playerRole = JSON.parse(localStorage.getItem(player.auth))[Ss.RL];
            if (playerRole == "admin" || playerRole == "master") {
                room.setPlayerAdmin(player.id, true);
                room.sendAnnouncement("「Admin」" + player.name + " bienvenido de nuevo!", null, 0xFF7900, "bold");
            }
        }
        if (localStorage.getItem(getAuth(player)) == null) {
            stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", player.name]
            localStorage.setItem(getAuth(player), JSON.stringify(stats));
        }
    //    setTimeout(() => {
    //        if (registro.get(player.name)) room.sendAnnouncement('Login: !login senha', player.id, 0x1B9124, "bold");
    //       else room.sendAnnouncement('Registrar: !register senha', player.id, 0x1B9124, "bold");
    //        room.sendAnnouncement('Login: !login senha', player.id, 0x1B9124, "bold");
    //    }, 2_000);


    
    fetch(`${FIREBASE_URL}/users/${player.auth}.json?auth=${FIREBASE_API_KEY}`)
    .then(response => response.json())
    .then(userData => {
        if (userData) {
            room.sendAnnouncement('👋 ¡Bienvenido de vuelta! Usá !login <contraseña> para iniciar sesión', player.id, 0x1B9124, "bold");
        } else {
            room.sendAnnouncement('📝 ¡Nuevo jugador! Usá !register <contraseña> para registrarte', player.id, 0x1B9124, "bold");
        }
    })
    .catch(error => {
        room.sendAnnouncement("⚠️ Error verificando usuario: " + error.message, player.id, 0xFF0000);
    });

    // Intentar login automático
    fetch(`${FIREBASE_URL}/users/${player.auth}.json?auth=${FIREBASE_API_KEY}`)
    .then(response => response.json())
    .then(userData => {
        if (userData) {
            // Si encontramos el usuario, intentamos login automático
            fetch(`${FIREBASE_URL}/users.json?auth=${FIREBASE_API_KEY}`)
            .then(response => response.json())
            .then(allUsers => {
                const existingUser = Object.entries(allUsers).find(([_, user]) => 
                    user.auth === player.auth
                );

                if (existingUser) {
                    const [_, userData] = existingUser;
                    completeLogin(player, userData);
                } else {
                    room.sendAnnouncement('👋 ¡Bienvenido de vuelta! Usá !login <contraseña> para iniciar sesión', player.id, 0x1B9124, "bold");
                }
            });
        } else {
        }
    })
    .catch(error => {
        room.sendAnnouncement("⚠️ Error verificando usuario: " + error.message, player.id, 0xFF0000);

        // Sincronizamos las estadísticas
    setTimeout(() => syncPlayerStats(player), 2000); // Esperamos 2 segundos para asegurarnos que se cargue todo
    });

       // Sincronizamos las estadísticas
       setTimeout(() => {
        syncPlayerStats(player);
        
   // Con esto:
        setTimeout(() => {
    try {
        // Intentar actualizar nombre, pero no preocuparse si falla
        if (typeof updatePlayerName === 'function') {
            updatePlayerName(player);
        }
    } catch (e) {
        console.error("No se pudo actualizar el nombre:", e);
    }
        }, 1000);
    }, 2000);

    }


    room.onPlayerTeamChange = function (changedPlayer, byPlayer) {
        // Protección contra null
        const byPlayerId = byPlayer ? byPlayer.id : null;
        
        // Log para depuración
        console.log(`Cambio de equipo: ${changedPlayer.name} (${changedPlayer.id}) - Movido por: ${byPlayer ? byPlayer.name : 'Sistema/Null'} (${byPlayerId})`);
        
        if (changedPlayer.id == 0) {
            room.setPlayerTeam(0, Team.SPECTATORS);
            return;
        }
        
        if (getAFK(changedPlayer) && changedPlayer.team != Team.SPECTATORS) {
            room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS);
            room.sendChat(changedPlayer.name + ' is AFK !');
            return;
        }
        
        updateTeams();
        
        if (room.getScores() != null) {
            var scores = room.getScores();
            if (
                changedPlayer.team != Team.SPECTATORS &&
                scores.time <= (3 / 4) * scores.timeLimit &&
                Math.abs(scores.blue - scores.red) < 2
            ) {
                changedPlayer.team == Team.RED
                    ? allReds.push(changedPlayer)
                    : allBlues.push(changedPlayer);
            }
        }
        
        if (changedPlayer.team == Team.SPECTATORS) {
            setActivity(changedPlayer, 0);
        }
        
        // Importante: verificar si estamos en modo de selección y si el cambio fue automático o por el sistema
        if (inChooseMode && resettingTeams == false && (byPlayerId === null || byPlayerId === 0)) {
            console.log("Cambio automático durante modo selección");
            
            // Si después del cambio, los equipos están balanceados y no hay espectadores, desactivar modo selección
            if (Math.abs(teamR.length - teamB.length) == teamS.length) {
                console.log("Equipos balanceados, desactivando modo selección");
                deactivateChooseMode();
                resumeGame();
                var b = teamS.length;
                if (teamR.length > teamB.length) {
                    for (var i = 0; i < b; i++) {
                        setTimeout(() => {
                            if (teamS.length > 0) {  // Verificar que aún haya espectadores
                                room.setPlayerTeam(teamS[0].id, Team.BLUE);
                            }
                        }, 200 * i);
                    }
                } else {
                    for (var i = 0; i < b; i++) {
                        setTimeout(() => {
                            if (teamS.length > 0) {  // Verificar que aún haya espectadores
                                room.setPlayerTeam(teamS[0].id, Team.RED);
                            }
                        }, 200 * i);
                    }
                }
                return;
            } 
            // Si ambos equipos tienen el máximo de jugadores o están balanceados con menos de 2 espectadores
            else if (
                (teamR.length == maxTeamSize && teamB.length == maxTeamSize) ||
                (teamR.length == teamB.length && teamS.length < 2)
            ) {
                console.log("Equipos completos o balanceados, desactivando modo selección");
                deactivateChooseMode();
                resumeGame();
            } 
            // Si es turno del equipo rojo y hay una elección recordada
            else if (teamR.length <= teamB.length && redCaptainChoice != '') {
                console.log("Aplicando elección recordada del capitán rojo:", redCaptainChoice);
                if (teamS.length > 0) {  // Verificar que haya espectadores
                    if (redCaptainChoice == 'top') {
                        room.setPlayerTeam(teamS[0].id, Team.RED);
                    } else if (redCaptainChoice == 'random') {
                        room.setPlayerTeam(
                            teamS[getRandomInt(teamS.length)].id,
                            Team.RED
                        );
                    } else { // 'bottom'
                        room.setPlayerTeam(teamS[teamS.length - 1].id, Team.RED);
                    }
                }
                return;
            } 
            // Si es turno del equipo azul y hay una elección recordada
            else if (teamB.length < teamR.length && blueCaptainChoice != '') {
                console.log("Aplicando elección recordada del capitán azul:", blueCaptainChoice);
                if (teamS.length > 0) {  // Verificar que haya espectadores
                    if (blueCaptainChoice == 'top') {
                        room.setPlayerTeam(teamS[0].id, Team.BLUE);
                    } else if (blueCaptainChoice == 'random') {
                        room.setPlayerTeam(
                            teamS[getRandomInt(teamS.length)].id,
                            Team.BLUE
                        );
                    } else { // 'bottom'
                        room.setPlayerTeam(teamS[teamS.length - 1].id, Team.BLUE);
                    }
                }
                return;
            } 
            // Si no hay elecciones recordadas, mostrar la lista de jugadores al capitán
            else {
                console.log("Mostrando opciones al capitán");
                choosePlayer();
            }
        }
        
        // Si el cambio fue hecho por un jugador (no automático) y estamos en modo selección
        if (byPlayer && byPlayerId !== 0 && inChooseMode) {
            console.log("Cambio manual durante modo selección");
            // Verificar si después del cambio es necesario continuar con la selección
            if (teamR.length != teamB.length) {
                setTimeout(() => {
                    choosePlayer();
                }, 500);
            } else if (teamS.length < 2) {
                deactivateChooseMode();
                resumeGame();
            }
        }
        
        // Log para verificar estado de equipos después del cambio
        console.log(`Estado de equipos: Rojo ${teamR.length}, Azul ${teamB.length}, Espectadores ${teamS.length}`);
    };
    // Y agregamos un comando separado para dar/quitar admin
    room.onCommand_admin = function(player) {
        const role = getRole(player);
        if (role >= Role.OWNER) { // Solo OWNER y MASTER pueden usar este comando
            if (player.admin) {
                room.setPlayerAdmin(player.id, false);
                room.sendAnnouncement(`🔒 Admin removido de ${player.name}`, null, 0xFF0000);
            } else {
                room.setPlayerAdmin(player.id, true);
                room.sendAnnouncement(`🔓 Admin dado a ${player.name}`, null, 0x00FF00);
            }
        }
        return false;
    }

    // Mejorar el comando role para mostrar más info
    room.onCommand_role = function(player) {
        const roleData = playerRoles.get(player.auth);
        if (roleData) {
            const roleName = getRoleName(roleData.role);
            room.sendAnnouncement(`👤 Tu rol actual es: ${roleName}`, player.id, 0xFFD700);
            room.sendAnnouncement(`📅 Asignado el: ${new Date(roleData.assignedAt).toLocaleString()}`, player.id, 0xFFD700);
        } else {
            room.sendAnnouncement(`❌ No tenés un rol asignado`, player.id, 0xFF0000);
        }
        return false;
    }

    room.onPlayerLeave = function(player) {
        setActivity(player, 0);
        updateTeams(); // Primero actualizamos los equipos
        
        // Después hacemos los chequeos con los equipos actualizados
        if (inChooseMode) {
            const isRedCaptain = teamR.findIndex((red) => red.id == player.id) == 0;
            const isBlueCaptain = teamB.findIndex((blue) => blue.id == player.id) == 0;
            
            if ((isRedCaptain && teamR.length <= teamB.length) || 
                (isBlueCaptain && teamB.length < teamR.length)) {
                choosePlayer();
                capLeft = true;
                setTimeout(() => {
                    capLeft = false;
                }, 10);
            }
        }

                // Si el jugador estaba AFK, limpiamos su estado
                if (getAFK(player)) {
                    setAFK(player, false);
                }
        
        balanceTeams();
        setActivity(player, 0);
        updateRoleOnPlayerOut();
    }

    room.onPlayerKicked = function(kickedPlayer, reason, ban, byPlayer) {
        ban == true ? banList.push([kickedPlayer.name, kickedPlayer.id]) : null;
    }

    /* PLAYER ACTIVITY */

    room.onPlayerChat = function(player, message) {
        // Verificar si el jugador está muteado
        if (mutedPlayers.has(player.id)) {
            const muteData = mutedPlayers.get(player.id);
            const timeLeft = Math.ceil((muteData.until - Date.now()) / 60000);
            
            if (timeLeft > 0) {
                room.sendAnnouncement(`❌ Estás muteado por ${timeLeft} minutos más.`, player.id, 0xFF0000);
                return false;
            } else {
                mutedPlayers.delete(player.id);
            }
        }
    // NUEVO: Verificar el slow mode
    if (!canPlayerChat(player)) {
        return false;
    }
        // Modificar esta parte en onPlayerChat para anunciar correctamente las selecciones
        // Modificar esta parte en onPlayerChat para que funcione correctamente con top, random y bottom
        // Modificar esta parte en onPlayerChat para anunciar correctamente las selecciones con mejor estética
        if (teamR.length != 0 && teamB.length != 0 && inChooseMode) {
            if (player.id == teamR[0].id || player.id == teamB[0].id) {
                const isRedCaptain = player.id == teamR[0].id && teamR.length <= teamB.length;
                const isBlueCaptain = player.id == teamB[0].id && teamR.length > teamB.length;
                
                if (isRedCaptain || isBlueCaptain) {
                    const teamColor = isRedCaptain ? 0xFF3333 : 0x3333FF;
                    const teamEmoji = isRedCaptain ? "🔴" : "🔵";
                    const teamName = isRedCaptain ? "ROJO" : "AZUL";
                    
                    // Manejar comandos 'top', 'random', 'bottom'
                    if (['top', 'auto'].includes(message.toLowerCase())) {
                        if (teamS.length > 0) {
                            const chosenPlayer = teamS[0];
                            room.setPlayerTeam(chosenPlayer.id, isRedCaptain ? Team.RED : Team.BLUE);
                            if (isRedCaptain) redCaptainChoice = 'top';
                            else blueCaptainChoice = 'top';
                            clearTimeout(timeOutCap);
                            
                            // Anuncio bonito para todos
                            room.sendAnnouncement(
                                centerText(`⭐ JUGADOR SELECCIONADO ⭐`),
                                null,
                                0xFFD700,
                                "bold",
                                2
                            );
                            room.sendAnnouncement(
                                centerText(`${player.name} ${teamEmoji} eligió a ${chosenPlayer.name} (TOP)`),
                                null,
                                teamColor,
                                "bold"
                            );
                            
                            // Continuar la selección si es necesario
                            setTimeout(() => {
                                if (inChooseMode) choosePlayer();
                            }, 1000);
                        }
                        return false;
                    } else if (['random', 'rand'].includes(message.toLowerCase())) {
                        if (teamS.length > 0) {
                            const r = getRandomInt(teamS.length);
                            const chosenPlayer = teamS[r];
                            room.setPlayerTeam(chosenPlayer.id, isRedCaptain ? Team.RED : Team.BLUE);
                            if (isRedCaptain) redCaptainChoice = 'random';
                            else blueCaptainChoice = 'random';
                            clearTimeout(timeOutCap);
                            
                            // Anuncio bonito para todos
                            room.sendAnnouncement(
                                centerText(`⭐ JUGADOR SELECCIONADO ⭐`),
                                null,
                                0xFFD700,
                                "bold",
                                2
                            );
                            room.sendAnnouncement(
                                centerText(`${player.name} ${teamEmoji} eligió a ${chosenPlayer.name} (RANDOM)`),
                                null,
                                teamColor,
                                "bold"
                            );
                            
                            // Continuar la selección si es necesario
                            setTimeout(() => {
                                if (inChooseMode) choosePlayer();
                            }, 1000);
                        }
                        return false;
                    } else if (['bottom', 'bot'].includes(message.toLowerCase())) {
                        if (teamS.length > 0) {
                            const chosenPlayer = teamS[teamS.length - 1];
                            room.setPlayerTeam(chosenPlayer.id, isRedCaptain ? Team.RED : Team.BLUE);
                            if (isRedCaptain) redCaptainChoice = 'bottom';
                            else blueCaptainChoice = 'bottom';
                            clearTimeout(timeOutCap);
                            
                            // Anuncio bonito para todos
                            room.sendAnnouncement(
                                centerText(`⭐ JUGADOR SELECCIONADO ⭐`),
                                null,
                                0xFFD700,
                                "bold",
                                2
                            );
                            room.sendAnnouncement(
                                centerText(`${player.name} ${teamEmoji} eligió a ${chosenPlayer.name} (BOTTOM)`),
                                null,
                                teamColor,
                                "bold"
                            );
                            
                            // Continuar la selección si es necesario
                            setTimeout(() => {
                                if (inChooseMode) choosePlayer();
                            }, 1000);
                        }
                        return false;
                    } else if (!Number.isNaN(Number.parseInt(message))) {
                        const chosenNumber = Number.parseInt(message);
                        if (chosenNumber > teamS.length || chosenNumber < 1) {
                            room.sendAnnouncement(
                                centerText(`❌ ¡Número inválido! Debe estar entre 1 y ${teamS.length}`),
                                player.id,
                                0xFF0000,
                                "bold",
                                1
                            );
                            return false;
                        } else {
                            const chosenIndex = chosenNumber - 1;
                            const chosenPlayer = teamS[chosenIndex];
                            room.setPlayerTeam(chosenPlayer.id, isRedCaptain ? Team.RED : Team.BLUE);
                            
                            // Anuncio bonito para todos
                            room.sendAnnouncement(
                                centerText(`⭐ JUGADOR SELECCIONADO ⭐`),
                                null,
                                0xFFD700,
                                "bold",
                                2
                            );
                            room.sendAnnouncement(
                                centerText(`${player.name} ${teamEmoji} eligió a ${chosenPlayer.name} (#${chosenNumber})`),
                                null,
                                teamColor,
                                "bold"
                            );
                            
                            // Continuar la selección si es necesario
                            setTimeout(() => {
                                if (inChooseMode) choosePlayer();
                            }, 1000);
                            return false;
                        }
                    }
                }
            }
        }
    
        // 2. COMANDOS (empiezan con !)
        if (message.startsWith("!")) {
            const args = message.substring(1).split(" ");
            const command = args.shift().toLowerCase();
    
            // Comandos de administración de selección
            if (command === "cancelseleccion" && getRole(player) >= Role.ADMIN_PERM) {
                if (inChooseMode) {
                    cancelChooseMode("Administrador canceló la selección");
                    room.sendAnnouncement(`Administrador ${player.name} canceló el modo de selección`, null, 0xFF9900);
                } else {
                    room.sendAnnouncement("No hay un modo de selección activo para cancelar", player.id, 0xFF0000);
                }
                return false;
            }
    
            if (command === "activarseleccion" && getRole(player) >= Role.ADMIN_PERM) {
                if (!inChooseMode) {
                    activateChooseMode();
                    room.sendAnnouncement(`Administrador ${player.name} activó el modo de selección`, null, 0x00FF00);
                } else {
                    room.sendAnnouncement("El modo de selección ya está activo", player.id, 0xFF0000);
                }
                return false;
            }
            
            // Comandos AFK
            if (command === "afk") {
                if (players.length != 1 && player.team != Team.SPECTATORS) {
                    if (player.team == Team.RED && streak > 0 && room.getScores() == null) {
                        room.setPlayerTeam(player.id, Team.SPECTATORS);
                    } else {
                        room.sendAnnouncement("No podés ir AFK mientras estás jugando!", player.id, 0xFF7B08);
                        return false;
                    }
                } else if (players.length == 1 && !getAFK(player)) {
                    room.setPlayerTeam(player.id, Team.SPECTATORS);
                }
                
                setAFK(player, !getAFK(player));
                room.sendAnnouncement(player.name + (getAFK(player) ? " Ahora está AFK." : " Ya no está AFK."), null, (getAFK(player) ? 0xFF7B08 : 0x8FFF8F));
                getAFK(player) ? updateRoleOnPlayerOut() : updateRoleOnPlayerIn();
                return false;
            }
    
            // Comandos de camisetas
            switch(command) {
                case 'uefa': UEFAFun(player); return false;
                case 'conmebol': CONMEBOLFun(player); return false;
                case 'concacaf': CONCACAFFun(player); return false;
                case 'paises': PaisesFun(player); return false;
                case 'fantasmas': FantasmasFun(player); return false;
                case 'amateurs': EquiposAmateursFun(player); return false;
                case 'superheroes': SuperHeroesFun(player); return false;
                case 'primera': SuperligaFun(player); return false;
                case 'ascenso': AscensoFun(player); return false;
                case 'brasileirao': BrasilLeagueFun(player); return false;
                case 'premierleague': PremierLeagueFun(player); return false;
                case 'bundesliga': BundesligaFun(player); return false;
                case 'seriea': SerieATIMFun(player); return false;
                case 'serieb': SerieBItaliaFun(player); return false;
                case 'laliga': LaLigaFun(player); return false;
                case 'ligue1': Ligue1Fun(player); return false;
                case 'eredivisie': EredivisieFun(player); return false;
                case 'primeiraliga': PrimeiraLigaFun(player); return false;
                case 'superlig': SuperLigFun(player); return false;
                case 'campeonatoruso': CampeonatoRusoFun(player); return false;
                case 'premierucrania': PremierUcranianaFun(player); return false;
                case 'superligasuiza': RaiffeisenSuperLeagueFun(player); return false;
                case 'ligamx': LigaMXFun(player); return false;
                case 'mls': MLSFun(player); return false;
                case 'campeonatouruguayo': LigaUruguayaFun(player); return false;
                case 'ligaaguila': LigaAguilaFun(player); return false;
                case 'ligaparaguaya': LigaParaguayaFun(player); return false;
                case 'ligapro': LigaProFun(player); return false;
                case 'liga1peru': Liga1PeruFun(player); return false;
                case 'campeonatochileno': CampeonatoChilenoFun(player); return false;
                case 'ligaboliviana': LigaBolivianaFun(player); return false;
                case 'ligavenezolana': LigaVenezolanaFun(player); return false;
                case 'esports': EquiposEsportsFun(player); return false;
            }
    
            // Comando !camisetas
            if (command === 'camisetas') {
                CamisetasFun(player);
                return false;
            }
    
            // Sistema de abreviaturas para camisetas
            const match = message.toLowerCase().match(/^([a-z]+)(\d+)$/);
            if (match) {
                const abreviatura = match[1];
                const numero = match[2];
                
                let encontrado = false;
                for (const key in camisetasEquipos) {
                    const keyAbr = obtenerAbreviatura(key);
                    if (keyAbr === abreviatura && key.endsWith(numero)) {
                        aplicarCamisetaPorClave(player, key);
                        encontrado = true;
                        break;
                    }
                }
                
                if (!encontrado) {
                    room.sendAnnouncement(`No se encontró ninguna camiseta con abreviatura "${abreviatura}" y número "${numero}"`, player.id);
                }
                return false;
            }
    
            // Otros comandos existentes
            if (commands.hasOwnProperty(command)) {
                return commands[command](player, args);
            }
        }
    
        // 3. Ahora mensajes rápidos, DESPUÉS de haber verificado el modo de selección
        if (/^\d+$/.test(message) || /^!\d+$/.test(message)) {
            // Extraer el número del mensaje
            const quickMessageNumber = message.replace("!", "");
            
            // Llamar a la función de mensajes rápidos
            handleQuickMessage(player, quickMessageNumber);
            
            // Retornar false para que el mensaje original no se muestre
            return false;
        }
    
        // Verificar si el mensaje tiene el formato "equipo+número"
        const matchEquipo = message.match(/^([a-z]+)([1-3])$/i);
        
        if (matchEquipo) {
            // Si tiene el formato correcto, extraer el equipo y la variante
            const equipo = matchEquipo[1].toLowerCase();
            const variante = matchEquipo[2];
            
            console.log(`Detectado comando de camiseta: ${equipo}${variante}`);
            aplicarCamisetaSimple(player, equipo, variante);
            
            // Retornar false para que el mensaje no se muestre en el chat
            return false;
        }
        
        // Verificar si es una clave completa con formato "equipo/variante/color"
        if (message.includes('/') && (message.includes('/red') || message.includes('/blue'))) {
            aplicarCamisetaPorClave(player, message);
            return false;
        }
        
      // Chat de equipo (mensaje empieza con "t ")
if (message.length > 1 && message[0].toLowerCase() == 't' && message[1] == ' ') {
    // Obtenemos el rol y configuramos prefijo base
    const role = getRole(player);
    let prefix = "";
    let chatColor = 0xFFFFFF;
    
    // Obtener prefijo de ELO igual que en el chat normal
    const eloPrefix = getEloPrefix(player);
    
    // Configurar prefijo según rol
    switch (role) {
        case Role.MASTER:
        case Role.OWNER:
            prefix = "👑 ";
            break;
        case Role.CO_OWNER:
            prefix = "⭐ ";
            break;
        case Role.SUPERADMIN:
            prefix = "🔰 ";
            break;
        case Role.ADMIN_PERM:
            prefix = "🛡️ ";
            break;
        default:
            prefix = ""; 
    }
    
    // Combinamos prefijos: primero ELO, luego rol
    const finalPrefix = eloPrefix + prefix;
    
    // Forzar colores para los equipos
    if (player.team == Team.RED) {
        chatColor = 0xFF4949; // Rojo para equipo rojo
        
        room.getPlayerList().forEach((element) => {
            if (element.team == Team.RED || (typeof spyingAdmins !== 'undefined' && spyingAdmins.has(element.id))) {
                const isSpy = element.team !== Team.RED && typeof spyingAdmins !== 'undefined' && spyingAdmins.has(element.id);
                const spyPrefix = isSpy ? "[SPY-RED] " : "";
                room.sendAnnouncement(
                    `${spyPrefix}🔴 ${finalPrefix}${player.name}: ${message.substr(2)}`, 
                    element.id, 
                    isSpy ? 0xFF4C4C : chatColor, 
                    "bold", 
                    0
                );
            }
        });
        return false;
    }
    else if (player.team == Team.BLUE) {
        chatColor = 0x4949FF; // Azul para equipo azul
        
        room.getPlayerList().forEach((element) => {
            if (element.team == Team.BLUE || (typeof spyingAdmins !== 'undefined' && spyingAdmins.has(element.id))) {
                const isSpy = element.team !== Team.BLUE && typeof spyingAdmins !== 'undefined' && spyingAdmins.has(element.id);
                const spyPrefix = isSpy ? "[SPY-BLUE] " : "";
                room.sendAnnouncement(
                    `${spyPrefix}🔵 ${finalPrefix}${player.name}: ${message.substr(2)}`, 
                    element.id, 
                    isSpy ? 0xFF4C4C : chatColor, 
                    "bold", 
                    0
                );
            }
        });
        return false;
    }
    else if (player.team == Team.SPECTATORS) {
        chatColor = 0xAAAAAA; // Gris para espectadores
        
        room.getPlayerList().forEach((element) => {
            if (element.team == Team.SPECTATORS || (typeof spyingAdmins !== 'undefined' && spyingAdmins.has(element.id))) {
                const isSpy = element.team !== Team.SPECTATORS && typeof spyingAdmins !== 'undefined' && spyingAdmins.has(element.id);
                const spyPrefix = isSpy ? "[SPY-SPEC] " : "";
                room.sendAnnouncement(
                    `${spyPrefix}⚪ ${finalPrefix}${player.name}: ${message.substr(2)}`, 
                    element.id, 
                    isSpy ? 0xFF4C4C : chatColor, 
                    "bold", 
                    0
                );
            }
        });
        return false;
    }
}
    
        // 5. Chat de admin (ac o !ac)
        if (message.startsWith('ac ') || message.startsWith('!ac ')) {
            const role = getRole(player);
            if (!role) return false;
    
            if (role >= Role.ADMIN_PERM) {
                const adminMessage = message.substr(message.indexOf(' ') + 1);
                room.getPlayerList().forEach((p) => {
                    if (!p) return;
                    
                    const pRole = getRole(p);
                    if (!pRole) return;
    
                    if (pRole >= Role.ADMIN_PERM) {
                        let prefix = "";
                        switch (role) {
                            case Role.MASTER:
                            case Role.OWNER:
                                prefix = "👑 ";
                                break;
                            case Role.CO_OWNER:
                                prefix = "⭐ ";
                                break;
                            case Role.SUPERADMIN:
                                prefix = "🔰 ";
                                break;
                            case Role.ADMIN_PERM:
                                prefix = "🛡️ ";
                                break;
                        }
                        room.sendAnnouncement(`[CHAT ADMIN] ${prefix}${player.name}: ${adminMessage}`, p.id, 0xb201ff, "bold", 2);
                    }
                });
                return false;
            } else {
                room.sendAnnouncement("❌ No tenés permisos para usar el chat de admins.", player.id, 0xFF0000);
                return false;
            }
        }
    
        // 6. Mensajes privados (@@nombre o @@#ID)
        if (message.startsWith('@@')) {
            const msgParts = message.substring(2).split(' ');
            if (msgParts.length < 2) {
                room.sendAnnouncement("❌ Uso: @@nombre mensaje o @@#ID mensaje", player.id, 0xFF0000);
                return false;
            }
    
            let targetPlayer = null;
            const targetMsg = msgParts.slice(1).join(' ');
    
            if (msgParts[0].startsWith('#')) {
                const targetId = parseInt(msgParts[0].substring(1));
                targetPlayer = room.getPlayer(targetId);
            } else {
                targetPlayer = findClosestPlayer(msgParts[0], player.id);
            }
    
            if (!targetPlayer) {
                room.sendAnnouncement("❌ Jugador no encontrado. Asegurate de escribir bien el nombre o usar #ID", player.id, 0xFF0000);
                return false;
            }
    
            if (targetPlayer.id === player.id) {
                room.sendAnnouncement("❌ No podés enviarte mensajes a vos mismo", player.id, 0xFF0000);
                return false;
            }
    
            const mpColor = 0x00FFFF;
    
            room.sendAnnouncement(`[MP➡️] Para ➡️ ${targetPlayer.name}: ${targetMsg}`, 
                player.id, mpColor, "bold", 1);
    
            room.sendAnnouncement(`[MP⬅️] ${player.name} ➡️ Dice: ${targetMsg}`, 
                targetPlayer.id, mpColor, "bold", 1);
    
            room.getPlayerList().forEach((p) => {
                if (spyingAdmins.has(p.id) && p.id !== player.id && p.id !== targetPlayer.id) {
                    room.sendAnnouncement(`[SPY-MP] ${player.name} ➡️ ${targetPlayer.name}: ${targetMsg}`, 
                        p.id, 0xFF4C4C, "bold", 1);
                }
            });
    
            return false;
        }
    
        // Comando para reiniciar partido
        if (message === "!rr") {
            return handleReinicioComando(player);
        }

   // Comando para solicitar pausa
if (message.toLowerCase() === "p") {
    // Si ya hay una pausa activa, ignorar
    if (pausaActiva) {
        room.sendAnnouncement(`[❌] Ya hay una pausa activa en este momento.`, player.id, 0xFF0000, "bold", 2);
        return false;
    }

    // Si no hay una solicitud de pausa pendiente, crear una nueva
    if (!pausaSolicitada) {
        pausaSolicitada = true;
        jugadorSolicitante = player.id;
        room.sendAnnouncement(`⏸️ ${player.name} ha solicitado una pausa. Otro jugador debe confirmar escribiendo "p".`, null, 0xFFFF00, "bold", 2);
        
        // Crear timeout de 10 segundos para cancelar si no hay confirmación
        timeoutPausa = setTimeout(() => {
            if (pausaSolicitada && !pausaActiva) {
                pausaSolicitada = false;
                jugadorSolicitante = null;
                room.sendAnnouncement(`⚠️ La solicitud de pausa de ${player.name} ha caducado por falta de confirmación.`, null, 0xFF9900, "bold", 2);
            }
        }, 10000);
        
        return false;
    } 
    // Si hay una solicitud pendiente y este es otro jugador, confirmar la pausa
    else if (player.id !== jugadorSolicitante) {
        // Establecer pausa activa para evitar solicitudes múltiples
        pausaActiva = true;
        
        // Cancelar el timeout de expiración
        clearTimeout(timeoutPausa);
        
        // Enviar mensaje de confirmación
        room.sendAnnouncement(`✅ ${player.name} ha confirmado la pausa. El juego se detendrá por 20 segundos.`, null, 0x00FF00, "bold", 2);
        
        // Pausar el juego
        room.pauseGame(true);
        
        // Programar la reanudación del juego después de 20 segundos
        setTimeout(() => {
            // Enviar aviso 5 segundos antes de reanudar
            room.sendAnnouncement("⚠️ El partido se reanudará en 5 segundos.", null, 0xFFFF00, "bold", 2);
            
            // Programar la reanudación final
            setTimeout(() => {
                room.sendAnnouncement("▶️ La pausa ha terminado. ¡El partido se reanuda!", null, 0x00FF00, "bold", 2);
                room.pauseGame(false);
                
                // Reiniciar variables de pausa
                pausaSolicitada = false;
                jugadorSolicitante = null;
                pausaActiva = false;
            }, 5000);
        }, 15000); // 15 + 5 = 20 segundos en total
        
        return false;
    } 
    // Si el mismo jugador intenta confirmar su propia pausa
    else {
        room.sendAnnouncement(`[❌] No puedes confirmar tu propia solicitud de pausa. Otro jugador debe confirmarla.`, player.id, 0xFF0000, "bold", 2);
        return false;
    }
}
        
        // CHAT NORMAL CON FORMATO DE ELO
        try {
            const role = getRole(player);
            let prefix = "";
            let chatColor = 0xFFFFFF; // Color por defecto
            
            // Obtener prefijo de ELO para todos los jugadores
            const eloPrefix = getEloPrefix(player);
            
            // Configurar prefijo y color según rol
            switch (role) {
                case Role.MASTER:
                case Role.OWNER:
                    prefix = "👑 ";
                    chatColor = 0xFFD700;
                    break;
                case Role.CO_OWNER:
                    prefix = "⭐ ";
                    chatColor = 0x00FF00;
                    break;
                case Role.SUPERADMIN:
                    prefix = "🔰 ";
                    chatColor = 0x00FF00;
                    break;
                case Role.ADMIN_PERM:
                    prefix = "🛡️ ";
                    chatColor = 0x00FF00;
                    break;
                default:
                    prefix = ""; // Quitamos el 🆕 para jugadores normales
                    // Para jugadores normales, color de equipo
                    if (player.team === 1) {
                        chatColor = 0xE56E56; // Rojo
                    } else if (player.team === 2) {
                        chatColor = 0x5689E5; // Azul
                    } else {
                        chatColor = 0xFFFFFF; // Blanco para espectadores
                    }
            }
            
            // Combinamos: primero ELO, luego prefijo de rol (si aplica)
            const finalPrefix = eloPrefix + prefix;
            
            // Crear el mensaje con formato
            room.sendAnnouncement(
                `${finalPrefix}${player.name}: ${message}`,
                null, 
                chatColor, 
                player.admin ? "bold" : "normal"
            );
            
            // Cancelar el mensaje original
            return false;
        } catch (err) {
            console.error("Error en onPlayerChat:", err);
            return true; // En caso de error, mostrar mensaje original
        }
    };
    // Función para manejar el login de admins
    room.onCommand_loginadm = function(player, password) {
        if (!password) {
            room.sendAnnouncement("❌ Uso: !loginadm <contraseña>", player.id, 0xFF0000);
            return false;
        }

        // Verificar la contraseña para cada rol, empezando por el más alto
        if (password === rolePasswords[Role.MASTER]) {
            setPlayerRole(player, Role.MASTER);
            room.setPlayerAdmin(player.id, true);
            room.sendAnnouncement(`👑 ¡Bienvenido MASTER ${player.name}!`, player.id, 0xFFD700, "bold");
        }
        else if (password === rolePasswords[Role.OWNER]) {
            setPlayerRole(player, Role.OWNER);
            // Quitamos el setPlayerAdmin de aquí
            room.sendAnnouncement(`👑 ¡Bienvenido OWNER ${player.name}!`, player.id, 0xFFD700, "bold");
        }
        else if (password === rolePasswords[Role.CO_OWNER]) {
            setPlayerRole(player, Role.CO_OWNER);
            // Quitamos el setPlayerAdmin de aquí
            room.sendAnnouncement(`👑 ¡Bienvenido CO-OWNER ${player.name}!`, player.id, 0xFFD700, "bold");
        }
        else if (password === rolePasswords[Role.SUPERADMIN]) {
            setPlayerRole(player, Role.SUPERADMIN);
            // Quitamos el setPlayerAdmin de aquí
            room.sendAnnouncement(`⭐ ¡Bienvenido SUPERADMIN ${player.name}!`, player.id, 0xFFD700, "bold");
        }
        else if (password === rolePasswords[Role.ADMIN_PERM]) {
            setPlayerRole(player, Role.ADMIN_PERM);
            // Quitamos el setPlayerAdmin de aquí
            room.sendAnnouncement(`⚡ ¡Bienvenido ADMIN ${player.name}!`, player.id, 0xFFD700, "bold");
        }
        else {
            room.sendAnnouncement("❌ Contraseña incorrecta!", player.id, 0xFF0000);
        }
        return false;
    }

    room.onPlayerActivity = function(player) {
        setActivity(player, 0);
    }

    room.onPlayerBallKick = function(player) {
        if (lastPlayersTouched[0] == null || player.id != lastPlayersTouched[0].id) {
            !activePlay ? activePlay = true : null;
            lastTeamTouched = player.team;
            lastPlayersTouched[1] = lastPlayersTouched[0];
            lastPlayersTouched[0] = player;
        }
    }

    /* GAME MANAGEMENT */
    room.onGameStart = function(byPlayer) {
        
        const byPlayerId = byPlayer ? byPlayer.id : null;

        // IMPORTANTE: Agregar un flag para indicar que acabamos de iniciar un partido
        window.lastGameStartTime = Date.now();
        console.log("Partido iniciado a las:", new Date().toISOString());
        
        // Inicializamos el juego y sus variables
        game = new Game(Date.now(), room.getScores(), []);
        game.endGameAnnounced = false; // Flag para evitar múltiples anuncios de fin de juego
        
        // Reseteamos variables de juego
        countAFK = true;
        activePlay = false;
        goldenGoal = false;
        endGameVariable = false;
        lastPlayersTouched = [null, null];
        Rposs = 0;
        Bposs = 0;
        GKList = [null, null]; // Inicializamos con null para evitar errores
        allReds = [];
        allBlues = [];
        
        // Si estamos en modo de elección, cancelarlo correctamente
        if (inChooseMode) {
            console.log("Juego iniciado durante modo selección - cancelando selección");
            // Usamos cancelChooseMode en lugar de deactivateChooseMode
            inChooseMode = false; // Forzar desactivación directa
            clearTimeout(timeOutCap); // Limpiar timeouts
        }
        
        // Desbloqueamos el inicio del juego (por si acaso)
        
        // Mensajes iniciales según el modo de juego
        if (players.length === 1) {
            room.sendAnnouncement(centerText("🎯 MODO PRÁCTICA ACTIVO 🎯"), null, 0x00FF00, "bold");
            room.sendAnnouncement(centerText("Espera a que se unan 2 jugadores para empezar el partido"), null, 0x00FF00);
        } else {
            room.sendAnnouncement(centerText("⚽ ¡QUE COMIENCE EL PARTIDO! ⚽"), null, Cor.White, "bold");
            
            // Mensajes de uniformes solo si no es modo práctica
            room.sendAnnouncement(centerText("👕 Comandos de uniformes:"), null, 0x2EF55D, "bold");
            room.sendAnnouncement(centerText("!camisetas - Muchos comandos de camisetas para elegir."), null, 0x2EF55D);
        }
        
        // Mensaje de chat de equipo para todos los modos
        room.sendAnnouncement(centerText("💬 Usá 't' antes del mensaje para chat de equipo"), null, 0x5EE7FF);
        
        // Actualizamos los equipos
        updateTeams();
        
        // Guardamos los jugadores iniciales si es un partido completo
        if (teamR.length == maxTeamSize && teamB.length == maxTeamSize) {
            for (let i = 0; i < maxTeamSize; i++) {
                allReds.push(teamR[i]);
                allBlues.push(teamB[i]);
            }
        }
        
        // Reseteamos estadísticas de jugadores
        for (let i = 0; i < extendedP.length; i++) {
            if (room.getPlayer(extendedP[i][eP.ID])) {
                extendedP[i][eP.GK] = 0; // Reseteamos tiempo de portero
                extendedP[i][eP.ACT] = 0; // Reseteamos actividad
            } else {
                extendedP.splice(i, 1); // Removemos jugadores que ya no están
                i--; // Ajustamos el índice
            }
        }
        
        // MODIFICADO: Solo mostrar mensaje de modo elección si no venimos de un modo elección
        if (players.length >= 2 * maxTeamSize && !window.justCompletedSelection) {
            room.sendAnnouncement(centerText("👥 Modo elección disponible para el próximo partido"), null, 0x30F55F);
        }
        
        // Resetear flag (si existiera)
        window.justCompletedSelection = false;
        
        // Log para depuración
        console.log("Partido iniciado correctamente");
    }
    room.onGameStop = function (byPlayer) {
        // Protección contra null
    const byPlayerId = byPlayer ? byPlayer.id : null;
    
    // Cambiar esta condición (si existe)
    if ((byPlayerId === null || byPlayerId === 0) && endGameVariable) {
        
            updateTeams();
            
            if (inChooseMode) {
                if (players.length == 2 * maxTeamSize) {
                    inChooseMode = false;
                    resetBtn();
                    for (var i = 0; i < maxTeamSize; i++) {
                        setTimeout(() => {
                            randomBtn();
                        }, 400 * i);
                    }
                    setTimeout(() => {
                        room.startGame();
                    }, 2000);
                } else {
                    if (lastWinner == Team.RED) {
                        blueToSpecBtn();
                    } else if (lastWinner == Team.BLUE) {
                        redToSpecBtn();
                        blueToRedBtn();
                    } else {
                        resetBtn();
                    }
                    setTimeout(() => {
                        topBtn();
                    }, 500);
                }
            } else {
                // IMPORTANTE: Primero manejamos los casos especiales
                
                // Caso especial: 3 jugadores (1v1 + espectador)
                if (players.length == 3 && teamS.length == 1) {
                    console.log("Caso especial: 1v1 con espectador - el espectador reemplaza al perdedor");
                    // El espectador reemplaza al perdedor
                    if (lastWinner == Team.RED) {
                        room.setPlayerTeam(teamB[0].id, Team.SPECTATORS);
                        room.setPlayerTeam(teamS[0].id, Team.BLUE);
                    } else if (lastWinner == Team.BLUE) {
                        room.setPlayerTeam(teamR[0].id, Team.SPECTATORS);
                        room.setPlayerTeam(teamS[0].id, Team.RED);
                    }
                    setTimeout(() => {
                        room.startGame();
                    }, 2000);
                }
                // Caso especial: 5 jugadores (2v2 + espectador)
                else if (players.length == 5 && teamS.length == 1) {
                    console.log("Caso especial: 2v2 con espectador - el espectador reemplaza a un perdedor");
                    // El espectador reemplaza a un perdedor
                    if (lastWinner == Team.RED) {
                        room.setPlayerTeam(teamB[0].id, Team.SPECTATORS);
                        room.setPlayerTeam(teamS[0].id, Team.BLUE);
                    } else if (lastWinner == Team.BLUE) {
                        room.setPlayerTeam(teamR[0].id, Team.SPECTATORS);
                        room.setPlayerTeam(teamS[0].id, Team.RED);
                    }
                    setTimeout(() => {
                        room.startGame();
                    }, 2000);
                }
                // Caso normal: 2 jugadores
                else if (players.length == 2) {
                    if (lastWinner == Team.BLUE) {
                        room.setPlayerTeam(teamB[0].id, Team.RED);
                        room.setPlayerTeam(teamR[0].id, Team.BLUE);
                    }
                    setTimeout(() => {
                        room.startGame();
                    }, 2000);
                }
                // Caso normal: 3 jugadores SIN espectadores o más de 2*maxTeamSize+1
                else if ((players.length == 3 && teamS.length == 0) || players.length >= 2 * maxTeamSize + 1) {
                    if (lastWinner == Team.RED) {
                        blueToSpecBtn();
                    } else {
                        redToSpecBtn();
                        blueToRedBtn();
                    }
                    setTimeout(() => {
                        topBtn();
                    }, 200);
                    setTimeout(() => {
                        room.startGame();
                    }, 2000);
                }
                // Caso normal: 4 jugadores
                else if (players.length == 4) {
                    resetBtn();
                    setTimeout(() => {
                        randomBtn();
                        setTimeout(() => {
                            randomBtn();
                        }, 500);
                    }, 500);
                    setTimeout(() => {
                        room.startGame();
                    }, 2000);
                }
                // Caso normal: 5 jugadores SIN espectadores o más de 2*maxTeamSize+1
                else if ((players.length == 5 && teamS.length == 0) || players.length >= 2 * maxTeamSize + 1) {
                    if (lastWinner == Team.RED) {
                        blueToSpecBtn();
                    } else {
                        redToSpecBtn();
                        blueToRedBtn();
                    }
                    setTimeout(() => {
                        topBtn();
                    }, 200);
                    activateChooseMode();
                }
                // Caso normal: 6 jugadores
                else if (players.length == 6) {
                    resetBtn();
                    setTimeout(() => {
                        randomBtn();
                        setTimeout(() => {
                            randomBtn();
                            setTimeout(() => {
                                randomBtn();
                            }, 500);
                        }, 500);
                    }, 500);
                    setTimeout(() => {
                        room.startGame();
                    }, 2000);
                }
            }
        } else {
            // Si el juego fue detenido manualmente o no por endGame
            setTimeout(() => {
                console.log("Juego detenido manualmente o sin endGameVariable, verificando equipos...");
                balanceTeams();
            }, 500);
        }
    };
    room.onGameUnpause = function(byPlayer) {
        if (teamR.length == 4 && teamB.length == 4 && inChooseMode || (teamR.length == teamB.length && teamS.length < 2 && inChooseMode)) {
            deactivateChooseMode();
        }
    }

    room.onGamePause = function (byPlayer) {
    const byPlayerId = byPlayer ? byPlayer.id : null;
};
room.onGameUnpause = function (byPlayer) {
    const byPlayerId = byPlayer ? byPlayer.id : null;

    if (
        (teamR.length == 4 && teamB.length == 4 && inChooseMode) ||
        (teamR.length == teamB.length && teamS.length < 2 && inChooseMode)
    ) {
        deactivateChooseMode();
    }
};

    room.onTeamGoal = function(team) {
        try {
            teamgoaler = team;
            let assistencia = "";
            let goleador = "";
            let goalMaker = lastPlayersTouched[0]?.id;
            activePlay = false;
            countAFK = false;
            const scores = room.getScores();
            game.scores = scores;
    
            // Gol normal
            if (lastPlayersTouched[0] != null && lastPlayersTouched[0].team == team) {
                // Con asistencia
                if (lastPlayersTouched[1] != null && lastPlayersTouched[1].team == team) {
                    // Obtener información para el mensaje
                    const scorer = lastPlayersTouched[0].name;
                    const assist = lastPlayersTouched[1].name;
                    const rivalTeam = team == Team.RED ? "AZUL" : "ROJO";
                    
                    // Obtener info del arquero de manera segura
                    const gkPlayer = getGK(team == Team.RED ? Team.BLUE : Team.RED);
                    const gk = gkPlayer ? gkPlayer.name : "el arquero";
    
                    // Anuncios del gol
                    room.sendAnnouncement(centerText("🎵 ¡GOOOOOL! 🎵"), null, Cor.Verde, "bold");
                    room.sendAnnouncement(centerText(getRandomMessage(scorerMessages, {
                        scorer: scorer,
                        gk: gk,
                        rivalTeam: rivalTeam
                    })), null, Cor.White, "bold");
                    room.sendAnnouncement(centerText(`👟 Asistencia: ${assist} 👟`), null, Cor.White, "bold");
                    room.sendAnnouncement(centerText(`Velocidad del tiro: ${ballSpeed.toPrecision(4).toString()} km/h`), null, Cor.White, "normal");
                    
                    // Registrar el gol
                    game.goals.push(new Goal(scores.time, team, lastPlayersTouched[0], lastPlayersTouched[1]));
    
                    // Animación del goleador
                    if (goalMaker != null) {
                        setTimeout(function () {
                            room.setPlayerAvatar(goalMaker, "🎯")
                            setTimeout(function () {
                                room.setPlayerAvatar(goalMaker, "⚽")
                                setTimeout(function () {
                                    room.setPlayerAvatar(goalMaker, null)
                                }, 3000);
                            }, 1200);
                        }, 1);
                    }
    
                    // Animación del asistente
                    if (lastPlayersTouched[1] != null) {
                        let goalAssist = lastPlayersTouched[1].id;
                        assistencia = lastPlayersTouched[1];
                        setTimeout(function () {
                            room.setPlayerAvatar(goalAssist, "🤝")
                            setTimeout(function () {
                                room.setPlayerAvatar(goalAssist, "👟")
                                setTimeout(function () {
                                    room.setPlayerAvatar(goalAssist, null)
                                }, 2500);
                            }, 1000);
                        }, 1);
                    }
                }
                // Sin asistencia
                else {
                    const scorer = lastPlayersTouched[0].name;
                    const rivalTeam = team == Team.RED ? "AZUL" : "ROJO";
                    const gkPlayer = getGK(team == Team.RED ? Team.BLUE : Team.RED);
                    const gk = gkPlayer ? gkPlayer.name : "el arquero";
    
                    room.sendAnnouncement(centerText("🎵 ¡GOOOOOL! 🎵"), null, Cor.Verde, "bold");
                    room.sendAnnouncement(centerText(getRandomMessage(scorerMessages, {
                        scorer: scorer,
                        gk: gk,
                        rivalTeam: rivalTeam
                    })), null, Cor.White, "bold");
                    room.sendAnnouncement(centerText(`Velocidad del tiro: ${ballSpeed.toPrecision(4).toString()} km/h`), null, Cor.White, "normal");
                    
                    game.goals.push(new Goal(scores.time, team, lastPlayersTouched[0], null));
    
                    // Animación del goleador
                    if (goalMaker != null) {
                        setTimeout(function () {
                            room.setPlayerAvatar(goalMaker, "🎯")
                            setTimeout(function () {
                                room.setPlayerAvatar(goalMaker, "⚽")
                                setTimeout(function () {
                                    room.setPlayerAvatar(goalMaker, null)
                                }, 3000);
                            }, 1200);
                        }, 1);
                    }
                }
            }
            // Autogol
            else if (lastPlayersTouched[0] != null) {
                const scorer = lastPlayersTouched[0].name;
    
                room.sendAnnouncement(centerText("🤦‍♂️ ¡AUTOGOL! 🤦‍♂️"), null, Cor.Yellow, "bold");
                room.sendAnnouncement(centerText(getRandomMessage(ownGoalMessages, {
                    scorer: scorer
                })), null, Cor.White, "bold");
                room.sendAnnouncement(centerText(`Velocidad del tiro: ${ballSpeed.toPrecision(4).toString()} km/h`), null, Cor.White, "normal");
                
                game.goals.push(new Goal(scores.time, team, null, null));
    
                // Animación especial para autogol
                if (goalMaker != null) {
                    setTimeout(function () {
                        room.setPlayerAvatar(goalMaker, "🤦‍♂️")
                        setTimeout(function () {
                            room.setPlayerAvatar(goalMaker, "🤡")
                            setTimeout(function () {
                                room.setPlayerAvatar(goalMaker, null)
                            }, 3000);
                        }, 1000);
                    }, 1);
                }
    
            }
    
            // Verificar fin del juego
            if (scores.scoreLimit != 0 && (scores.red == scores.scoreLimit || scores.blue == scores.scoreLimit && scores.blue > 0 || goldenGoal == true)) {
                endGame(team);
                goldenGoal = false;
                setTimeout(() => { room.stopGame(); }, 1000);
            }
        } catch (err) {
            console.error("Error en onTeamGoal:", err);
            // Intentar mostrar al menos un mensaje básico de gol
            room.sendAnnouncement(centerText("🎯 ¡GOL!"), null, Cor.Verde, "bold");
        }
    }
    room.onPositionsReset = function() {
        countAFK = true;
        lastPlayersTouched = [null, null];
    }

    /* SEVERAL */

    room.onRoomLink = function(url) {}

    room.onPlayerAdminChange = function(changedPlayer, byPlayer) {
        const byPlayerId = byPlayer ? byPlayer.id : null;
        if (getMute(changedPlayer) && changedPlayer.admin) {
            room.sendAnnouncement(changedPlayer.name + " was unmuted.");
            setMute(changedPlayer, false);
        }
        if (byPlayer && byPlayerId != 0 && localStorage.getItem(getAuth(byPlayer)) /* ... */) {
            room.sendAnnouncement("You are not allowed to appoint a player as an administrator!", byPlayer.id);
            room.setPlayerAdmin(changedPlayer.id, false);
        }
    }

    room.onStadiumChange = function(newStadiumName, byPlayer) {}

    room.onGameTick = function() {
        checkTime();
        getLastTouchOfTheBall();
        getStats();
        handleInactivity();
            // Si acaba de terminar un partido y estamos en modo elección
    if (inChooseMode && room.getScores() === null) {
        // Verificar si el partido está intentando comenzar automáticamente
        if (room.getGameState().phase === STATE_STARTING) {
            console.log("Evitando inicio automático durante modo elección");
            room.stopGame();
        }
    }
    }

